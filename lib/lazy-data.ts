import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Quiz questions and practice questions are not compiled into the page. Each data file under content/quiz-data or
 * content/practice-data is also served as a static JSON file at
 *
 *   /data/quiz/sem3/csi243/01-functional-thinking/review.json?v=<version>
 *   /data/practice/sem3/csi213/04-random-var-distributions/questions.json?v=<version>
 *
 * (app/data/[kind]/[...path]/route.ts), and the page only carries that address. The reader's browser fetches the file
 * when the quiz comes near the screen, and the page asks the browser to start the download early with a preload hint.
 * `version` is a hash of the file's content, so the address changes when the data changes: the response can be cached
 * for a year and a reader never sees an old question after a deploy.
 */

export type LazyDataKind = 'quiz' | 'practice';

export const LAZY_DATA_BASE = '/data';

const ROOTS: Record<LazyDataKind, string> = {
  quiz: 'content/quiz-data',
  practice: 'content/practice-data',
};

export const isLazyDataKind = (value: string): value is LazyDataKind => value === 'quiz' || value === 'practice';

/** Every JSON data file of a kind, as the path under its folder without `.json` (for example `sem3/csi243/01-x/review`). */
export function listLazyDataFiles(kind: LazyDataKind): string[] {
  // `turbopackIgnore`: the folder depends on `kind`, which makes the bundler trace the whole project (public/ included, 436 MB)
  // into every function that imports this file, and the data route then exceeds Vercel's 250 MB limit. This runs only at build
  // time (generateStaticParams), so nothing has to be traced.
  const root = path.join(/*turbopackIgnore: true*/ process.cwd(), ROOTS[kind]);
  const found: string[] = [];
  const walk = (directory: string) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.json') && !entry.name.endsWith('.schema.json')) {
        found.push(path.relative(root, full).replace(/\\/g, '/').replace(/\.json$/, ''));
      }
    }
  };
  if (fs.existsSync(root)) walk(root);
  return found.sort();
}

const versions = new Map<string, string>();

/** A short hash of the data, used as the `?v=` part of the address. */
export function dataVersion(key: string, data: unknown): string {
  let version = versions.get(key);
  if (!version) {
    version = createHash('sha1').update(JSON.stringify(data)).digest('hex').slice(0, 10);
    versions.set(key, version);
  }
  return version;
}

export function lazyDataUrl(kind: LazyDataKind, src: string, version: string): string {
  return `${LAZY_DATA_BASE}/${kind}/${src}.json?v=${version}`;
}

export const SAFE_DATA_PATH = /^[A-Za-z0-9][A-Za-z0-9/_.-]*$/;
