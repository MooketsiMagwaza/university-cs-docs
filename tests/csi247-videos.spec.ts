import {expect,test} from '@playwright/test';
import timings from '../videos/csi247/timings.json';

for (const [chapter,count] of [['sorting-and-searching',3],['packages',1]] as const) {
  test(`${chapter}: optional Ava recaps play with captions and transcripts`,async({page,request})=>{
    await page.goto(`/docs/sem3/csi247/${chapter}/resources`);
    const videos=page.locator('video');
    await expect(videos).toHaveCount(count);
    for(let index=0;index<count;index++) {
      const video=videos.nth(index),panel=video.locator('..');
      await expect(panel).not.toHaveAttribute('open');
      await expect(video).not.toHaveAttribute('autoplay');
      await panel.locator(':scope > summary').click();
      const metadata=await video.evaluate(async node=>{
        const element=node as HTMLVideoElement;
        await new Promise<void>((resolve,reject)=>{
          element.addEventListener('loadedmetadata',()=>resolve(),{once:true});
          element.addEventListener('error',()=>reject(new Error('Video failed to load')),{once:true});
          element.load();
        });
        return {width:element.videoWidth,height:element.videoHeight,duration:element.duration};
      });
      const src = (await video.locator('source').getAttribute('src'))!;
      const slug = src.split('/').at(-1)!.replace('.mp4','') as keyof typeof timings;
      const dimensions = timings[slug] as {width?:number;height?:number};
      expect(metadata.width).toBe(dimensions.width ?? 720);
      expect(metadata.height).toBe(dimensions.height ?? 1280);
      const expectedDuration = timings[slug].durationInFrames / timings[slug].fps;
      expect(metadata.duration).toBeGreaterThan(30);
      expect(Math.abs(metadata.duration - expectedDuration)).toBeLessThan(.2);
      const captions=await request.get((await video.locator('track').getAttribute('src'))!);
      expect(captions.ok()).toBe(true);
      expect(await captions.text()).toMatch(/^WEBVTT/);
      await video.evaluate(async node=>{const v=node as HTMLVideoElement;v.muted=true;await v.play();});
      await expect.poll(()=>video.evaluate(node=>(node as HTMLVideoElement).currentTime)).toBeGreaterThan(.1);
      await video.evaluate(node=>(node as HTMLVideoElement).pause());
      await panel.getByText('Read the complete transcript',{exact:true}).click();
      await expect(panel.locator('h3').first()).toBeVisible();
      await panel.locator(':scope > summary').click();
    }
    await page.setViewportSize({width:390,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
  });
}
