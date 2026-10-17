'use client';

import { Check, Copy } from 'lucide-react';
import { isValidElement, useRef, useState, type CSSProperties, type ComponentProps, type ReactNode } from 'react';

/** What the title bar says for a fence language. */
const LANGUAGE_NAMES: Record<string, string> = {
  haskell: 'Haskell',
  java: 'Java',
  python: 'Python',
  py: 'Python',
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  yaml: 'YAML',
  xml: 'XML',
  c: 'C',
  cpp: 'C++',
  bash: 'Terminal',
  sh: 'Terminal',
  shell: 'Terminal',
  powershell: 'PowerShell',
  md: 'Markdown',
  mdx: 'MDX',
};

/** Fences that hold program output, a transcript or plain text rather than code. */
const PLAIN_LANGUAGES = new Set(['text', 'plaintext', 'output', 'console', 'stdout']);

/** A line that starts an interactive session (GHCi, a shell, Python). */
const SESSION_START = /^(ghci>|\$ |PS [^>\n]*>|>>> )/;

/** Code shows line numbers from this many lines, so short snippets stay uncluttered. */
const NUMBERED_FROM = 6;

type Kind = 'code' | 'output' | 'session';

function nodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
  return '';
}

/** The language named by the `language-xxx` class that rehype-code puts on the code element. */
function languageOf(children: ReactNode): string | undefined {
  const first = Array.isArray(children) ? children[0] : children;
  if (!isValidElement<{ className?: string }>(first)) return undefined;
  return /(?:^|\s)language-([\w+-]+)/.exec(String(first.props.className ?? ''))?.[1];
}

type CodeWindowProps = {
  /** Fence language, such as `haskell`. */
  language?: string;
  /** A file name from the fence's title="…". */
  title?: string;
  /** The text of the block, used to pick the kind and the line count. */
  text: string;
  /** Show line numbers whatever the length. */
  numbered?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Every code block in the notes: a window with a title bar (three window buttons, the language or file name, and a copy
 * button), the code with line numbers when it is long enough, and, for a `text` fence that follows code, an Output
 * panel that joins the window above it. Colours come from the --ui-* tokens in code-window.css.
 */
export function CodeWindow({ language, title, text, numbered, className, style, children }: CodeWindowProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const plain = language === undefined || PLAIN_LANGUAGES.has(language);
  const firstLine = text.split('\n').find((line) => line.trim() !== '') ?? '';
  const session = plain && SESSION_START.test(firstLine);
  const kind: Kind = session ? 'session' : plain ? 'output' : 'code';
  const lineCount = text.replace(/\n$/, '').split('\n').length;
  const showNumbers = kind === 'code' && (numbered || lineCount >= NUMBERED_FROM);

  const languageName = language ? LANGUAGE_NAMES[language] ?? language : 'Code';
  const sessionName = firstLine.startsWith('ghci>') ? 'GHCi' : firstLine.startsWith('>>>') ? 'Python' : 'Terminal';

  const copy = async () => {
    const code = bodyRef.current?.querySelector('pre')?.textContent ?? text;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // The clipboard API needs a secure page; fall back to a hidden field.
      const field = document.createElement('textarea');
      field.value = code;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      document.body.removeChild(field);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const label = kind === 'code' ? title ?? languageName : kind === 'session' ? title ?? sessionName : title ?? 'Output';

  return (
    <figure className={`cw not-prose${className ? ` ${className}` : ''}`} data-kind={kind} data-lang={language} dir="ltr" style={style}>
      <figcaption className="cw-bar">
        {kind === 'code' && (
          <span className="cw-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
        <span className="cw-name">
          {kind === 'output' && !title ? (
            // A text fence straight after code is that code's output; on its own it is just text (see code-window.css).
            <>
              <span className="cw-as-output">Output</span>
              <span className="cw-as-text">Text</span>
            </>
          ) : (
            label
          )}
        </span>
        <button type="button" className="cw-copy" data-copied={copied || undefined} onClick={copy} aria-label={copied ? 'Copied' : `Copy ${kind === 'code' ? 'code' : 'text'}`}>
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span aria-hidden="true">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </figcaption>
      <div ref={bodyRef} className="cw-body" role="region" tabIndex={0} aria-label={`${label}, ${lineCount} ${lineCount === 1 ? 'line' : 'lines'}`}>
        <pre className="cw-pre" data-numbered={showNumbers || undefined}>
          {children}
        </pre>
      </div>
    </figure>
  );
}

/** The MDX `pre`: reads the language, title and text from what rehype-code produced and renders a CodeWindow. */
export function MdxPre({ children, title, style, ...rest }: ComponentProps<'pre'> & { title?: string; 'data-line-numbers'?: boolean }) {
  return (
    <CodeWindow
      language={languageOf(children)}
      title={title}
      text={nodeText(children)}
      numbered={Boolean(rest['data-line-numbers'])}
      style={style}
    >
      {children}
    </CodeWindow>
  );
}
