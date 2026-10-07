import { escape } from './visuals.mjs';

export const VERSION = '2026-10-07.5';

export function renderSection(item) {
  if (item.optional) return `<section id="${escape(item.id)}" class="studio-section optional-section"><details class="lesson-detail"><summary><h2>${escape(item.title)}</h2><span class="detail-hint">Optional · expand to explore</span></summary><div class="detail-body">${codeWindows(item.body)}</div></details></section>`;
  if (item.raw) return `<section id="${escape(item.id)}" data-reference-section>${codeWindows(item.body)}</section>`;
  return `<section id="${escape(item.id)}" class="studio-section"><h2>${escape(item.title)}</h2>${codeWindows(item.body)}</section>`;
}

function toolbar(label) {
  return `<div class="code-head"><span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="code-language">${label}</span><button type="button" class="copy-btn" aria-label="Copy code">Copy code</button></div>`;
}
export function codeWindows(html) {
  const panels = [];
  const styled = html.replace(/<div class="code-head">[\s\S]*?<\/div>/g, head => toolbar(head.match(/<span[^>]*>([\s\S]*?)<\/span>/)?.[1] || 'Java'))
    .replace(/<figure class="code"><figcaption>([\s\S]*?)<\/figcaption>/g, (_, label) => `<figure class="code code-panel">${toolbar(label)}`);
  return styled
    .replace(/<(div|figure) class="[^"]*\bcode-panel\b[^"]*">[\s\S]*?<\/pre>\s*<\/\1>/g, panel => {
      panels.push(panel); return `CODEWINDOW${panels.length - 1}END`;
    })
    .replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/g, (_, source) => `<figure class="code-panel">${toolbar(/public|static|void|import|class/.test(source) ? 'Java' : 'Example')}<pre>${source}</pre></figure>`)
    .replace(/CODEWINDOW(\d+)END/g, (_, index) => panels[Number(index)]);
}

export function document(guide, css, runtime) {
  const toc = guide.sections.map((item) => `<a href="#${escape(item.id)}">${escape(item.title.replace(/^\d+\.\s*/, ''))}</a>`).join('');
  const chapter = guide.chapter === 'packages' ? 'Java packages' : 'Searching and sorting';
  return `<!doctype html>
<html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(guide.summary)}"><meta name="color-scheme" content="light dark"><meta name="csi247-artifact-id" content="${escape(guide.id)}"><meta name="csi247-artifact-version" content="${VERSION}"><meta name="csi247-reference-sha256" content="${escape(guide.referenceSha256)}"><title>CSI247 - ${escape(guide.title)} | Complete Visual Chapter</title><style>${css}</style><script>try{const t=localStorage.getItem('csi247-guide-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}</script></head>
<body><div class="progress" aria-hidden="true"></div>
<div class="site-bar" id="site-bar"><div class="site-title"><a class="site-brand" href="#top">CSI247</a><span class="site-chapter">${escape(guide.title)}</span></div><div class="site-actions"><a class="artifact-link" href="./${escape(guide.slug)}.html" download>Download HTML</a><a class="artifact-link" href="./${escape(guide.slug)}.pdf" download>Download PDF</a><button class="theme-toggle" type="button" data-theme-toggle>Dark mode</button></div></div>
<header class="masthead chapter-masthead" id="top"><div class="mast-grid"><div><div class="eyebrow">CSI247 · ${escape(chapter)} · complete visual chapter</div><h1>${escape(guide.title)}</h1><p class="standfirst">${escape(guide.summary)}</p></div><aside class="mast-note"><strong>How to use this chapter:</strong><br>Learn the idea in plain language, read each diagram, predict every trace row, then study the commented Java and attempt the exam-style questions.</aside></div></header>
<div class="shell"><nav class="toc open" aria-label="Contents"><button class="toc-title" type="button" aria-expanded="true" aria-controls="toc-list"><span>On this page</span><span class="toc-mark" aria-hidden="true">−</span></button><div id="toc-list" class="toc-tree"><details open><summary><span class="folder-icon">01</span> ${escape(guide.title)}</summary>${toc}</details></div></nav><main>${guide.sections.map(renderSection).join('')}<footer><span>CSI247 · ${escape(guide.title)} · ${VERSION}</span><a class="back-top" href="#top">Return to the beginning ↑</a></footer></main></div>
<script>${runtime.replace('export function initializeChapter', 'function initializeChapter').replace(/<\/script/gi, '<\\/script')}\ninitializeChapter(document);</script></body></html>`.replace(/[ \t]+$/gm, '');
}
