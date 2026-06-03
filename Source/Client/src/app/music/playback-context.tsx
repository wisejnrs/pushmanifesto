"use client";

import { useRef } from "react";

/**
 * Minimal no-op playback/navigation context for Push Manifesto.
 *
 * The blog markdown renderer and keyboard-navigation hook (ported from
 * wisejnrs-website) talk to a site-wide context that, on the source site,
 * combines music playback with a multi-panel keyboard navigation system.
 * Push Manifesto has neither a music app nor that panel system, so this
 * stub satisfies the imports and renders those features inert: playback
 * methods do nothing, there is never a current track, and panel state is
 * a no-op.
 */
export function usePlayback() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const noop = () => {};
  return {
    // playback (used by the in-post audio block)
    playTrack: async (_track?: any) => {},
    currentTrack: null as any,
    isPlaying: false,
    togglePlayPause: noop,
    currentTime: 0,
    duration: 0,
    audioRef,
    // panel navigation (used by use-keyboard-navigation)
    activePanel: null as any,
    setActivePanel: (_panel?: any) => {},
  };
}
