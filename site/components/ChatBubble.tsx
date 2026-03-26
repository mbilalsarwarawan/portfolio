'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ChatBubbleProps {
  isOpen: boolean;
  onToggle: () => void;
  hasUnread: boolean;
}

export function ChatBubble({ isOpen, onToggle, hasUnread }: ChatBubbleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ background: 'var(--accent)', color: '#fff' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label={isOpen ? 'Close chat' : 'Open portfolio chat assistant'}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.svg
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </motion.svg>
        ) : (
          <motion.svg
            key="chat"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Unread dot */}
      <AnimatePresence>
        {hasUnread && !isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
            style={{ background: '#22c55e', borderColor: 'var(--bg)' }}
          />
        )}
      </AnimatePresence>

      {/* Pulse ring — loops while chat is closed */}
      {!isOpen && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
          style={{ background: 'var(--accent)' }}
        />
      )}
    </motion.button>
  );
}
