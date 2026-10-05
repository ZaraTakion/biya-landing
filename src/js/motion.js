/**
 * Signature motion for Biya / Parallel Worlds.
 * Intentionally limited to three moments: world switching, gallery changes,
 * and the "O Outro Lado" intermission.
 */
import { subscribe } from './state.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const timers = new Map();

function pulse(element, className, duration) {
  if (!element || reducedMotion.matches) return;

  element.classList.remove(className);
  // These interactions are infrequent; the sync read guarantees a clean replay
  // without running a continuous scroll or pointer loop.
  void element.offsetWidth;
  element.classList.add(className);

  clearTimeout(timers.get(className));
  timers.set(className, setTimeout(() => {
    element.classList.remove(className);
    timers.delete(className);
  }, duration));
}

function initIntermission() {
  const intermission = document.querySelector('.intermission');
  if (!intermission || reducedMotion.matches || !('IntersectionObserver' in window)) return null;

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      intermission.classList.add('motion-entered');
      observer.unobserve(intermission);
    }
  }, {
    threshold: 0.34,
    rootMargin: '0px 0px -8% 0px',
  });

  observer.observe(intermission);
  return observer;
}

export function initSignatureMotion() {
  const stage = document.getElementById('art-stage');
  const portal = document.querySelector('.portal');
  const gallery = document.querySelector('.gallery-experience');
  let intermissionObserver = initIntermission();

  subscribe((_, changed) => {
    if (changed === 'world') {
      pulse(stage, 'world-shift', 850);
      pulse(portal, 'world-copy-shift', 620);
    }

    if (changed === 'artworkIndex') {
      pulse(gallery, 'gallery-shift', 520);
    }
  });

  reducedMotion.addEventListener?.('change', event => {
    if (event.matches) {
      intermissionObserver?.disconnect();
      intermissionObserver = null;
      stage?.classList.remove('world-shift');
      portal?.classList.remove('world-copy-shift');
      gallery?.classList.remove('gallery-shift');
      document.querySelector('.intermission')?.classList.remove('motion-entered');
      return;
    }

    intermissionObserver = initIntermission();
  });
}
