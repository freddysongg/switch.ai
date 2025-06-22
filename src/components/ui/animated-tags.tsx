'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/oauth';

interface AnimatedTagsProps {
  tags: string[];
  className?: string;
}

export function AnimatedTags({ tags, className }: AnimatedTagsProps) {
  return (
    <motion.div
      className={cn(
        'flex justify-center items-center gap-4 text-sm text-muted-foreground',
        className
      )}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
            delayChildren: 0.5,
            duration: 0.8
          }
        }
      }}
    >
      {tags.map((tag, index) => (
        <motion.div
          key={tag}
          className="flex items-center gap-2"
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
              scale: 0.8
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
                duration: 0.6
              }
            }
          }}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-primary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.8 + index * 0.3,
              type: 'spring',
              stiffness: 400,
              damping: 15
            }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + index * 0.3 }}
          >
            {tag}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}
