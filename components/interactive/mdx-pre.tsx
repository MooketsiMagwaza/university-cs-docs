import type { ComponentProps } from 'react';
import { htmlToText } from '@/lib/code-as-string';
import { ChildrenPre, CodeWindow } from './code-window';

type MdxPreProps = ComponentProps<'pre'> & {
  title?: string;
  'data-line-numbers'?: boolean;
  /** The highlighted code as one HTML string, and the class of its `code` element (lib/code-as-string.ts). */
  'data-html'?: string;
  'data-code-class'?: string;
};

/**
 * The MDX `pre`. This is a server component on purpose: it works out the language and the text of the block here, from the
 * string the build step left on the element, and hands the client only plain strings. A client component that reads its
 * React children gets unresolved references for them and can see a different block on the server and in the browser,
 * which showed up as a hydration error and a wrong Code or Output label.
 */
export function MdxPre({ children, title, style, ...rest }: MdxPreProps) {
  const html = rest['data-html'];
  if (html === undefined) return <ChildrenPre title={title} style={style} {...rest}>{children}</ChildrenPre>;
  const codeClass = rest['data-code-class'] ?? '';
  return (
    <CodeWindow
      language={/(?:^|\s)language-([\w+-]+)/.exec(codeClass)?.[1]}
      title={title}
      text={htmlToText(html)}
      numbered={Boolean(rest['data-line-numbers'])}
      style={style}
      html={html}
      codeClass={codeClass}
    />
  );
}
