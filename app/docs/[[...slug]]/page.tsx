import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { Quiz } from '@/components/interactive/quiz';
import { siteConfig } from '@/lib/site';
import { flattenTree } from 'fumadocs-core/page-tree';
import { Mat221SourceShell } from '@/features/courses/mat221/compat/source-shell';
import { PageDownloadActions } from '@/components/learning/page-download-actions';
import { FullStudyChapters, getFullChapters, getChapterToc } from '@/features/courses/csi247/study-guides/chapter';
import {
  Callout as Mat221SourceCallout,
  CheckpointQuiz as Mat221SourceCheckpointQuiz,
  Concept as Mat221SourceConcept,
  LessonIntro as Mat221SourceLessonIntro,
  Theorem as Mat221SourceTheorem,
  WorkedExample as Mat221SourceWorkedExample,
  WorkedExampleSet as Mat221SourceWorkedExampleSet,
} from '@/features/courses/mat221/source/components/MDXPrimitives';

function getCourseFooterItems(pageUrl: string) {
  const segments = pageUrl.split('/').filter(Boolean);
  if (segments.length < 3 || segments[0] !== 'docs') return undefined;

  const courseUrl = `/${segments.slice(0, 3).join('/')}`;
  const pages = flattenTree(source.getPageTree().children).filter(
    (item) => item.url === courseUrl || item.url.startsWith(`${courseUrl}/`),
  );
  const currentIndex = pages.findIndex((item) => item.url === pageUrl);
  if (currentIndex === -1) return undefined;

  return {
    previous: pages[currentIndex - 1],
    next: pages[currentIndex + 1],
  };
}

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const canonicalUrl = new URL(page.url, siteConfig.url).toString();
  const imageUrl = new URL(getPageImage(page).url, siteConfig.url).toString();
  const isMat221 = page.url === '/docs/sem3/mat221' || page.url.startsWith('/docs/sem3/mat221/');
  const isCsi247 = page.url === '/docs/sem3/csi247' || page.url.startsWith('/docs/sem3/csi247/');
  const fullChapters = isCsi247 ? getFullChapters(page.url) : [];
  const hasCustomEntryHeader = page.url === '/docs' || page.url === '/docs/study-tools' || isMat221;
  const mdxComponents = getMDXComponents({
    Quiz,
    a: createRelativeLink(source, page),
    ...(isMat221 ? {
      Callout: Mat221SourceCallout,
      LessonIntro: Mat221SourceLessonIntro,
      Concept: Mat221SourceConcept,
      Theorem: Mat221SourceTheorem,
      WorkedExample: Mat221SourceWorkedExample,
      WorkedExampleSet: Mat221SourceWorkedExampleSet,
      CheckpointQuiz: Mat221SourceCheckpointQuiz,
    } : {}),
  });
  const learningResourceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: page.data.title,
    description: page.data.description,
    url: canonicalUrl,
    image: imageUrl,
    inLanguage: siteConfig.language,
    isAccessibleForFree: true,
    educationalLevel: 'University',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <DocsPage
      toc={isMat221 ? [] : fullChapters.length ? getChapterToc(fullChapters) : page.data.toc}
      full={isMat221 || page.data.full}
      footer={isMat221 ? { enabled: false } : { items: getCourseFooterItems(page.url) }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(learningResourceJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {!hasCustomEntryHeader && <>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
          />
          {isCsi247 && <PageDownloadActions pageUrl={page.url} />}
        </div>
      </>}
      {isMat221 ? <Mat221SourceShell pageUrl={page.url}><MDX components={mdxComponents} /></Mat221SourceShell> : fullChapters.length ? <FullStudyChapters chapters={fullChapters} /> : <DocsBody><MDX components={mdxComponents} /></DocsBody>}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const canonicalUrl = new URL(page.url, siteConfig.url).toString();
  const imageUrl = new URL(getPageImage(page).url, siteConfig.url).toString();
  const socialImage = {
    url: imageUrl,
    width: 1200,
    height: 630,
    alt: `${page.data.title} - ${siteConfig.name}`,
  };

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'article',
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: [socialImage],
    },
  };
}
