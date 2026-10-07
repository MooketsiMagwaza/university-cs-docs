'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { initializeChapter } from './runtime';

export function ChapterClient({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const syncTheme = () => { node.dataset.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'; };
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const dispose = initializeChapter(node);
    return () => { dispose(); observer.disconnect(); };
  }, []);
  return <div className="csi247-chapter not-prose" ref={ref}>{children}</div>;
}
