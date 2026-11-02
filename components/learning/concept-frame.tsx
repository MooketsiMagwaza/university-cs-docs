import type { ReactNode } from 'react';

/**
 * The four-box opening of a lesson: the idea, the definition, why it works and what it is for. Each box is a `FrameBox`
 * whose label says which question it answers; the children are ordinary Markdown.
 */
export function ConceptFrame({ children }: { children?: ReactNode }) {
  return <div className="jf-frame">{children}</div>;
}

export function FrameBox({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="jf-frame-box">
      <span className="jf-frame-label">{label}</span>
      <div className="jf-frame-body">{children}</div>
    </div>
  );
}
