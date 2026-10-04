"""Offline structural checks (no network or Playwright required)."""
import json, re, unittest
from pathlib import Path
from html.parser import HTMLParser
ROOT = Path(__file__).resolve().parents[1]

class DocumentParser(HTMLParser):
    def __init__(self): super().__init__(); self.images = []; self.attrs = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); self.attrs.append((tag,a))
        if tag == 'img': self.images.append(a)

class TestStructure(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = (ROOT/'index.html').read_text(encoding='utf-8')
        cls.parser=DocumentParser(); cls.parser.feed(cls.page)

    def test_html_is_explicitly_unindexed(self):
        self.assertRegex(self.page, r'(?is)name="robots"[^>]*content="noindex, nofollow"|content="noindex, nofollow"[^>]*name="robots"')

    def test_expected_files_exist(self):
        for name in ['index.html','src/css/tokens.css','src/css/base.css','src/css/layout.css',
                     'src/css/components.css','src/css/motion.css','src/js/main.js','src/js/state.js',
                     'src/js/i18n.js','src/js/world.js','src/js/gallery.js','src/js/navigation.js',
                     'src/data/artworks.js','src/data/media.js','src/data/translations/pt-BR.js',
                     'src/data/translations/en.js','README.md']:
            with self.subTest(name=name): self.assertTrue((ROOT/name).exists())

    def test_assets_and_dimensions(self):
        for img in self.parser.images:
            with self.subTest(src=img.get('src')):
                self.assertTrue((ROOT/img['src']).exists())
                self.assertGreater(int(img['width']),0)
                self.assertGreater(int(img['height']),0)
                self.assertTrue(img.get('alt') is not None)

    def test_no_unapproved_fan_project_messaging(self):
        visible=self.page.lower()
        for term in ['homenagem não oficial','unofficial tribute','independent tribute','fan project']:
            self.assertNotIn(term,visible)

    def test_separate_locales(self):
        pt=(ROOT/'src/data/translations/pt-BR.js').read_text()
        en=(ROOT/'src/data/translations/en.js').read_text()
        pattern=r'export const strings = (\{.*?\});\s*export const worlds'
        a=json.loads(re.search(pattern,pt,re.S).group(1)); b=json.loads(re.search(pattern,en,re.S).group(1))
        self.assertEqual(set(a),set(b));self.assertGreater(len(a),70)

if __name__=='__main__':unittest.main()
