import { useState, KeyboardEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button.js'
import { Textarea } from '@/components/ui/textarea.js'
import { SendHorizontal } from 'lucide-react'

interface ChatInputProps {
    onSendMessage: (message: string) => void
    isLoading?: boolean
}

export function ChatInput({
    onSendMessage,
    isLoading = false,
}: ChatInputProps) {
    const [message, setMessage] = useState('')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (message.trim() && !isLoading) {
            onSendMessage(message)
            setMessage('')
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t p-4 bg-background"
        >
            <Textarea
                placeholder="Ask about mechanical keyboard switches..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] resize-none"
                disabled={isLoading}
            />
            <Button
                type="submit"
                size="icon"
                disabled={isLoading || !message.trim()}
                className="h-[60px] w-[60px] rounded-md bg-primary hover:bg-primary/90"
            >
                <SendHorizontal className="h-5 w-5" />
                <span className="sr-only">Send message</span>
            </Button>
        </form>
    )
}
