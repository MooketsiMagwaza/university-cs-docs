import {test,expect} from '@playwright/test';
test.use({reducedMotion:'reduce'});
test.setTimeout(150_000);

test('full chapters inherit site fonts and surface tokens in both themes',async({page})=>{
  await page.goto('/docs/sem3/csi247/sorting-and-searching/notes/merge-sort');
  for(const dark of [false,true]) {
    await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
    const chapter=page.locator('.csi247-chapter');
    await expect(chapter).toHaveAttribute('data-theme',dark?'dark':'light');
    const style=await chapter.evaluate(node=>{
      const panel=node.querySelector('.code-panel')!,h2=node.querySelector('h2')!;
      return {bodyFont:getComputedStyle(node).fontFamily,headingFont:getComputedStyle(h2).fontFamily,panel:getComputedStyle(panel).backgroundColor,token:getComputedStyle(node).getPropertyValue('--color-fd-card').trim(),text:getComputedStyle(panel).color};
    });
    expect(style.bodyFont.toLowerCase()).toContain('inter');
    expect(style.headingFont.toLowerCase()).toContain('fraunces');
    expect(style.panel).not.toBe('rgb(32, 35, 31)');
  }
  const player=page.locator('[data-player="merge-lanes"]');
  await expect(page.locator('[data-map-kind="merge"] svg.tree')).toBeVisible();
  await expect(page.locator('[data-map-kind="merge"] svg.map-array')).toHaveCount(14);
  await expect(page.locator('[data-map-kind="merge"] .merge-choice-detail[open]')).toHaveCount(0);
  const optional=page.locator('#merge-sort-merge-lanes > details');
  await expect(optional).not.toHaveAttribute('open');
  await optional.locator('summary').click();
  await expect(player.locator('[data-frame]')).toHaveCount(8);
  await expect(player.locator('[data-frame="0"]')).toContainText('Copy 3 from RIGHT into temp[0]');
  await player.getByRole('button',{name:'Next',exact:true}).click();
  await expect(player.locator('[data-frame="1"]')).toContainText('Copy 18 from RIGHT into temp[1]');
  await page.evaluate(()=>{location.hash='merge-sort-merge-mechanics-lab';});
  await expect(page.locator('#merge-sort-merge-mechanics-lab > details')).toHaveAttribute('open','');
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({path:'tmp/csi247-themed-mobile.png',fullPage:false});
});

for(const chapter of ['sorting-and-searching','packages']) for(const support of ['cheat-sheet','questions','review','resources']) {
  test(`${chapter}/${support} has substantive support material`,async({page})=>{
    await page.goto(`/docs/sem3/csi247/${chapter}/${support}`);
    const article=page.locator('article').first();
    expect((await article.innerText()).length).toBeGreaterThan(2200);
    await expect(article.locator('h2')).not.toHaveCount(0);
    await page.setViewportSize({width:390,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  });
}
