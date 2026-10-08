import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = path => readFileSync(join(root, path), 'utf8');
const errors = [];
const requireText = (file, text, message) => {
  const body = read(file);
  if (!body.includes(text)) errors.push(message);
};

for (const file of [
  'public/_headers',
  'public/robots.txt',
  'src/react/useImmersion.ts',
  'src/react/PolicyApp.tsx',
  'src/react/App.tsx',
  'vite.config.ts',
  'wrangler.jsonc',
  'src/react/EasterEgg.tsx',
]) {
  if (!existsSync(join(root, file))) errors.push(`Missing security file: ${file}`);
}

requireText('public/_headers', "Content-Security-Policy:", 'CSP header missing.');
requireText('public/_headers', "style-src 'self';", 'CSP must not require unsafe-inline styles.');
requireText('public/_headers', "Strict-Transport-Security:", 'HSTS missing.');
requireText('public/_headers', "Cross-Origin-Opener-Policy: same-origin", 'COOP missing.');
requireText('public/_headers', "X-Frame-Options: DENY", 'Frame protection missing.');
requireText('public/_headers', "X-Content-Type-Options: nosniff", 'nosniff missing.');
requireText('public/_headers', "X-Robots-Tag: noindex, noimageindex", 'Asset image indexing opt-out missing.');
requireText('public/robots.txt', 'User-agent: GPTBot', 'GPTBot opt-out missing.');
requireText('public/robots.txt', 'User-agent: Google-Extended', 'Google-Extended opt-out missing.');
requireText('public/robots.txt', 'User-agent: ClaudeBot', 'ClaudeBot opt-out missing.');
requireText('public/robots.txt', 'User-agent: CCBot', 'CCBot opt-out missing.');
requireText('src/react/useImmersion.ts', "document.addEventListener('contextmenu'", 'Context-menu deterrence missing.');
requireText('src/react/useImmersion.ts', "document.addEventListener('dragstart'", 'Drag deterrence missing.');
requireText('src/react/App.tsx', 'protected-art', 'Protected artwork class missing.');
if (read('src/react/App.tsx').includes('style={{')) errors.push('Inline React style found in App.tsx.');
if (read('src/react/EasterEgg.tsx').includes('style={{')) errors.push('Inline React style found in EasterEgg.tsx.');
if (read('public/_headers').includes("'unsafe-inline'")) errors.push('unsafe-inline must not be enabled in the final CSP.');
requireText('src/react/PolicyApp.tsx', 'fine-tuning', 'AI model fine-tuning policy missing.');
requireText('src/react/PolicyApp.tsx', 'LoRA', 'LoRA policy missing.');
requireText('src/react/PolicyApp.tsx', 'image-to-image', 'Image-to-image policy missing.');
requireText('vite.config.ts', 'sourcemap: false', 'Production source maps must stay disabled.');
requireText('wrangler.jsonc', '"name": "biya-prism"', 'Wrangler worker name must match biya-prism.');
requireText('wrangler.jsonc', '"not_found_handling": "404-page"', '404-page handling must be enabled.');

const publicAssets = join(root, 'public', 'assets');
if (!existsSync(publicAssets)) errors.push('Production asset directory missing.');
else {
  const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
  );
  const assets = walk(publicAssets);
  if (assets.length > 12) errors.push(`Too many production artwork files exposed: ${assets.length}`);
}

if (errors.length) {
  for (const error of errors) console.error('FAIL:', error);
  process.exit(1);
}
console.log('PASS: security/audit controls present. Note: browser-delivered images can never be made impossible to copy.');
