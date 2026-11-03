import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={appName} />,
    {
      width: 1200,
      height: 630,
    },
  );
}

// No image is made at build time. Drawing about 700 PNGs (satori and a WebAssembly rasteriser each) is a large share of
// the build, and only a link preview ever asks for one. The first request for an address draws it and, because
// `revalidate` is false, every later request is answered from the cache until the next deploy (PERF-02).
export function generateStaticParams() {
  return [];
}
