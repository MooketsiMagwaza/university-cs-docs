import type { ReactNode } from 'react';
import { loadFigure } from '@/lib/figure-data';

/**
 * A figure drawn as SVG, loaded from content/figure-data (see lib/figure-data.ts), with its caption as the children.
 * The SVG uses the small vocabulary in app/styles/java-lessons.css (`f-b`, `ln`, `h`, `s`, `m` ...), so it follows the
 * theme in light and dark.
 */
export async function SvgFigure({ src, id, children }: { src: string; id: string; children?: ReactNode }) {
  const { svg } = await loadFigure(src, id);
  return (
    <figure className="jf-figure">
      <div className="jf-figure-art" dangerouslySetInnerHTML={{ __html: svg }} />
      {children ? <figcaption>{children}</figcaption> : null}
    </figure>
  );
}
