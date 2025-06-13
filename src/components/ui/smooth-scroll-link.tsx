'use client';

import type React from 'react';

import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

interface SmoothScrollLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
  duration?: number;
  onClick?: () => void;
}

export function SmoothScrollLink({
  to,
  children,
  className,
  offset = 80,
  duration = 800,
  onClick
}: SmoothScrollLinkProps) {
  const { scrollToElement } = useSmoothScroll();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToElement(to, { offset, duration });
    onClick?.();
  };

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
