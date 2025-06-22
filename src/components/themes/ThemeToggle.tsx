import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/hooks/use-theme.js';

import { GlowButton } from '@/components/ui/glow-button.js';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <GlowButton
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="toggle theme"
      glowColor={`color-mix(in srgb, var(--main-color) 20%, transparent)`}
      glownintensity={0.7}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">toggle theme</span>
    </GlowButton>
  );
}
