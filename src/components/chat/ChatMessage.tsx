import { Avatar } from '@/components/ui/avatar.js'
import { cn } from '@/lib/utils.js'
import { Message } from '@/types.js'

interface ChatMessageProps {
    message: Message
    isLastMessage?: boolean
}

export function ChatMessage({ message, isLastMessage }: ChatMessageProps) {
    const isUserMessage = message.sender === 'user'

    return (
        <div
            className={cn(
                'flex w-full items-start gap-4 py-4',
                isUserMessage ? 'justify-end' : 'justify-start'
            )}
            id={isLastMessage ? 'last-message' : undefined}
        >
            {!isUserMessage && (
                <Avatar className="h-8 w-8">
                    <div className="flex h-full w-full items-center justify-center bg-muted text-primary text-xs">
                        <img
                            src="/assets/icons/switchai-logo.svg"
                            alt="Switch.ai"
                            className="h-5 w-5"
                        />
                    </div>
                </Avatar>
            )}

            <div
                className={cn(
                    'rounded-lg px-4 py-2 max-w-[80%]',
                    isUserMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                )}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                </p>
            </div>

            {isUserMessage && (
                <Avatar className="h-8 w-8">
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xs">
                        U
                    </div>
                </Avatar>
            )}
        </div>
    )
}
