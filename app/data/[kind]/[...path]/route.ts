import { SAFE_DATA_PATH, isLazyDataKind, listLazyDataFiles } from '@/lib/lazy-data';

/**
 * The quiz and practice data files as static JSON (see lib/lazy-data.ts): /data/quiz/<path>.json serves
 * content/quiz-data/<path>.json and /data/practice/<path>.json serves content/practice-data/<path>.json. Every file
 * is generated at build time. The address a page uses carries a `?v=` hash of the content, so the response can be
 * cached for a year.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return (['quiz', 'practice'] as const).flatMap((kind) =>
    listLazyDataFiles(kind).map((file) => ({ kind, path: `${file}.json`.split('/') })),
  );
}

const notFound = () => new Response('Not found', { status: 404 });

export async function GET(_request: Request, { params }: RouteContext<'/data/[kind]/[...path]'>) {
  const { kind, path } = await params;
  const file = path.join('/');
  if (!isLazyDataKind(kind) || !file.endsWith('.json')) return notFound();
  const src = file.slice(0, -'.json'.length);
  if (!SAFE_DATA_PATH.test(src) || src.includes('..')) return notFound();

  let data: unknown;
  try {
    const module_ = kind === 'quiz'
      ? await import(`@/content/quiz-data/${src}.json`)
      : await import(`@/content/practice-data/${src}.json`);
    data = module_.default ?? module_;
  } catch {
    return notFound();
  }

  return Response.json(data, { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
