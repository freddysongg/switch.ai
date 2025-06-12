'use client';

import { Palette } from 'lucide-react';
import * as React from 'react';

import { applyTheme, AppTheme, availableAppThemes, themeColorPreviews } from '@/lib/ThemeService';
import { cn } from '@/lib/utils.js';

import { Button } from '@/components/ui/button.js';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command.js';
import { Dialog, DialogContent } from '@/components/ui/dialog.js';

const getThemePreviewColors = (themeId: string): Required<AppTheme['previewColors']> => {
  const specificPreview = themeColorPreviews[themeId];
  if (specificPreview) {
    return specificPreview as Required<AppTheme['previewColors']>;
  }
  const fallbackColors = { background: '#888888', text: '#ffffff', primary: '#007bff' };
  const defaultThemeColors = availableAppThemes.find((t) => t.id === themeId)?.previewColors;
  return defaultThemeColors || fallbackColors;
};

export function ThemeSwitcherSpotlight() {
  const [open, setOpen] = React.useState(false);
  const [activeThemeId, setActiveThemeId] = React.useState<string>('');

  React.useEffect(() => {
    const initializeTheme = () => {
      const savedThemeId = localStorage.getItem('switch-ai-active-theme-id');
      let initialThemeId = savedThemeId;
      if (!initialThemeId || !availableAppThemes.some((t) => t.id === initialThemeId)) {
        initialThemeId = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      applyTheme(initialThemeId);
      setActiveThemeId(initialThemeId);
    };

    initializeTheme();

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme: string; baseMode?: 'light' | 'dark' }>;
      if (customEvent.detail?.theme) {
        setActiveThemeId(customEvent.detail.theme);
      }
    };

    window.addEventListener('themechanged', handleThemeChange);
    return () => {
      window.removeEventListener('themechanged', handleThemeChange);
    };
  }, []);

  const handleThemeSelect = (themeId: string) => {
    applyTheme(themeId);
    setOpen(false);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === 'K' && (e.metaKey || e.ctrlKey))
      ) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const activeTheme = availableAppThemes.find((t) => t.id === activeThemeId);
  const activeThemeName = activeTheme?.name || 'select theme';

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-2 sm:px-3 font-mono text-xs sm:text-sm"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{activeThemeName}</span>
        <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>k
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="overflow-hidden p-0 shadow-2xl border-2 max-w-xl w-full rounded-xl transition-all duration-200"
          style={{
            zIndex: 99999,
            position: 'fixed',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'block',
            padding: '10px',
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}
        >
          <Command className="font-mono">
            <div className="flex items-center border-b border-border px-4 py-3 rounded-t-lg">
              <CommandInput
                placeholder="search themes..."
                className="flex h-8 w-full bg-transparent text-sm outline-none text-foreground placeholder:text-foreground/70 font-mono border-0 focus:ring-0"
              />
            </div>
            <CommandList className="max-h-[70vh] overflow-y-auto">
              <CommandEmpty className="py-8 text-center text-sm text-foreground font-mono">
                no themes found
              </CommandEmpty>
              <CommandGroup>
                <div className="px-2 py-1">
                  <p className="px-2 text-xs font-medium text-foreground/70 font-mono uppercase tracking-wider">
                    available themes
                  </p>
                </div>
                {availableAppThemes.map((theme) => {
                  const colors = getThemePreviewColors(theme.id);
                  return (
                    <CommandItem
                      key={theme.id}
                      value={theme.name}
                      onSelect={() => handleThemeSelect(theme.id)}
                      className={cn(
                        'cursor-pointer px-4 py-3 mx-2 my-1 rounded-lg font-mono transition-all duration-200',
                        'hover:bg-accent/50 hover:text-accent-foreground',
                        'flex items-center justify-between group',
                        activeThemeId === theme.id &&
                          'bg-accent text-accent-foreground ring-2 ring-primary/20'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          {Object.values(colors || {}).map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-border/50 transition-transform duration-200 hover:scale-125"
                              style={{
                                backgroundColor: color,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{theme.name}</span>
                          <span className="text-xs text-foreground/70">
                            {theme.baseMode} • {theme.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeThemeId === theme.id && (
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-mono">
                            active
                          </span>
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-xs text-foreground/70 font-mono">↵</div>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
