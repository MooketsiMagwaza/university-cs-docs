import { expect, test } from '@playwright/test';

test('runs Java safely, reports exact diagnostics, and recovers after limits', async ({ page }) => {
  await page.goto('/docs/sem3/csi247/java-playground');
  const editor = page.getByLabel('Java code');
  const run = page.getByRole('button', { name: 'Run Java' });

  await run.click();
  await expect(page.getByText('Program finished')).toBeVisible();
  await expect(page.getByText('18 -> 4')).toBeVisible();
  await expect(page.getByText('31 -> -1')).toBeVisible();

  await editor.fill(`public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 1000; i++) System.out.println(i);
    }
}`);
  await run.click();
  await expect(page.getByText('Output limit exceeded (500 lines or 64 KiB).')).toBeVisible();

  await editor.fill(`public class Main {
    public static void main(String[] args) {
        nope();
    }
}`);
  await run.click();
  await expect(page.getByText(/ERROR line 3:9:/)).toBeVisible();

  await editor.fill(`public class Main {
    public static void main(String[] args) {
        while (true) { }
    }
}`);
  await run.click();
  await expect(page.getByText('Timed out')).toBeVisible();
  await expect(page.getByText('Stopped after 5 seconds. The program may contain an infinite loop.')).toBeVisible();

  await editor.fill(`public class Main {
    public static void main(String[] args) {
        System.out.println(7);
    }
}`);
  await run.click();
  await expect(page.getByText('Program finished')).toBeVisible();
  await expect(page.getByText('7', { exact: true })).toBeVisible();

  await editor.fill(`public class Main {
    public static void main(String[] args) {
        String block = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
        for (int i = 0; i < 700; i++) System.out.print(block);
    }
}`);
  await run.click();
  await expect(page.getByText('Output limit exceeded (500 lines or 64 KiB).')).toBeVisible();
});
