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
