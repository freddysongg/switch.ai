import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ThemeSwitcherSpotlight } from '@/components/themes/ThemeSwitcherSpotlight.js';

interface ChatHeaderProps {
  onReset: () => void;
}

export function ChatHeader({ onReset }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onReset}
        >
          <img src="/assets/icons/switch.ai v2 Logo.png" alt="switch.ai" className="h-8 w-8" />
          <div className="flex flex-col justify-center lowercase">
            <h1 className="text-lg font-semibold leading-none">switch.ai</h1>
            <p className="text-xs text-muted-foreground">gpt, but for switches</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcherSpotlight />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="About switch.ai">
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="group fixed bottom-0 left-[50%] translate-x-[-50%] h-[90vh] w-[80vw] rounded-t-xl sm:rounded-xl bg-background/60 dark:bg-background/40 backdrop-blur-md border border-border/50 shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full data-[state=open]:duration-500 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-full data-[state=closed]:duration-300">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/50 dark:from-background/30 dark:via-background/20 dark:to-background/30 pointer-events-none" />
                <div className="relative z-10">
                  <DialogHeader>
                    <DialogTitle className="text-center font-display text-2xl">
                      About switch.ai
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground sr-only">
                      Detailed information about the switch.ai application, its mission, features,
                      and development story.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-8 overflow-auto px-4 sm:px-6 pb-6 max-h-[calc(90vh-8rem)]">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Our Mission</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        switch.ai is your AI-powered companion for discovering mechanical keyboard
                        switches. We believe that finding the perfect switch shouldn't be
                        overwhelming. Whether you're looking for the perfect typing experience,
                        silent switches for the office, or something specific, we're here to help
                        you navigate the complex world of mechanical switches.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">The Journey</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Born from personal experience with the overwhelming variety of mechanical
                        switches, switch.ai was developed to simplify the selection process. As
                        keyboard enthusiasts ourselves, we understand the importance of finding
                        switches that match your preferences perfectly. Our AI-powered platform
                        combines extensive switch knowledge with modern technology to provide
                        personalized recommendations.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">What We Offer</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                          Intelligent switch comparisons and recommendations
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                          Detailed specifications and characteristics
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                          Natural language interaction for easy exploration
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                          Real-world usage insights and compatibility information
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg border bg-card/50 p-6 space-y-4">
                      <h3 className="text-lg font-semibold">What's next? 🚀</h3>
                      <p className="text-sm text-muted-foreground">
                        We're constantly working to improve switch.ai. Here are some features we're
                        considering:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary/60" />
                          Sound profile analysis and comparison
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary/60" />
                          Keyboard compatibility checker
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <p className="text-sm text-primary/90">
                          Have a feature suggestion? We'd love to hear from you!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
