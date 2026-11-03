import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

export const docs = defineDocs({
  // DOCS_DIR lets a build read a smaller folder of pages (for a quick check on a machine with little memory, or to
  // measure one kind of page): `DOCS_DIR=tmp/mini-docs npm run build`. Unset, it is the whole site.
  dir: process.env.DOCS_DIR || 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    // The code window reads the language from the language-xxx class on the code element.
    // (The themes are Fumadocs' defaults, repeated because the option's type requires them.)
    // `icon: false` leaves out the file-type picture (an 800-character SVG) that Fumadocs adds to every code block: the code
    // window (components/interactive/code-window.tsx) never draws it, but it was compiled into every page and sent to the
    // browser again as a property of every block (8,371 blocks on the site, PERF-01).
    rehypeCodeOptions: { addLanguageClass: true, icon: false, themes: { light: 'github-light', dark: 'github-dark' } },
    // CRITICAL: Place it at first, it must be executed BEFORE the syntax highlighter
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});