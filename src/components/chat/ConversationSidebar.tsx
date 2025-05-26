import { useState } from 'react'
import { PlusCircle, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area.js'
import { Button } from '@/components/ui/button.js'
import { Conversation } from '@/types.js'
import { cn } from '@/lib/utils.js'
import { useIsMobile } from '@/hooks/use-mobile.js'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.js'

interface ConversationSidebarProps {
    conversations: Conversation[]
    currentConversationId: string | null
    onSelectConversation: (id: string) => void
    onNewConversation: () => void
}

export function ConversationSidebarMobile({
    conversations,
    currentConversationId,
    onSelectConversation,
    onNewConversation,
}: ConversationSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSelectConversation = (id: string) => {
        onSelectConversation(id)
        setIsOpen(false)
    }

    const handleNewConversation = () => {
        onNewConversation()
        setIsOpen(false)
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-menu"
                    >
                        <line x1="4" x2="20" y1="12" y2="12" />
                        <line x1="4" x2="20" y1="6" y2="6" />
                        <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="p-0 w-80 bg-sidebar text-sidebar-foreground"
            >
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Conversations</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <ConversationList
                        conversations={conversations}
                        currentConversationId={currentConversationId}
                        onSelectConversation={handleSelectConversation}
                        onNewConversation={handleNewConversation}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export function ConversationSidebarDesktop({
    conversations,
    currentConversationId,
    onSelectConversation,
    onNewConversation,
}: ConversationSidebarProps) {
    return (
        <div className="hidden md:flex h-full w-80 flex-col border-r bg-sidebar text-sidebar-foreground">
            <div className="p-4 border-b border-sidebar-border">
                <h2 className="text-lg font-semibold">Conversations</h2>
            </div>
            <ConversationList
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={onSelectConversation}
                onNewConversation={onNewConversation}
            />
        </div>
    )
}

function ConversationList({
    conversations,
    currentConversationId,
    onSelectConversation,
    onNewConversation,
}: ConversationSidebarProps) {
    return (
        <>
            <div className="p-4">
                <Button
                    onClick={onNewConversation}
                    className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Chat
                </Button>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {conversations.length > 0 ? (
                        conversations.map((conversation) => (
                            <Button
                                key={conversation.id}
                                variant="ghost"
                                className={cn(
                                    'w-full justify-start text-left font-normal',
                                    conversation.id === currentConversationId &&
                                        'bg-sidebar-accent text-sidebar-accent-foreground'
                                )}
                                onClick={() =>
                                    onSelectConversation(conversation.id)
                                }
                            >
                                <div className="truncate">
                                    {conversation.title}
                                </div>
                            </Button>
                        ))
                    ) : (
                        <div className="text-center text-sm text-sidebar-foreground/60 p-4">
                            No conversations yet. Start a new chat!
                        </div>
                    )}
                </div>
            </ScrollArea>
        </>
    )
}

export function ConversationSidebar(props: ConversationSidebarProps) {
    const isMobile = useIsMobile()

    if (isMobile) {
        return <ConversationSidebarMobile {...props} />
    }

    return <ConversationSidebarDesktop {...props} />
}
