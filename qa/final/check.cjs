const {chromium}=require('/Users/aliaksandrazhyhala/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
(async()=>{
const browser=await chromium.launch({channel:'chrome',headless:true});const report={viewports:[],checks:[],errors:[]};const base='http://127.0.0.1:4173/site/';
fs.mkdirSync('qa/final',{recursive:true});
for(const width of [360,390,768,912,1440]){
 const page=await browser.newPage({viewport:{width,height:1000}});const videos=[];
 page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url())});page.on('request',r=>{if(r.url().endsWith('.mp4'))videos.push(r.url())});
 await page.goto(base,{waitUntil:'networkidle'});
 report.checks.push([`video deferred ${width}`,videos.length===0]);
 await page.locator('main img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode()})));
 for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=850){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(40)}
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(600);
 report.viewports.push({width,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(x=>x.getClientRects().length>0&&(!x.complete||!x.naturalWidth)).map(x=>x.src),brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),h1:document.querySelectorAll('h1').length,oldSiteLinks:[...document.querySelectorAll('a')].filter(a=>a.getAttribute('href').includes('../site')).length}))});
 if(width===1440||width===390){await page.screenshot({path:`qa/final/hero-${width}.png`});for(const selector of ['#history','#working','#character','#care','#together','#album-story','#camp']){await page.locator(selector).screenshot({path:`qa/final/${selector.slice(1)}-${width}.png`});}}
 if(width===1440){
  report.checks.push(['family default',await page.locator('#scene-family').isVisible()]);
  await page.locator('#tab-walk').click();await page.locator('#tab-walk').press('ArrowRight');report.checks.push(['tabs arrows',await page.locator('#tab-family').getAttribute('aria-selected')==='true']);await page.locator('#tab-family').press('End');report.checks.push(['tabs End',await page.locator('#scene-play').isVisible()]);await page.locator('#tab-play').press('Home');report.checks.push(['tabs Home',await page.locator('#scene-walk').isVisible()]);
  await page.locator('.cover-a-photo .photo-link').click();await page.locator('#album-photo').evaluate(img=>img.decode());report.checks.push(['album hero correct',(await page.locator('#album-photo').getAttribute('src')).endsWith('portrait-first.webp')]);const first=await page.locator('#album-photo').getAttribute('src');await page.locator('#next').click();report.checks.push(['album next',first!==await page.locator('#album-photo').getAttribute('src')]);await page.keyboard.press('ArrowLeft');report.checks.push(['album keyboard',first===await page.locator('#album-photo').getAttribute('src')]);await page.keyboard.press('Escape');report.checks.push(['album closes',!await page.locator('#album').isVisible()]);report.checks.push(['focus restored',await page.locator('.cover-a-photo .photo-link').evaluate(a=>a===document.activeElement)]);
  await page.locator('.landscape-open').click();report.checks.push(['landscape album',(await page.locator('#album-photo').getAttribute('src')).endsWith('lakes.webp')]);await page.keyboard.press('Escape');
  await page.locator('.breed-facts summary').last().click();report.checks.push(['Earthdog detail',await page.locator('.breed-facts details').last().getAttribute('open')!==null]);
  const v=page.locator('video');await v.evaluate(v=>v.play());await page.waitForTimeout(500);report.checks.push(['lake video plays',await v.evaluate(v=>!v.paused&&v.currentTime>0&&Math.abs(v.duration-16.733333)<0.1&&!v.error)]);await v.evaluate(v=>v.pause());
 }
 if(width===390){await page.locator('.owner-dog .photo-link').first().click();report.checks.push(['mobile album no overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)]);await page.keyboard.press('Escape');}
 await page.close();
}
for(const width of [390,768]){const page=await browser.newPage({viewport:{width,height:1000}});await page.goto(base);await page.addStyleTag({content:'html{font-size:200%}'});const overs=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>el.getClientRects().length&&el.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(el=>({tag:el.tagName,cls:el.className,right:el.getBoundingClientRect().right})));report.checks.push([`200% text ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),overs]);await page.screenshot({path:`qa/final/zoom-${width}.png`});await page.close();}
const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:1000}});await nojs.goto(base);report.checks.push(['noJS scene story',await nojs.locator('.scene:visible').count()===3&&!await nojs.locator('.scene-tabs').isVisible()]);report.checks.push(['noJS image links',await nojs.locator('.cover-a-photo .photo-link').getAttribute('href')==='assets/images/portrait-first.webp']);await nojs.close();
const motion=await browser.newPage({reducedMotion:'reduce'});await motion.goto(base);await motion.locator('#tab-play').click();report.checks.push(['reduced motion',await motion.locator('#scene-play').evaluate(el=>getComputedStyle(el).animationName==='none')]);await motion.close();
const local=await browser.newPage();await local.goto('file://'+path.resolve('site/index.html'));report.checks.push(['local file title',(await local.title()).startsWith('Лейкленд-терьер')]);await local.close();
await browser.close();fs.writeFileSync('qa/final/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})();
