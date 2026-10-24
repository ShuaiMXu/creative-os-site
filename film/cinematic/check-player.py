import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(channel='chrome')
        page=await browser.new_page()
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        response=await page.goto('http://127.0.0.1:4238/film/cinematic/')
        await page.wait_for_function('document.querySelector("video").readyState >= 1')
        media=await page.locator('video').evaluate('(v)=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,controls:v.controls})')
        assert response.status==200 and media['width']==1920 and media['height']==1080 and media['controls'] and not errors
        print(json.dumps({'status':response.status,'media':media,'errors':errors}))
        await browser.close()
asyncio.run(main())
