'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Loader2, AlertCircle, Maximize2, X } from 'lucide-react';

type Status = 'idle' | 'rendering' | 'ready' | 'error';

export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const rawId = useId();
  const elementId = `mermaid-${rawId.replace(/[:]/g, '')}`;
  const { resolvedTheme } = useTheme();
  const [status, setStatus] = useState<Status>('idle');
  const [svg, setSvg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const renderIdRef = useRef(0);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    let cancelled = false;
    const currentRender = ++renderIdRef.current;
    setStatus('rendering');

    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          fontFamily: 'var(--font-sans, inherit)',
          themeVariables:
            resolvedTheme === 'dark'
              ? {
                  primaryColor: '#2c2c2e',
                  primaryBorderColor: '#48484a',
                  primaryTextColor: '#f5f5f7',
                  lineColor: '#a1a1a6',
                  secondaryColor: '#1d1d1f',
                  tertiaryColor: '#1d1d1f',
                }
              : {
                  primaryColor: '#f5f5f7',
                  primaryBorderColor: '#d2d2d7',
                  primaryTextColor: '#1d1d1f',
                  lineColor: '#6e6e73',
                  secondaryColor: '#ffffff',
                  tertiaryColor: '#ffffff',
                },
        });

        const { svg: rendered } = await mermaid.render(elementId, chart.trim());
        if (cancelled || currentRender !== renderIdRef.current) return;
        setSvg(rendered);
        setStatus('ready');
      } catch (err) {
        if (cancelled || currentRender !== renderIdRef.current) return;
        setErrorMsg(err instanceof Error ? err.message : 'Failed to render diagram.');
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme, elementId]);

  return (
    <>
      <figure className="group relative my-6 w-full overflow-hidden rounded-xl border border-fd-border bg-fd-background shadow-sm not-prose">
        {status === 'ready' && (
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="View diagram fullscreen"
            className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md border border-fd-border bg-fd-background/90 p-1.5 text-fd-muted-foreground opacity-70 transition-opacity hover:opacity-100 hover:text-fd-foreground focus-visible:opacity-100"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        )}
        <div className="flex min-h-[120px] w-full items-center justify-center overflow-x-auto p-4">
          {status === 'rendering' && (
            <div className="flex flex-col items-center gap-2 py-6 text-fd-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-xs">Rendering diagram...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center gap-2 py-6 text-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-xs">{errorMsg}</p>
              <pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap text-left text-[11px] text-fd-muted-foreground">
                {chart}
              </pre>
            </div>
          )}
          {status === 'ready' && (
            <div className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
          )}
        </div>
        {caption && (
          <figcaption className="border-t border-fd-border bg-fd-muted/20 px-4 py-2 text-center text-xs text-fd-muted-foreground">
            {caption}
          </figcaption>
        )}
      </figure>

      {isFullscreen && status === 'ready' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Diagram, fullscreen"
          className="fixed inset-0 z-50 flex flex-col bg-fd-background/98 backdrop-blur-sm not-prose"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreen(false);
          }}
        >
          <div className="flex items-center justify-between border-b border-fd-border px-4 py-3">
            {caption ? (
              <p className="text-sm text-fd-muted-foreground">{caption}</p>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen diagram"
              className="flex items-center gap-1 rounded-md border border-fd-border bg-fd-background p-1.5 text-fd-muted-foreground hover:text-fd-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div
              className="mx-auto h-full min-h-[70vh] [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-h-[85vh] [&_svg]:w-auto [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}
    </>
  );
}
