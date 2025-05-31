import { motion } from 'framer-motion';
import { ChevronLeft, MessageSquare, PlusCircle, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { useIsMobile } from '@/hooks/use-mobile.js';
import { cn } from '@/lib/utils.js';

import { ConversationListProps, ConversationSidebarProps } from '@/types/chat';

import { BorderTrail } from '@/components/ui/border-trail.js';
import { Button } from '@/components/ui/button.js';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.js';

export function ConversationSidebarDesktop({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation
}: ConversationSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <motion.div
        ref={sidebarRef}
        className="hidden md:flex h-full flex-col border-r bg-sidebar text-sidebar-foreground shadow-md"
        animate={{ width: isCollapsed ? 0 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="p-3 border-b border-sidebar-border flex items-center justify-between h-14 flex-shrink-0 overflow-hidden">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 1 }}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
          >
            <MessageSquare className="h-5 w-5 shrink-0" />
            <h2 className="text-lg font-semibold whitespace-nowrap">Chats</h2>
          </motion.div>
          <div className="flex items-center gap-1">
            {!isCollapsed ? (
              <BorderTrail className="rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onNewConversation}
                  aria-label="New Chat"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </BorderTrail>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onNewConversation}
                disabled={isCollapsed}
                aria-label="New Chat"
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggle}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <ChevronLeft
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  isCollapsed && 'rotate-180'
                )}
              />
            </Button>
          </div>
        </div>
        <motion.div
          className="flex-grow overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
        >
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={onSelectConversation}
            onDeleteConversation={onDeleteConversation}
          />
        </motion.div>
      </motion.div>
      {isCollapsed && (
        <motion.div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-20 hidden md:block"
          initial={{ x: -40 }}
          animate={{ x: 4 }}
          exit={{ x: -40 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-r-md rounded-l-none shadow-lg"
            onClick={handleToggle}
            aria-label="Expand Sidebar"
          >
            <MessageSquare className="h-5 w-5 rotate-0 transition-transform duration-200" />
          </Button>
        </motion.div>
      )}
    </>
  );
}

function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation
}: ConversationListProps) {
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-2 space-y-1">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              className="group relative"
              whileHover={{ backgroundColor: 'hsla(var(--muted))' }}
              style={{ borderRadius: '0.375rem' }}
            >
              <button
                className={cn(
                  'w-full flex items-center gap-2 px-2.5 py-2 text-left text-sm rounded-md transition-colors',
                  conversation.id === currentConversationId
                    ? 'bg-primary/15 text-primary dark:bg-primary/25 dark:text-white font-medium pointer-events-none'
                    : 'text-sidebar-foreground/80 hover:text-sidebar-foreground group-hover:bg-transparent dark:group-hover:bg-transparent'
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <MessageSquare
                  className={cn(
                    'h-4 w-4 shrink-0',
                    conversation.id === currentConversationId
                      ? 'text-primary dark:text-white/90'
                      : 'text-muted-foreground group-hover:text-sidebar-foreground'
                  )}
                />
                <span className="truncate flex-1 min-w-0 break-words text-pretty">
                  {conversation.title || 'New Chat'}
                </span>
              </button>
              {conversation.id !== currentConversationId && onDeleteConversation && (
                <motion.div
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground p-4 h-full flex items-center justify-center">
            <p>
              No conversations yet. <br /> Start a new chat!
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export function ConversationSidebarMobile({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation
}: ConversationSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAndClose = (id: string) => {
    onSelectConversation(id);
    setIsOpen(false);
  };

  const handleNewAndClose = () => {
    onNewConversation();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed left-3 top-2.5 z-20 h-9 w-9 bg-background/80 backdrop-blur-sm border border-border"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-64 sm:w-72 bg-sidebar text-sidebar-foreground flex flex-col"
      >
        <div className="p-3 border-b border-sidebar-border flex items-center justify-between h-14 flex-shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 shrink-0" />
            <h2 className="text-lg font-semibold">Chats</h2>
          </div>
          <div className="flex items-center gap-1">
            <BorderTrail className="rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleNewAndClose}
                aria-label="New Chat"
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </BorderTrail>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectAndClose}
          onDeleteConversation={onDeleteConversation}
        />
      </SheetContent>
    </Sheet>
  );
}

export function ConversationSidebar(props: ConversationSidebarProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <ConversationSidebarMobile {...props} />;
  }

  return <ConversationSidebarDesktop {...props} />;
}
