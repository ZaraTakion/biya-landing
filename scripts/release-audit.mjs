import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const errors = [];
const read = path => readFileSync(path, 'utf8');
const prod = 'https://biya-prism.zaratakion.workers.dev';

for (const file of ['index.html', 'art-policy.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers']) {
  if (!existsSync(join(dist, file))) errors.push(`dist/${file} missing`);
}

if (!errors.length) {
  const index = read(join(dist, 'index.html'));
  const policy = read(join(dist, 'art-policy.html'));
  const notFound = read(join(dist, '404.html'));
  const robots = read(join(dist, 'robots.txt'));
  const sitemap = read(join(dist, 'sitemap.xml'));
  const headers = read(join(dist, '_headers'));
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
  if (!index.includes(prod)) errors.push('Production canonical URL is not biya-prism.');
  if (index.includes('/src/main.tsx')) errors.push('Build still references TSX source.');
  if (policy.includes('/src/policy-main.tsx')) errors.push('Policy build still references TSX source.');
  if (!policy.includes(prod + '/art-policy')) errors.push('Policy canonical URL is incorrect.');
  if (!robots.includes(prod + '/sitemap.xml')) errors.push('robots.txt points to the wrong production URL.');
  if (!sitemap.includes(prod + '/') || !sitemap.includes(prod + '/art-policy')) errors.push('sitemap.xml contains incorrect production URLs.');
  if (!headers.includes("style-src 'self';") || headers.includes("'unsafe-inline'")) errors.push('Final CSP is not strict enough.');
  if (!notFound.includes('BIYA')) errors.push('Custom 404 page is not branded.');

  const stale = 'biya-landing.zaratakion.workers.dev';
  if ([index, policy, robots, sitemap].some(body => body.includes(stale))) {
    errors.push('Stale biya-landing production URL found in release artifact.');
  }

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
console.log('PASS: release artifact is public, final, canonicalized to biya-prism and protected by the configured policy layers.');
