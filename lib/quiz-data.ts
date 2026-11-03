/**
 * Quiz content lives in JSON files under content/quiz-data, mirroring the path of the page that uses it:
 *
 *   content/quiz-data/sem3/csi243/01-functional-thinking/notes/functional-thinking.json
 *
 * A page references a quiz from MDX with <QuizRef src="<path without .json>" id="<quiz id>" />.
 * Keeping the questions out of the MDX keeps notes readable and lets the data be validated and reused on its own.
 */

import { SAFE_DATA_PATH, dataVersion, lazyDataUrl } from './lazy-data';

export type QuizLevel = 'foundation' | 'developing' | 'exam';

export type QuizQuestionData = {
  /** A stable id. If missing, one is derived from the question text; set it so editing the wording keeps a reader's saved answer. */
  id?: string;
  question: string;
  /** A program or snippet shown beneath the question. An array is one entry per line. */
  code?: string | string[];
  options: string[];
  correctIndex: number;
  explanation?: string;
  optionFeedback?: string[];
  /** The topic or section the question belongs to; the chooser lets a reader pick groups. */
  group?: string;
  /** How hard the question is: foundation, developing, or exam-style. */
  level?: QuizLevel;
  /** A short worked solution shown after answering. */
  steps?: string[];
  /** Where the question comes from, for example a past paper and question number. */
  source?: string;
};

export type QuizData = {
  title?: string;
  questions: QuizQuestionData[];
};

export type QuizFile = {
  quizzes: Record<string, QuizData>;
};

/**
 * What the page needs to know about a quiz without carrying its questions: the title, how many questions there are and
 * the address of the data file (see lib/lazy-data.ts). Throws at build time, as before, when the file or the id is
 * missing.
 */
export async function describeQuiz(src: string, id: string) {
  if (!SAFE_DATA_PATH.test(src) || src.includes('..')) {
    throw new Error(`QuizRef: invalid src "${src}".`);
  }

  let file: QuizFile;
  try {
    const module_ = await import(`@/content/quiz-data/${src}.json`);
    file = (module_.default ?? module_) as QuizFile;
  } catch {
    throw new Error(`QuizRef: no quiz data file at content/quiz-data/${src}.json.`);
  }

  const quiz = file.quizzes?.[id];
  if (!quiz) {
    const known = Object.keys(file.quizzes ?? {}).join(', ') || 'none';
    throw new Error(`QuizRef: quiz "${id}" is not in content/quiz-data/${src}.json (known ids: ${known}).`);
  }

  return {
    title: quiz.title,
    count: quiz.questions.length,
    url: lazyDataUrl('quiz', src, dataVersion(`quiz:${src}`, file)),
  };
}
