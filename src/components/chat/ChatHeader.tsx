import { Button } from '@/components/ui/button.js'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ChatHeader() {
    const { theme, setTheme } = useTheme()

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-2">
                <img
                    src="/assets/icons/switchai-logo.svg"
                    alt="switch.ai"
                    className="h-8 w-8"
                />
                <h1 className="text-xl font-semibold">switch.ai</h1>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle theme"
            >
                {theme === 'light' ? (
                    <Moon className="h-5 w-5" />
                ) : (
                    <Sun className="h-5 w-5" />
                )}
            </Button>
        </header>
    )
}
