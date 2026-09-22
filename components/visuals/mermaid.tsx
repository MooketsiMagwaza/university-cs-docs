'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Loader2, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'rendering' | 'ready' | 'error';

export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const rawId = useId();
  const elementId = `mermaid-${rawId.replace(/[:]/g, '')}`;
  const { resolvedTheme } = useTheme();
  const [status, setStatus] = useState<Status>('idle');
  const [svg, setSvg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const renderIdRef = useRef(0);

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
    <figure className="my-6 w-full overflow-hidden rounded-xl border border-fd-border bg-fd-background shadow-sm not-prose">
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
  );
}
