# Contributing to University CS Docs

Thank you for helping improve an open study resource for University of Botswana Computer Science students. Contributions of corrections, explanations, worked examples, accessible diagrams, tests, components, and course resources are welcome.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- Use a GitHub issue for bugs, content corrections, new topics, or substantial proposals.
- Do not use public issues to report security vulnerabilities; follow [SECURITY.md](SECURITY.md).
- For a large structural change, open an issue before implementation so scope and content ownership can be agreed first.
- Never include student records, answer submissions, credentials, personal data, or restricted course-system exports.

## Ways to contribute

- Correct a factual, mathematical, grammatical, accessibility, or broken-link issue.
- Improve an explanation, proof, worked example, diagram, quiz, question, or marking guide.
- Add missing material from an official course outline.
- Improve a React/TypeScript learning component or the documentation interface.
- Triage issues, reproduce defects, or review pull requests.

## Local setup

Requirements:

- Git
- Node.js 22 (the version in `.nvmrc`)
- npm

```bash
git clone https://github.com/MooketsiMagwaza/university-cs-docs.git
cd university-cs-docs
npm ci
npm run dev
```

Open `http://localhost:3000`. Large MDX builds can require additional memory:

```bash
NODE_OPTIONS="--max-old-space-size=8192" npm run build
```

On PowerShell:

```powershell
$env:NODE_OPTIONS="--max-old-space-size=8192"
npm run build
```

## Contribution workflow

### Branch naming

Use conventional, lowercase branch names in the form `<type>/<kebab-case-description>`.

- `feat/` for new features, courses, lessons, or substantial content expansions.
- `fix/` for defects and factual corrections.
- `docs/` for repository documentation that does not change the learning experience.
- `chore/` for maintenance, tooling, and dependency work.

Do not prefix branches with an author, tool, or agent name. For example, use `feat/csi243-redemption`, not `codex/feat-csi243-redemption`.

1. Fork the repository on GitHub.
2. Clone your fork and add the main repository as `upstream`:

   ```bash
   git clone https://github.com/YOUR-USERNAME/university-cs-docs.git
   cd university-cs-docs
   git remote add upstream https://github.com/MooketsiMagwaza/university-cs-docs.git
   ```

3. Create a focused branch from the latest `main`:

   ```bash
   git checkout main
   git pull --ff-only upstream main
   git checkout -b feat/csi243-redemption
   ```

4. Make one coherent change. Avoid unrelated formatting or file moves.
5. Run the checks described below.
6. Commit with a clear conventional-style message, for example:

   ```text
   docs(csi132): correct the strong-induction example
   fix(quiz): preserve selected answer during review
   feat(resources): add an authorized CSI142 lecture index
   ```

7. Push your branch to your fork and open a pull request using the repository template.

## Content architecture

Course content lives under `content/docs/sem<semester>/<course>/`. New Semester I–II topics follow this structure:

```text
topic-name/
├── meta.json
├── notes.mdx
├── review.mdx
├── questions.mdx
└── exam.mdx
```

The four pages have distinct purposes:

- **Notes:** complete instruction from prerequisites to application and verification. Do not place a quiz at the end.
- **Review:** at least 16 meaningful flashcards and exactly 15 quiz questions.
- **Questions:** 15 guided practice questions that progress beyond recall.
- **Exam:** 30 substantially harder questions that differ from the guided set and use marks that reflect task difficulty.

Do not add formula-sheet or rules-sheet pages to Semester I–II topics. Use existing components and the established CSI213/CSI243 presentation patterns before introducing a new abstraction.

### Content quality bar

Every educational contribution should:

- agree with the current official course outline;
- define notation and prerequisite ideas before using them;
- show complete reasoning rather than only final answers;
- include realistic worked examples and boundary or error cases;
- distinguish facts, conventions, interpretations, and assumptions;
- verify calculations, code, claims, and answer keys independently;
- avoid generic generated filler and repeated question templates;
- use accessible language without sacrificing technical precision;
- cite or identify authoritative sources when a claim is not self-contained.

If AI tools materially assisted a contribution, disclose that in the pull request. The contributor remains responsible for checking every claim, solution, citation, and license.

## MDX rules

- Every MDX file needs `title` and `description` frontmatter.
- Components registered in `components/mdx.tsx` are globally available; do not import them in MDX unless the data itself must be imported.
- Do not place raw `<` or `>` characters in JSX text. Use `\lt`, `\gt`, `&lt;`, or `&gt;` as appropriate.
- Put display mathematics in KaTeX-compatible delimiters and keep it out of string props.
- Preserve a logical heading hierarchy; do not skip heading levels.
- Add descriptive alternative text to meaningful images.
- Use descriptive, kebab-case filenames for new web assets.
- Link course landing pages with the shared `CourseChapterIndex` pattern.

## Components and application code

- Use TypeScript and existing design tokens/components.
- Keep interactive controls keyboard accessible and visibly focusable.
- Include appropriate labels, roles, and state attributes.
- Preserve light/dark-mode contrast and responsive layouts.
- Avoid adding a dependency when a small local implementation is sufficient.
- Register reusable MDX components in `components/mdx.tsx`.

## Course resources and copyright

The MIT license covers original repository code and content. It does not transfer ownership of third-party textbooks, papers, lecture slides, assessments, or other source material.

Only add a resource when you own it, it has a compatible license, it is in the public domain, or you have explicit permission to redistribute it. Record the source, author/owner, license or permission basis, and retrieval date in the course resource metadata or pull request.

Do not upload:

- paid textbooks or paywalled articles;
- restricted LMS downloads;
- current confidential assessments or leaked solutions;
- personal student data;
- files whose redistribution status is unknown.

See [CONTENT_POLICY.md](CONTENT_POLICY.md) for the full provenance and takedown policy.

## Required checks

Run these before requesting review:

```bash
npm run types:check
npm run build
```

Also inspect changed pages locally. For UI changes, test keyboard interaction, a narrow viewport, and light and dark themes. For content changes, recalculate answers and verify internal links.

The pull request CI repeats type checking and the production build. Dependency and CodeQL workflows provide additional automated review.

## Pull request expectations

A pull request should:

- solve one clear problem;
- explain the motivation and affected courses/routes;
- list validation performed;
- include screenshots for visible UI changes;
- disclose source provenance and redistribution rights for new resources;
- disclose material AI assistance;
- update documentation when behavior or contributor workflow changes;
- have all automated checks passing and review conversations resolved.

Maintainers may request changes, split an oversized pull request, or decline content that cannot be verified or legally redistributed.

## Licensing contributions

By submitting a contribution, you confirm that you have the right to submit it and agree that it will be distributed under this repository's [MIT License](LICENSE). Third-party material remains governed by its own license and must be clearly identified.

## Getting help

Read [SUPPORT.md](SUPPORT.md), open a suitable issue, or start a GitHub Discussion for an open-ended proposal. Project roles and decision-making are described in [GOVERNANCE.md](GOVERNANCE.md).
