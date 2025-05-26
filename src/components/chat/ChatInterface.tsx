import { useEffect, useRef, useState } from 'react'
import { ChatHeader } from './ChatHeader.js'
import { ChatInput } from './ChatInput.js'
import { ChatMessage } from './ChatMessage.js'
import { ConversationSidebar } from './ConversationSidebar.js'
import { Message, Conversation } from '@/types.js'
import { ScrollArea } from '@/components/ui/scroll-area.js'
import { Loader2 } from 'lucide-react'

export function ChatInterface() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [currentConversationId, setCurrentConversationId] = useState<
        string | null
    >(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Mock conversation data
    useEffect(() => {
        const mockConversations: Conversation[] = [
            { id: '1', title: 'Linear vs Tactile Switches' },
            { id: '2', title: 'Best Silent Switches' },
            { id: '3', title: 'Cherry MX Red Alternatives' },
        ]
        setConversations(mockConversations)

        // Initialize with welcome message
        const welcomeMessage: Message = {
            id: 'welcome',
            content:
                "Hello! I'm switch.ai, ask me anything about mechanical keyboard switches.",
            sender: 'assistant',
            timestamp: new Date().toISOString(),
        }
        setMessages([welcomeMessage])
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = (content: string) => {
        // Add user message to the chat
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content,
            sender: 'user',
            timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, userMessage])

        // Simulate AI response
        setIsLoading(true)
        setTimeout(() => {
            // For demo, create a mock response based on the query
            let responseContent = ''
            if (content.toLowerCase().includes('linear')) {
                responseContent =
                    "Linear switches have a smooth keystroke without any tactile bump or click. Popular examples include Cherry MX Red, Gateron Yellow, and Novelkey Cream switches. They're often preferred for gaming due to their faster actuation and smoother keypress."
            } else if (content.toLowerCase().includes('tactile')) {
                responseContent =
                    "Tactile switches provide a noticeable bump during keypress, giving physical feedback without being as loud as clicky switches. Examples include Cherry MX Browns, Zealios V2, and Holy Pandas. They're popular for typing and offer a good balance between gaming and typing performance."
            } else if (content.toLowerCase().includes('silent')) {
                responseContent =
                    'Silent switches are designed to minimize noise during typing. Options like Silent Alpacas, Zilent V2, and Cherry MX Silent Red use special dampeners to reduce bottom-out and top-out noise, making them great for office environments or late-night typing sessions.'
            } else {
                responseContent =
                    "I'd be happy to help with your question about mechanical keyboard switches. Could you provide a bit more detail about what specific switch characteristics you're interested in? For example, are you looking for information about switch types, feel, sound profiles, or specific brands?"
            }

            const botMessage: Message = {
                id: `assistant-${Date.now()}`,
                content: responseContent,
                sender: 'assistant',
                timestamp: new Date().toISOString(),
            }

            setMessages((prev) => [...prev, botMessage])
            setIsLoading(false)
        }, 1500)
    }

    const handleSelectConversation = (id: string) => {
        setCurrentConversationId(id)
        const selectedConvo = conversations.find((c) => c.id === id)

        if (selectedConvo) {
            // Mock loading conversation messages
            setMessages([
                {
                    id: 'convo-start',
                    content: `This is the beginning of your conversation about "${selectedConvo.title}"`,
                    sender: 'assistant',
                    timestamp: new Date().toISOString(),
                },
            ])
        }
    }

    const handleNewConversation = () => {
        const newId = `new-${Date.now()}`
        const newConversation: Conversation = {
            id: newId,
            title: 'New Conversation',
        }

        setConversations((prev) => [newConversation, ...prev])
        setCurrentConversationId(newId)
        setMessages([
            {
                id: 'new-welcome',
                content:
                    "Hello! I'm switch.ai, ask me anything about mechanical keyboard switches.",
                sender: 'assistant',
                timestamp: new Date().toISOString(),
            },
        ])
    }

    return (
        <div className="flex h-full flex-col md:flex-row">
            <ConversationSidebar
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
            />

            <div className="flex flex-1 flex-col h-full">
                <ChatHeader />

                <ScrollArea className="flex-1 p-4">
                    <div className="max-w-3xl mx-auto">
                        {messages.map((message, i) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isLastMessage={i === messages.length - 1}
                            />
                        ))}

                        {isLoading && (
                            <div className="flex items-center justify-start gap-2 py-4">
                                <div className="h-8 w-8 flex items-center justify-center bg-muted rounded-full">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                                <div className="rounded-lg px-4 py-2 bg-muted text-muted-foreground">
                                    switch.ai is typing...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}
