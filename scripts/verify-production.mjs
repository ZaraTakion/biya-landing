// Lightweight verification: this checks what the public Cloudflare URL actually serves.
// Never equate a successful GitHub build with a successfully published deployment.
const expected = (process.env.EXPECTED_SHA ?? process.argv[2] ?? '').toLowerCase().trim();
const base = process.env.SITE_URL ?? 'https://biya-prism.zaratakion.workers.dev';
const maxWaitMs = Number(process.env.MAX_WAIT_MS ?? 480000);
const pollMs = Number(process.env.POLL_MS ?? 15000);

if (!/^[a-f0-9]{40}$/.test(expected)) {
  console.error('Expected an exact, 40-character commit SHA.');
  process.exit(2);
}

const deadline = Date.now() + maxWaitMs;
let attempt = 0;
let lastResult = 'not checked';

do {
  attempt += 1;
  try {
    const url = new URL('/version.json', base);
    url.searchParams.set('verify', String(Date.now()));
    const response = await fetch(url, {
      headers: { 'Cache-Control': 'no-cache', 'Accept': 'application/json' },
      signal: AbortSignal.timeout(12000),
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!(response.headers.get('content-type') ?? '').includes('json')) {
      throw new Error('Expected JSON from the version endpoint');
    }
    const release = await response.json();
    if (release.site !== 'biya-prism' || !/^[a-f0-9]{40}$/.test(release.revision ?? '')) {
      throw new Error('Invalid release metadata');
    }
    if (release.revision === expected) {
      console.log(`PASS: public Cloudflare deployment serves exact commit ${release.revision} (${attempt} checks).`);
      process.exit(0);
    }
    lastResult = `different deployed commit: ${release.revision}`;
  } catch (error) {
    lastResult = error instanceof Error ? error.message : String(error);
  }

  console.log(`Check ${attempt}: ${lastResult}. Expected ${expected.slice(0, 7)}.`);
  if (Date.now() + pollMs >= deadline) break;
  await new Promise(resolve => setTimeout(resolve, pollMs));
} while (Date.now() < deadline);

console.error(`FAIL: latest public version was not verified within ${maxWaitMs}ms. Last result: ${lastResult}.`);
process.exit(1);
