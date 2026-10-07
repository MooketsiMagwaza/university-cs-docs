import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('topic pages link to complete standalone HTML guides and light PDFs', async ({ page, request }) => {
  await page.goto('/docs/sem3/csi247/sorting-and-searching/notes/bubble-and-selection-sort');

  const bubbleHtml = page.getByRole('link', { name: 'Bubble Sort HTML' });
  const selectionHtml = page.getByRole('link', { name: 'Selection Sort HTML' });
  await expect(bubbleHtml).toHaveAttribute('href', '/files/sem3/csi247/study-guides/sorting-and-searching/bubble-sort.html');
  await expect(selectionHtml).toHaveAttribute('href', '/files/sem3/csi247/study-guides/sorting-and-searching/selection-sort.html');
  await expect(page.getByRole('link', { name: 'Bubble Sort PDF' })).toHaveAttribute('href', /bubble-sort\.pdf$/);
  await expect(page.getByRole('link', { name: 'Selection Sort PDF' })).toHaveAttribute('href', /selection-sort\.pdf$/);

  await page.goto('/files/sem3/csi247/study-guides/sorting-and-searching/bubble-sort.html');
  await expect(page.getByRole('heading', { level: 1, name: 'Bubble Sort' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.getByRole('button', { name: 'Dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Light mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  const player = page.locator('[data-player]').first();
  await player.getByRole('button', { name: 'Next' }).click();
  await expect(player.locator('[data-frame="1"]')).toBeVisible();
  await expect(player.locator('[data-row="1"]')).toHaveAttribute('aria-current', 'step');
  await expect(player.locator('[data-current]')).toContainText('Current step 2:');

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);

  const pdfResponse = await request.get('/files/sem3/csi247/study-guides/sorting-and-searching/bubble-sort.pdf');
  expect(pdfResponse.ok()).toBe(true);
  expect((await pdfResponse.body()).subarray(0, 4).toString()).toBe('%PDF');
});

test('merge lesson shows the whole run before guided returns and merge mechanics', async ({ page }) => {
  await page.goto('/docs/sem3/csi247/sorting-and-searching/notes/merge-sort');

  const merge = page.locator('[data-player="merge-main"]');
  await expect(merge).toBeVisible();
  await merge.getByRole('button', { name: /Next/ }).click();
  await expect(merge.locator('tr[aria-current="step"]')).toContainText('[72,85]');
  await expect(merge.locator('[data-current]')).toContainText('Current step 2:');

  await expect(page.locator('[data-map-kind="merge"] .map-pass')).toHaveCount(7);
  await page.locator('#merge-sort-merge-mechanics-lab > details > summary').click();
  const pointers = page.locator('[data-player="merge-pointers"]');
  await pointers.getByRole('button', { name: 'Next' }).click();
  await expect(pointers.locator('[data-frame="1"]')).toContainText('take right');

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
});

test('standalone merge guide works offline-style and keeps trace state synchronized', async ({ page }) => {
  await page.goto('/files/sem3/csi247/study-guides/sorting-and-searching/merge-sort.html');

  await expect(page.getByRole('heading', { level: 1, name: 'Merge Sort' })).toBeVisible();
  const player = page.locator('[data-player="merge-main"]');
  await expect(player).toBeVisible();
  await player.locator('[data-action="next"]').click();
  await expect(player.locator('[data-frame="1"]')).toBeVisible();
  await expect(player.locator('[data-row="1"]')).toHaveAttribute('aria-current', 'step');
  await expect(player.locator('[data-current]')).toContainText('Current step 2:');

  await page.emulateMedia({ media: 'print' });
  const printState = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    selectedFrames: getComputedStyle(document.querySelector('.frames') as Element).display,
    fullTrace: getComputedStyle(document.querySelector('.full-trace .table-wrap') as Element).display,
  }));
  expect(printState.background).toBe('rgb(255, 255, 255)');
  expect(printState.selectedFrames).not.toBe('none');
  expect(printState.fullTrace).not.toBe('none');
});
