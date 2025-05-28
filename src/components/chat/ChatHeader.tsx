import { Button } from '@/components/ui/button.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog.js';
import { useTheme } from '@/hooks/useTheme.js';
import { Info, Moon, Sun } from 'lucide-react';

interface ChatHeaderProps {
  onReset: () => void;
}

export function ChatHeader({ onReset }: ChatHeaderProps) {
  const { theme, setTheme } = useTheme();

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
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
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
                      about switch.ai
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-8 overflow-auto px-4 sm:px-6 pb-6 max-h-[calc(90vh-8rem)]">
                    {/* Mission & Vision */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">our mission</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        switch.ai is your ai-powered companion for discovering mechanical keyboard
                        switches. we believe that finding the perfect switch shouldn't be
                        overwhelming. whether you're looking for the perfect typing experience,
                        silent switches for the office, or something specific, we're here to help
                        you navigate the complex world of mechanical switches.
                      </p>
                    </div>

                    {/* Development Story */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">the journey</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        born from personal experience with the overwhelming variety of mechanical
                        switches, switch.ai was developed to simplify the selection process. as
                        keyboard enthusiasts ourselves, we understand the importance of finding
                        switches that match your preferences perfectly. our ai-powered platform
                        combines extensive switch knowledge with modern technology to provide
                        personalized recommendations.
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">what we offer</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                          intelligent switch comparisons and recommendations
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                          detailed specifications and characteristics
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                          natural language interaction for easy exploration
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                          real-world usage insights and compatibility information
                        </li>
                      </ul>
                    </div>

                    {/* Upcoming Features Box */}
                    <div className="rounded-lg border bg-card/50 p-6 space-y-4">
                      <h3 className="text-lg font-semibold">what's next? 🚀</h3>
                      <p className="text-sm text-muted-foreground">
                        we're constantly working to improve switch.ai. here are some features we're
                        considering:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary/60" />
                          sound profile analysis and comparison
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary/60" />
                          visual switch animations
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary/60" />
                          community reviews and experiences
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary/60" />
                          keyboard compatibility checker
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <p className="text-sm text-primary/90">
                          have a feature suggestion? we'd love to hear from you!
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
