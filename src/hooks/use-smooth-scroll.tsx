'use client';

import { useCallback } from 'react';

interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  offset?: number;
}

export function useSmoothScroll() {
  const scrollTo = useCallback((target: string | number, options: SmoothScrollOptions = {}) => {
    const { duration = 800, easing = (t: number) => t * (2 - t), offset = 0 } = options;

    let targetPosition: number;

    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) {
        console.warn(`Element with selector "${target}" not found`);
        return;
      }
      targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    } else {
      targetPosition = target - offset;
    }

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easing(progress);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        if (typeof target === 'string' && target.startsWith('#')) {
          window.history.replaceState(null, '', target);
        }
      }
    }

    requestAnimationFrame(animation);
  }, []);

  const scrollToTop = useCallback(
    (options?: SmoothScrollOptions) => {
      scrollTo(0, options);
    },
    [scrollTo]
  );

  const scrollToElement = useCallback(
    (selector: string, options?: SmoothScrollOptions) => {
      scrollTo(selector, options);
    },
    [scrollTo]
  );

  return {
    scrollTo,
    scrollToTop,
    scrollToElement
  };
}
