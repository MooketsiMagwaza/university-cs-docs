import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { topicFolderLabel, topicPageLabel } from './topic-pages';
import { getFullChapterMarkdown } from '@/features/courses/csi247/study-guides/markdown.mjs';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [
    lucideIconsPlugin(),
    {
      // Every topic names its pages the same way in the sidebar, the tabs and the pager,
      // whatever the page's own title says (docs/content-standard.md, section 2.1).
      name: 'topic-page-labels',
      transformPageTree: {
        file(node, filePath) {
          const label = topicPageLabel(filePath);
          return label ? { ...node, name: label } : node;
        },
        folder(node, folderPath) {
          const label = topicFolderLabel(folderPath);
          return label ? { ...node, name: label } : node;
        },
      },
    },
  ],
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  if (page.url.startsWith('/docs/sem3/csi247/')) {
    const chapter = getFullChapterMarkdown(page.url);
    if (chapter) return chapter;
  }
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
