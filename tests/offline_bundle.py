"""Chromium test with fully embedded modules/assets; does not use the network."""
from pathlib import Path
from urllib.parse import quote
from base64 import b64encode
from bs4 import BeautifulSoup
import re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]

def dataurl(path):
    return ('data:image/jpeg;base64,' if path.suffix=='.jpg' else 'data:image/webp;base64,')+b64encode(path.read_bytes()).decode()

def make_doc():
    image_paths={str(p.relative_to(ROOT)):dataurl(p) for p in (p for p in (ROOT/'assets').rglob('*') if p.suffix in ('.webp','.jpg'))}
    # Memoize nested `import` paths (no cycles in the import graph).
    cache={}
    def module_url(p):
        p=p.resolve()
        if p in cache:return cache[p]
        src=p.read_text(encoding='utf-8')
        pat=re.compile(r"(?m)(\b(?:from\s+|import\s+))(['\"])(\.{1,2}/[^'\"]+)\2")
        def rewrite(match):
            dep=(p.parent / match.group(3)).resolve()
            return match.group(1)+match.group(2)+module_url(dep)+match.group(2)
        src=pat.sub(rewrite,src)
        # Asset URLs in artwork/media data (all source code is trusted)
        for name,url in image_paths.items():src=src.replace(name,url)
        url='data:text/javascript;base64,'+b64encode(src.encode('utf-8')).decode()
        cache[p]=url
        return url
    soup=BeautifulSoup((ROOT/'index.html').read_text(encoding='utf-8'),'html.parser')
    for l in soup.select('link[rel="stylesheet"]'):
        path=ROOT/l['href']; st=soup.new_tag('style'); st.string=path.read_text(encoding='utf-8');l.replace_with(st)
    for l in soup.select('link[rel="preload"]'):l.decompose()
    for im in soup.select('img'):
        if im.get('src') in image_paths:im['src']=image_paths[im['src']]
    for sc in soup.select('script[src]'):
        sc['src']=module_url(ROOT / sc['src'])
    return str(soup)

