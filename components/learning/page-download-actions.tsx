import { Download, FileText } from 'lucide-react';
import manifest from '../../public/files/sem3/csi247/study-guides/manifest.json';

type StudyGuideArtifact = {
  id: string;
  title: string;
  sourceRoutes: string[];
  html: string;
  pdf: string | null;
};

const artifacts = manifest.artifacts as StudyGuideArtifact[];

export function getCsi247StudyGuides(pageUrl: string) {
  return artifacts.filter((artifact) => artifact.sourceRoutes.includes(pageUrl));
}

export function PageDownloadActions({ pageUrl }: { pageUrl: string }) {
  const guides = getCsi247StudyGuides(pageUrl);
  if (guides.length === 0) return null;

  return (
    <div data-page-download-actions className="ml-auto flex flex-wrap items-center justify-end gap-2">
      {guides.map((guide) => {
        const showTitle = guides.length > 1;
        return (
          <div key={guide.id} className="flex items-center gap-1.5">
            {showTitle && <span className="hidden text-xs font-semibold text-fd-muted-foreground xl:inline">{guide.title}</span>}
            <a
              href={guide.html}
              download
              title={`Download the complete interactive ${guide.title} study guide for offline use`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-sm text-fd-foreground hover:bg-fd-muted"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {showTitle ? `${guide.title} HTML` : 'HTML'}
            </a>
            {guide.pdf && <a
              href={guide.pdf}
              download
              title={`Download the light-mode ${guide.title} PDF`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-sm text-fd-foreground hover:bg-fd-muted"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {showTitle ? `${guide.title} PDF` : 'PDF'}
            </a>}
          </div>
        );
      })}
    </div>
  );
}
