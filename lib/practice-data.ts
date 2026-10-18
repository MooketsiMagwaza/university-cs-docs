/**
 * Practice questions with worked solutions live in JSON files under content/practice-data, mirroring the path of the page
 * that shows them:
 *
 *   content/practice-data/sem3/csi213/04-random-var-distributions/questions.json
 *
 * A page shows one group of them with <PracticeRef src="<path without .json>" group="<group id>" />. The maths is written
 * with $...$ and rendered in the browser, so a page with hundreds of formulas does not compile to megabytes of markup.
 */

export type PracticeStep = {
  title: string;
  /** Text with $maths$ and **bold**. */
  body: string;
};

export type PracticeQuestionData = {
  title: string;
  /** The question, as text with $maths$ and **bold**; paragraphs are separated by a blank line. */
  prompt: string;
  steps: PracticeStep[];
  /** The final answer, shown under the steps. */
  answer?: string;
};

export type PracticeGroupData = {
  title: string;
  questions: PracticeQuestionData[];
};

export type PracticeFile = {
  groups: Record<string, PracticeGroupData>;
};

const SAFE_PATH = /^[A-Za-z0-9][A-Za-z0-9/_.-]*$/;

export async function loadPracticeGroup(src: string, group: string): Promise<PracticeGroupData> {
  if (!SAFE_PATH.test(src) || src.includes('..')) {
    throw new Error(`PracticeRef: invalid src "${src}".`);
  }

  let file: PracticeFile;
  try {
    const module_ = await import(`@/content/practice-data/${src}.json`);
    file = (module_.default ?? module_) as PracticeFile;
  } catch {
    throw new Error(`PracticeRef: no practice data file at content/practice-data/${src}.json.`);
  }

  const found = file.groups?.[group];
  if (!found) {
    const known = Object.keys(file.groups ?? {}).join(', ') || 'none';
    throw new Error(`PracticeRef: group "${group}" is not in content/practice-data/${src}.json (known groups: ${known}).`);
  }
  return found;
}
