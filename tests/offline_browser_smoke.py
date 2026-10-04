"""Offline Chromium regression tests (no network required)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from offline_bundle import make_doc
DOC=make_doc()
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for width,height in [(320,760),(390,844),(768,1024),(1440,900)]:
        context=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
        page=context.new_page(); errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(DOC,wait_until='load')
        page.wait_for_timeout(200)
        assert page.locator('html').get_attribute('lang')=='pt-BR',('lang',width,errors)
        assert page.locator('body').get_attribute('data-world')=='crystal'
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('overflow',width,page.evaluate('document.documentElement.scrollWidth'))
        page.locator('[data-set-world="ghost"]').click()
        assert page.locator('body').get_attribute('data-world')=='ghost'
        assert page.locator('#stage-ghost').get_attribute('aria-hidden')=='false'
        page.locator('[data-set-language="en"]').click()
        assert page.locator('html').get_attribute('lang')=='en'
        assert page.locator('.language-switch').get_attribute('aria-label')=='Language'
        assert page.locator('meta[name=description]').get_attribute('content').startswith('Biya — digital')
        assert page.locator('img[data-i18n-alt="media.1.alt"]').first.get_attribute('alt') == 'Phasmophobia video thumbnail'
        assert page.locator('#archive-title').inner_text().startswith('Fragments')
        assert 'night' in page.locator('#world-title').inner_text().lower()
        page.locator('#gallery-next').click()
        assert page.locator('#gallery-title').inner_text()=='Many Faces'
        page.locator('#gallery-expand').click()
        assert page.locator('#image-dialog').evaluate('(x)=>x.open')
        page.keyboard.press('Escape')
        assert not page.locator('#image-dialog').evaluate('(x)=>x.open')
        page.locator('[data-set-language="pt"]').click()
        assert page.locator('#gallery-title').inner_text()=='Muitas Facetas'
        assert page.locator('html').get_attribute('lang')=='pt-BR'
        assert page.locator('.language-switch').get_attribute('aria-label') == 'Idioma'
        assert page.locator('meta[name=description]').get_attribute('content').startswith('Biya — artista digital')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('overflow2',width)
        page.evaluate('document.querySelectorAll("img[loading=lazy]").forEach(x=>x.loading="eager")');page.wait_for_function('Array.from(document.images).every(x=>x.complete && x.naturalWidth>0)',timeout=15000);assert page.locator('img').evaluate_all('(xs)=>xs.every(x=>x.complete&&x.naturalWidth>0)'), page.locator('img').evaluate_all('(xs)=>xs.filter(x=>!(x.complete&&x.naturalWidth>0)).map(x=>({id:x.id,src:x.src.slice(0,120),complete:x.complete,width:x.naturalWidth}))')
        assert not errors,errors
        if width in (390,1440):
            Path('/mnt/data/biya-landing-preview').mkdir(exist_ok=True)
            page.screenshot(path=f'/mnt/data/biya-landing-preview/{width}.png',full_page=True)
        print(f'PASS {width}px | PT/EN, Crystal/Ghost, artwork, dialog, loaded images, no overflow or JS errors')
        context.close()
    browser.close()
