"""Local browser regression test. Run: python tests/browser_smoke.py"""
from pathlib import Path
from contextlib import contextmanager
from functools import partial
import http.server, socketserver, threading, time
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
@contextmanager
def web_server():
 class Handler(http.server.SimpleHTTPRequestHandler):
  def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
  def log_message(self,*a):pass
 class Server(socketserver.TCPServer):allow_reuse_address=True
 with Server(('127.0.0.1',0),Handler) as s:
  t=threading.Thread(target=s.serve_forever,daemon=True);t.start()
  try:yield f'http://127.0.0.1:{s.server_address[1]}'
  finally:s.shutdown();t.join(timeout=2)

with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width,height in [(320,760),(390,844),(768,1024),(1440,900)]:
  context=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
  page=context.new_page();errs=[];fail=[]
  page.on('pageerror',lambda x:errs.append(str(x)))
  page.on('response',lambda r:fail.append((r.status,r.url)) if r.status>=400 else None)
  # Offline browser origin: fulfill all module and image requests from the working tree.
  from urllib.parse import urlsplit, unquote
  import mimetypes
  def local_route(route):
   parsed=urlsplit(route.request.url)
   if parsed.hostname!='biya.test':
    route.abort(); return
   path=(ROOT / unquote(parsed.path).lstrip('/')).resolve()
   if ROOT not in path.parents or not path.is_file():
    route.fulfill(status=404,body='Missing local file');return
   route.fulfill(status=200,body=path.read_bytes(),content_type=mimetypes.guess_type(str(path))[0] or 'application/octet-stream')
  page.route('**/*',local_route)
  page.goto('https://biya.test/index.html',wait_until='load')
  page.wait_for_timeout(80)
  assert page.locator('html').get_attribute('lang')=='pt-BR'
  assert page.locator('body').get_attribute('data-world')=='crystal'
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('overflow',width,page.evaluate('document.documentElement.scrollWidth'))
  page.locator('[data-set-world="ghost"]').click()
  assert page.locator('body').get_attribute('data-world')=='ghost'
  assert page.locator('#stage-crystal').get_attribute('aria-hidden')=='true'
  assert page.locator('#stage-ghost').get_attribute('aria-hidden')=='false'
  page.locator('[data-set-language="en"]').click()
  assert page.locator('html').get_attribute('lang')=='en'
  assert page.locator('h2#archive-title').inner_text().startswith('Fragments')
  assert page.locator('#world-title').inner_text().lower().find('night')>=0
  page.locator('#gallery-next').click()
  assert page.locator('#gallery-title').inner_text()=='Many Faces'
  page.locator('#gallery-expand').click()
  assert page.locator('#image-dialog').evaluate('(x)=>x.open') is True
  page.locator('#dialog-close').click()
  assert page.locator('#image-dialog').evaluate('(x)=>x.open') is False
  page.locator('[data-set-language="pt"]').click()
  assert page.locator('#gallery-title').inner_text()=='Muitas Facetas'
  assert page.locator('html').get_attribute('lang')=='pt-BR'
  assert page.locator('img').evaluate_all('(xs)=>xs.every(x=>x.complete&&x.naturalWidth>0)')
  assert not errs,errs
  assert not fail,fail
  if width in (390,1440):
   Path('/mnt/data/biya-landing-preview').mkdir(exist_ok=True)
   page.screenshot(path=f'/mnt/data/biya-landing-preview/{width}.png',full_page=True)
  print(f'PASS {width}px PT/EN Crystal/Ghost gallery/modal imgs/no overflow/no JS errors')
  context.close()
 browser.close()
