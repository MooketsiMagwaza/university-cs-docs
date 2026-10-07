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
      const panel=node.querySelector('section[id$="-annotated-java"] .code-panel')!,h2=node.querySelector('h2')!;
      return {bodyFont:getComputedStyle(node).fontFamily,headingFont:getComputedStyle(h2).fontFamily,panel:getComputedStyle(panel).backgroundColor,token:getComputedStyle(node).getPropertyValue('--color-fd-card').trim(),text:getComputedStyle(panel).color};
    });
    expect(style.bodyFont.toLowerCase()).toContain('inter');
    expect(style.headingFont.toLowerCase()).toContain('fraunces');
    expect(style.panel).not.toBe('rgb(32, 35, 31)');
  }
  const player=page.locator('[data-player="merge-lanes"]');
  await expect(page.locator('[data-map-kind="merge"] svg.merge-value-tree')).toHaveCount(2);
  await expect(page.locator('[data-merge-tree="split"] svg.merge-value-tree')).toBeVisible();
  await expect(page.locator('[data-merge-tree="return"] svg.merge-value-tree')).toBeVisible();
  await expect(page.locator('[data-map-kind="merge"] svg.merge-join-diagram')).toHaveCount(7);
  await expect(page.locator('[data-map-kind="merge"] .map-pass')).toHaveCount(7);
  await expect(page.locator('[data-map-kind="merge"] .merge-choice-detail[open]')).toHaveCount(0);
  const optional=page.locator('#merge-sort-merge-lanes > details');
  await expect(optional).not.toHaveAttribute('open');
  await optional.locator(':scope > summary').click();
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

test('merge value trees and final decisions preserve both fronts and build one output',async({page})=>{
  await page.goto('/docs/sem3/csi247/sorting-and-searching/notes/merge-sort');
  const split=page.locator('[data-merge-tree="split"]');
  const returned=page.locator('[data-merge-tree="return"]');
  await expect(split.locator('[data-values="63,29,72,85,18,49,3,54"]')).toHaveCount(1);
  await expect(returned.locator('[data-values="29,63,72,85"]')).toHaveCount(1);
  await expect(returned.locator('[data-values="3,18,49,54"]')).toHaveCount(1);
  await expect(returned.locator('[data-values="3,18,29,49,54,63,72,85"]')).toHaveCount(1);
  const section=page.locator('#merge-sort-final-merge');
  await expect(section).toBeVisible();
  const diagrams=section.locator('svg.merge-decision-diagram');
  await expect(diagrams).toHaveCount(8);
  const values=[3,18,29,49,54,63,72,85];
  const fronts=[[29,3],[29,18],[29,49],[63,49],[63,54],[63],[72],[85]];
  for(let index=0;index<values.length;index++) {
    const diagram=diagrams.nth(index);
    await expect(diagram).toHaveAttribute('data-picked',String(values[index]));
    await expect(diagram).toHaveAttribute('data-output',values.slice(0,index+1).join(','));
    expect(await diagram.locator('.merge-decision-cell.front text').allTextContents()).toEqual(fronts[index].map(String));
    await expect(diagram.locator('.merge-copy-arrow')).toHaveCount(1);
    if(index>=5) await expect(diagram).toHaveAttribute('aria-label',/group is empty.*no comparison is needed/);
  }
  await expect(diagrams.first()).toHaveAttribute('aria-label',/29 > 3: copy 3 from the right\. 29 stays at the front/);
  await expect(diagrams.nth(2)).toHaveAttribute('aria-label',/29 ≤ 49: copy 29 from the left\. 49 stays at the front/);
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
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
