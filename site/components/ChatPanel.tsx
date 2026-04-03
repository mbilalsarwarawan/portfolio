'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatMessage, TypingIndicator, useAutoScroll } from './ChatMessage';

const MAX_MESSAGES = 15;
const STORAGE_KEY = 'portfolio_chat_count';
const MESSAGES_KEY = 'portfolio_chat_messages';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function loadMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Backwards-compat: if stored value is an array (older format), return it
    if (Array.isArray(parsed)) return parsed as UIMessage[];
    const { messages, savedAt } = parsed as { messages?: UIMessage[]; savedAt?: number };
    if (!messages) return [];
    if (!savedAt || Date.now() - savedAt > ONE_DAY_MS) {
      localStorage.removeItem(MESSAGES_KEY);
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return messages;
  } catch {
    return [];
  }
}

function saveMessages(msgs: UIMessage[]) {
  try {
    const payload = { messages: msgs, savedAt: Date.now() };
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(payload));
  } catch {
    // quota exceeded — ignore
  }
}

const SUGGESTED = [
  "What projects has Bilal built?",
  "Show me his Python projects",
  "What's his tech stack?",
  "How can I contact him?",
  "Tell me about his experience",
];

export function ChatPanel({ isOpen }: { isOpen: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [msgCount, setMsgCount] = useState(0);
  const [initialMessages] = useState<UIMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    return loadMessages();
  });

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    setMsgCount(stored);
  }, []);

  const { messages, status, sendMessage } = useChat({ messages: initialMessages });

  // Persist messages whenever they change and remove when empty
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    } else {
      localStorage.removeItem(MESSAGES_KEY);
      localStorage.setItem(STORAGE_KEY, '0');
    }
  }, [messages]);

  const isLoading = status === 'submitted' || status === 'streaming';
  const isLimitReached = msgCount >= MAX_MESSAGES;

  const scrollRef = useAutoScroll([messages, isLoading]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading || isLimitReached) return;
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    localStorage.setItem(STORAGE_KEY, String(newCount));
    sendMessage({ text: input });
    setInput('');
  }

  function sendSuggestion(text: string) {
    if (isLoading || isLimitReached) return;
    const newCount = msgCount + 1;
    setMsgCount(newCount);
    localStorage.setItem(STORAGE_KEY, String(newCount));
    sendMessage({ text });
  }

  const isEmpty = messages.length === 0;

  return (
    <AnimatePresence>
    {isOpen && (
    <motion.div
      key="chat-panel"
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="fixed bottom-24 right-4 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
      style={{
        width: 'min(420px, calc(100vw - 32px))',
        height: 'min(560px, calc(100vh - 120px))',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          B
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--fg)' }}>Portfolio Assistant</p>
          <p className="text-xs opacity-50" style={{ color: 'var(--fg)' }}>Ask me anything about Bilal</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          <span className="text-xs opacity-50" style={{ color: 'var(--fg)' }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'color-mix(in srgb, var(--fg) 15%, transparent) transparent' }}
      >
        {isEmpty ? (
          <EmptyState onSuggest={sendSuggestion} />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <AnimatePresence>
              {isLoading && <TypingIndicator />}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Limit banner or Input */}
      {isLimitReached ? (
        <div
          className="px-4 py-3 flex-shrink-0 text-center"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs opacity-60" style={{ color: 'var(--fg)' }}>
            You&apos;ve reached the {MAX_MESSAGES}-message limit.
          </p>
          <a
            href="/contact"
            className="text-xs font-medium mt-1 inline-block"
            style={{ color: 'var(--accent)' }}
          >
            Contact Bilal directly →
          </a>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask me anything… (${MAX_MESSAGES - msgCount} left)`}
            className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all"
            style={{
              background: 'color-mix(in srgb, var(--fg) 6%, transparent)',
              color: 'var(--fg)',
              border: '1.5px solid var(--border)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            style={{
              background: input.trim() && !isLoading ? 'var(--accent)' : 'color-mix(in srgb, var(--fg) 10%, transparent)',
              color: input.trim() && !isLoading ? '#fff' : 'color-mix(in srgb, var(--fg) 40%, transparent)',
            }}
            aria-label="Send message"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      )}
    </motion.div>
    )}
    </AnimatePresence>
  );
}

function EmptyState({ onSuggest }: { onSuggest: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center text-center h-full justify-center gap-5 pb-4">
      <div>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3"
          style={{ background: 'var(--accent)' }}
        >
          B
        </div>
        <p className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>Hi, I&apos;m Bilal&apos;s assistant</p>
        <p className="text-xs opacity-55 mt-1" style={{ color: 'var(--fg)' }}>Ask me about projects, skills, or how to get in touch</p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80 text-left"
            style={{
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              color: 'var(--accent)',
              border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
