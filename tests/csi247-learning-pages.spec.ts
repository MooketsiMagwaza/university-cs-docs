import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('topic traces stay compact on mobile and HTML exports preserve the chosen pass', async ({ page }) => {
  await page.goto('/docs/sem3/csi247/sorting-and-searching/notes/bubble-and-selection-sort');

  const selection = page.locator('section').filter({ hasText: 'Selection sort chooses the smallest remaining value' });
  await expect(selection).toBeVisible();
  await selection.getByRole('button', { name: 'Pass 3' }).click();
  await expect(selection.getByText('Pass 3 of 4')).toBeVisible();
  await expect(selection.getByText('4 < 5 → true; min = 4', { exact: true })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'HTML' }).click();
  const download = await downloadPromise;
  const html = await readFile(await download.path() as string, 'utf8');
  const visibleHtml = html.replaceAll('<!-- -->', '');

  expect(html).toContain('<style>');
  expect(visibleHtml).toContain('Pass 3 of 4');
  expect(html).toContain('Static HTML lesson snapshot.');
  expect(html).not.toContain('rel="stylesheet"');
  expect(html).not.toContain('rel="preload"');
  expect(html).not.toContain('data-page-download-actions');
});

test('merge trace follows the same seven depth-first returns as its reference table', async ({ page }) => {
  await page.goto('/docs/sem3/csi247/sorting-and-searching/notes/merge-sort');

  const story = page.locator('section').filter({ hasText: 'Merge sort: one completed return at a time' });
  await expect(story).toBeVisible();
  await expect(story.getByRole('button', { name: 'Return 7' })).toBeVisible();
  await story.getByRole('button', { name: 'Return 3' }).click();
  await expect(story.getByText('The entire left half is now sorted.')).toBeVisible();
  await expect(story.getByText('29 ≤ 72 → true; 63 ≤ 72 → true; copy leftovers 72, 85')).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
});
