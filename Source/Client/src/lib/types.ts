
import React from 'react';

export type FormErrors = Record<string, string[]> | null | undefined;
export type FormDefaultValues =
  | Record<
      string,
      string | number | boolean | (string | number | boolean)[] | null
    >
  | null
  | undefined;

export type FormState<
  TFormData = Record<string, string | number | boolean | null>
> =
  | {
      type: "success";
      message: string;
    }
  | {
      type: "error";
      fieldErrors?: {
        [K in keyof TFormData]?: string[] | undefined;
      };
      formErrors?: string[];
      formData: TFormData;
    }
  | { type: undefined; message: null }; // initial state

  type GetEventHandlers<T extends keyof React.JSX.IntrinsicElements> = Extract<
  keyof React.JSX.IntrinsicElements[T],
  `on${string}`
>;

/**
 * Provides the event type for a given element and handler.
 *
 * @example
 *
 * type MyEvent = EventFor<"input", "onChange">;
 */
export type EventFor<
  TElement extends keyof React.JSX.IntrinsicElements,
  THandler extends GetEventHandlers<TElement>
> = React.JSX.IntrinsicElements[TElement][THandler] extends
  | ((e: infer TEvent) => any)
  | undefined
  ? TEvent
  : never;

  export type Song = {
    id: number; // Optional, assuming there's an auto-incrementing ID
    title: string;
    track: number;
    disc: number;
    artist: string;
    album: string;
    album_artist?: string; // Optional, if it's not always present
    year: number;
    genre?: string; // Optional, if it might not be present
    bpm?: number; // Optional, assuming some tracks might not have BPM info
    key?: string; // Optional, for tracks that might not have a musical key
    comment?: string; // Optional, for additional track information
    original_artist?: string; // Optional, in case it's a cover
    remixed_by?: string; // Optional, for remixes
    composer?: string; // Optional, if not always provided
    cover_url?: string; // Optional, for album artwork or cover image URL
    isrc?: string; // Optional, for ISRC code
    publisher?: string; // Optional, for publisher info
    copyright?: string; // Optional, for copyright year or details
    url?: string; // Optional, for track URL or streaming link (standard quality MP3)
    hdUrl?: string; // Optional, for high-definition track URL (HD WAV)
    size?: number; // Optional, file size of the track
    lastmodified?: string; // Optional, date when track was last modified
    disqus?: string; // Optional, discussion or comment-related field    
    subgenre?: string; // Optional, for more specific genre classifications
    duration: number;
  };
  

  
export type Playlist = {
  playlist_id: number;
  name: string;
  user_id?: number;
  is_global?: boolean;
  cover_url?: string;
  created_at?: string;
  tracks?: number[];
}

export type NewSong = {
  id: string; 
}

export type NewPlaylist = {
  playlist_id: number;
}

export type PlaylistSong = {
  id: string; 
}

export type NewPlaylistSong = {
  id: string; 
}

export type PlaylistWithSongs = Playlist & {
  songs: (Song & { order: number })[];
  trackCount: number;
  duration: number;
};