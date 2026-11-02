'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * A trace table the reader fills in on paper first: the header shows, the rows are hidden, and the buttons reveal them one
 * at a time (or all at once, or hide them again). Wrap an ordinary Markdown table; the rows are hidden by toggling the
 * `hidden` attribute on the rendered `tbody tr` elements, so the table itself stays plain server-rendered markup.
 */
export function TraceTable({ children }: { children?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [total, setTotal] = useState(0);
  const [shown, setShown] = useState(0);

  // Hide every row before the first paint after hydration (the stylesheet hides them until then), then count them.
  useEffect(() => {
    const rows = root.current?.querySelectorAll<HTMLElement>('tbody tr') ?? [];
    rows.forEach((row) => {
      row.hidden = true;
    });
    setTotal(rows.length);
  }, []);

  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>('tbody tr').forEach((row, index) => {
      row.hidden = index >= shown;
    });
  }, [shown, total]);

  return (
    <div className="jf-trace" ref={root} data-ready={total > 0 ? '' : undefined}>
      {children}
      <div className="jf-trace-bar" role="group" aria-label="Reveal the table">
        <span>
          Work out each row yourself, then check it. {shown} of {total} rows shown.
        </span>
        <button type="button" className="jf-btn jf-btn-primary" disabled={shown >= total} onClick={() => setShown((n) => Math.min(total, n + 1))}>
          Reveal next row
        </button>
        <button type="button" className="jf-btn" disabled={shown >= total} onClick={() => setShown(total)}>
          Reveal all
        </button>
        <button type="button" className="jf-btn" disabled={shown === 0} onClick={() => setShown(0)}>
          Hide again
        </button>
      </div>
    </div>
  );
}
