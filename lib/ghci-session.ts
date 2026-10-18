/**
 * A GHCi session as a reader sees it: each command after a `ghci>` prompt, then what it printed.
 *
 * The interpreter (lib/haskell-simulator.ts) prints only the results of a session. To show the transcript, the commands
 * are replayed one more at a time and what each new command added to the output is put under its prompt. A session is
 * short, so the repeated runs cost nothing.
 */

export type SessionLine = { stream: 'in' | 'out' | 'err'; text: string };

export type SessionRunResult = {
  ok: boolean;
  output: string;
  elapsedMs: number;
  diagnostic?: { kind?: string; line?: number; column?: number; message: string; hint?: string };
};

export type SessionResult = {
  lines: SessionLine[];
  ok: boolean;
  elapsedMs: number;
  /** The command that failed, with the interpreter's message, when ok is false. */
  failure?: { command: string; kind?: string; message: string; hint?: string };
};

/** The commands of a session text: prompts removed, blank lines dropped, one command per line. */
export function sessionCommands(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*ghci>\s*/, '').replace(/\s+$/, ''))
    .filter((line) => line.trim() !== '');
}

/** What a transcript line is: a prompt line or a result. Used to colour the transcript the page shows. */
export function transcriptStream(line: string): 'in' | 'out' {
  return /^ghci>/.test(line) ? 'in' : 'out';
}

/** Replays the commands one more at a time with `run` and builds the transcript. Stops at the first command that fails. */
export function runSession(commands: string[], run: (code: string) => SessionRunResult): SessionResult {
  const lines: SessionLine[] = [];
  let previous = '';
  let elapsedMs = 0;
  for (let index = 0; index < commands.length; index += 1) {
    const result = run(commands.slice(0, index + 1).join('\n'));
    elapsedMs += result.elapsedMs;
    lines.push({ stream: 'in', text: `ghci> ${commands[index]}` });
    if (!result.ok) {
      const message = result.diagnostic?.message ?? 'The command could not be run.';
      for (const text of message.split('\n')) lines.push({ stream: 'err', text });
      return { lines, ok: false, elapsedMs, failure: { command: commands[index], kind: result.diagnostic?.kind, message, hint: result.diagnostic?.hint } };
    }
    // The output only ever grows: what this command printed is whatever came after the previous output.
    const added = result.output.startsWith(previous) ? result.output.slice(previous.length).replace(/^\n/, '') : result.output;
    if (added !== '') for (const text of added.split('\n')) lines.push({ stream: 'out', text });
    previous = result.output;
  }
  return { lines, ok: true, elapsedMs };
}
