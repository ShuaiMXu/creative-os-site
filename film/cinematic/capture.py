import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parent
async def main():
    out=ROOT/'public/textures';out.mkdir(exist_ok=True)
    layout={}
    async with async_playwright() as p:
        browser=await p.chromium.launch(channel='chrome')
        page=await browser.new_page(viewport={'width':1200,'height':900},device_scale_factor=6)
        for state in ['before','after']:
            await page.goto((ROOT/'fixtures/northstar.html').as_uri()+'?state='+state)
            await page.evaluate('document.fonts.ready')
            await page.locator('.fixture').screenshot(path=str(out/f'page-{state}-6x.png'))
            await page.locator('.intro-actions').screenshot(path=str(out/f'group-{state}-6x.png'))
            a=await page.locator('.intro-actions').bounding_box();b=await page.locator('.fixture').bounding_box()
            layout[state]={'x':a['x']-b['x'],'y':a['y']-b['y'],'w':a['width'],'h':a['height'],'gap':await page.locator('.intro-actions').evaluate('e=>getComputedStyle(e).gap')}
        await browser.close()
    (out/'layout.json').write_text(json.dumps({'source':'Original fictional Northstar fixture; capture.py / fixtures/northstar.html','scale':6,'page':{'w':1000,'h':640},'states':layout},indent=2),encoding='utf8')
    assert layout['before']['gap']=='16px' and layout['after']['gap']=='32px'
    print(json.dumps(layout))
asyncio.run(main())
