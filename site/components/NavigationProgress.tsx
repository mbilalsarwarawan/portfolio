'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const SHOW_DELAY_MS = 90;
const COMPLETE_HOLD_MS = 220;

export function NavigationProgress() {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [completing, setCompleting] = useState(false);

  const clearTimers = useCallback(() => {
    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (visible || showTimerRef.current) return;

    setCompleting(false);
    showTimerRef.current = window.setTimeout(() => {
      setVisible(true);
      showTimerRef.current = null;
    }, SHOW_DELAY_MS);
  }, [visible]);

  const finish = useCallback(() => {
    if (!visible) {
      clearTimers();
      return;
    }

    if (hideTimerRef.current) return;

    setCompleting(true);
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setCompleting(false);
      hideTimerRef.current = null;
    }, COMPLETE_HOLD_MS);
  }, [clearTimers, visible]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest('a[href]');

      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const isSameDocument =
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash === window.location.hash;

      if (isSameDocument) return;

      start();
    };

    const handleHistoryNavigation = () => {
      start();
    };

    window.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('popstate', handleHistoryNavigation);

    return () => {
      window.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('popstate', handleHistoryNavigation);
      clearTimers();
    };
  }, [clearTimers, start]);

  useEffect(() => {
    if (pathname === previousPathnameRef.current) return;

    previousPathnameRef.current = pathname;

    const frame = window.requestAnimationFrame(() => {
      finish();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [finish, pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="navigation-progress"
          className="fixed inset-x-0 top-0 z-[120] h-[2px] overflow-hidden pointer-events-none"
          style={{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-hidden="true"
        >
          <motion.div
            className="h-full origin-left"
            style={{ background: 'var(--accent)' }}
            initial={{ scaleX: 0.08 }}
            animate={
              completing
                ? { scaleX: 1, opacity: 1 }
                : {
                    scaleX: [0.08, 0.34, 0.62, 0.82],
                    opacity: [0.88, 1, 1, 0.96],
                  }
            }
            transition={
              completing
                ? { duration: 0.24, ease: [0.16, 1, 0.3, 1] }
                : {
                    duration: 1.1,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'mirror',
                  }
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
