import { Button } from '@/components/ui/button.js';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.js';
import { useIsMobile } from '@/hooks/use-mobile.js';
import { ChevronLeft, MessageSquare, PlusCircle, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/lib/utils.js';

import { Conversation } from '@/types/chat';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
}

interface ConversationSidebarProps extends ConversationListProps {
  onNewConversation: () => void;
}

export function ConversationSidebarDesktop({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation
}: ConversationSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [shouldShowIcon, setShouldShowIcon] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    setShouldShowIcon(!shouldShowIcon);
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={cn(
          'hidden md:flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200',
          isCollapsed ? 'w-0 border-none overflow-hidden' : 'w-60'
        )}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between h-14">
          <div
            className={cn(
              'flex items-center gap-2 transition-opacity duration-200',
              isCollapsed && 'opacity-0'
            )}
          >
            <MessageSquare className="h-5 w-5 shrink-0" />
            <h2 className="text-lg font-semibold">chats</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNewConversation}>
              <PlusCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggle}>
              <ChevronLeft
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  isCollapsed && 'rotate-180'
                )}
              />
            </Button>
          </div>
        </div>

        <div
          className={cn(
            'transition-all duration-200',
            isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={onSelectConversation}
          />
        </div>
      </div>
      {shouldShowIcon && isCollapsed && (
        <div className="fixed left-0 top-0 bottom-0 w-12 z-50">
          <div className="absolute inset-y-0 flex items-center" onClick={handleToggle}>
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation
}: ConversationListProps & { onDeleteConversation?: (id: string) => void }) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div key={conversation.id} className="group relative">
              <button
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-2 text-left text-sm rounded-md transition-colors',
                  conversation.id === currentConversationId
                    ? 'bg-primary/10 text-primary dark:bg-white/20 dark:text-white pointer-events-none'
                    : 'hover:bg-muted/50 dark:hover:bg-white/10'
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div
                  className={cn(
                    'rounded-md p-1 transition-colors relative group/icon',
                    conversation.id === currentConversationId
                      ? ''
                      : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-white/20 dark:hover:text-white/90'
                  )}
                >
                  <div className="relative w-4 h-4">
                    <MessageSquare
                      className={cn(
                        'h-4 w-4 shrink-0 transition-all absolute',
                        conversation.id === currentConversationId
                          ? 'text-primary dark:text-white/90'
                          : 'text-muted-foreground dark:text-white/60 group-hover/icon:opacity-0'
                      )}
                    />
                    {conversation.id !== currentConversationId && (
                      <Trash2
                        className="h-4 w-4 text-muted-foreground hover:text-destructive absolute transition-all opacity-0 group-hover/icon:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation?.(conversation.id);
                        }}
                      />
                    )}
                  </div>
                </div>
                <span className="min-w-0 break-words text-pretty">{conversation.title}</span>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground p-4">
            no conversations yet. start a new chat!
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
  onNewConversation
}: ConversationSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectConversation = (id: string) => {
    onSelectConversation(id);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-60 bg-sidebar text-sidebar-foreground">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold">chats</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onNewConversation();
                  setIsOpen(false);
                }}
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>
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
