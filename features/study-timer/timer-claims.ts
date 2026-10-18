/**
 * Several tabs can hold the same running timer. When a block ends, each of them could record the minutes and ring.
 * A claim is a note in localStorage that says "this tab does it": the first tab to write the note acts, and every
 * other tab finds the note and stays quiet. localStorage is shared by all tabs and read and written synchronously.
 */
export const TIMER_CLAIMS_KEY = 'university-docs-pomodoro-claims';

type ClaimStore = Pick<Storage, 'getItem' | 'setItem'>;
type Claim = { id: string; by: string; at: number };

const KEEP = 24;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function readClaims(store: ClaimStore): Claim[] {
  try {
    const value: unknown = JSON.parse(store.getItem(TIMER_CLAIMS_KEY) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is Claim => typeof item?.id === 'string' && typeof item?.by === 'string' && typeof item?.at === 'number',
    );
  } catch {
    return [];
  }
}

/**
 * Returns true for exactly one caller per `id`. Writing and then reading the note back catches two tabs that wrote at
 * the same moment: only the one whose note survived keeps the claim. If storage cannot be used at all there is no
 * second tab to worry about, so the caller acts.
 */
export function claimOnce(store: ClaimStore, id: string, by: string, now: number): boolean {
  try {
    const claims = readClaims(store);
    if (claims.some((claim) => claim.id === id)) return false;
    const kept = claims.filter((claim) => now - claim.at < MAX_AGE_MS).slice(-(KEEP - 1));
    store.setItem(TIMER_CLAIMS_KEY, JSON.stringify([...kept, { id, by, at: now }]));
    return readClaims(store).some((claim) => claim.id === id && claim.by === by);
  } catch {
    return true;
  }
}
