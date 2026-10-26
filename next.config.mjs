import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Turbopack keeps every compiled page in memory by default. 'full' drops what it has already saved to its disk
    // cache after each save, so the dev server stays small (DEV-01).
    turbopackMemoryEviction: 'full',
  },
  // Allow cross-origin dev requests from your network IP
  allowedDevOrigins: ['100.124.114.119'],
  async redirects() {
    const mat221Topics = [
      ['foundations', '01-foundations'],
      ['substitution', '02-substitution'],
      ['partials', '03-partial-fractions'],
      ['parts', '04-integration-by-parts'],
      ['reduction-formulas', '05-reduction-formulas'],
      ['trig', '06-trigonometric-integrals'],
      ['trig-substitution', '07-trigonometric-substitution'],
      ['weierstrass', '08-weierstrass-substitution'],
      ['improper', '09-improper-integrals'],
      ['numerical', '10-numerical-integration'],
      ['applications', '11-applications'],
      ['lhopital', '12-lhopital'],
      ['sequences-series', '13-sequences-and-series'],
      ['power-series', '14-power-series'],
      ['taylor', '15-taylor-series'],
    ];
    const mat221Pages = ['', '/questions', '/quiz', '/review', '/exam-practice'];
    return [
      ...mat221Topics.flatMap(([sourceSlug, destinationSlug]) => mat221Pages.map((suffix) => ({
        source: `/topics/${sourceSlug}${suffix}`,
        destination: `/docs/sem3/mat221/${destinationSlug}/${suffix === '/exam-practice' ? 'review' : suffix ? suffix.slice(1) : 'notes'}`,
        permanent: true,
      }))),
      // The Exam section was removed: its pages sent readers to Review, which now holds the exam-style questions.
      {
        source: '/docs/:semester/:course/:topic/exam',
        destination: '/docs/:semester/:course/:topic/review',
        permanent: true,
      },
      {
        source: '/docs/:semester/:course/:topic/exam-practice',
        destination: '/docs/:semester/:course/:topic/review',
        permanent: true,
      },
      // Course-level playground pages moved under /docs/playgrounds, so a course folder holds only its overview, topics and resources.
      {
        source: '/docs/sem3/csi247/java-playground',
        destination: '/docs/playgrounds/java',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/playground',
        destination: '/docs/playgrounds/haskell',
        permanent: true,
      },
      // The CSI243 lab pages are the last lessons of their topic's Notes.
      ...[
        ['03-defining-functions', 'lab-01'],
        ['04-making-choices', 'lab-02'],
        ['06-lists-tuples', 'lab-03a'],
        ['06-lists-tuples', 'lab-03'],
      ].map(([topic, lab]) => ({
        source: `/docs/sem3/csi243/${topic}/${lab}`,
        destination: `/docs/sem3/csi243/${topic}/notes/${lab}`,
        permanent: true,
      })),
      {
        source: '/docs/sem3/csi243/decoding-questions',
        destination: '/docs/sem3/csi243/01-functional-thinking/review',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/01-functional-thinking/programming-model',
        destination: '/docs/sem3/csi243/01-functional-thinking/notes/programming-model',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/01-functional-thinking/functional-thinking',
        destination: '/docs/sem3/csi243/01-functional-thinking/notes/functional-thinking',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/02-expressions-types/ghci',
        destination: '/docs/sem3/csi243/02-expressions-types/notes/ghci',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/02-expressions-types/values-text',
        destination: '/docs/sem3/csi243/02-expressions-types/notes/values-text',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/02-expressions-types/expressions-types',
        destination: '/docs/sem3/csi243/02-expressions-types/notes/expressions-types',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/03-defining-functions/defining-functions',
        destination: '/docs/sem3/csi243/03-defining-functions/notes/defining-functions',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/03-defining-functions/output',
        destination: '/docs/sem3/csi243/03-defining-functions/notes/output',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/03-defining-functions/complete-program',
        destination: '/docs/sem3/csi243/03-defining-functions/notes/complete-program',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi243/03-defining-functions/input-processing',
        destination: '/docs/sem3/csi243/03-defining-functions/notes/input-processing',
        permanent: true,
      },
      // The CSI213 sub-topic pages are the lessons of their topic's Notes.
      ...[
        ['01-set-theory', ['definitions', 'algebra', 'combinatorics', 'summations']],
        ['02-probability', ['sample-space-events', 'axioms', 'outcomes']],
        ['03-conditional-probability', ['conditional-prob', 'laws-bayes', 'independent-events']],
        ['04-random-var-distributions', ['random-var', 'expectation-variance']],
        ['05-discrete-distributions', ['bernoulli-binomial', 'poisson', 'geometric-negative-binomial', 'hypergeometric']],
        ['06-continuous-distributions', ['continuous-exponential', 'normal-standardization', 'reliability-hazard']],
        ['07-regression-analysis', ['MLS-OLS', 'ANOVA']],
      ].flatMap(([topic, lessons]) => lessons.map((lesson) => ({
        source: `/docs/sem3/csi213/${topic}/${lesson}`,
        destination: `/docs/sem3/csi213/${topic}/notes/${lesson}`,
        permanent: true,
      }))),
      // The CSI323 topic folders are numbered, like every other course.
      ...[
        ['trees-and-bsts', '01-trees-and-bsts'],
        ['heaps-and-priority-queues', '02-heaps-and-priority-queues'],
        ['hash-tables', '03-hash-tables'],
        ['graphs', '04-graphs'],
      ].flatMap(([oldFolder, newFolder]) => ['', '/review', '/questions', '/resources'].map((page) => ({
        source: `/docs/sem5/csi323/${oldFolder}${page}`,
        destination: `/docs/sem5/csi323/${newFolder}${page}`,
        permanent: true,
      }))),
      // The CSI247 topic folders are numbered 01 to 13, like every other course. Each row: old folder, new folder, extra pages.
      ...[
        ['java-fundamentals', '01-java-fundamentals', ['/notes/arrays-and-objects', '/notes/classes-and-objects', '/notes/methods-parameters-scope', '/notes/strings-control-io', '/notes/values-primitives-references']],
        ['recursion', '02-recursion', []],
        ['time-complexity', '03-time-complexity', []],
        ['sorting-and-searching', '04-sorting-and-searching', ['/notes/binary-search', '/notes/bubble-and-selection-sort', '/notes/bubble-sort', '/notes/choosing-an-algorithm', '/notes/insertion-sort', '/notes/linear-search', '/notes/merge-sort', '/notes/selection-sort', '/cheat-sheet']],
        ['packages', '05-packages', ['/notes/built-in-packages-and-imports', '/notes/compiling-and-running', '/notes/creating-a-package', '/cheat-sheet']],
        ['object-oriented-programming', '06-object-oriented-programming', ['/notes/abstract-classes-and-interfaces', '/notes/inheritance-and-super', '/notes/overriding-and-polymorphism']],
        ['generics', '07-generics', ['/notes/bounds-and-comparable', '/notes/generic-classes', '/notes/generic-methods-and-interfaces', '/notes/why-generics', '/notes/wildcards-and-variance']],
        ['collections', '08-collections', ['/notes/choosing-a-collection', '/notes/core-interfaces', '/notes/framework-and-generics', '/notes/iteration-and-algorithms']],
        ['linked-lists-traversals', '09-linked-lists-traversals', []],
        ['stacks-and-queues', '10-stacks-and-queues', []],
      ].flatMap(([oldFolder, newFolder, extraPages]) => ['', '/review', '/questions', '/resources', ...extraPages].map((page) => ({
        source: `/docs/sem3/csi247/${oldFolder}${page}`,
        destination: `/docs/sem3/csi247/${newFolder}${page}`,
        permanent: true,
      }))),
      // CSI247 stops at stacks and queues. Hash tables, trees and graphs moved to CSI323 (Semester V), under both the old
      // unnumbered folder names and the numbered ones. Each row: CSI247 folder names, CSI323 topic, lessons that moved.
      ...[
        [['hash-tables', '11-hash-tables'], '03-hash-tables', ['hash-tables-in-java', 'hash-tables-by-example']],
        [['trees', '12-trees'], '01-trees-and-bsts', ['trees-and-bsts']],
        [['graphs', '13-graphs'], '04-graphs', ['graphs-and-traversals']],
      ].flatMap(([oldFolders, topic, lessons]) => oldFolders.flatMap((oldFolder) => ['', '/review', '/questions', '/resources', '/cheat-sheet', ...lessons.map((l) => `/notes/${l}`)].map((page) => ({
        source: `/docs/sem3/csi247/${oldFolder}${page}`,
        destination: `/docs/sem5/csi323/${topic}${page}`,
        permanent: true,
      })))),
      // Encapsulation and Abstraction became Encapsulation; abstraction is taught in Abstract Classes and Interfaces.
      ...['/docs/sem3/csi247/object-oriented-programming', '/docs/sem3/csi247/06-object-oriented-programming'].map((base) => ({
        source: `${base}/notes/encapsulation-and-abstraction`,
        destination: '/docs/sem3/csi247/06-object-oriented-programming/notes/encapsulation',
        permanent: true,
      })),
      // The overview and resources of the legacy Linear Structures folder repeated the linked-list and stack chapters.
      {
        source: '/docs/sem3/csi247/linear-structures',
        destination: '/docs/sem3/csi247/09-linked-lists-traversals',
        permanent: true,
      },
      {
        source: '/docs/sem3/csi247/linear-structures/resources',
        destination: '/docs/sem3/csi247/09-linked-lists-traversals/resources',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const mat221VideoFiles = [
      'mat221-lesson67-review.mp4',
      'mat221-lesson67-review.vtt',
    ];
    const mat221PosterFiles = [
      'mat221-lesson67-poster.png',
    ];
    const mat221VisualFiles = [
      'applications-washer.svg',
      'foundations-area.svg',
      'improper-limit.svg',
      'lhopital-rates.svg',
      'numerical-rules.svg',
      'partials-split.svg',
      'parts-tabular.svg',
      'power-interval.svg',
      'series-tests.svg',
      'substitution-u.svg',
      'taylor-fit.svg',
      'trig-triangle.svg',
    ];

    return [
      ...mat221VideoFiles.map((file) => ({ source: `/videos/${file}`, destination: `/videos/sem3/mat221/${file}` })),
      ...mat221PosterFiles.map((file) => ({ source: `/videos/${file}`, destination: `/images/sem3/mat221/video-posters/${file}` })),
      ...mat221VisualFiles.map((file) => ({ source: `/visuals/${file}`, destination: `/images/sem3/mat221/diagrams/${file}` })),
    ];
  },
};

export default withMDX(config);
