import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/use-auth.js';

import { Button } from '@/components/ui/button.js';
import { ThemeSwitcherSpotlight } from '@/components/themes/ThemeSwitcherSpotlight.js';

export function Header() {
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between relative px-4 md:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/icons/switch.ai v2 Logo.png" alt="switch.ai" className="h-8 w-8" />
            <span className="text-xl font-bold lowercase">switch.ai</span>
          </Link>
        </div>

        <nav className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-6"></nav>

        <div className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <ThemeSwitcherSpotlight />
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {currentUser.email}
                </span>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild size="sm">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
