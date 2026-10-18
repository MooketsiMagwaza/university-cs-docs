/**
 * "Predict, then reveal" questions live in JSON files under content/predict-data, mirroring the path of the page that
 * shows them:
 *
 *   content/predict-data/sem1/mat111/01-functions/notes.json
 *
 * A page shows one of them with <PredictReveal src="<path without .json>" id="<question id>" />. The question, the options
 * and the explanation are text with $maths$ and **bold**, drawn in the browser. A wrong path, a missing id or a
 * malformed question stops the build with a message that says what to fix.
 */

export type PredictChoice = {
  type: 'choice';
  /** The question, as text with $maths$ and **bold**. */
  question: string;
  options: string[];
  correctIndex: number;
  /** Why the answer is what it is. Shown only after the reader has committed to an answer. */
  explanation: string;
  /** One line for each option saying why it is wrong, or right (optional). */
  optionFeedback?: string[];
};

export type PredictNumber = {
  type: 'number';
  question: string;
  /** The right answer. */
  answer: number;
  /** How far from the answer still counts as right. 0 means exactly (to rounding). */
  tolerance: number;
  /** A unit or a word shown after the box, for example "square units" (optional). */
  unit?: string;
  explanation: string;
};

export type PredictQuestionData = PredictChoice | PredictNumber;

export type PredictFile = {
  predictions: Record<string, PredictQuestionData>;
};

const SAFE_PATH = /^[A-Za-z0-9][A-Za-z0-9/_.-]*$/;

/** Check one question and say what is wrong with it. Returns nothing when it is fine. */
export function problemWith(question: unknown): string | null {
  if (typeof question !== 'object' || question === null) return 'it is not an object';
  const q = question as Record<string, unknown>;
  if (typeof q.question !== 'string' || q.question.trim() === '') return 'it needs a "question" text';
  if (typeof q.explanation !== 'string' || q.explanation.trim() === '') return 'it needs an "explanation" text';
  if (q.type === 'choice') {
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.some((option) => typeof option !== 'string')) return '"options" must be a list of at least two texts';
    if (!Number.isInteger(q.correctIndex) || (q.correctIndex as number) < 0 || (q.correctIndex as number) >= q.options.length) return '"correctIndex" must be the position (from 0) of the right option';
    if (q.optionFeedback !== undefined && (!Array.isArray(q.optionFeedback) || q.optionFeedback.length !== q.options.length)) return '"optionFeedback" needs one text for each option';
    return null;
  }
  if (q.type === 'number') {
    if (typeof q.answer !== 'number' || !Number.isFinite(q.answer)) return '"answer" must be a number';
    if (typeof q.tolerance !== 'number' || !Number.isFinite(q.tolerance) || q.tolerance < 0) return '"tolerance" must be a number that is not negative';
    return null;
  }
  return '"type" must be "choice" or "number"';
}

export async function loadPrediction(src: string, id: string): Promise<PredictQuestionData> {
  if (!SAFE_PATH.test(src) || src.includes('..')) {
    throw new Error(`PredictReveal: invalid src "${src}".`);
  }

  let file: PredictFile;
  try {
    const module_ = await import(`@/content/predict-data/${src}.json`);
    file = (module_.default ?? module_) as PredictFile;
  } catch {
    throw new Error(`PredictReveal: no data file at content/predict-data/${src}.json.`);
  }

  const found = file.predictions?.[id];
  if (!found) {
    const known = Object.keys(file.predictions ?? {}).join(', ') || 'none';
    throw new Error(`PredictReveal: question "${id}" is not in content/predict-data/${src}.json (known ids: ${known}).`);
  }
  const problem = problemWith(found);
  if (problem) {
    throw new Error(`PredictReveal: question "${id}" in content/predict-data/${src}.json is not valid: ${problem}.`);
  }
  return found;
}
