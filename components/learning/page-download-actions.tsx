'use client';

import { Download, FileText } from 'lucide-react';

function safeFilename(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function PageDownloadActions({ title }: { title: string }) {
  const downloadHtml = () => {
    const snapshot = document.documentElement.cloneNode(true) as HTMLElement;
    snapshot.querySelectorAll('script, link[rel="stylesheet"], link[rel="preload"], [data-page-download-actions]').forEach((node) => node.remove());

    const css = Array.from(document.styleSheets).flatMap((sheet) => {
      try {
        return Array.from(sheet.cssRules, (rule) => rule.cssText);
      } catch {
        return [];
      }
    }).join('\n');
    const style = document.createElement('style');
    style.textContent = css;
    snapshot.querySelector('head')?.append(style);

    const notice = document.createElement('aside');
    notice.textContent = 'Static HTML lesson snapshot. Interactive traces show the state selected when this file was downloaded.';
    notice.setAttribute('style', 'padding:12px 20px;border-bottom:1px solid #999;font:14px/1.5 system-ui,sans-serif;text-align:center');
    snapshot.querySelector('body')?.prepend(notice);

    snapshot.querySelectorAll<HTMLElement>('[href], [src]').forEach((element) => {
      for (const attribute of ['href', 'src']) {
        const value = element.getAttribute(attribute);
        if (value) element.setAttribute(attribute, new URL(value, window.location.href).href);
      }
    });

    const html = `<!doctype html>\n${snapshot.outerHTML}`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFilename(title)}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-page-download-actions className="ml-auto flex flex-wrap items-center gap-2">
      <button type="button" onClick={downloadHtml} title="Download a styled static snapshot of the currently selected trace state" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-sm text-fd-foreground hover:bg-fd-muted">
        <Download className="h-4 w-4" aria-hidden="true" /> HTML
      </button>
      <button type="button" onClick={() => window.print()} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-sm text-fd-foreground hover:bg-fd-muted">
        <FileText className="h-4 w-4" aria-hidden="true" /> PDF
      </button>
    </div>
  );
}
