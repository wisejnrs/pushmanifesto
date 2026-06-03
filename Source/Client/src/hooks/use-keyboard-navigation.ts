'use client';

import { useEffect, RefObject } from 'react';
import { usePlayback } from '@/app/music/playback-context';

type KeyboardNavigationOptions = {
  containerRef: RefObject<HTMLElement | null>;
  itemSelector: string;
  onNavigate?: (newIndex: number) => void;
  onSelect?: (currentIndex: number) => void;
  onExit?: (direction: 'left' | 'right') => void;
  gridMode?: boolean;
  columnsPerRow?: number;
};

export function useKeyboardNavigation({
  containerRef,
  itemSelector,
  onNavigate,
  onSelect,
  onExit,
  gridMode = false,
  columnsPerRow = 1,
}: KeyboardNavigationOptions) {
  const { activePanel, setActivePanel } = usePlayback();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      // Don't interfere with normal tab navigation
      if (e.key === 'Tab') return;

      // Don't trigger if focused on input elements
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      )) {
        return;
      }

      const items = Array.from(
        containerRef.current.querySelectorAll(itemSelector)
      );
      const currentFocusedItem = document.activeElement as HTMLElement;
      let currentIndex = items.indexOf(currentFocusedItem);

      // If nothing is focused and user presses j/k, focus the first/last item
      if (currentIndex === -1 && (e.key === 'j' || e.key === 'k' || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const firstIndex = e.key === 'k' || e.key === 'ArrowUp' ? items.length - 1 : 0;
        (items[firstIndex] as HTMLElement).focus();
        onNavigate?.(firstIndex);
        return;
      }

      // Only handle other navigation if we're focused on an item in this container
      if (currentIndex === -1) return;

      let newIndex: number;

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          e.preventDefault();
          if (gridMode) {
            newIndex = Math.min(currentIndex + columnsPerRow, items.length - 1);
          } else {
            newIndex = Math.min(currentIndex + 1, items.length - 1);
          }
          (items[newIndex] as HTMLElement).focus();
          onNavigate?.(newIndex);
          break;
        case 'k':
        case 'ArrowUp':
          e.preventDefault();
          if (gridMode) {
            newIndex = Math.max(currentIndex - columnsPerRow, 0);
          } else {
            newIndex = Math.max(currentIndex - 1, 0);
          }
          (items[newIndex] as HTMLElement).focus();
          onNavigate?.(newIndex);
          break;
        case 'h':
        case 'ArrowLeft':
          e.preventDefault();
          if (gridMode) {
            newIndex = Math.max(currentIndex - 1, 0);
            (items[newIndex] as HTMLElement).focus();
            onNavigate?.(newIndex);
          } else {
            onExit?.('left');
          }
          break;
        case 'l':
        case 'ArrowRight':
          e.preventDefault();
          if (gridMode) {
            newIndex = Math.min(currentIndex + 1, items.length - 1);
            (items[newIndex] as HTMLElement).focus();
            onNavigate?.(newIndex);
          } else {
            onExit?.('right');
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect?.(currentIndex);
          break;
        default:
          return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    containerRef,
    itemSelector,
    onNavigate,
    onSelect,
    onExit,
    setActivePanel,
  ]);

  return activePanel;
}
