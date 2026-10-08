import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

function gitRevision(): string {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'local';
  }
}

// The same SHA is embedded in the visible footer and the public release manifest.
// Git is preferred to CI environment variables so local and Cloudflare builds agree.
const revision = gitRevision();
const releaseSha = /^[a-f0-9]{40}$/i.test(revision) ? revision.toLowerCase() : 'local';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'biya-release-provenance',
      apply: 'build',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: JSON.stringify({
            site: 'biya-prism',
            revision: releaseSha,
            shortRevision: releaseSha === 'local' ? 'local' : releaseSha.slice(0, 7),
          }, null, 2) + '\n',
        });
      },
    },
  ],
  define: { __BIYA_BUILD_SHA__: JSON.stringify(releaseSha) },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        policy: resolve(__dirname, 'art-policy.html'),
      },
    },
  },
});
