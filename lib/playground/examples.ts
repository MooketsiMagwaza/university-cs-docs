import type { PlaygroundLanguage } from './runners';

// Examples and seed datasets are data, not code: see content/playground-data and lib/playground/data.ts.

export const LANGUAGE_META: Record<PlaygroundLanguage, { name: string; fileHint: string; tagline: string }> = {
  html: { name: 'HTML & CSS', fileHint: 'index.html', tagline: 'Edit the page and see it rendered live.' },
  javascript: { name: 'JavaScript', fileHint: 'script.js', tagline: 'Runs in a sandboxed worker. console.log writes to the output.' },
  python: { name: 'Python', fileHint: 'main.py', tagline: 'Real CPython (Pyodide) running in your browser.' },
  sql: { name: 'SQL', fileHint: 'query.sql', tagline: 'A real SQLite database, rebuilt from your script on every run.' },
};
