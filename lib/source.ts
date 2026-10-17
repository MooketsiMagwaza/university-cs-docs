import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { classifyFolder, lessonLabel, topicFolderLabel, topicLabel, topicPageLabel } from './topic-pages';
import { getFullChapterMarkdown } from '@/features/courses/csi247/study-guides/markdown.mjs';

/**
 * A copy of a page tree node with a new name. Only string keys are copied: spreading a node also copied the symbol keys
 * React adds to objects made during a render (Symbol(name), Symbol(owner)), and Next refuses to pass those to a client
 * component ("Only plain objects can be passed to Client Components").
 */
function renamed<T extends { name: unknown }>(node: T, name: string): T {
  return { ...Object.fromEntries(Object.entries(node)), name } as T;
}

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
          return label ? renamed(node, label) : node;
        },
        folder(node, folderPath) {
          const folder = classifyFolder(folderPath);
          if (!folder) return node;
          if (folder.kind === 'topic') {
            // "6. Lists and Tuples": the number comes from the folder name, never from the title.
            return folder.number !== undefined && typeof node.name === 'string'
              ? renamed(node, topicLabel(folder.number, node.name))
              : node;
          }
          // The notes folder is "Notes", and its lessons are "6.1", "6.2" ... in the order of notes/meta.json.
          let position = 0;
          const children = node.children.map((child) => {
            if (child.type !== 'page' || folder.number === undefined || typeof child.name !== 'string') return child;
            position += 1;
            return renamed(child, lessonLabel(folder.number, position, child.name));
          });
          return { ...Object.fromEntries(Object.entries(node)), name: topicFolderLabel(folderPath) ?? node.name, children } as typeof node;
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
