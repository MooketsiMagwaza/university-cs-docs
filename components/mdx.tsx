import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

// 1. Import your custom components
import { SafeImage } from './visuals/safe-image';
import { Quiz } from './interactive/quiz';
import { Columns, Column } from './layouts/columns';
import { ComparisonTable } from './layouts/comparison-table';
import { PresetCard } from './callouts/preset-card';
import { HighlightCard } from './callouts/highlight-card';
import { Checklist } from './callouts/checklist';
import { MathEnv } from './math/math-env';
import { EquationBreakdown, Equation, Term, TermGrid } from './math/equation-breakdown';
import { FormulaBlock } from './math/formula-block';
import { CaseAnalysis, Case } from './math/case-analysis';
import { Step, StepByStep, StepByStepTitle, StepTitle } from './interactive/step-by-step';
import { InteractiveStepper, StepperStep } from './interactive/interactive-stepper';
import { Flashcard } from './interactive/flashcard';
import { GraphViewer } from './visuals/graph-viewer';
import { Mermaid } from './visuals/mermaid';
import { Card } from './callouts/card';
import { ResourceHub } from './interactive/resource-hub';


import { Callout } from 'fumadocs-ui/components/callout';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Steps as FumaSteps, Step as FumaStep } from 'fumadocs-ui/components/steps';

import { ExamQuestion, SubQuestion } from './interactive/exam-question';
import { FlashcardDeck } from './interactive/flashcard-deck';

import { ExcalidrawCanvas } from './interactive/excalidraw-canvas';

import { ResourceCard, ResourceGrid } from './interactive/resource-card';
import { TopicNotesFlow } from './learning/topic-notes-flow';
import { PomodoroTimer, TimerSummary } from './learning/study-tools';
import { DocsWelcome, StudyWorkspaceHeader } from './learning/docs-entry-panels';
import { SemesterWorkInProgress } from './learning/semester-status';
import { ChapterExam, ChapterQuestions, ChapterReview } from './learning/chapter-study-pages';
import { CourseChapterIndex } from './learning/course-chapter-index';
import { LessonIntroduction, LearningObjectives, Prerequisites } from './learning/lesson-introduction';
import { CommonMistake, ConceptBlock, RecognitionStrategy, TheoremBlock } from './learning/concept-block';
import { WorkedExample, WorkedExampleSet } from './learning/worked-example';
import { LessonConnection, LessonSummary, MethodSteps, PracticeCheckpoint } from './learning/lesson-flow';
import { CalculusDiagram, Mat221CourseVideo, Mat221ExamPractice, Mat221FormulaSheet, Mat221QuestionBank } from '@/features/courses/mat221/components';
import { Mat221SourceCourseOverview, Mat221SourceExamPracticePage, Mat221SourceQuestionsPage, Mat221SourceQuizPage, Mat221SourceReviewPage } from '@/features/courses/mat221/compat/source-pages';
import { Mat221SourceFormulaSheet, Mat221SourceResources } from '@/features/courses/mat221/compat/source-tools';


export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    
    // 2. Register them globally
    SafeImage,
    Quiz,
    Columns,
    Column,
    ComparisonTable,
    PresetCard,
    HighlightCard,
    Checklist,
    MathEnv,
    EquationBreakdown,
    Equation,
    Term,
    TermGrid,
    FormulaBlock,
    CaseAnalysis,
    Case,
    StepByStep,
    Step,
    StepByStepTitle,
    StepTitle,
    InteractiveStepper,
    StepperStep,
    Flashcard,
    GraphViewer,
    Mermaid,
    Callout,
    Tabs,
    Tab,
    Accordion,
    Accordions,
    FumaSteps,
    FumaStep,
    Card,
    ResourceHub,
    ExamQuestion,
    SubQuestion,
    FlashcardDeck,
    ExcalidrawCanvas,
    ResourceCard, 
    ResourceGrid,
    TopicNotesFlow,
    PomodoroTimer,
    TimerSummary,
    DocsWelcome,
    StudyWorkspaceHeader,
    SemesterWorkInProgress,
    ChapterReview,
    ChapterQuestions,
    ChapterExam,
    CourseChapterIndex,
    LessonIntroduction,
    LearningObjectives,
    Prerequisites,
    ConceptBlock,
    TheoremBlock,
    RecognitionStrategy,
    CommonMistake,
    WorkedExample,
    WorkedExampleSet,
    MethodSteps,
    PracticeCheckpoint,
    LessonSummary,
    LessonConnection,
    CalculusDiagram,
    Mat221FormulaSheet,
    Mat221CourseVideo,
    Mat221QuestionBank,
    Mat221ExamPractice,
    Mat221SourceCourseOverview,
    Mat221SourceQuestionsPage,
    Mat221SourceQuizPage,
    Mat221SourceReviewPage,
    Mat221SourceExamPracticePage,
    Mat221SourceFormulaSheet,
    Mat221SourceResources,
    
    // Allow any other passed components to override
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
