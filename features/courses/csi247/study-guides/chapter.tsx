import { createGuides } from './guides.mjs';
import { renderSection } from './document.mjs';
import { ChapterClient } from './chapter-client';
import './native-chapter.css';

type Section = { id: string; title: string; body: string; raw?: boolean; optional?: boolean };
type Guide = { id: string; slug: string; title: string; sourceRoutes: string[]; sections: Section[] };
const guides = createGuides() as Guide[];

export function getFullChapters(pageUrl: string) {
  return guides.filter(guide => guide.sourceRoutes.includes(pageUrl));
}

export function getChapterToc(chapters: Guide[]) {
  if (chapters.length > 1) return [];
  return chapters.flatMap(guide => guide.sections.filter(section => !section.optional).map(section => ({
    title: chapters.length > 1 ? `${guide.title}: ${section.title}` : section.title,
    url: `#${guide.slug}-${section.id}`,
    depth: 2,
  })));
}

export function FullStudyChapters({ chapters }: { chapters: Guide[] }) {
  if (chapters.length > 1) return <div className="grid gap-5 md:grid-cols-2">
    {chapters.map(guide => <a key={guide.id} href={guide.sourceRoutes[0]} className="block border border-fd-border bg-fd-card p-6 text-fd-foreground hover:bg-fd-muted">
      <h2 className="mb-3 text-xl font-semibold">{guide.title}</h2>
      <p className="text-sm leading-6 text-fd-muted-foreground">{guide.slug === 'bubble-sort' ? 'Compare neighbours and follow each swap through a complete pass.' : 'Find each remaining minimum, then follow the swap or no-swap decision.'} Open the full visual chapter, commented Java, worked examples and quiz.</p>
      <span className="mt-4 block text-sm font-semibold">Study {guide.title.toLowerCase()} →</span>
    </a>)}
  </div>;
  return chapters.map(guide => {
    const markup = guide.sections.map(renderSection).join('')
      .replace(/\bid="([^"]+)"/g, (_, id: string) => `id="${guide.slug}-${id}"`)
      .replace(/href="#([^"]+)"/g, (_, id: string) => `href="#${guide.slug}-${id}"`)
      .replace(/href="\.\.\/(sorting-and-searching|packages)\/([^"#]+)\.html#([^"]+)"/g,
        (_, chapter: string, slug: string, anchor: string) => {
          const destination = guides.find(item => item.id === `${chapter}/${slug}`);
          return `href="${destination?.sourceRoutes[0]}#${slug}-${anchor}"`;
        });
    return <ChapterClient key={guide.id}>
      {chapters.length > 1 && <h2 className="mt-8">{guide.title}</h2>}
      <div className="chapter-content" dangerouslySetInnerHTML={{ __html: markup }} />
    </ChapterClient>;
  });
}
