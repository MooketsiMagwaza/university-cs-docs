'use client';

import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';

/** `next/dynamic` typed as the plain function component the MDX components map expects. */
const lazy = <Props extends object>(load: () => Promise<ComponentType<Props>>) => dynamic(load) as unknown as (props: Props) => ReactNode;

/**
 * The large interactive components, loaded only by the pages that use them (PERF-01).
 *
 * `components/mdx.tsx` gives every docs page the whole set of components that MDX can use. A server file that imports a
 * client component adds that component's code to the first load of every page that uses the file, whether or not the
 * page shows the component, and `next/dynamic` in a server file does not split it. A client file can: each component
 * below is its own chunk, the server still renders it into the HTML, and the browser downloads the chunk only on a
 * page where the component appears. Before this file the first load of every docs page carried the Haskell interpreter
 * (about 100 KB), the animation library (about 130 KB) and the code of every explorer, story and simulation.
 *
 * Add a component here when it is large, has dependencies of its own (a library, a data module) and appears on few pages.
 */

export const HaskellPlayground = lazy(() => import('./haskell-playground').then((module_) => module_.HaskellPlayground));
export const HaskellTryIt = lazy(() => import('./haskell-try-it').then((module_) => module_.HaskellTryIt));
export const CodePlayground = lazy(() => import('./code-playground').then((module_) => module_.CodePlayground));
export const CodeTryIt = lazy(() => import('./code-try-it').then((module_) => module_.CodeTryIt));
export const JavaPlayground = lazy(() => import('./java-playground').then((module_) => module_.JavaPlayground));
export const JavaTryIt = lazy(() => import('./java-try-it').then((module_) => module_.JavaTryIt));

export const InsertionSortStory = lazy(() => import('./insertion-sort-story').then((module_) => module_.InsertionSortStory));
export const BinarySearchStory = lazy(() => import('./search-stories').then((module_) => module_.BinarySearchStory));
export const LinearSearchStory = lazy(() => import('./search-stories').then((module_) => module_.LinearSearchStory));
export const BubbleSortStory = lazy(() => import('./simple-sort-stories').then((module_) => module_.BubbleSortStory));
export const SelectionSortStory = lazy(() => import('./simple-sort-stories').then((module_) => module_.SelectionSortStory));
export const MergeSortStory = lazy(() => import('./merge-sort-story').then((module_) => module_.MergeSortStory));
export const MergeComplexityFigure = lazy(() => import('./merge-sort-deep-dive').then((module_) => module_.MergeComplexityFigure));
export const MergeFrontWorkbench = lazy(() => import('./merge-sort-deep-dive').then((module_) => module_.MergeFrontWorkbench));
export const MergeRecursionExplorer = lazy(() => import('./merge-sort-deep-dive').then((module_) => module_.MergeRecursionExplorer));
export const PackageBuildStory = lazy(() => import('./package-stories').then((module_) => module_.PackageBuildStory));
export const PackageFolderStory = lazy(() => import('./package-stories').then((module_) => module_.PackageFolderStory));
export const PackageImportStory = lazy(() => import('./package-stories').then((module_) => module_.PackageImportStory));

export const DistributionExplorer = lazy(() => import('./distribution-explorer').then((module_) => module_.DistributionExplorer));
export const Simulation = lazy(() => import('./simulation').then((module_) => module_.Simulation));
export const VennDiagram = lazy(() => import('./venn-diagram').then((module_) => module_.VennDiagram));
export const ProbabilityTree = lazy(() => import('./probability-tree').then((module_) => module_.ProbabilityTree));
export const CountingCalculator = lazy(() => import('./counting-calculator').then((module_) => module_.CountingCalculator));
export const Visualise = lazy(() => import('./function-visual').then((module_) => module_.Visualise));
export const RegressionPlot = lazy(() => import('./regression-plot').then((module_) => module_.RegressionPlot));

export const MemoryDiagram = lazy(() => import('./memory-diagram').then((module_) => module_.MemoryDiagram));
export const ResourceHub = lazy(() => import('./resource-hub').then((module_) => module_.ResourceHub));
