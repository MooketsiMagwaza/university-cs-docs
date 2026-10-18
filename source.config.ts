import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

export const docs = defineDocs({
  dir: 'content/docs',
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
    rehypeCodeOptions: { addLanguageClass: true, themes: { light: 'github-light', dark: 'github-dark' } },
    // CRITICAL: Place it at first, it must be executed BEFORE the syntax highlighter
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});