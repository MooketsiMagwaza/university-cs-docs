// The study timer's logic: the reducer, the saved state and its migration, the claims that keep two tabs from both
// ringing and both crediting a block, the schedule, and the synthesised alarm sounds.
// Run with: node --no-warnings --experimental-strip-types --test tests/unit/study-timer.test.mjs

// The site is used in Botswana (UTC+2). Setting the zone first makes the local-day tests mean something on any machine.
process.env.TZ = 'Africa/Gaborone';

import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as nodeModule from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// The timer's source files import each other without a file extension, as the bundler allows. Node needs the
// extension, so resolve those imports to the .ts files here instead of changing the source.
const addExtension = (specifier, parentURL) => {
  if (!specifier.startsWith('.') || path.extname(specifier) || !parentURL) return null;
  const file = fileURLToPath(new URL(`${specifier}.ts`, parentURL));
  return fs.existsSync(file) ? `${specifier}.ts` : null;
};
if (typeof nodeModule.registerHooks === 'function') {
  nodeModule.registerHooks({
    resolve: (specifier, context, nextResolve) => nextResolve(addExtension(specifier, context.parentURL) ?? specifier, context),
  });
} else {
  // Node 22 before 22.15 has only the asynchronous hooks.
  nodeModule.register(`data:text/javascript,${encodeURIComponent(`
    import fs from 'node:fs';
    import path from 'node:path';
    import { fileURLToPath } from 'node:url';
    export function resolve(specifier, context, nextResolve) {
      if (specifier.startsWith('.') && !path.extname(specifier) && context.parentURL) {
        const file = fileURLToPath(new URL(specifier + '.ts', context.parentURL));
        if (fs.existsSync(file)) return nextResolve(specifier + '.ts', context);
      }
      return nextResolve(specifier, context);
    }
  `)}`);
}

const dir = '../../features/study-timer/';
const types = await import(`${dir}timer-types.ts`);
const { timerReducer } = await import(`${dir}timer-reducer.ts`);
const storage = await import(`${dir}timer-storage.ts`);
const schedule = await import(`${dir}timer-schedule.ts`);
const { claimOnce, TIMER_CLAIMS_KEY } = await import(`${dir}timer-claims.ts`);
const { synthesizeTone } = await import(`${dir}timer-sounds.ts`);
const { isTimerTitle, timerTitle } = await import(`${dir}timer-title.ts`);
const dom = await import(`${dir}timer-dom.ts`);

const { defaultTimerSettings, timerDateKey, utcDateKey, normalizeSetting, normalizeSettings, timerTones } = types;
const { createInitialTimerState, hydrateTimer, parseSavedTimer, serializeTimer, TIMER_STORAGE_VERSION } = storage;
const { CLAIM_GRACE_MS, FORCE_AFTER_MS, afterLostClaim, nextDeadline, planTick } = schedule;

/** A local time, written as the reader would read it on a clock. */
const local = (year, month, day, hour = 0, minute = 0, second = 0) =>
  new Date(year, month - 1, day, hour, minute, second).getTime();

const state = (overrides = {}) => ({ ...createInitialTimerState(), ready: true, ...overrides });
const withSettings = (settings, overrides = {}) =>
  state({ settings: { ...defaultTimerSettings, ...settings }, ...overrides });
const running = (endAt, overrides = {}) =>
  state({ endAt, left: 60, date: timerDateKey(endAt), ...overrides });

/** A fake localStorage that several tabs can share. */
function fakeStorage() {
  const values = new Map();
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => void values.set(key, String(value)),
    values,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// TIM-02 (1): the day is the local day
// ---------------------------------------------------------------------------------------------------------------

test('the timer day is the local calendar day, not the UTC date', () => {
  const justAfterMidnight = new Date(2026, 9, 17, 0, 30); // 00:30 on 17 October, local time
  assert.equal(timerDateKey(justAfterMidnight), '2026-10-17');
  assert.equal(timerDateKey(local(2026, 10, 17, 23, 59)), '2026-10-17');
  if (justAfterMidnight.getTimezoneOffset() < 0) {
    // East of UTC (Botswana is UTC+2): the UTC date is still the 16th, which is what the old key used.
    assert.equal(utcDateKey(justAfterMidnight), '2026-10-16');
    assert.notEqual(timerDateKey(justAfterMidnight), justAfterMidnight.toISOString().slice(0, 10));
  }
});

test('a focus block that ends at 00:30 local time starts the new day with one block', () => {
  const endAt = local(2026, 10, 17, 0, 30);
  const before = running(endAt, { date: '2026-10-16', completedBlocks: 3, focusedMinutes: 75 });
  const after = timerReducer(before, { type: 'tick', now: endAt });
  assert.equal(after.date, '2026-10-17');
  assert.equal(after.completedBlocks, 1);
  assert.equal(after.focusedMinutes, 25);
  assert.equal(after.blocks.length, 1);
});

test('a focus block that ends before local midnight adds to the same day', () => {
  const endAt = local(2026, 10, 16, 23, 40);
  const before = running(endAt, { date: '2026-10-16', completedBlocks: 3, focusedMinutes: 75 });
  const after = timerReducer(before, { type: 'tick', now: endAt });
  assert.equal(after.date, '2026-10-16');
  assert.equal(after.completedBlocks, 4);
  assert.equal(after.focusedMinutes, 100);
});

test('the counters roll over at local midnight while the page sits idle', () => {
  const idle = state({ date: '2026-10-16', completedBlocks: 4, focusedMinutes: 100, blocks: [{ id: 'a', at: local(2026, 10, 16, 20), minutes: 25, label: '' }] });
  const same = timerReducer(idle, { type: 'day', now: local(2026, 10, 16, 23, 59) });
  assert.equal(same, idle);
  const next = timerReducer(idle, { type: 'day', now: local(2026, 10, 17, 0, 1) });
  assert.deepEqual([next.date, next.completedBlocks, next.focusedMinutes, next.blocks.length], ['2026-10-17', 0, 0, 0]);
});

// ---------------------------------------------------------------------------------------------------------------
// The reducer: finishing a block
// ---------------------------------------------------------------------------------------------------------------

test('a finished focus block moves to a short break, counts once and starts an alarm', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const before = running(endAt, { label: 'Linked lists' });
  const after = timerReducer(before, { type: 'tick', now: endAt + 300 });
  assert.equal(after.phase, 'short');
  assert.equal(after.left, 5 * 60);
  assert.equal(after.endAt, null);
  assert.equal(after.round, 2);
  assert.equal(after.completedBlocks, 1);
  assert.deepEqual(after.blocks.map((block) => [block.minutes, block.label]), [[25, 'Linked lists']]);
  assert.deepEqual(
    [after.alarm.id, after.alarm.finished, after.alarm.next, after.alarm.rings, after.alarm.snoozeUntil],
    [`done:${endAt}`, 'focus', 'short', 1, null],
  );
  assert.deepEqual(
    [after.event.kind, after.event.id, after.event.ring, after.event.minutes, after.event.label],
    ['complete', `done:${endAt}`, 'loop', 25, 'Linked lists'],
  );
});

test('the last focus block of a cycle leads to the long break and starts the next cycle', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const after = timerReducer(running(endAt, { round: 4 }), { type: 'tick', now: endAt });
  assert.equal(after.phase, 'long');
  assert.equal(after.round, 1);
});

test('a finished break credits no focus minutes and adds no block', () => {
  const endAt = local(2026, 10, 17, 10, 5);
  const after = timerReducer(running(endAt, { phase: 'short', round: 2 }), { type: 'tick', now: endAt });
  assert.equal(after.phase, 'focus');
  assert.equal(after.round, 2);
  assert.equal(after.completedBlocks, 0);
  assert.equal(after.blocks.length, 0);
  assert.equal(after.event.minutes, 0);
});

test('two tabs that finish the same block compute the same result', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const tabA = timerReducer(running(endAt), { type: 'tick', now: endAt + 10, owner: 'a' });
  const tabB = timerReducer(running(endAt), { type: 'tick', now: endAt + 10, owner: 'b' });
  assert.deepEqual(tabA, tabB);
});

test('when the next block starts by itself the tone plays once and there is no alarm to dismiss', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const before = withSettings({ autoBreak: true }, { endAt, left: 60, date: timerDateKey(endAt) });
  const after = timerReducer(before, { type: 'tick', now: endAt + 50, owner: 'tab-1' });
  assert.equal(after.alarm, null);
  assert.equal(after.event.ring, 'once');
  assert.equal(after.endAt, endAt + 50 + 5 * 60 * 1000);
  assert.equal(after.owner, 'tab-1');
});

test('a tab waiting for the owner only shows 00:00; it does not finish the block', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const before = running(endAt);
  const held = timerReducer(before, { type: 'tick', now: endAt + 100, complete: false });
  assert.equal(held.left, 0);
  assert.equal(held.endAt, endAt);
  assert.equal(held.completedBlocks, 0);
  assert.equal(held.event, null);
});

test('time left comes from the end time, so a late tick shows the right time', () => {
  const endAt = local(2026, 10, 17, 10, 25);
  const before = running(endAt, { left: 1500 });
  // A background tab ticks once, a long time after the previous tick.
  const late = timerReducer(before, { type: 'tick', now: endAt - 600_000 });
  assert.equal(late.left, 600);
  const ending = timerReducer(late, { type: 'tick', now: endAt - 1 });
  assert.equal(ending.left, 1);
});

// ---------------------------------------------------------------------------------------------------------------
// The reducer: alarm, snooze, warning, label, settings
// ---------------------------------------------------------------------------------------------------------------

function ringing() {
  const endAt = local(2026, 10, 17, 10, 0);
  return timerReducer(running(endAt), { type: 'tick', now: endAt });
}

test('snooze silences the alarm until later, and it rings again only once the time has come', () => {
  const now = local(2026, 10, 17, 10, 0);
  const snoozed = timerReducer(ringing(), { type: 'snooze', minutes: 5, now });
  assert.equal(snoozed.alarm.snoozeUntil, now + 5 * 60_000);

  const tooSoon = timerReducer(snoozed, { type: 'wake', now: now + 60_000 });
  assert.equal(tooSoon, snoozed);

  const woken = timerReducer(snoozed, { type: 'wake', now: now + 5 * 60_000 });
  assert.equal(woken.alarm.snoozeUntil, null);
  assert.equal(woken.alarm.rings, 2);
  assert.equal(woken.event.kind, 'wake');
  assert.equal(woken.event.id, `ring:${snoozed.alarm.id}#2`);
});

test('dismissing clears the alarm, and so does starting the next block', () => {
  assert.equal(timerReducer(ringing(), { type: 'dismiss-alarm' }).alarm, null);
  const started = timerReducer(ringing(), { type: 'toggle', now: local(2026, 10, 17, 10, 1), owner: 'a' });
  assert.equal(started.alarm, null);
  assert.notEqual(started.endAt, null);
  assert.equal(timerReducer(ringing(), { type: 'skip' }).alarm, null);
  assert.equal(timerReducer(ringing(), { type: 'reset' }).alarm, null);
});

test('the one-minute warning is given once per run, by the tab that claimed it', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const before = withSettings({ warn: true }, { endAt, left: 60, date: timerDateKey(endAt) });
  const warned = timerReducer(before, { type: 'tick', now: endAt - 59_000, warn: true });
  assert.equal(warned.warned, true);
  assert.equal(warned.event.kind, 'warn');
  assert.equal(warned.event.id, `warn:${endAt}`);
  const again = timerReducer(warned, { type: 'tick', now: endAt - 58_000, warn: true });
  assert.equal(again.event, warned.event);
  // The warning does not finish the block.
  assert.equal(warned.endAt, endAt);
});

test('starting or resuming inside the last minute gives no warning', () => {
  const now = local(2026, 10, 17, 10, 0);
  assert.equal(timerReducer(state({ left: 40 }), { type: 'toggle', now, owner: 'a' }).warned, true);
  assert.equal(timerReducer(state({ left: 25 * 60 }), { type: 'toggle', now, owner: 'a' }).warned, false);
  const live = withSettings({ warn: true }, { endAt: now + 40_000, left: 40, warned: true, owner: 'a' });
  assert.equal(planTick(live, now + 1000, 'a').kind, 'update');
});

test('the label is kept to its limit and carried onto the finished block', () => {
  const labelled = timerReducer(state(), { type: 'set-label', label: 'x'.repeat(200) });
  assert.equal(labelled.label.length, types.MAX_LABEL_LENGTH);
});

test('settings are clamped, the sound choice is validated, and the volume can reach zero', () => {
  assert.equal(normalizeSetting('focus', 500), 90);
  assert.equal(normalizeSetting('focus', 0), 1);
  assert.equal(normalizeSetting('focus', ''), 1);
  assert.equal(normalizeSetting('rounds', 50), 8);
  assert.equal(normalizeSetting('volume', 0), 0);
  assert.equal(normalizeSetting('volume', 400), 100);
  assert.equal(normalizeSetting('tone', 'siren'), defaultTimerSettings.tone);
  assert.equal(normalizeSetting('tone', 'soft'), 'soft');
  assert.equal(normalizeSetting('warn', true), true);

  const louder = timerReducer(state(), { type: 'change-setting', key: 'volume', value: 35 });
  assert.equal(louder.settings.volume, 35);
  const tone = timerReducer(state(), { type: 'change-setting', key: 'tone', value: 'beep' });
  assert.equal(tone.settings.tone, 'beep');
  const length = timerReducer(state(), { type: 'change-setting', key: 'focus', value: 40 });
  assert.equal(length.left, 40 * 60);
  const restored = timerReducer(length, { type: 'restore-defaults' });
  assert.deepEqual(restored.settings, defaultTimerSettings);
});

test('state saved by another tab keeps this tab\'s dialogs and its unhandled event', () => {
  const mine = state({ settingsOpen: true, event: { seq: 4, kind: 'warn', id: 'warn:1' }, eventSeq: 4 });
  const theirs = state({ phase: 'long', left: 900, eventSeq: 0 });
  const merged = timerReducer(mine, { type: 'remote', state: theirs });
  assert.equal(merged.phase, 'long');
  assert.equal(merged.settingsOpen, true);
  assert.equal(merged.eventSeq, 4);
  assert.equal(merged.event.id, 'warn:1');
});

test('closing the overlay shuts settings and full screen together, and does nothing when neither is open', () => {
  const open = state({ settingsOpen: true });
  const closed = timerReducer(open, { type: 'close-overlay' });
  assert.deepEqual([closed.settingsOpen, closed.fullscreenOpen], [false, false]);
  const idle = state();
  assert.equal(timerReducer(idle, { type: 'close-overlay' }), idle);
});

// ---------------------------------------------------------------------------------------------------------------
// TIM-02 (4) and (6): who acts, and when
// ---------------------------------------------------------------------------------------------------------------

test('the tab that started the run acts at the end; others wait out the grace period', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const live = running(endAt, { owner: 'tab-a' });
  assert.deepEqual(planTick(live, endAt - 5000, 'tab-a'), { kind: 'update' });
  assert.deepEqual(planTick(live, endAt, 'tab-a'), { kind: 'complete', claim: `done:${endAt}` });
  assert.deepEqual(planTick(live, endAt + 500, 'tab-b'), { kind: 'hold' });
  assert.deepEqual(planTick(live, endAt + CLAIM_GRACE_MS, 'tab-b'), { kind: 'complete', claim: `done:${endAt}` });
});

test('a run with no owner is open to every tab', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  assert.equal(planTick(running(endAt, { owner: null }), endAt, 'tab-z').kind, 'complete');
});

test('two tabs, one credit: only the tab that wins the claim records the block and rings', () => {
  const storageA = fakeStorage();
  const endAt = local(2026, 10, 17, 10, 0);
  const live = running(endAt, { owner: 'tab-a' });
  const credited = [];

  for (const [tab, at] of [['tab-a', endAt + 20], ['tab-b', endAt + CLAIM_GRACE_MS + 20]]) {
    const plan = planTick(live, at, tab);
    if (plan.kind === 'complete' && claimOnce(storageA, plan.claim, tab, at)) credited.push(tab);
  }
  assert.deepEqual(credited, ['tab-a']);
});

test('if the owning tab is gone, another tab takes over after the grace period, still only once', () => {
  const shared = fakeStorage();
  const endAt = local(2026, 10, 17, 10, 0);
  const live = running(endAt, { owner: 'tab-gone' });
  const credited = [];
  for (const tab of ['tab-b', 'tab-c']) {
    const at = endAt + CLAIM_GRACE_MS + 5;
    const plan = planTick(live, at, tab);
    assert.equal(plan.kind, 'complete');
    if (claimOnce(shared, plan.claim, tab, at)) credited.push(tab);
  }
  assert.deepEqual(credited, ['tab-b']);
});

test('a tab that lost the claim waits for the winner\'s saved state, then finishes without effects', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const live = running(endAt);
  assert.equal(afterLostClaim(live, endAt + 1000), 'hold');
  assert.equal(afterLostClaim(live, endAt + FORCE_AFTER_MS), 'force');
});

test('a snoozed alarm wakes in the owner first, and everyone else after the grace period', () => {
  const now = local(2026, 10, 17, 10, 0);
  const snoozed = timerReducer(ringing(), { type: 'snooze', minutes: 1, now });
  const withOwner = { ...snoozed, owner: 'tab-a' };
  const due = now + 60_000;
  assert.equal(planTick(withOwner, due - 1, 'tab-a').kind, 'idle');
  assert.equal(planTick(withOwner, due, 'tab-a').kind, 'wake');
  assert.equal(planTick(withOwner, due, 'tab-b').kind, 'idle');
  assert.equal(planTick(withOwner, due + CLAIM_GRACE_MS, 'tab-b').kind, 'wake');
});

test('the warning is planned only when the setting is on, once the last minute begins', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const off = running(endAt, { owner: 'a' });
  const on = withSettings({ warn: true }, { endAt, left: 90, owner: 'a' });
  assert.equal(planTick(off, endAt - 30_000, 'a').kind, 'update');
  assert.equal(planTick(on, endAt - 90_000, 'a').kind, 'update');
  assert.deepEqual(planTick(on, endAt - 60_000, 'a'), { kind: 'warn', claim: `warn:${endAt}` });
});

test('the next wake-up is a timestamp, so the alarm does not depend on a throttled tick', () => {
  const endAt = local(2026, 10, 17, 10, 0);
  const warn = withSettings({ warn: true }, { endAt, left: 600, owner: 'a' });
  const plain = running(endAt, { owner: 'a' });
  // The first moment worth waking for is the warning, then the end itself.
  assert.equal(nextDeadline(warn, endAt - 5 * 60_000), endAt - 60_000);
  assert.equal(nextDeadline(plain, endAt - 5 * 60_000), endAt);
  // Once the end has passed, the grace period and the give-up time are still ahead.
  assert.equal(nextDeadline(plain, endAt + 1), endAt + CLAIM_GRACE_MS);
  assert.equal(nextDeadline(plain, endAt + CLAIM_GRACE_MS + 1), endAt + FORCE_AFTER_MS);
  assert.equal(nextDeadline(plain, endAt + FORCE_AFTER_MS + 1), null);
  assert.equal(nextDeadline(state(), endAt), null);
  const snoozed = timerReducer(ringing(), { type: 'snooze', minutes: 5, now: endAt });
  assert.equal(nextDeadline(snoozed, endAt), endAt + 5 * 60_000);
});

test('a late check reaches the same plan as an on-time one', () => {
  // A laptop that slept: the tab wakes up long after the end and still completes the block, once.
  const endAt = local(2026, 10, 17, 10, 0);
  const live = running(endAt, { owner: 'a' });
  const wokeLate = planTick(live, endAt + 45 * 60_000, 'a');
  assert.deepEqual(wokeLate, { kind: 'complete', claim: `done:${endAt}` });
  const done = timerReducer(live, { type: 'tick', now: endAt + 45 * 60_000 });
  assert.equal(done.completedBlocks, 1);
});

// ---------------------------------------------------------------------------------------------------------------
// Claims
// ---------------------------------------------------------------------------------------------------------------

test('a claim is won by exactly one caller', () => {
  const store = fakeStorage();
  assert.equal(claimOnce(store, 'done:1', 'a', 1000), true);
  assert.equal(claimOnce(store, 'done:1', 'b', 1001), false);
  assert.equal(claimOnce(store, 'done:1', 'a', 1002), false);
  assert.equal(claimOnce(store, 'done:2', 'b', 1003), true);
});

test('when two tabs write at the same moment, only the one whose note survives wins', () => {
  const store = fakeStorage();
  // The other tab writes between this tab's write and its read-back.
  const racing = {
    getItem: (key) => store.getItem(key),
    setItem: (key, value) => {
      store.setItem(key, value);
      store.setItem(key, JSON.stringify([{ id: 'done:9', by: 'other', at: 1 }]));
    },
  };
  assert.equal(claimOnce(racing, 'done:9', 'me', 1), false);
});

test('old claims are forgotten, so the list stays short', () => {
  const store = fakeStorage();
  for (let index = 0; index < 60; index += 1) claimOnce(store, `done:${index}`, 'a', index);
  assert.ok(JSON.parse(store.getItem(TIMER_CLAIMS_KEY)).length <= 24);
});

test('a broken or unavailable store never blocks the timer', () => {
  const broken = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
  assert.equal(claimOnce(broken, 'done:1', 'a', 1), true);
  assert.equal(claimOnce(fakeStorageWith('not json'), 'done:1', 'a', 1), true);

  function fakeStorageWith(text) {
    const store = fakeStorage();
    store.setItem(TIMER_CLAIMS_KEY, text);
    return store;
  }
});

// ---------------------------------------------------------------------------------------------------------------
// Saved state: version 3, and old saves keep working
// ---------------------------------------------------------------------------------------------------------------

const NOW = local(2026, 10, 17, 9, 0);

test('a save from the first version (no version field) still loads, with the new settings at their defaults', () => {
  const v2 = {
    phase: 'short',
    left: 120,
    endAt: null,
    round: 3,
    completedBlocks: 2,
    focusedMinutes: 50,
    date: '2026-10-17',
    settings: { focus: 30, short: 5, long: 15, rounds: 4, autoBreak: true, autoFocus: false, sound: false },
  };
  const loaded = hydrateTimer(parseSavedTimer(JSON.stringify(v2)), NOW);
  assert.equal(loaded.ready, true);
  assert.equal(loaded.phase, 'short');
  assert.equal(loaded.left, 120);
  assert.equal(loaded.round, 3);
  assert.equal(loaded.settings.focus, 30);
  assert.equal(loaded.settings.autoBreak, true);
  assert.equal(loaded.settings.sound, false);
  // New settings take their defaults.
  assert.equal(loaded.settings.tone, defaultTimerSettings.tone);
  assert.equal(loaded.settings.volume, defaultTimerSettings.volume);
  assert.equal(loaded.settings.warn, false);
  assert.equal(loaded.settings.notify, false);
  assert.equal(loaded.completedBlocks, 2);
  assert.equal(loaded.focusedMinutes, 50);
  assert.deepEqual([loaded.label, loaded.blocks, loaded.alarm, loaded.owner], ['', [], null, null]);
});

test('a first-version save from before the local-day fix keeps its counts when its UTC date is still today in UTC', () => {
  // Saved at 01:30 local on the 17th: the old key said 2026-10-16 (UTC). Loading at 01:40 local must not lose the count.
  const at = local(2026, 10, 17, 1, 40);
  const saved = { date: '2026-10-16', completedBlocks: 2, focusedMinutes: 50 };
  if (utcDateKey(at) === '2026-10-16') {
    assert.equal(hydrateTimer(parseSavedTimer(JSON.stringify(saved)), at).completedBlocks, 2);
  }
  // A version 3 save is always a local date, so the same text from version 3 is yesterday.
  const v3 = { ...saved, version: 3 };
  assert.equal(hydrateTimer(parseSavedTimer(JSON.stringify(v3)), at).completedBlocks, 0);
});

test('the very oldest save format (a single "today" count) still loads', () => {
  const loaded = hydrateTimer(parseSavedTimer(JSON.stringify({ today: 3, date: '2026-10-17' })), NOW);
  assert.equal(loaded.completedBlocks, 3);
  assert.equal(loaded.focusedMinutes, 3 * defaultTimerSettings.focus);
});

test('a save from an earlier day starts the counters at zero', () => {
  const saved = { version: 3, date: '2026-10-16', completedBlocks: 5, focusedMinutes: 125, blocks: [{ id: 'x', at: local(2026, 10, 16, 12), minutes: 25, label: 'a' }] };
  const loaded = hydrateTimer(parseSavedTimer(JSON.stringify(saved)), NOW);
  assert.deepEqual([loaded.completedBlocks, loaded.focusedMinutes, loaded.blocks.length, loaded.date], [0, 0, 0, '2026-10-17']);
});

test('saving then loading gives the same state back, and loading again changes nothing', () => {
  const endAt = local(2026, 10, 17, 9, 25);
  const live = hydrateTimer({}, NOW);
  const original = {
    ...live,
    phase: 'focus',
    endAt,
    left: 1500,
    round: 2,
    completedBlocks: 1,
    focusedMinutes: 25,
    date: '2026-10-17',
    label: 'Recursion',
    owner: 'tab-a',
    warned: false,
    settings: { ...defaultTimerSettings, tone: 'soft', volume: 35, warn: true, notify: true },
    blocks: [{ id: 'done:1', at: local(2026, 10, 17, 8, 30), minutes: 25, label: 'Trees' }],
    alarm: { id: 'done:1', finished: 'focus', next: 'short', rings: 2, snoozeUntil: NOW + 60_000, at: NOW - 1000 },
  };
  const text = serializeTimer(original);
  const saved = JSON.parse(text);
  assert.equal(saved.version, TIMER_STORAGE_VERSION);
  assert.equal(saved.left, null, 'the time left is not saved while a run is going, so the text does not change every second');

  const loaded = hydrateTimer(parseSavedTimer(text), NOW);
  assert.equal(loaded.endAt, endAt);
  assert.equal(loaded.left, Math.ceil((endAt - NOW) / 1000));
  assert.deepEqual(loaded.settings, original.settings);
  assert.equal(loaded.label, 'Recursion');
  assert.deepEqual(loaded.blocks, original.blocks);
  assert.deepEqual(loaded.alarm, original.alarm);
  assert.equal(loaded.owner, 'tab-a');

  // A fixed point: tabs that take each other's saves settle at once instead of rewriting forever.
  assert.equal(serializeTimer(hydrateTimer(parseSavedTimer(serializeTimer(loaded)), NOW)), serializeTimer(loaded));
  const paused = { ...loaded, endAt: null, warned: true };
  const reread = hydrateTimer(parseSavedTimer(serializeTimer(paused)), NOW);
  assert.equal(serializeTimer(reread), serializeTimer(paused));
});

test('a run that already ended is dropped on load, but kept when another tab just wrote it', () => {
  const endAt = NOW - 5000;
  const saved = parseSavedTimer(JSON.stringify({ version: 3, phase: 'focus', endAt, left: null, date: '2026-10-17' }));
  const fresh = hydrateTimer(saved, NOW);
  assert.equal(fresh.endAt, null);
  assert.equal(fresh.left, defaultTimerSettings.focus * 60, 'it starts the phase again instead of showing a stale few seconds');
  assert.equal(hydrateTimer(saved, NOW, { keepExpired: true }).endAt, endAt);
});

test('a run that is far in the future is treated as damage', () => {
  const saved = parseSavedTimer(JSON.stringify({ version: 3, endAt: NOW + 30 * 24 * 3600_000 }));
  assert.equal(hydrateTimer(saved, NOW).endAt, null);
});

test('an alarm nobody dismissed for an hour is dropped on load', () => {
  const alarm = { id: 'done:1', finished: 'focus', next: 'short', rings: 1, snoozeUntil: null, at: NOW - 2 * 3600_000 };
  assert.equal(hydrateTimer(parseSavedTimer(JSON.stringify({ version: 3, alarm })), NOW).alarm, null);
  const recent = { ...alarm, at: NOW - 60_000 };
  assert.equal(hydrateTimer(parseSavedTimer(JSON.stringify({ version: 3, alarm: recent })), NOW).alarm.id, 'done:1');
});

test('damaged saves load as defaults instead of breaking the timer', () => {
  for (const text of [null, '', 'not json', '[]', '"text"', '{"settings": 5, "blocks": "x", "alarm": 3, "phase": "nope"}']) {
    const loaded = hydrateTimer(parseSavedTimer(text), NOW);
    assert.equal(loaded.ready, true);
    assert.equal(loaded.phase, 'focus');
    assert.deepEqual(loaded.settings, defaultTimerSettings);
    assert.deepEqual(loaded.blocks, []);
  }
  const odd = hydrateTimer(parseSavedTimer(JSON.stringify({ version: 3, date: '2026-10-17', settings: { focus: 'abc', volume: 9999, tone: 'nope', warn: 'yes' }, blocks: [null, { id: 1 }, { id: 'ok', at: NOW, minutes: 25, label: 'fine' }] })), NOW);
  assert.equal(odd.settings.focus, defaultTimerSettings.focus);
  assert.equal(odd.settings.volume, 100);
  assert.equal(odd.settings.tone, defaultTimerSettings.tone);
  assert.equal(odd.settings.warn, false);
  assert.deepEqual(odd.blocks.map((block) => block.id), ['ok']);
});

test('every setting survives a save and a reload', () => {
  const chosen = { focus: 50, short: 10, long: 20, rounds: 3, autoBreak: true, autoFocus: true, sound: false, tone: 'digital', volume: 15, warn: true, notify: true };
  const text = serializeTimer({ ...hydrateTimer({}, NOW), settings: chosen });
  assert.deepEqual(hydrateTimer(parseSavedTimer(text), NOW).settings, chosen);
  assert.deepEqual(normalizeSettings(chosen), chosen);
});

// ---------------------------------------------------------------------------------------------------------------
// The alarm sounds
// ---------------------------------------------------------------------------------------------------------------

for (const tone of timerTones) {
  test(`the ${tone} sound is audible, never clips, and starts and ends in silence so it can loop`, () => {
    const samples = synthesizeTone(tone, 8000);
    assert.ok(samples.length >= 8000, 'at least a second long');
    let peak = 0;
    let energy = 0;
    for (const sample of samples) {
      assert.ok(Number.isFinite(sample));
      peak = Math.max(peak, Math.abs(sample));
      energy += sample * sample;
    }
    assert.ok(peak <= 0.91 && peak > 0.5, `peak ${peak}`);
    assert.ok(Math.sqrt(energy / samples.length) > 0.05, 'not silent');
    assert.ok(Math.abs(samples[0]) < 0.01);
    assert.ok(Math.abs(samples[samples.length - 1]) < 0.001);
  });
}

test('the sounds differ from each other', () => {
  const rendered = timerTones.map((tone) => Array.from(synthesizeTone(tone, 4000).slice(0, 800)).join(','));
  assert.equal(new Set(rendered).size, timerTones.length);
});

// ---------------------------------------------------------------------------------------------------------------
// TIM-02 (3) and (5): Escape, scroll lock and the document title
// ---------------------------------------------------------------------------------------------------------------

test('Escape belongs to the timer only when nothing else already used it', () => {
  assert.equal(dom.isEscapeForTimer({ key: 'Escape', defaultPrevented: false }), true);
  // A search dialog that closed itself called preventDefault: the same press must not also close the timer.
  assert.equal(dom.isEscapeForTimer({ key: 'Escape', defaultPrevented: true }), false);
  assert.equal(dom.isEscapeForTimer({ key: 'Escape', defaultPrevented: false, isComposing: true }), false);
  assert.equal(dom.isEscapeForTimer({ key: 'ArrowLeft', defaultPrevented: false }), false);
  assert.equal(dom.isEscapeForTimer({ key: 'Enter', defaultPrevented: false }), false);
});

test('the scroll lock is an attribute, and the body\'s own overflow style is never read or written', () => {
  const attributes = new Map();
  const style = new Proxy({}, {
    get() { throw new Error('the timer must not read the inline overflow style'); },
    set() { throw new Error('the timer must not write the inline overflow style'); },
  });
  const body = {
    style,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
  };
  dom.setScrollLock(body, true);
  assert.equal(attributes.has(dom.SCROLL_LOCK_ATTRIBUTE), true);
  dom.setScrollLock(body, false);
  assert.equal(attributes.size, 0);
  // The style sheet turns the attribute into the lock.
  const css = fs.readFileSync(new URL('../../app/styles/study-timer.css', import.meta.url), 'utf8');
  assert.match(css, /body\[data-timer-scroll-lock\]\s*\{\s*overflow:\s*hidden/);
});

test('the title written for a running block is recognised, and an ordinary page title never is', () => {
  assert.equal(timerTitle(24 * 60 + 59, 'focus'), '24:59 · Focus');
  assert.equal(timerTitle(0, 'long'), '00:00 · Long break');
  for (const phase of ['focus', 'short', 'long']) assert.equal(isTimerTitle(timerTitle(61, phase)), true);
  for (const title of ['University CS Docs | University of Botswana Study Hub', 'Notes | CSI243', '10:30 · Lecture times', '', '12:00']) {
    assert.equal(isTimerTitle(title), false, title);
  }
});

// ---------------------------------------------------------------------------------------------------------------
// TIM-02 (2): the markers the page-turning keys look for
// ---------------------------------------------------------------------------------------------------------------

test('the popover and the full screen timer carry the markers that make the page keys stand down', () => {
  // components/layouts/page-keys.tsx skips the arrow keys while it finds [role="dialog"][data-state="open"] or
  // [aria-modal="true"] in the page. This guards the markup; the key handling itself needs a browser.
  const read = (file) => fs.readFileSync(new URL(`${dir}components/${file}`, import.meta.url), 'utf8');
  const pageKeys = fs.readFileSync(new URL('../../components/layouts/page-keys.tsx', import.meta.url), 'utf8');
  assert.match(pageKeys, /\[role="dialog"\]\[data-state="open"\], \[aria-modal="true"\]/);
  const popover = read('timer-popover.tsx');
  assert.match(popover, /role="dialog"[^>]*data-state="open"|data-state="open"[^>]*role="dialog"/);
  const panel = read('timer-panel.tsx');
  assert.match(panel, /role=\{fullscreen \? 'dialog' : undefined\}/);
  assert.match(panel, /aria-modal=\{fullscreen \? true : undefined\}/);
  assert.match(read('timer-settings.tsx'), /role="dialog" aria-modal="true"/);
});
