import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const errors = [];
const sources = ['index.html', 'art-policy.html'];
const walk = dir => readdirSync(join(root, dir), { withFileTypes: true }).flatMap(entry => {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return walk(path);
  return /\.(tsx?|css|html)$/.test(entry.name) ? [path] : [];
});
sources.push(...walk('src'));
const referenced = new Set();
const pattern = /\/assets\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g)/g;

for (const path of sources) {
  const content = readFileSync(join(root, path), 'utf8');
  for (const match of content.matchAll(pattern)) referenced.add(match[0]);
}

const validSignature = (path, bytes) => {
  const ext = extname(path).toLowerCase();
  if (ext === '.webp') return bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  if (ext === '.png') return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (ext === '.jpg' || ext === '.jpeg') return bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  return false;
};

if (!referenced.size) errors.push('No artwork references were found in source files.');

for (const ref of referenced) {
  if (ref.includes('..')) {
    errors.push('Unsafe asset path: ' + ref);
    continue;
  }
  for (const directory of ['public', ...(existsSync(join(root, 'dist')) ? ['dist'] : [])]) {
    const file = join(root, directory, ref.slice(1));
    if (!existsSync(file)) {
      errors.push('Missing asset in ' + directory + ': ' + ref);
      continue;
    }
    if (!statSync(file).isFile() || !validSignature(file, readFileSync(file))) {
      errors.push('Unexpected or invalid image signature: ' + relative(root, file));
    }
  }
}
if (errors.length) {
  for (const error of errors) console.error('FAIL:', error);
  process.exit(1);
}
console.log('PASS: ' + referenced.size + ' referenced artworks, avatars and thumbnails exist with valid image signatures in public/ and dist/.');
