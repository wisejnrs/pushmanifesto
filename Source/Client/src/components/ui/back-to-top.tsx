"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackToTopProps {
  showAfter?: number; // Show button after scrolling this many pixels
  className?: string;
}

export function BackToTop({ showAfter = 300, className }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility(); // Check initial scroll position

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-40 rounded-full shadow-lg backdrop-blur-sm bg-background/80 border border-border/50 hover:bg-background hover:border-border transition-all duration-300 hover:scale-110",
        "animate-in fade-in slide-in-from-bottom-4",
        className
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
