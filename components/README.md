# MDX Design System: Implementation Guide

This guide defines the exact architecture, component usage rules, and MDX syntax protocols for building the CSI213 digital textbook. It is engineered for **human developers** and **AI code generators** to follow deterministically.

---

## 🚨 Phase 1: The Zero-Import Rule & Global Registry

### 1.1 Core Architecture
All custom and native UI components are **globally registered** in `components/mdx-components.tsx`. 
Because of this, **you must NEVER import UI components inside `.mdx` files.** The MDX compiler automatically resolves them via the `MDXProvidedComponents` TypeScript declaration.

### 1.2 The Only Allowed Import: Quiz Data
The **sole exception** to the zero-import rule is quiz data. Quiz questions are stored externally to keep MDX files lightweight and focused on pedagogy.

**Import Path Structure:**
```ts
import { quizData } from '@/content/quiz-data/sem3/csi213/[chapter-slug]-quiz';
```

**Correct MDX File Header:**
```mdx
---
title: "01. Combinatorics and Counting Principles"
description: "Formal treatment of permutations, combinations, and algorithmic complexity."
---
import { quizData } from '@/content/quiz-data/sem3/csi213/01-combinatorics-quiz';

# Chapter 1: Combinatorics and Counting Principles
...
```

**❌ NEVER DO THIS:**
```mdx
import { Columns, MathEnv, Quiz, Callout } from '@/components/...'; // BREAKS GLOBAL REGISTRY
```

### 1.3 Preferred for New Quizzes: JSON Data and `<QuizRef />`

Quiz questions never go inline in an `.mdx` file. For new quizzes, put them in a JSON file whose path mirrors the page path, and reference each quiz by id. This needs no import, so the zero-import rule is untouched.

```
content/docs/sem3/csi243/01-functional-thinking/notes/functional-thinking.mdx
content/quiz-data/sem3/csi243/01-functional-thinking/notes/functional-thinking.json
```

```json
{
  "$schema": "../../../../quiz.schema.json",
  "quizzes": {
    "check-pure-functions": {
      "title": "Check: pure functions",
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

```mdx
<QuizRef src="sem3/csi243/01-functional-thinking/notes/functional-thinking" id="check-pure-functions" />
```

- `code` is optional and shown in a code block under the question; an array is one entry per line.
- `optionFeedback` is optional, with one entry per option, in the same order.
- Run `npm run audit:quizzes` to check every data file and every reference. The audit fails on a malformed question, a reference to a missing file or id, or a quiz that no page uses.
- The older `quizData` TypeScript modules (section 1.2) remain valid. `<QuizRef />` and `<Quiz questions={...} />` render the same component.

---

## 📦 Phase 2: Component Implementation & Expanded Examples

Every component below is globally available. Use them directly in MDX. Each section includes usage, rationale, and common pitfalls.

### 2.1 Highlight Card (`<HighlightCard>`)
Wraps a core concept description around a critical formula or code block. Uses a card-in-card layout with thematic color outlines.

**Usage:**
```mdx
<HighlightCard 
  variant="danger"
  title="The False Positive Paradox"
  description="Even with a highly accurate test, if the base rate is extremely low, most positives are false. Critical for Bayesian inference."
>
  $$ P(Leak|Flag) = \frac{0.019}{0.068} \approx 0.2794 \quad \text{(Only 28\% chance of actual leak!)} $$
</HighlightCard>
```
**Variants:** `primary` | `success` | `warning` | `danger` | `info` | `neutral`
**⚠️ Pitfall:** Do not put markdown headings (`###`) inside the card. Use the `title` prop instead.

### 2.2 Preset Card (`<PresetCard>`)
Color-coded callouts for exam traps, intuition, and cumulative links.

**Usage:**
```mdx
<PresetCard type="trap">
  **Exam Warning:** Students confuse Geometric PMF $P(X=x) = q^{x-1}p$ with the Survival Function $P(X \ge x) = q^{x-1}$. If the question says *"at least"*, you **must** use the survival function.
</PresetCard>
```
**Types:** `trap` (red) | `exam` (green) | `builds` (blue) | `intuition` (yellow)

### 2.3 Columns (`<Columns>` & `<Column>`)
Pairs formalism with intuition side-by-side. Automatically handles horizontal overflow for wide math.

**Usage:**
```mdx
<Columns>
  <Column>
    ### 📐 Formal Definition
    $$ f(x) = \frac{1}{b - a} $$
  </Column>
  <Column>
    ### 🧠 Plain-English Translation
    Probability is simply the width of the sub-interval divided by the total width. It is a "flat" baseline distribution.
  </Column>
</Columns>
```
**⚠️ Pitfall:** Never exceed 2 columns. Mobile fallback is automatic. Do not nest `<Columns>` inside other flex containers.

### 2.4 Math Environments (`<MathEnv>`)
Mimics LaTeX `amsthm`. Provides typographical hierarchy for definitions, theorems, lemmas, corollaries, and examples.

**Usage:**
```mdx
<MathEnv type="theorem" number="1.2" title="The Memoryless Property">
  The Exponential distribution is the *unique* continuous distribution possessing the memoryless property:
  $$ P(X \gt s + t \mid X \gt s) = P(X \gt t) \quad \text{for all } s, t \ge 0 $$
</MathEnv>
```

### 2.5 Formula Block (`<FormulaBlock>`)
Highlights canonical formulas with a copy-to-clipboard button.

**Usage:**
```mdx
<FormulaBlock title="Method of Least Squares (Slope)" latex="\beta_1 = \frac{n(\sum xy) - (\sum x)(\sum y)}{n(\sum x^2) - (\sum x)^2}">
  $$ \beta_1 = \frac{n(\sum xy) - (\sum x)(\sum y)}{n(\sum x^2) - (\sum x)^2} $$
</FormulaBlock>
```
**⚠️ Critical Rule:** The `latex` prop is **only** for the copy button. The actual rendered math **must** be passed as `children` so the host KaTeX pipeline can parse it natively.

### 2.6 Interactive Stepper (`<InteractiveStepper>` & `<StepperStep>`)
Guides students through multi-stage proofs or algorithms. Prevents cognitive overload by revealing one step at a time.

**Usage:**
```mdx
<InteractiveStepper>
  <StepperStep title="Step 1: Identify the Distribution">
    Since we need *at least* $k$ successes out of $n$ independent trials, this is a **k-out-of-n system**. $X \sim \text{Bin}(5, 0.80)$.
  </StepperStep>
  <StepperStep title="Step 2: Formulate the Summation">
    $$ R_{3/5} = P(X=3) + P(X=4) + P(X=5) $$
  </StepperStep>
</InteractiveStepper>
```
**⚠️ Pitfall:** Never pass math or markdown inside a `content` prop. Always use `<StepperStep>` as a wrapper so MDX parses the children natively.

### 2.7 Flashcard (`<Flashcard>`)
3D-flipping card for rapid-fire memorization. Dynamically adjusts height to prevent text clipping.

**Usage:**
```mdx
<Flashcard 
  front={<span>State the <strong>Symmetry Axiom</strong> for the Z-Table.</span>}
  back={<span>$P(Z \lt -z) = 1 - P(Z \lt z)$<br/>The area left of $-z$ equals the area right of $+z$.</span>}
/>
```

### 2.8 Native Fumadocs Components
These are globally available and require zero configuration.

**Accordions:**
```mdx
<Accordions type="single" collapsible>
  <Accordion title="When to use Hypergeometric?">
    When sampling is **without replacement** from a **finite population**.
  </Accordion>
</Accordions>
```

**Tabs:**
```mdx
<Tabs items={['Intuition', 'Proof']}>
  <Tab>The system "forgets" how long it has been waiting.</Tab>
  <Tab>$$ \frac{e^{-\lambda(s+t)}}{e^{-\lambda s}} = e^{-\lambda t} \quad \blacksquare $$</Tab>
</Tabs>
```

**Steps:**
```mdx
<Steps>
  <Step>Navigate to `STAT` mode on your calculator.</Step>
  <Step>Select `2-VAR` and input $x$ and $y$ datasets.</Step>
</Steps>
```

---

## 🛡️ Phase 3: MDX + Math Syntax Guardrails

The MDX compiler parses JSX **before** KaTeX processes LaTeX. Violating these rules will cause build crashes or hydration mismatches.

### Rule 1: Never Put Math Inside Component Props
Props are evaluated as raw JavaScript strings. KaTeX will not render inside them.
* ❌ **Wrong:** `<StepperStep title="Step 1" content="$x^2$" />`
* ✅ **Right:** Use children.
  ```mdx
  <StepperStep title="Step 1">$$ x^2 $$</StepperStep>
  ```

### Rule 2: Never Use Raw `<` or `>` Inside JSX
The Acorn JSX parser interprets `<` and `>` as tag boundaries and throws `SyntaxError: Unexpected token`.
* ❌ **Wrong:** `<Tab> $P(X > 5)$ </Tab>`
* ✅ **Right:** Use LaTeX commands or HTML entities.
  ```mdx
  <Tab> $$ P(X \gt 5) $$ </Tab>
  <!-- OR -->
  <Tab> P(X &gt; 5) </Tab>
  ```

### Rule 3: Prevent Grid/Flex Blowout
Math formulas do not wrap. If placed in a constrained container without overflow handling, they will break the viewport.
* **Fix:** All layout components (`<Column>`, `<HighlightCard>`, etc.) already include `min-w-0`, `overflow-x-auto`, and `break-words`. Do not override these classes.

### Rule 4: Hydration-Safe Math Graphing
Server (Node.js) and Client (V8) calculate floating-point math slightly differently. This causes React Hydration Mismatch warnings.
* **Fix:** The `<GraphViewer>` component strictly rounds all SVG coordinates to `.toFixed(2)`. Never remove this rounding logic.

---

## 🤖 Phase 4: AI & Developer Enforcement Rules

If you are prompting an AI to generate or refactor MDX content for this system, paste these guardrails to prevent hallucination:

```text
AI GUARDRAILS FOR CSI213 MDX GENERATION:
1. ZERO COMPONENT IMPORTS: Never generate `import { Component } from ...` for UI elements. All components are globally registered. The ONLY allowed import is quiz data: `import { quizData } from '@/content/quiz-data/sem3/csi213/[slug]-quiz';`
2. CHILDREN OVER PROPS: Never pass markdown, LaTeX, or JSX inside component props. Always use component children so the MDX compiler parses them natively.
3. ESCAPE COMPARISON OPERATORS: Never use raw `<` or `>` inside JSX tags. Always use `\lt`, `\gt`, `&lt;`, or `&gt;`.
4. MATH BLOCKS: Use `$$ ... $$` for display math and `$ ... $` for inline math. Never wrap math in backticks inside JSX.
5. QUIZ PLACEMENT: Always place `<Quiz title="Chapter X Assessment" questions={quizData} />` at the very end of the chapter.
6. NO FLUFF: Delete academic filler. Use direct, active voice. Focus on exam mechanics, definitions, and cumulative links.
7. STRUCTURE: Maintain strict heading hierarchy (`##` for sections, `###` for subsections) to ensure the Fumadocs TOC renders correctly.
```

---

## 📋 Quick Reference Cheat Sheet

| Component | Purpose | Key Prop(s) | Children? |
|-----------|---------|-------------|-----------|
| `<HighlightCard>` | Concept + Math/Code wrapper | `variant`, `title`, `description` | ✅ Required |
| `<PresetCard>` | Exam traps & intuition | `type` (`trap`/`exam`/`builds`/`intuition`) | ✅ Required |
| `<Columns>` / `<Column>` | Side-by-side layout | `className` (optional) | ✅ Required |
| `<MathEnv>` | Definitions & Theorems | `type`, `number`, `title` | ✅ Required |
| `<FormulaBlock>` | Canonical formula + copy | `title`, `latex` (for clipboard) | ✅ Required |
| `<InteractiveStepper>` | Multi-step walkthrough | None | ✅ `<StepperStep>` |
| `<Flashcard>` | Active recall memorization | `front`, `back` (ReactNode) | ❌ Props only |
| `<GraphViewer>` | Function plotting & integrals | `functions`, `integrals`, `domain`, `range` | ❌ Props only |
| `<Quiz>` | Chapter assessment | `title`, `questions={quizData}` | ❌ Props only |

**Import Rule:** `import { quizData } from '@/content/quiz-data/sem3/csi213/[chapter]-quiz';` → **Everything else is zero-import.**

---

