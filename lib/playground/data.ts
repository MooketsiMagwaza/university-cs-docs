/**
 * Playground examples and seed datasets live in JSON files under content/playground-data, one file per language.
 * This module loads them and turns each `code` value (a string, or an array with one entry per line) into text.
 *
 * A seed is a dataset that runs invisibly before the learner's code: SQL tables and rows, Python variables
 * or JavaScript constants. An example may name the seed it needs.
 */
import htmlData from '@/content/playground-data/html.json';
import javascriptData from '@/content/playground-data/javascript.json';
import pythonData from '@/content/playground-data/python.json';
import sqlData from '@/content/playground-data/sql.json';
import haskellData from '@/content/playground-data/haskell.json';
import type { PlaygroundLanguage } from './runners';

type RawCode = string | string[];
type RawFile = {
  language: string;
  seeds: { id: string; label: string; description: string; code: RawCode }[];
  examples: { id: string; label: string; code: RawCode; seed?: string; stdin?: string }[];
};

export type PlaygroundSeed = { id: string; label: string; description: string; code: string };
export type PlaygroundExample = { id: string; label: string; code: string; seed?: string; stdin?: string };
export type PlaygroundData = { seeds: PlaygroundSeed[]; examples: PlaygroundExample[] };

const toText = (code: RawCode) => (Array.isArray(code) ? code.join('\n') : code);

function normalise(file: RawFile): PlaygroundData {
  return {
    seeds: file.seeds.map((seed) => ({ ...seed, code: toText(seed.code) })),
    examples: file.examples.map((example) => ({ ...example, code: toText(example.code) })),
  };
}

const DATA: Record<PlaygroundLanguage | 'haskell', PlaygroundData> = {
  html: normalise(htmlData as unknown as RawFile),
  javascript: normalise(javascriptData as unknown as RawFile),
  python: normalise(pythonData as unknown as RawFile),
  sql: normalise(sqlData as unknown as RawFile),
  haskell: normalise(haskellData as unknown as RawFile),
};

export const getPlaygroundData = (language: PlaygroundLanguage | 'haskell') => DATA[language];
