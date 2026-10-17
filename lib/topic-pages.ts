/**
 * The pages every topic folder may contain, with the one label the sidebar,
 * the topic tabs and the pager use for each. Order here is the required order
 * (docs/content-standard.md, section 2.1).
 */
export const topicStages = [
  { slug: 'index', label: 'Overview' },
  { slug: 'notes', label: 'Notes' },
  { slug: 'cheat-sheet', label: 'Cheat sheet' },
  { slug: 'review', label: 'Review' },
  { slug: 'questions', label: 'Practice' },
  { slug: 'resources', label: 'Resources' },
] as const;

/** Old slugs that still exist until their course is migrated; they share a label with the standard page. */
const legacyStageLabels: Record<string, string> = {
  quiz: 'Quiz',
};

const stageLabels: Record<string, string> = {
  ...legacyStageLabels,
  ...Object.fromEntries(topicStages.map((stage) => [stage.slug, stage.label])),
};

export function stageLabel(slug: string): string | undefined {
  return stageLabels[slug];
}

/** The two pages every course folder has besides its topics. */
const coursePageLabels: Record<string, string> = {
  index: 'Course Overview',
  resources: 'Course Resources',
};

/**
 * A number typed at the start of a title: "1. ", "01. ", "3) ", "2: " or "1.2 ". Titles carry no number of their own;
 * the sidebar, the breadcrumb, the topic tabs and the pager add it (topicLabel and lessonLabel), so one rule numbers
 * every course. A bare "2 Sum" is a title, not a number, so a dot, bracket or colon is required.
 */
const TYPED_NUMBER = /^\s*(?:\d+(?:\.\d+)+\s+|\d+[.):]\s+)/;

export function stripTypedNumber(title: string): string {
  return title.replace(TYPED_NUMBER, '');
}

export function hasTypedNumber(title: string): boolean {
  return TYPED_NUMBER.test(title);
}

/** The number of a topic folder named `06-lists-tuples`, or undefined for a folder that is not numbered. */
export function topicNumber(folderName: string): number | undefined {
  const found = /^(\d+)-/.exec(folderName);
  return found ? Number(found[1]) : undefined;
}

/**
 * The sidebar label of a topic: its number from the folder name, a full stop, then its title: "6. Lists and Tuples".
 * The number has no leading zero ("1.", not "01.").
 */
export function topicLabel(number: number, title: string): string {
  return `${number}. ${stripTypedNumber(title)}`;
}

/** The label of lesson `position` (counting from 1) in the notes of topic `number`: "6.4 List Comprehensions". */
export function lessonLabel(number: number, position: number, title: string): string {
  return `${number}.${position} ${stripTypedNumber(title)}`;
}

/**
 * What a folder of the content tree is, from its path (`sem3/csi243/06-lists-tuples/notes`): a topic folder, a topic's
 * notes folder, or neither. The topic number comes with both, because the lessons are numbered inside their topic.
 */
export function classifyFolder(folderPath: string | undefined): { kind: 'topic'; number?: number } | { kind: 'notes'; number?: number } | undefined {
  if (!folderPath) return undefined;
  const path = folderPath.replace(/\\/g, '/');
  const notes = /^sem\d+\/[^/]+\/([^/]+)\/notes$/.exec(path);
  if (notes) return { kind: 'notes', number: topicNumber(notes[1]) };
  const topic = /^sem\d+\/[^/]+\/([^/]+)$/.exec(path);
  return topic ? { kind: 'topic', number: topicNumber(topic[1]) } : undefined;
}

/**
 * The label for a folder inside a topic that is a standard page. A topic's lessons live in `notes/`, and that folder
 * is called "Notes" in the sidebar whatever its own meta.json title says, so a topic with one notes page and a topic
 * with a folder of lessons look the same. Undefined for every other folder.
 */
export function topicFolderLabel(folderPath: string | undefined): string | undefined {
  return classifyFolder(folderPath)?.kind === 'notes' ? stageLabel('notes') : undefined;
}

/**
 * The label for a content file that is a standard page: a page of a topic folder
 * (`sem1/csi131/01-logic/review.mdx`) or a course's own overview and resources page
 * (`sem3/csi243/resources.mdx`). Undefined for every other file, including lessons
 * inside `notes/`.
 */
export function topicPageLabel(filePath: string | undefined): string | undefined {
  if (!filePath) return undefined;
  const path = filePath.replace(/\\/g, '/');
  const topicPage = /^sem\d+\/[^/]+\/[^/]+\/([^/]+)\.mdx?$/.exec(path);
  if (topicPage) return stageLabel(topicPage[1]);
  const coursePage = /^sem\d+\/[^/]+\/([^/]+)\.mdx?$/.exec(path);
  return coursePage ? coursePageLabels[coursePage[1]] : undefined;
}
