// Text-to-Speech utility with ElevenLabs integration
export interface TTSOptions {
  voice?: string;
  speed?: number;
  stability?: number;
}

export interface TTSStatus {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  error?: string;
}

export class TextToSpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isLoading = false;
  private currentTime = 0;
  private duration = 0;
  private error: string | null = null;
  private onStatusChange: ((status: TTSStatus) => void) | null = null;

  constructor(onStatusChange?: (status: TTSStatus) => void) {
    this.onStatusChange = onStatusChange || null;

    // Listen for music playback events and pause TTS
    if (typeof window !== 'undefined') {
      window.addEventListener('musicPlaybackStarted', () => {
        if (this.isPlaying) {
          console.log('[TTS] Pausing TTS due to music playback');
          this.pause();
        }
      });
    }
  }

  private updateStatus() {
    if (this.onStatusChange) {
      this.onStatusChange({
        isPlaying: this.isPlaying,
        isLoading: this.isLoading,
        currentTime: this.currentTime,
        duration: this.duration,
        error: this.error || undefined
      });
    }
  }

  // ElevenLabs implementation
  async speakWithElevenLabs(text: string, options: TTSOptions = {}): Promise<void> {
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
      console.warn('ElevenLabs API key not found, falling back to browser TTS');
      return this.speakWithBrowser(text);
    }

    // Set loading state
    this.isLoading = true;
    this.error = null;
    this.updateStatus();

    try {
      // Clean and validate text first
      const cleanedText = this.cleanTextForSpeech(text);

      // Check text length (ElevenLabs has a 5000 character limit for free tier)
      if (cleanedText.length > 5000) {
        console.warn('Text too long for ElevenLabs, truncating to 5000 characters');
        const truncatedText = cleanedText.substring(0, 4950) + '...';
        return this.speakWithElevenLabs(truncatedText, options);
      }

      if (cleanedText.trim().length === 0) {
        console.warn('Empty text provided to TTS');
        this.isLoading = false;
        this.updateStatus();
        return;
      }

      // Use Bill voice - mature, calm male voice
      const voiceId = options.voice || 'pNInz6obpgDQGcFmaJgB';

      const requestBody = {
        text: cleanedText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: Math.min(1.0, Math.max(0.0, options.stability || 0.75)), // Higher stability for smoother speech
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      };

      console.log('ElevenLabs request:', { voiceId, textLength: cleanedText.length });

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API response:', response.status, errorText);
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();

      if (audioBlob.size === 0) {
        throw new Error('Received empty audio response');
      }

      const audioUrl = URL.createObjectURL(audioBlob);

      // Loading is complete, audio is ready to play
      this.isLoading = false;
      this.updateStatus();

      await this.playAudioFromUrl(audioUrl);
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      this.isLoading = false;
      this.error = error instanceof Error ? error.message : 'Unknown TTS error';
      this.updateStatus();

      // Fallback to browser TTS
      return this.speakWithBrowser(text);
    }
  }

  // Fallback browser TTS
  async speakWithBrowser(text: string, options: TTSOptions = {}): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Text-to-speech not supported in this browser');
    }

    this.stop(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(this.cleanTextForSpeech(text));

    // Configure voice settings for slower, deeper speech
    utterance.rate = options.speed || 0.8; // Slower rate
    utterance.pitch = 0.85; // Lower pitch for older male voice
    utterance.volume = 0.8;

    // Try to find a male voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice =>
      voice.lang.startsWith('en') &&
      !voice.name.includes('Female') &&
      (voice.name.includes('Male') || voice.name.includes('Daniel') || voice.name.includes('James'))
    ) || voices.find(voice =>
      voice.lang.startsWith('en') && !voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.updateStatus();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.updateStatus();
    };

    utterance.onerror = () => {
      this.isPlaying = false;
      this.error = 'Browser TTS error';
      this.updateStatus();
    };

    speechSynthesis.speak(utterance);
  }

  // Azure Cognitive Services implementation (alternative)
  async speakWithAzure(text: string, options: TTSOptions = {}): Promise<void> {
    const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY;
    const region = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || 'eastus';

    if (!subscriptionKey) {
      console.warn('Azure Speech key not found, falling back to browser TTS');
      return this.speakWithBrowser(text);
    }

    try {
      // Get access token
      const tokenResponse = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const accessToken = await tokenResponse.text();

      // Generate speech
      const ssml = `
        <speak version='1.0' xml:lang='en-US'>
          <voice name='en-US-AriaNeural'>
            <prosody rate='${options.speed || 1}'>
              ${this.cleanTextForSpeech(text)}
            </prosody>
          </voice>
        </speak>`;

      const speechResponse = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
        },
        body: ssml
      });

      const audioBlob = await speechResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      await this.playAudioFromUrl(audioUrl);
    } catch (error) {
      console.error('Azure TTS error:', error);
      return this.speakWithBrowser(text);
    }
  }

  private async playAudioFromUrl(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.currentAudio = new Audio();

      // Set up event handlers before setting the source
      this.currentAudio.oncanplaythrough = async () => {
        try {
          // Dispatch event to pause music playback
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('ttsPlaybackStarted'));
          }

          this.isPlaying = true;
          this.updateStatus();
          await this.currentAudio!.play();
        } catch (playError) {
          console.error('Audio play error:', playError);
          this.isPlaying = false;
          this.error = 'Audio play failed: ' + playError;
          this.updateStatus();
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio play failed: ' + playError));
        }
      };

      this.currentAudio.onended = () => {
        this.isPlaying = false;
        this.currentTime = 0;
        this.updateStatus();
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      this.currentAudio.onerror = (event) => {
        console.error('Audio error event:', event);
        this.isPlaying = false;
        this.error = 'Audio playback failed - may be due to Content Security Policy restrictions';
        this.updateStatus();
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Audio playback failed - may be due to Content Security Policy restrictions'));
      };

      this.currentAudio.onloadstart = () => {
        console.log('Audio loading started');
      };

      this.currentAudio.onloadeddata = () => {
        console.log('Audio data loaded');
      };

      this.currentAudio.onloadedmetadata = () => {
        this.duration = this.currentAudio?.duration || 0;
        this.updateStatus();
      };

      this.currentAudio.ontimeupdate = () => {
        this.currentTime = this.currentAudio?.currentTime || 0;
        this.updateStatus();
      };

      this.currentAudio.onpause = () => {
        this.isPlaying = false;
        this.updateStatus();
      };

      this.currentAudio.onplay = () => {
        this.isPlaying = true;
        this.updateStatus();
      };

      // Set the source after handlers are set up
      this.currentAudio.src = audioUrl;
      this.currentAudio.load();
    });
  }

  private cleanTextForSpeech(text: string): string {
    return text
      // Remove HTML tags completely
      .replace(/<[^>]*>/g, ' ')
      // Remove markdown syntax
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '[Code block]') // Replace code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, 'Image: $1') // Convert images
      // Remove special characters that might cause issues
      .replace(/[^\w\s\-.,!?;:()"'\n]/g, ' ')
      // Clean up excessive punctuation
      .replace(/[.]{3,}/g, '...')
      .replace(/[!]{2,}/g, '!')
      .replace(/[?]{2,}/g, '?')
      // Normalize quotes
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '. ') // Replace paragraph breaks with periods
      .trim()
      // Ensure proper sentence endings
      .replace(/([a-zA-Z])\s*\n/g, '$1. ');
  }

  // Playback control methods
  play(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(error => {
        console.error('Play error:', error);
        this.error = 'Failed to resume playback';
        this.updateStatus();
      });
    }
  }

  pause(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
    }
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.updateStatus();
  }

  seek(time: number): void {
    if (this.currentAudio) {
      this.currentAudio.currentTime = Math.max(0, Math.min(time, this.duration));
    }
  }

  setVolume(volume: number): void {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  // Getters for current status
  getStatus(): TTSStatus {
    return {
      isPlaying: this.isPlaying,
      isLoading: this.isLoading,
      currentTime: this.currentTime,
      duration: this.duration,
      error: this.error || undefined
    };
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }

  // Main method - tries ElevenLabs first, falls back to browser
  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    return this.speakWithElevenLabs(text, options);
  }
}