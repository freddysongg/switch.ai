import { useNavigate } from 'react-router-dom';

import { ThemeSwitcherSpotlight } from '@/components/themes/ThemeSwitcherSpotlight.js';

interface ChatHeaderProps {
  onReset: () => void;
}

export function ChatHeader({ onReset }: ChatHeaderProps) {
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onReset();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <img src="/assets/icons/switch.ai v2 Logo.png" alt="switch.ai" className="h-8 w-8" />
          <div className="flex flex-col justify-center lowercase">
            <h1 className="text-lg font-semibold leading-none">switch.ai</h1>
            <p className="text-xs text-muted-foreground">gpt, but for switches</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcherSpotlight />
        </div>
      </div>
    </header>
  );
}
