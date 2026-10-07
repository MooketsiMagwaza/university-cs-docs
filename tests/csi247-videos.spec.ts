import {expect,test} from '@playwright/test';

for (const chapter of ['sorting-and-searching','packages'] as const) {
  test(`${chapter}: resources support written study without video recaps`,async({page}) => {
    await page.goto(`/docs/sem3/csi247/${chapter}/resources`);
    await expect(page.getByRole('heading',{name:'Resources',exact:true,level:1})).toBeVisible();
    await expect(page.locator('video,audio')).toHaveCount(0);
    await expect(page.locator('a[href*="/files/sem3/csi247/videos/"]')).toHaveCount(0);
    await expect(page.getByRole('heading',{name:/Optional narrated recap/})).toHaveCount(0);
    await expect(page.getByRole('heading',{name:chapter === 'packages' ? 'javac Command' : 'Java Arrays API',exact:true,level:3})).toBeVisible();
    await page.setViewportSize({width:390,height:844});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}

test('withdrawn CSI247 recaps are no longer served',async({request}) => {
  for (const slug of ['merge-sort','sorting-movements','searching','java-packages']) {
    const response = await request.get(`/files/sem3/csi247/videos/${slug}.mp4`);
    expect(response.status()).toBe(404);
  }
});
