"""Generate real UI screenshots in Chromium from the unchanged local project."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from offline_bundle import make_doc
DOC=make_doc()
DEST=Path('/mnt/data/biya-landing-preview');DEST.mkdir(exist_ok=True)
with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  for width in (390,1440):
    ctx=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce')
    page=ctx.new_page();page.set_content(DOC,wait_until='load')
    page.evaluate('document.querySelectorAll("img[loading=lazy]").forEach(x=>x.loading="eager")')
    page.wait_for_function('Array.from(document.images).every(x=>x.complete&&x.naturalWidth>0)',timeout=20000)
    # Visit sections to force offscreen painting before a full-page screenshot.
    for selector in ('.gallery-info','.broadcast-one','.broadcast-two','.broadcast-three','.about-art'):
      page.locator(selector).scroll_into_view_if_needed();page.wait_for_timeout(100)
    page.evaluate('scrollTo(0,0)');page.wait_for_timeout(250)
    page.screenshot(path=str(DEST/f'crystal-{width}.png'),full_page=True)
    page.locator('[data-set-world="ghost"]').click();page.wait_for_timeout(150)
    page.screenshot(path=str(DEST/f'ghost-{width}.png'),full_page=True)
    ctx.close()
  browser.close()
print('Screenshots: crystal/ghost 390px and 1440px')
