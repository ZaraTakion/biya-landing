/** Subtle reveal choreography and progressive motion enhancement. */
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const groups = [
  {
    selector: '.portal-copy > .section-index, .portal-copy > .hero-kicker, #portal-title, .hero-subtitle, .hero-description, .world-control, .hero-actions',
    step: 55
  },
  {
    selector: '.art-stage',
    step: 0,
    soft: true
  },
  {
    selector: '.archive-heading > *, .gallery-experience',
    step: 70
  },
  {
    selector: '.intermission > *',
    step: 65
  },
  {
    selector: '.section-number, .signal-heading > *, .broadcast, .signal-end > *',
    step: 55
  },
  {
    selector: '.about-art, .about-copy > *',
    step: 55
  },
  {
    selector: '.footer-top > *, .footer-wordmark, .footer-bottom > *',
    step: 50
  }
];

function prepareRevealTargets() {
  const seen = new Set();

  groups.forEach(group => {
    const nodes = [...document.querySelectorAll(group.selector)];
    nodes.forEach((element, index) => {
      if (seen.has(element)) return;
      seen.add(element);
      element.classList.add('motion-reveal');
      if (group.soft || element.matches('.gallery-experience, .about-art')) {
        element.classList.add('motion-reveal-soft');
      }
      element.style.setProperty('--motion-delay', `${Math.min(index * group.step, 220)}ms`);
    });
  });

  return [...seen];
}

function revealAll(elements) {
  elements.forEach(element => element.classList.add('is-visible'));
}

export function initMotion() {
  const elements = prepareRevealTargets();
  if (!elements.length) return;

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealAll(elements);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  elements.forEach(element => observer.observe(element));

  reducedMotion.addEventListener?.('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    revealAll(elements);
  });
}
