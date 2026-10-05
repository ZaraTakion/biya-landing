/**
 * Subtle motion layer for the existing Biya experience.
 * Progressive enhancement only: content remains fully usable without JavaScript.
 */
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const revealGroups = [
  ['.archive-heading > *', 70],
  ['.gallery-experience', 0],
  ['.archive-footer > *', 55],
  ['.intermission-ink, .intermission p, .intermission-symbol', 65],
  ['.section-number > *', 55],
  ['.signal-heading > *', 70],
  ['.broadcast', 65],
  ['.signal-end > *', 55],
  ['.about-art', 0],
  ['.about-copy > .mini-label, .about-copy > .script-word, .about-copy > h2, .about-copy > .about-description', 65],
  ['.social-table a', 55],
  ['.footer-top > *', 55],
  ['.footer-wordmark', 0],
  ['.footer-bottom > *', 45],
];

function collectRevealTargets() {
  const targets = new Set();

  for (const [selector, delayStep] of revealGroups) {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('motion-reveal');
      element.style.setProperty('--motion-delay', `${Math.min(index * delayStep, 180)}ms`);
      targets.add(element);
    });
  }

  return [...targets];
}

function reveal(target) {
  target.classList.add('is-revealed');
}

export function initMotion() {
  const targets = collectRevealTargets();
  if (!targets.length) return;

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    targets.forEach(reveal);
    return;
  }

  document.documentElement.classList.add('motion-ready');

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveal(entry.target);
      observer.unobserve(entry.target);
    }
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px',
  });

  targets.forEach(target => observer.observe(target));

  reducedMotion.addEventListener?.('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    targets.forEach(reveal);
    document.documentElement.classList.remove('motion-ready');
  }, { once: true });
}
