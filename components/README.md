# Components for MDX content

Every course page is built from the same small set of components. The page structure, the notes template and the rules for which component goes where are in [docs/content-standard.md](../docs/content-standard.md); read that first. This file is the reference for the components themselves.

## Rules

1. **Never import components in MDX.** Every component is registered once, in [`components/mdx.tsx`](mdx.tsx), and the MDX compiler resolves it by name. To add a component, create it and register it there.
2. **Data imports are the one exception.** A review page imports its flashcards as data (`import { flashcardData } from '@/content/flashcard-data/...'` at the top of `review.mdx`), never a component.
3. **Questions stay out of the MDX.** Quiz questions live in JSON under `content/quiz-data` and are referenced with `<QuizRef />`; flashcards live in a TypeScript module under `content/flashcard-data`; playground examples and seed datasets live under `content/playground-data`. Older quizzes that are still TypeScript modules (`quizData`, passed to `<Quiz questions={quizData} />`) keep working until their course is migrated.
4. **No emojis in the interface or in headings.** Use plain labels or lucide icons.
5. **Style through tokens.** Components use the `--ui-*` tokens in `app/styles/tokens.css` and the rules in `app/styles/components.css`. Do not add per-component colours or per-course stylesheets.

## The standard elements

| Element | Use | Props |
|---|---|---|
| `LearningObjectives`, `Prerequisites` | Open a notes page | `items` (array of strings) |
| `KeyTerm` | A definition or theorem | `label` (default "Key term"), `title`, `tone` (`blue`, `purple`, `green`, `amber`, `red`) |
| `Steps` and `Step` | A procedure or a worked example | `title` on `Steps`; `title` on each `Step` |
| `Callout` | An aside with one meaning | `type`: `note`, `tip`, `caution`, `mistake`, `key`, `analogy`; optional `title` |
| `CheckQuestions` and `CheckQuestion` | "Check your understanding" at the end of a notes page | `question` on each `CheckQuestion`; the answer is its children |
| `SiteDiagram`, `Mermaid`, `SafeImage` | Figures | see the component |
| `ExcalidrawCanvas` | A drawn map of a whole topic, read-only, with pan, zoom and full screen. Overview pages only | `src` (a file under `public/diagrams`), `title`, `expectedMB` (the file size). At 3 MB or more it loads on a click; smaller files load as they scroll into view |
| `ComparisonTable` | A comparison (renders as a table) | |
| `JavaTryIt`, `HaskellTryIt`, `CodeTryIt` and the algorithm stories | Running or watching code | see the component |

`Callout` also accepts the Fumadocs names `info`, `warning`, `error`, `success` and `idea`, and maps them onto the six kinds above.

```mdx
<LearningObjectives items={['Define a recursive function', 'Trace a call by hand']} />

<KeyTerm title="Recursive function">A function that calls itself on a smaller input until it reaches a base case.</KeyTerm>

<Steps title="Tracing factorial 3">
  <Step title="Expand">`factorial 3 = 3 * factorial 2`</Step>
  <Step title="Reach the base case">`factorial 0 = 1`</Step>
</Steps>

<Callout type="key">Every recursive definition needs a base case and a smaller recursive call.</Callout>

## Check your understanding

<CheckQuestions>
  <CheckQuestion question="Why does the base case matter?">Without it the calls never stop.</CheckQuestion>
</CheckQuestions>
```

## Assessment components

| Page | Components | Data |
|---|---|---|
| Notes | `CheckQuestions` at the end, nothing else | in the MDX, three to five items |
| `review.mdx` | `FlashcardDeck`, then `QuizRef` | `content/flashcard-data/<page path>.ts`, `content/quiz-data/<page path>.json` |
| `questions.mdx` | `ExamQuestion` containing `SubQuestion` with worked solutions | in the MDX |

```mdx
<QuizRef src="sem3/csi243/01-functional-thinking/review" id="chapter-quiz" />

<ExamQuestion title="Question 1: Pure functions [10 marks]">
  <SubQuestion part="a" prompt={<>Define a pure function. [3]</>} solution={<>Its result depends only on its arguments and it has no side effects. [3]</>} />
</ExamQuestion>
```

### Quiz data

A quiz data file mirrors the path of the page that uses it:

```text
content/docs/sem3/csi243/01-functional-thinking/review.mdx
content/quiz-data/sem3/csi243/01-functional-thinking/review.json
```

```json
{
  "$schema": "../../../quiz.schema.json",
  "quizzes": {
    "chapter-quiz": {
      "title": "Functional thinking",
      "questions": [
        {
          "question": "What makes a function pure?",
          "code": ["double :: Integer -> Integer", "double x = x * 2"],
          "options": ["...", "...", "...", "..."],
          "correctIndex": 2,
          "explanation": "Shown after submitting.",
          "optionFeedback": ["Why option 1 is wrong.", "...", "Correct.", "..."]
        }
      ]
    }
  }
}
```

`code` is optional (one array entry per line) and so is `optionFeedback` (one entry per option, in order). Run `npm run audit:quizzes`: it fails on a malformed question, a reference to a missing file or id, and a quiz that no page uses. The `$schema` path depends on how deep the file is.

### Quiz fields

The quiz shows one question at a time. When the questions have more than one `group` it first offers topic chips and, past ten questions, a "how many" menu; otherwise it starts straight away. These fields are all optional, so older quizzes keep working:

| Field | Meaning |
|---|---|
| `group` | The topic or section the question belongs to. A chip in the chooser, and a bar in the results. |
| `level` | `foundation`, `developing` or `exam`. A tag in the data only; the quiz does not use it. |
| `steps` | A short worked solution, one step per entry, shown after answering |
| `source` | Where the question comes from, for example `"CSI247 2018 paper, Q3"`. Use it when a past paper inspired the question. |
| `id` | A stable id (lowercase words with hyphens), unique in the quiz. Saved answers and progress follow it, so set one when you might reword the question. Without it, an id is derived from the text. |

## Practice questions from data

A Practice page with many formulas should not carry them in the MDX: with `rehype-katex` every formula becomes markup in the compiled page, and two CSI213 pages compiled to 1.4 MB and 0.8 MB (about 1.4 GB of dev server memory for one page, DEV-03). Write the questions in JSON under `content/practice-data/`, mirroring the page path, and show a group of them with `<PracticeRef />`. The maths is written with `$...$` and drawn in the browser, as in the quizzes.

```mdx
## Binomial

A sentence or a table that belongs to the whole group stays here, in the MDX.

<PracticeRef src="sem3/csi213/05-discrete-distributions/questions" group="binomial" />
```

```json
{ "groups": { "binomial": { "title": "Binomial", "questions": [
  { "title": "Foundation: ...", "prompt": "Text with $maths$ and **bold**.",
    "steps": [{ "title": "Name the model", "body": "..." }], "answer": "**Final answer.** ..." }
] } } }
```

Each question is an `ExamQuestion` with a Show solution button, the steps as `Steps`, and the answer under them. Keep the `##` heading in the MDX so the page contents list still has the group. The loader is `lib/practice-data.ts`; the file path and group id are checked and a wrong one stops the build with a message.

## Code window

Every fenced code block in the notes is rendered by `components/interactive/code-window.tsx` (the MDX `pre` in `components/mdx.tsx`), styled in `app/styles/code-window.css`. It has three window buttons, the language name (or the fence `title="File.java"`), a copy button, and line numbers from six lines (or with `lineNumbers` on the fence). The language comes from the `language-xxx` class that `rehypeCodeOptions: { addLanguageClass: true }` in `source.config.ts` adds.

A `text` fence straight after code is that code's **Output** panel and joins the window above it; a `text` fence that starts with `ghci>`, `$ ` or `>>> ` is a session transcript and joins it the same way; any other `text` fence on its own is labelled Text. Code never wraps or clips: a long line scrolls sideways inside the window, which can be focused from the keyboard. The quiz `code` field is a code window too (the language comes from the course in the page path), and `RichText` renders `inline code` in quiz text and on flashcards.

### Try it yourself

`HaskellTryIt`, `JavaTryIt` and `CodeTryIt` (JavaScript, Python and SQL; `html` keeps a static sample with a button that opens the playground) render `components/interactive/runnable-code.tsx`: an editable code window with Run and Reset in the title bar, and an Output window joined beneath it that shows the result, any error, and how long the run took. Ctrl or Cmd with Enter runs; Tab indents two spaces (press Esc and then Tab to leave the editor); Copy copies what is in the editor now. An optional second fence after the program (a `text` block) is the output the page shows for it: it appears in the Output window until the reader runs the code, so the page reads the same as before and the reader can then change it. A GHCi transcript can be runnable too: `<HaskellTryIt session>` takes one command per line (the `ghci>` prompt is optional) and shows the transcript as the output, each command under its prompt with its result; a second `text` fence holding the transcript as the page shows it appears until the first run. A command that fails stops the session with the interpreter's message. A program that reads input (Haskell `getLine`, `readLn`, `getContents` or `interact`, Python `input()`) gets an **Input** box under the editor, one line per line of input; `<HaskellTryIt input="21">` sets what it starts with. The Haskell interpreter (`lib/haskell-simulator.ts`) loads only when Run is first pressed. `npm run scan:haskell` runs every Haskell example in the CSI243 notes through it and compares the output with what the page shows, and `npm run test:haskell` runs its unit tests.

Write the program as a fenced block inside the tag. MDX strips the indentation from a multi-line template literal in an attribute, so `code={`...`}` loses it; a fenced child keeps it:

````mdx
<HaskellTryIt>

```haskell
main = print [x * x | x <- [1..5]]
```

</HaskellTryIt>
````

## Distribution explorer

`<DistributionExplorer />` (`components/interactive/distribution-explorer.tsx`, styled in `app/styles/explorer.css`) lets a reader pick a distribution, move its parameters with sliders, shade an interval with two more sliders, and read off the probability, the mean and the variance beside the formula. It draws the mass or density and the cumulative curve as SVG from the `--ui-*` tokens, and the maths is in `lib/stats/distributions.ts` (tested by `npm run test:distributions`).

```mdx
<DistributionExplorer family="binomial" start={{ n: 10, p: 0.5 }} />
<DistributionExplorer families={["geometric", "negative-binomial"]} convention="failures" />
```

| Prop | Meaning |
|---|---|
| `family` | One of `binomial`, `poisson`, `geometric`, `negative-binomial`, `hypergeometric`, `uniform`, `exponential`, `normal` |
| `families` | A list the reader can switch between (the first is shown first) |
| `start` | Starting parameter values by key: `n`, `p`, `lambda`, `r`, `N`, `K`, `a`, `b`, `mu`, `sigma` |
| `convention` | For the geometric and negative binomial only: `trials` (counts up to the success, STA122) or `failures` (counts the failures before it, CSI213 lesson 5.3) |

Set the convention to match the lesson, because the two conventions give different values for the same experiment. The plot has a text description in its `aria-label`, and the readout beneath it gives the same numbers as text.

## Simulation

`<Simulation experiment="..." />` (`components/interactive/simulation.tsx`) runs an experiment 1, 10, 100 or 1000 trials at a time and draws the relative frequencies as bars beside the theoretical probabilities as markers, with a table of counts, relative frequencies and theory under it. It is for showing that frequencies settle on probabilities. The generator is seeded (`lib/stats/random.ts`, mulberry32), so a seed number repeats a run, and Reset starts again from the seed. The experiments are pure functions in `lib/stats/simulate.ts` (tested by `tests/unit/simulation.test.mjs`).

```mdx
<Simulation experiment="dice" />
<Simulation experiment="binomial" start={{ n: 10, p: 0.3 }} />
<Simulation experiment="monte-carlo" mode="conditional" start={{ threshold: 8 }} />
<Simulation experiment="clt" start={{ sampleSize: 1 }} />
```

| Prop | Meaning |
|---|---|
| `experiment` | `coins` (count heads in several fair coins), `dice` (the sum of two dice), `binomial` (n attempts with success probability p), `lln` (the running frequency of heads, or the running mean of a die, against its limit), `clt` (a histogram of sample means from a skewed source, against the normal curve), `monte-carlo` (random points to estimate π, or a conditional probability from two dice) |
| `mode` | Pins the version of `lln` (`coin` or `die`) or `monte-carlo` (`pi` or `conditional`). Leave it out and the reader gets a select |
| `seed` | The starting seed, 2024 by default. The reader can type another |
| `start` | Starting values: `coins`, `n`, `p`, `sampleSize`, `threshold` (the conditional probability asks for P(first die is 6 given the sum is at least `threshold`)) |

Nothing random happens while the page renders: the first render is an empty run and numbers are drawn only in the click handlers, so the server and the browser agree. A run stops at 20,000 trials. The plot's `aria-label` and the readout and table give the result as text.

## Venn diagram

`<VennDiagram sets={2} />` (`components/interactive/venn-diagram.tsx`) shows two or three overlapping sets. The reader picks an expression from a select (`A ∩ B`, `(A ∪ B)′`, `A and B and not C` and so on), sees its regions shaded, types the number of elements in each region, and reads the count and the probability of the expression. It is for the set operations and De Morgan's laws, and for turning "and", "or" and "not" into counting. The set algebra is in `lib/stats/sets.ts` (tested by `tests/unit/sets-and-trees.test.mjs`).

```mdx
<VennDiagram sets={2} />
<VennDiagram sets={3} expression="A and B and not C" notation="c" start={{ ABC: 5, none: 20 }} />
```

| Prop | Meaning |
|---|---|
| `sets` | 2 or 3 |
| `expression` | The expression shown first, written in words as the menu writes it: `A and B`, `not (A or B)`, `A minus B`, `A and B and not C` |
| `start` | Starting counts by region key: `A` (A only), `B`, `AB`, `none` (in no set), and for three sets `C`, `AC`, `BC`, `ABC` |
| `notation` | How the complement is written in the formula: `bar` (CSI213, the default), `c` (STA122) or `prime` |

Shading is not the only cue: the counts in shaded regions are bold, and the label and readout give the expression in words, in LaTeX and as a list of regions.

## Probability tree

`<ProbabilityTree />` (`components/interactive/probability-tree.tsx`) draws a two-stage tree. The reader types P(A), P(B | A) and P(B | not A) and sees the four joint probabilities, P(B) by total probability and P(A | B) by Bayes' theorem, with the formula and the numbers put into it. It is for conditional probability and the base-rate effect. The arithmetic is in `lib/stats/bayes.ts` (tested by `tests/unit/sets-and-trees.test.mjs`: P(A) = 0.01, P(B | A) = 0.95 and P(B | not A) = 0.1 give P(A | B) = 0.0876).

```mdx
<ProbabilityTree eventA="Disease" eventB="Positive test" start={{ a: 0.01, bGivenA: 0.95, bGivenNotA: 0.1 }} />
```

| Prop | Meaning |
|---|---|
| `eventA`, `eventB` | The names of the two events, shown in a line above the tree and in the sentence under the formula. The tree itself is labelled with the letters A and B |
| `start` | `a`, `bGivenA`, `bGivenNotA`, each between 0 and 1 |
| `notation` | How the complement is written in the formula: `bar` (the default), `c` or `prime` |

## Counting calculator

`<CountingCalculator />` (`components/interactive/counting-calculator.tsx`) counts arrangements and selections. The reader sets n and r, ticks "Order matters" and "Repetition allowed", and sees the count, the formula and the working with the numbers put in, and a table of all four counts for the same n and r. The numbers are BigInts (`lib/stats/counting.ts`), so they stay exact: C(52, 5) = 2,598,960. It is for choosing between P(n, r), C(n, r), n^r and C(n + r − 1, r).

```mdx
<CountingCalculator start={{ n: 52, r: 5 }} />
<CountingCalculator start={{ n: 5, r: 3 }} ordered />
```

| Prop | Meaning |
|---|---|
| `start` | Starting `n` (1 to 60) and `r` (0 to 30) |
| `ordered`, `repetition` | Start with "Order matters" or "Repetition allowed" ticked |

Without repetition, an r larger than n has no arrangements, and the calculator says so instead of showing a formula that does not apply.

## Decoding the questions

Every review page ends with a `## Decoding the questions` section that teaches how to read a question before answering it. `<CommandWords />` shows the shared table of command words (define, explain, compare and so on), and `<DecodeQuestion>` works through a real question from the topic. Course-specific dictionaries live in `content/decoding/<course>.json`.

## Progress

Interactive components report what the reader does so the streak, XP and badges stay current. Call `useRecord()` from `@/features/progress` and record an event; it does nothing outside the provider. The events are `page`, `quiz-answer`, `quiz-complete`, `quiz-reset`, `card`, `check` and `focus`. Rewards, levels and badges are data in `content/progress/rewards.json`. See [docs/plans/progress-system.md](../docs/plans/progress-system.md) for the design, how to add a badge or an event, and the rules for keeping saved progress working as the content changes (stable ids, `content/progress/aliases.json` for renamed pages, versioned storage with migrations).

## Retired components

These still work, because each one renders through a standard element, but new content should not use them. `npm run audit:content-standard` flags every use so the content can be migrated.

| Retired | Use instead |
|---|---|
| `Card`, `HighlightCard`, `ConceptBlock`, `TheoremBlock` | `KeyTerm` (`label="Theorem" tone="purple"` for a theorem) |
| `PresetCard`, `CommonMistake`, `RecognitionStrategy` | `Callout` |
| `StepByStep`, `MethodSteps`, `InteractiveStepper`, `FumaSteps` | `Steps` |
| `Checklist`, `PracticeCheckpoint` | `LearningObjectives` and `CheckQuestions` |
| `Accordion`, `Accordions` | A plain section, or `CheckQuestions` |
| `Columns`, `Column` | A table, or two sections |
| `WorkedExample`, `WorkedExampleSet` | `Steps` |
| `LessonIntroduction`, `LessonSummary`, `LessonConnection` | The page description, `LearningObjectives`, a `key` callout, the pager |

## Writing math in MDX

The MDX compiler parses JSX before KaTeX reads the LaTeX, so a few habits keep the build from breaking.

- **Math goes in children, never in props.** `<Step title="Setup">$x^2$</Step>`, not `<Step content="$x^2$" />`. A prop is a plain string and is never typeset.
- **No raw `<` or `>` inside JSX.** Write `\lt` and `\gt` in LaTeX, or `&lt;` and `&gt;` in text, for example `<Callout>$P(X \gt 5)$</Callout>`.
- **Use `$...$` for inline math and `$$...$$` for display math.** Do not wrap math in backticks.
- **Wide formulas scroll; they do not wrap.** The layout components already allow horizontal overflow, so do not override it.
- **Keep SVG coordinates rounded.** `GraphViewer` rounds every coordinate with `.toFixed(2)` so the server and the browser render the same markup; do not remove that.

## Where things live

| What | Where |
|---|---|
| Page content | `content/docs/semN/<course>/` |
| Quiz questions | `content/quiz-data/` |
| Flashcards | `content/flashcard-data/` |
| Playground examples | `content/playground-data/` |
| Component registry | `components/mdx.tsx` |
| Styles | `app/styles/` (`tokens.css`, `base.css`, `chrome.css`, `prose.css`, `components.css`, `study-timer.css`) |
| Page chrome (tabs, pager, keys) | `components/layouts/`, `lib/page-navigation.ts`, `lib/topic-pages.ts` |
| The audit | `npm run audit:content-standard` |
