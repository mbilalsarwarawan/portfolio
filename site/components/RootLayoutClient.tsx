'use client';

import { useEffect, ReactNode, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { LoadingScreen } from './LoadingScreen';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { NavigationProgress } from './NavigationProgress';

const ChatBubble = dynamic(() => import('./ChatBubble').then((m) => m.ChatBubble), { ssr: false });
const ChatPanel = dynamic(() => import('./ChatPanel').then((m) => m.ChatPanel), { ssr: false });

export function RootLayoutClient({ children }: { children: ReactNode }) {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      // Skip intro on subsequent session visits
      if (sessionStorage.getItem('intro_seen')) {
        setShowLoader(false);
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Mouse-following dot logic (smooth lerp)
    let rafId: number | null = null;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    const ease = 0.16;

    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!rafId) loop();
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches && e.touches[0]) {
        target.x = e.touches[0].clientX;
        target.y = e.touches[0].clientY;
        if (!rafId) loop();
      }
    }

    function loop() {
      rafId = requestAnimationFrame(() => {
        // lerp
        current.x += (target.x - current.x) * ease;
        current.y += (target.y - current.y) * ease;

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
        }

        // stop the loop when close enough
        if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
          loop();
        } else {
          rafId = null;
        }
      });
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouchMove as EventListener);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Mark when component is mounted on the client so client-only
  // components (ChatPanel) are only rendered after hydration.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsClient(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  // Lock body scroll while intro loader is showing
  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showLoader]);

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <LoadingScreen
            onDone={() => {
              sessionStorage.setItem('intro_seen', '1');
              setShowLoader(false);
            }}
          />
        )}
      </AnimatePresence>
      {/* Global floating accent dot (hidden on small screens) */}
      <NavigationProgress />

      <div
        ref={dotRef}
        aria-hidden
        className="fixed w-3 h-3 rounded-full pointer-events-none z-50 hidden lg:block"
        style={{ background: 'var(--accent)', transform: 'translate3d(50%,50%,0)' }}
      />

      {/* Portfolio chatbot */}
      <ChatBubble
        isOpen={chatOpen}
        onToggle={() => { setChatOpen((o) => !o); setHasUnread(false); }}
        hasUnread={hasUnread}
      />
      {/* Render ChatPanel only after client mount to avoid hydration mismatches.
          Once mounted it stays mounted so `useChat` state is preserved across open/close. */}
      {isClient && <ChatPanel isOpen={chatOpen} />}

      {/* Show Navbar on non-admin routes only */}
      {isClient && !pathname?.startsWith('/admin') && <Navbar />}

      {children}

      {/* Show Footer on non-admin routes only */}
      {isClient && !pathname?.startsWith('/admin') && <Footer />}
    </>
  );
}
