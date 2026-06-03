"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Self-contained playback for Push Manifesto.
 *
 * The blog markdown renderer embeds ```audio blocks that talk to this hook.
 * The source site backed it with a global music player; here each consumer
 * gets its own lightweight <audio> element so in-post podcast/audio players
 * actually play, with no music app required. Also exposes no-op panel-nav
 * fields used by use-keyboard-navigation.
 */
type Track = { url?: string; title?: string; [key: string]: unknown };

export function usePlayback() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

  const playTrack = useCallback(async (track?: Track) => {
    const audio = audioRef.current;
    if (!audio || !track?.url) return;
    if (audio.src !== track.url) {
      audio.src = track.url;
      setCurrentTrack(track);
    }
    try {
      await audio.play();
    } catch {
      /* autoplay/user-gesture rejections are non-fatal */
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  return {
    // playback (in-post audio block)
    playTrack,
    currentTrack,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    audioRef,
    // panel navigation no-ops (use-keyboard-navigation)
    activePanel: null as unknown,
    setActivePanel: (_panel?: unknown) => {},
  };
}
