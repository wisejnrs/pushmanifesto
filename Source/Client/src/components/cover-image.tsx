"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

/**
 * next/image with a loading state: an animated shimmer holds the space and
 * the image fades in once decoded, instead of popping in from blank.
 * Parent must be `relative overflow-hidden` (all our cover containers are).
 */
export function CoverImage({ className, alt = "", ...props }: ImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "img-shimmer pointer-events-none absolute inset-0 transition-opacity duration-500",
          loaded && "opacity-0",
        )}
      />
      <Image
        {...props}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn("transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", className)}
      />
    </>
  );
}
