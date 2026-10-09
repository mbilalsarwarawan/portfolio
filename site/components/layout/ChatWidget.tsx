'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const ChatBubble = dynamic(() => import('../ChatBubble').then((m) => m.ChatBubble), { ssr: false });
const ChatPanel = dynamic(() => import('../ChatPanel').then((m) => m.ChatPanel), { ssr: false });

/** Portfolio AI assistant. The panel mounts on first open and then stays mounted so chat state survives toggling. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unread, setUnread] = useState(true);

  return (
    <>
      <ChatBubble
        isOpen={open}
        hasUnread={unread}
        onToggle={() => {
          setMounted(true);
          setOpen((o) => !o);
          setUnread(false);
        }}
      />
      {mounted && <ChatPanel isOpen={open} />}
    </>
  );
}
