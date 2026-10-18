import { expect, test } from '@playwright/test';

/**
 * Code is never clipped and never traps the page (WORK_ORDERS.md: TRY-07, CSI247-10).
 * For a sample of pages from several courses, at three widths and in both themes, it fails when:
 *  - a code block is wider than its frame and nothing scrolls it;
 *  - a block that scrolls swallows the wheel in the vertical direction, so the page cannot be scrolled over it;
 *  - the page itself scrolls sideways.
 * Add a page to the list when a new kind of code appears on it.
 */
test.use({ reducedMotion: 'reduce' });
test.setTimeout(240_000);

const pages = [
  '/docs/sem3/csi243/06-lists-tuples/notes/list-comprehensions',
  '/docs/sem3/csi243/06-lists-tuples/review',
  '/docs/sem3/csi247/04-sorting-and-searching/notes/bubble-sort',
  '/docs/sem3/csi247/04-sorting-and-searching/notes/binary-search',
  '/docs/playgrounds/java',
];
const widths = [1280, 768, 375];

/** What the browser reports about code in the page. Runs in the page. */
function probe() {
  const issues: string[] = [];
  const doc = document.documentElement;
  if (doc.scrollWidth > doc.clientWidth + 1) issues.push(`the page scrolls sideways (${doc.scrollWidth} > ${doc.clientWidth})`);

  const scrolls = (element: Element, axis: 'x' | 'y') => {
    const style = getComputedStyle(element);
    return /(auto|scroll)/.test(axis === 'x' ? style.overflowX : style.overflowY);
  };
  const frameScrolls = (element: Element) => {
    for (let node: Element | null = element; node && node !== document.body; node = node.parentElement) {
      if (scrolls(node, 'x')) return true;
    }
    return false;
  };

  for (const block of document.querySelectorAll('pre')) {
    if (!(block as HTMLElement).offsetParent) continue; // hidden (a closed details, another tab)
    const name = `${block.closest('[class]')?.className ?? ''} > pre`.slice(0, 80);
    if (block.scrollWidth > block.clientWidth + 1 && !frameScrolls(block)) issues.push(`clipped code: ${name}`);
    const style = getComputedStyle(block);
    const scrollsItself = scrolls(block, 'x') || scrolls(block, 'y');
    if (scrollsItself && style.overscrollBehaviorY !== 'auto') issues.push(`wheel trap (overscroll-behavior-y: ${style.overscrollBehaviorY}): ${name}`);
  }
  for (const body of document.querySelectorAll('.cw-body')) {
    const style = getComputedStyle(body);
    if (style.overscrollBehaviorY !== 'auto') issues.push(`wheel trap on a code window (${style.overscrollBehaviorY})`);
  }
  for (const option of document.querySelectorAll('.ui-quiz-option')) {
    if (option.scrollWidth > option.clientWidth + 1) issues.push('a quiz option overflows its button');
  }
  return issues;
}

for (const path of pages) {
  test(`code is not clipped and does not trap the page: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(path);
    await expect(page.locator('h1').first()).toBeVisible();

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const dark of [false, true]) {
        await page.evaluate((value) => document.documentElement.classList.toggle('dark', value), dark);
        const issues = await page.evaluate(probe);
        expect(issues, `${path} at ${width}px, ${dark ? 'dark' : 'light'}`).toEqual([]);
      }
    }
    expect(errors).toEqual([]);
  });
}

test('the wheel scrolls the page when the cursor is over a code block (CSI247-10)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/docs/sem3/csi247/04-sorting-and-searching/notes/bubble-sort');
  const block = page.locator('.csi247-chapter pre').first();
  await expect(block).toBeAttached();
  await block.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -200));
  const box = await block.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, Math.min(box!.y + box!.height / 2, 600));
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 240);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  const mid = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, -240);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(mid);
});
