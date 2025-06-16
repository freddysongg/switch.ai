'use client';

import { motion } from 'framer-motion';
import { Menu, UserCircle } from 'lucide-react';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/auth-context';

import { BorderTrail } from '@/components/ui/border-trail';
import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.js';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { SmoothScrollLink } from '@/components/ui/smooth-scroll-link';
import { ThemeSwitcherSpotlight } from '@/components/themes/ThemeSwitcherSpotlight.js';

export const Header = React.memo(function Header() {
  const { currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('');
  const location = useLocation();

  const navItems = React.useMemo(
    () => [
      { name: 'features', href: '#features' },
      { name: 'how it works', href: '#how-it-works' },
      { name: 'contact', href: '#contact' }
    ],
    []
  );

  React.useEffect(() => {
    if (location.pathname === '/') {
      const handleScroll = () => {
        let currentSection = '';
        for (let i = navItems.length - 1; i >= 0; i--) {
          const sectionId = navItems[i].href.substring(1);
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 160 && rect.bottom >= 160) {
              currentSection = navItems[i].href;
              break;
            }
          }
        }
        if (window.scrollY <= 50) {
          currentSection = '';
        }
        setActiveSection(currentSection);
      };

      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setActiveSection('');
    }
  }, [navItems, location.pathname]);

  React.useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setActiveSection(location.hash);
    } else if (location.pathname !== '/') {
      setActiveSection('');
    }
  }, [location.pathname, location.hash]);

  const activeTab = React.useMemo(() => {
    if (location.pathname !== '/') return -1;
    return navItems.findIndex((item) => item.href === activeSection);
  }, [activeSection, navItems, location.pathname]);

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Header] handleLogoClick triggered.');
      console.log('[Header] Current location.pathname:', location.pathname);
      console.log('[Header] Current location.hash:', location.hash);
    }

    if (location.pathname === '/') {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Header] Already on the landing page.');
        console.log('[Header] Attempting to scroll to top smoothly.');
      }
      event.preventDefault();
      setActiveSection('');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (location.hash) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Header] Hash found, attempting to clear it using history.replaceState.');
        }
        history.replaceState(null, '', window.location.pathname);
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log("[Header] Not on the landing page. Allowing Link to navigate to '/'.");
      }
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-40">
      <div className="relative bg-background/98 dark:bg-background/98 backdrop-blur-xl border-b border-border/40">
        {location.pathname === '/' && (
          <ScrollProgress className="h-1 bg-zinc-800 dark:bg-zinc-600" />
        )}

        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2" onClick={handleLogoClick}>
              <motion.img
                src="/public/assets/icons/switch.ai v2 Logo.png"
                alt="switch.ai"
                className="h-8 w-8"
                style={{ willChange: 'transform' }}
                whileHover={{ rotate: [0, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <span className="font-bold lowercase text-foreground text-xl">switch.ai</span>
            </Link>
          </div>

          {location.pathname === '/' && (
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {navItems.map((item, index) => (
                  <SmoothScrollLink
                    key={item.href}
                    to={item.href}
                    className="relative px-4 py-2 text-sm font-medium transition-colors text-foreground/80 hover:text-foreground rounded-lg hover:bg-foreground/5"
                    offset={80}
                    duration={800}
                    onClick={() => {
                      console.log(`[Header] SmoothScrollLink clicked for: ${item.href}`);
                      setActiveSection(item.href);
                    }}
                  >
                    {item.name}
                    {activeTab === index && (
                      <motion.div
                        layoutId="active-tab-indicator-desktop"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </SmoothScrollLink>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <ThemeSwitcherSpotlight />
            {currentUser ? (
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ willChange: 'transform' }}
              >
                <div className="relative w-10 h-10 rounded-full bg-zinc-800 dark:bg-zinc-700 flex items-center justify-center border border-zinc-700 dark:border-zinc-600">
                  <motion.div />
                  <div className="absolute inset-[1px] bg-zinc-800 dark:bg-zinc-700 rounded-full" />
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="relative z-10 p-0 bg-transparent hover:bg-transparent rounded-full h-full w-full"
                  >
                    <Link
                      to="/chat"
                      aria-label="Open App / Profile"
                      className="flex items-center justify-center"
                    >
                      <UserCircle className="h-5 w-5 text-white" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ willChange: 'transform' }}
                  >
                    <Button
                      variant="ghost"
                      asChild
                      size="sm"
                      className="text-foreground/80 hover:text-foreground hover:bg-foreground/10 px-4 py-2 text-sm rounded-lg"
                    >
                      <Link to="/login">log in</Link>
                    </Button>
                  </motion.div>
                  <BorderTrail className="rounded-lg">
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm rounded-lg font-medium"
                      style={{ backgroundColor: 'var(--sub-color)', color: 'var(--sub-alt-color)' }}
                    >
                      <Link to="/register">sign up</Link>
                    </Button>
                  </BorderTrail>
                </div>
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground h-8 w-8 rounded-lg hover:bg-foreground/10"
                      >
                        <UserCircle className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-popover text-popover-foreground border-border"
                    >
                      <DropdownMenuItem asChild>
                        <Link to="/login" className="font-mono">
                          log in
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register" className="font-mono">
                          sign up
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}

            {location.pathname === '/' && (
              <div className="md:hidden">
                <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-foreground h-8 w-8 rounded-lg hover:bg-foreground/10"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-popover text-popover-foreground border-border w-48"
                  >
                    {navItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <SmoothScrollLink
                          to={item.href}
                          className="w-full"
                          onClick={() => {
                            setActiveSection(item.href);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          {item.name}
                        </SmoothScrollLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
