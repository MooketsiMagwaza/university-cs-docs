# University CS Docs

[![CI](https://github.com/MooketsiMagwaza/university-cs-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/MooketsiMagwaza/university-cs-docs/actions/workflows/ci.yml)
[![CodeQL](https://github.com/MooketsiMagwaza/university-cs-docs/actions/workflows/codeql.yml/badge.svg)](https://github.com/MooketsiMagwaza/university-cs-docs/actions/workflows/codeql.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

An open, interactive documentation platform for Computer Science courses at the University of Botswana. The project combines structured notes, active-recall review, guided questions, advanced mock exams, interactive components, and course resource hubs.

> [!IMPORTANT]
> This is a community-maintained study resource, not an official University of Botswana publication. Confirm course requirements, assessment rules, and administrative information through official university channels.

## Contributing

Contributions are welcome—from a one-line correction to a complete course topic. Start with the [contribution guide](CONTRIBUTING.md), follow the [Code of Conduct](CODE_OF_CONDUCT.md), and review the [educational content and resource policy](CONTENT_POLICY.md).

- [Report a bug](https://github.com/MooketsiMagwaza/university-cs-docs/issues/new?template=bug.yml)
- [Report a content correction](https://github.com/MooketsiMagwaza/university-cs-docs/issues/new?template=content.yml)
- [Propose a feature or course topic](https://github.com/MooketsiMagwaza/university-cs-docs/issues/new?template=feature.yml)
- [Ask a question or discuss an idea](https://github.com/MooketsiMagwaza/university-cs-docs/discussions)
- [Report a vulnerability privately](https://github.com/MooketsiMagwaza/university-cs-docs/security/advisories/new)

Project decisions and roles are documented in [GOVERNANCE.md](GOVERNANCE.md). General help routes are listed in [SUPPORT.md](SUPPORT.md).

## Memory warning for large MDX builds
If you experience out-of-memory errors or crashes while running the development server with large MDX files, you may need to increase Node.js memory limits. For systems with 16GB of RAM, it is highly recommended to allocate up to 12GB to Node.js during intensive builds or development to prevent V8 heap exhaustion.

Run the development server with increased memory:
```bash
NODE_OPTIONS="--max-old-space-size=12288" npm run dev
```
For building:
```bash
NODE_OPTIONS="--max-old-space-size=12288" npm run build
```

## Installation and Setup

### Prerequisites
- Node.js 22
- npm 10 or later
- Git

### Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/MooketsiMagwaza/university-cs-docs.git
   cd university-cs-docs
   ```
2. Install Node.js dependencies:
   ```bash
   npm ci
   ```

## Development Workflow

### Running the Development Server
Start the local Next.js development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build and Deployment
To create an optimized production build:
```bash
npm run build
```
To run the production build locally:
```bash
npm start
```
**Deployment**: The project is configured for deployment on platforms like Vercel. Simply push your repository to GitHub and import the project into Vercel. Vercel will automatically detect the Next.js framework and configure the build settings.

## Architecture and Features

This project is built on modern web technologies to ensure a fast, searchable, and interactive learning experience.

- **Framework**: Next.js 16 (App Router)
- **Documentation Engine**: Fumadocs
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX (Markdown + JSX)
- **Math Rendering**: KaTeX

### Key Features
- **Interactive Homepage**: A responsive, parallax-driven landing page built with Framer Motion.
- **Custom MDX Components**: A massive suite of React components designed for computer science notes, including interactive quizzes, step-by-step guides, mathematical proof environments, and function plotters.
- **Resource Hub**: A centralized, searchable file browser for lecture slides, lab manuals, and supplementary PDFs.

## Content Creation Guide

### Writing MDX Content
All course notes live in the `content/docs/` directory, organized by semester and course code (e.g., `sem3/csi247/`). Every MDX file must start with frontmatter:

```mdx
---
title: "Algorithm Analysis and Big-O Notation"
description: "Complete guide to asymptotic analysis and complexity."
---

# Algorithm Analysis

This is standard markdown with **bold** and *italic* text.
```

### Managing Images
Images are stored statically in the `public/images/` directory, organized by semester and course (e.g., `public/images/sem3/csi247/`).

**Guidelines**:
- Use WebP for photos (smaller file size) or PNG for diagrams with transparency.
- Use descriptive, kebab-case filenames (e.g., `binary-search-visualization.png`).
- Always include descriptive alt text for accessibility.

**Usage in MDX**:
Use the custom `<SafeImage>` component, which gracefully handles broken links by displaying a styled fallback UI.

```mdx
<SafeImage
  src="/images/csi247/binary-search-visualization.png"
  alt="Binary search algorithm visualization"
  caption="Figure 1: Binary search divides the array in half each iteration"
  className="max-w-full h-auto"
/>
```

### Managing Resources (Lectures, Labs, PDFs)
External files are stored in the `public/files/` directory (e.g., `public/files/sem3/csi247/`). 

To make these files browsable in the documentation:
1. Place your files in the appropriate course folder.
2. Create or update the `meta.json` file in that same directory. This JSON file acts as the index, defining folders, file types, URLs, and descriptions.
3. In your MDX page, add the Resource Hub component:

```mdx
<ResourceHub modulePath="/files/sem3/csi247" />
```
The component will automatically render a searchable file browser with built-in PDF previewing.

### Adding Quizzes
Quizzes are powered by a custom `<Quiz />` component and separate TypeScript data files.

1. **Create the Data**: Create a `.ts` file in `content/quiz-data/sem3/[course]/` (e.g., `binary-search-quiz.ts`).
2. **Export the Array**: Export an array named `quizData` containing objects with `question`, `options` (array of 4 strings), `correctIndex` (0-3), and `explanation`.
3. **Inject into MDX**: At the bottom of your MDX file, import the data and render the component:

```mdx
import { quizData } from '@/content/quiz-data/sem3/csi247/binary-search-quiz';

<Quiz title="Binary Search Assessment" questions={quizData} />
```

## The Zero-Import Rule & Global Registry

To keep MDX files clean and focused on content, all custom UI components are **globally registered**. You **never** need to import UI components inside your `.mdx` files. The MDX compiler automatically resolves them via the `MDXProvidedComponents` TypeScript declaration.

The **sole exception** to the zero-import rule is quiz data, which must be imported to keep MDX files lightweight.

### How to Add or Remove a Component Globally
When you create a new component or want to remove an existing one, you only need to update a single file: `components/mdx.tsx`.

1. **Create your component** (e.g., `components/interactive/my-widget.tsx`).
2. **Open `components/mdx.tsx`**.
3. **Import your component** at the top of the file:
   ```tsx
   import { MyWidget } from './interactive/my-widget';
   ```
4. **Register it** in the `getMDXComponents` return object:
   ```tsx
   export function getMDXComponents(components?: MDXComponents) {
     return {
       ...defaultMdxComponents,
       // ... other components
       MyWidget, // <-- Add it here
       ...components,
     } satisfies MDXComponents;
   }
   ```
5. **Use it anywhere** in your `.mdx` files without importing:
   ```mdx
   <MyWidget title="Hello" />
   ```

## Custom Components Reference

Below is the complete reference for all globally registered custom components. 

### Callouts
- **`Card`**: A basic container with a subtle border and background.
- **`Checklist`**: Displays a list of rules with icons. Props: `title`, `rules` (array of `{type: 'must' | 'avoid' | 'note', text: string}`).
- **`HighlightCard`**: Wraps core concepts around formulas or code. Props: `variant` (primary, success, warning, danger, info, neutral), `title`, `description`.
- **`PresetCard`**: Color-coded callouts for specific pedagogical purposes. Props: `type` ('trap', 'exam', 'builds', 'intuition').

### Interactive
- **`Flashcard`**: A 3D-flipping card for memorization. Props: `front`, `back` (ReactNode).
- **`InteractiveStepper` & `StepperStep`**: A multi-step walkthrough with a progress bar and next/previous buttons. Wrap steps in `<StepperStep title="...">`.
- **`Quiz`**: A fully interactive multiple-choice quiz with KaTeX math support, scoring, and explanations. Props: `title`, `questions` (array of quiz data).
- **`ResourceHub`**: A searchable file browser for lectures, labs, and PDFs. Reads from a `meta.json` file. Props: `modulePath` (e.g., `/files/sem3/csi247`).
- **`StepByStep` & `Step`**: A static, vertical timeline of steps. Use `<StepByStep title="...">` and nest `<Step number={1} title="...">` inside.
- **`StepByStepTitle` & `StepTitle`**: Helper components to prevent MDX hydration errors when mixing headings and text.

### Layouts
- **`Columns` & `Column`**: A responsive 2-column grid. Wrap content in `<Columns>` and use `<Column>` for each side.
- **`ComparisonTable`**: A styled table that can highlight a specific column. Props: `columns` (array of `{header, key}`), `rows` (array of objects), `highlightCol` (key to highlight).

### Math
- **`CaseAnalysis` & `Case`**: Used for piecewise functions or conditional logic. Wrap `<Case condition="..." explanation="...">` inside `<CaseAnalysis>`.
- **`EquationBreakdown`, `Equation`, `Term`, `TermGrid`**: Tools for breaking down complex equations. Use `<Equation>` for the main formula, and `<TermGrid>` with `<Term symbol="..." meaning="...">` to define variables.
- **`FormulaBlock`**: Highlights canonical formulas with a "Copy LaTeX" button. Props: `title`, `latex` (the raw LaTeX string for the clipboard). The rendered math goes in `children`.
- **`MathCodeBlock`**: A styled code block for pseudocode with a copy button. Props: `title`, `language`.
- **`MathEnv`**: Mimics LaTeX `amsthm` environments. Props: `type` ('definition', 'theorem', 'lemma', 'corollary', 'example'), `number`, `title`.
- **`Proof`**: A dedicated environment for mathematical proofs, automatically appending a QED symbol at the bottom right.

### Visuals
- **`GraphViewer`**: An SVG-based function plotter that supports multiple functions, integral shading, and grid lines. Props: `functions` (array of `{expr, color, label}`), `integrals`, `domain`, `range`.
- **`SafeImage`**: An image wrapper that gracefully handles broken links by displaying a styled fallback UI. Props: `src`, `alt`, `caption`.

### Native Fumadocs Components
These are also globally registered and require zero imports:
- **`Callout`**: Standard Fumadocs callout boxes.
- **`Tabs` & `Tab`**: Tabbed content sections.
- **`Accordion` & `Accordions`**: Collapsible content sections.
- **`FumaSteps` & `FumaStep`**: Fumadocs native step-by-step component.

## MDX + Math Syntax Guardrails

The MDX compiler parses JSX before KaTeX processes LaTeX. Violating these rules will cause build crashes or hydration mismatches.

1. **Never Put Math Inside Component Props**: Props are evaluated as raw JavaScript strings. KaTeX will not render inside them. Always use component children.
2. **Never Use Raw `<` or `>` Inside JSX**: The JSX parser interprets `<` and `>` as tag boundaries. Always use LaTeX commands (`\lt`, `\gt`) or HTML entities (`&lt;`, `&gt;`).
3. **Prevent Grid/Flex Blowout**: Math formulas do not wrap. All layout components already include `min-w-0` and `overflow-x-auto`. Do not override these classes.

## Contribution checks

Before opening a pull request, run:

```bash
npm run check
```

GitHub Actions repeats the type check and production build and also runs CodeQL and dependency review where applicable. See [CONTRIBUTING.md](CONTRIBUTING.md) for content structure, quality requirements, source provenance, accessibility, and pull-request expectations.

## License

Distributed under the MIT License. See the `LICENSE` file for full text.

The MIT License applies to original repository code and content. Third-party educational resources retain their respective rights and must comply with [CONTENT_POLICY.md](CONTENT_POLICY.md).

Copyright (c) 2026 Mooketsi Vincent Magwaza
