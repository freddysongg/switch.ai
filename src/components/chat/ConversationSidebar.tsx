import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  Clock,
  MessageSquare,
  PlusCircle,
  Search,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useRef, useState } from 'react';

import { useIsMobile } from '@/hooks/use-mobile.js';
import { cn } from '@/lib/oauth.js';

import { ConversationListProps, ConversationSidebarProps } from '@/types/chat';

import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
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
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <motion.div
        ref={sidebarRef}
        className="relative hidden md:flex h-full flex-col"
        layout
        style={{ willChange: 'width' }}
        animate={{ width: isCollapsed ? 80 : 320 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40, mass: 1, duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="expanded"
              className="absolute left-6 right-4 bottom-20 top-60 z-30"
              initial={{ opacity: 0, scale: 0.96, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.96, x: -20 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.4
              }}
            >
              <motion.div
                className="h-full bg-background/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-color)',
                  borderColor: 'var(--sub-color)'
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: 'var(--sub-alt-color)' }}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-foreground" />
                        </div>
                        <h2
                          className="text-lg font-semibold"
                          style={{ color: 'var(--text-color)' }}
                        >
                          chats
                        </h2>
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-transparent"
                            style={{ color: 'var(--text-color)' }}
                            onClick={onNewConversation}
                          >
                            <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                              <PlusCircle className="h-4 w-4" />
                            </motion.div>
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-transparent"
                            style={{ color: 'var(--text-color)' }}
                            onClick={handleToggle}
                          >
                            <motion.div whileHover={{ x: -2 }} transition={{ duration: 0.2 }}>
                              <ChevronLeft className="h-4 w-4" />
                            </motion.div>
                          </Button>
                        </motion.div>
                      </div>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border text-foreground placeholder:text-muted-foreground"
                        style={{
                          backgroundColor: 'var(--bg-color)',
                          borderColor: 'var(--sub-color)',
                          color: 'var(--text-color)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 max-h-full overflow-auto">
                  <div className="p-2">
                    <ConversationList
                      conversations={filteredConversations}
                      currentConversationId={currentConversationId}
                      onSelectConversation={onSelectConversation}
                      onDeleteConversation={onDeleteConversation}
                      isCollapsed={false}
                    />
                  </div>
                </ScrollArea>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCollapsed && (
            <motion.div
              key="collapsed"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30"
              initial={{ opacity: 0, scale: 0.8, x: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -30 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 35,
                mass: 1,
                duration: 0.4
              }}
            >
              <motion.div
                className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-3"
                style={{
                  backgroundColor: 'var(--bg-color)',
                  borderColor: 'var(--sub-color)'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-transparent"
                      style={{ color: 'var(--text-color)' }}
                      onClick={onNewConversation}
                    >
                      <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                        <PlusCircle className="h-5 w-5" />
                      </motion.div>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-transparent"
                      style={{ color: 'var(--text-color)' }}
                      onClick={handleToggle}
                    >
                      <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                        <ChevronLeft className="h-4 w-4 rotate-180" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation
}: ConversationListProps & { isCollapsed?: boolean }) {
  return (
    <div className="space-y-1">
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="group relative rounded-md"
            style={{ backgroundColor: 'rgba(0,0,0,0)', borderRadius: '0.375rem' }}
          >
            <motion.button
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 text-left text-sm rounded-xl transition-all duration-200',
                conversation.id === currentConversationId
                  ? 'bg-transparent hover:bg-black/5 hover:dark:bg-white/5 border border-current'
                  : 'bg-transparent hover:bg-black/5 hover:dark:bg-white/5'
              )}
              style={{
                color: 'var(--text-color)',
                borderColor:
                  conversation.id === currentConversationId ? 'var(--main-color)' : 'transparent'
              }}
              onClick={() => onSelectConversation(conversation.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={cn('p-2 rounded-lg')}
                style={{
                  backgroundColor:
                    conversation.id === currentConversationId
                      ? 'var(--main-color)'
                      : 'var(--sub-alt-color)'
                }}
              >
                <MessageSquare
                  className="h-4 w-4"
                  style={{
                    color:
                      conversation.id === currentConversationId
                        ? 'var(--bg-color)'
                        : 'var(--text-color)'
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-tight break-words line-clamp-2">
                  {conversation.title || 'New Chat'}
                </p>
                <div
                  className="flex items-center gap-1 text-xs mt-1"
                  style={{ color: 'var(--sub-color)' }}
                >
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.button>

            {conversation.id !== currentConversationId && onDeleteConversation && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-transform duration-150 ease-in-out">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-transparent"
                    style={{ color: 'var(--sub-color)' }}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                  >
                    <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                      <Trash2 className="h-3 w-3" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm p-8"
          style={{ color: 'var(--sub-color)' }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--sub-alt-color)' }}>
              <Sparkles className="h-6 w-6" />
            </div>
            <p>no conversations yet</p>
            <p className="text-xs">start a new chat to begin!</p>
          </div>
        </motion.div>
      )}
    </div>
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
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed left-4 top-8 z-20 h-10 w-10 backdrop-blur-xl border rounded-xl hover:bg-transparent"
            style={{
              backgroundColor: 'var(--bg-color)',
              borderColor: 'var(--sub-color)',
              color: 'var(--text-color)'
            }}
          >
            <motion.div whileHover={{ rotate: 5 }} transition={{ duration: 0.2 }}>
              <MessageSquare className="h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-80 backdrop-blur-xl border"
        style={{
          backgroundColor: 'var(--bg-color)',
          borderColor: 'var(--sub-color)'
        }}
      >
        <div className="p-6 border-b" style={{ borderColor: 'var(--sub-alt-color)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--sub-alt-color)' }}>
                <MessageSquare className="h-4 w-4" style={{ color: 'var(--text-color)' }} />
              </div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                chats
              </h2>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-transparent"
                style={{ color: 'var(--text-color)' }}
                onClick={handleNewAndClose}
              >
                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                  <PlusCircle className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectAndClose}
            onDeleteConversation={onDeleteConversation}
          />
        </ScrollArea>
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
