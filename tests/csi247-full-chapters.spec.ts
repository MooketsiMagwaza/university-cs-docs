import { expect as baseExpect, test } from '@playwright/test';
const expect = baseExpect.configure({ timeout: 10_000 });

test.use({ reducedMotion: 'reduce' });
test.setTimeout(150_000);

const routes = [
  ['sorting-and-searching', 'linear-search', 'linear', 5],
  ['sorting-and-searching', 'binary-search', 'binary', 3],
  ['sorting-and-searching', 'bubble-sort', 'bubble', 4],
  ['sorting-and-searching', 'selection-sort', 'selection', 8],
  ['sorting-and-searching', 'insertion-sort', 'insertion', 5],
  ['sorting-and-searching', 'merge-sort', 'merge', 7],
  ['packages', 'built-in-packages-and-imports', 'imports', 4],
  ['packages', 'creating-a-package', 'package', 4],
  ['packages', 'compiling-and-running', 'build', 4],
] as const;

for (const [chapter, slug, kind, steps] of routes) {
  test(`${slug}: full chapter, whole-run map, quiz, and mobile themes`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/docs/sem3/csi247/${chapter}/notes/${slug}`);
    const article = page.locator('.csi247-chapter').filter({ has: page.locator(`[data-map-kind="${kind}"]`) });
    await expect(article.locator('.chapter-content > section').first()).toHaveAttribute('id', /visual-map$/);
    await expect(article.locator(`[data-map-kind="${kind}"]`)).toBeVisible();
    await expect(article.locator('.quiz-question')).toHaveCount(12);
    const player = article.locator(`[data-player="${['imports','package','build'].includes(kind) ? 'packages-' + kind : kind + '-main'}"]`);
    await expect(player.locator('[data-frame]')).toHaveCount(steps);
    await player.locator('[data-action=next]').click();
    await expect(player.locator('[data-frame="1"]')).toBeVisible();
    await expect(player.locator('[data-row="1"]')).toHaveAttribute('aria-current', 'step');
    const quiz = article.locator('[data-topic-quiz]');
    const first = quiz.locator('fieldset').first();
    await first.locator('input').first().check();
    await expect(quiz.locator('.quiz-score')).toHaveText('Answered 1 of 12 · 1 correct');
    await expect(first.locator('.quiz-feedback')).toContainText('Correct.');
    await first.locator('input').nth(1).check();
    await expect(quiz.locator('.quiz-score')).toHaveText('Answered 1 of 12 · 0 correct');
    await quiz.getByRole('button', { name: 'Reset quiz' }).click();
    await expect(quiz.locator('.quiz-score')).toHaveText('Answered 0 of 12 · 0 correct');
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      for (const dark of [false, true]) {
        await page.evaluate(value => document.documentElement.classList.toggle('dark', value), dark);
        await expect(article).toHaveAttribute('data-theme', dark ? 'dark' : 'light');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    }
    expect(errors).toEqual([]);
  });
}

test('code toolbar copies only source and reference diagrams have full-run evidence', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/sem3/csi247/sorting-and-searching/notes/insertion-sort');
  const panel = page.locator('.code-panel').first();
  const expected = await panel.locator('pre').textContent();
  await panel.getByRole('button', { name: 'Copy code' }).click();
  expect((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(expected);
  await expect(panel.locator('.window-dots i')).toHaveCount(3);
  const map = page.locator('[data-map-kind="insertion"]');
  await expect(map).toContainText('held key = 51');
  await expect(map).toContainText('85 > 51');
  await expect(map).toContainText('72 > 51');
  await expect(map).toContainText('59 > 51');
  await expect(map).toContainText('45 > 51 is false');
});
