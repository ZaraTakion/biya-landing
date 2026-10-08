import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const errors = [];
const read = path => readFileSync(path, 'utf8');

for (const file of ['index.html', 'art-policy.html', 'robots.txt', 'sitemap.xml', '_headers']) {
  if (!existsSync(join(dist, file))) errors.push(`dist/${file} missing`);
}

if (!errors.length) {
  const index = read(join(dist, 'index.html'));
  const policy = read(join(dist, 'art-policy.html'));
  const robots = read(join(dist, 'robots.txt'));
  const forbidden = [
    'VERSÃO EM DESENVOLVIMENTO',
    'WORK IN PROGRESS',
    'PRÉ-LANÇAMENTO',
    'PRE-LAUNCH',
    'CRÉDITOS EM VALIDAÇÃO',
    'CREDITS PENDING',
  ];

  if (!index.includes('index, follow, noimageindex')) errors.push('Public robots meta missing.');
  if (!index.includes('summary_large_image')) errors.push('Large social preview missing.');
  if (!index.includes('og:image')) errors.push('Open Graph image missing.');
  if (index.includes('/src/main.tsx')) errors.push('Build still references TSX source.');
  if (policy.includes('/src/policy-main.tsx')) errors.push('Policy build still references TSX source.');
  for (const word of forbidden) {
    if (index.toUpperCase().includes(word.toUpperCase())) errors.push(`Stale development wording found: ${word}`);
  }
  for (const bot of ['GPTBot', 'Google-Extended', 'ClaudeBot', 'CCBot']) {
    if (!robots.includes(bot)) errors.push(`AI crawler opt-out missing: ${bot}`);
  }

  const assetDir = join(dist, 'assets');
  if (!existsSync(assetDir) || readdirSync(assetDir).length === 0) errors.push('Built asset directory is empty.');
}

if (errors.length) {
  for (const error of errors) console.error('FAIL:', error);
  process.exit(1);
}
console.log('PASS: release artifact is public, final, bundled and protected by the configured policy layers.');
