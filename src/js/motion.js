/**
 * Immersive motion for BIYA / Parallel Worlds.
 * Motion reinforces Crystal/Ghost without changing the page composition.
 */
import { subscribe } from './state.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const timers = new Map();

function pulse(element, className, duration) {
  if (!element || reducedMotion.matches) return;
  element.classList.remove(className);
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
  }, { threshold: 0.34, rootMargin: '0px 0px -8% 0px' });
  observer.observe(intermission);
  return observer;
}

function initSectionReveals() {
  const targets = document.querySelectorAll(
    '.archive-heading, .gallery-experience, .signal-heading, .broadcast, .about-art, .about-copy, .signal-end'
  );
  if (!targets.length) return null;
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    targets.forEach(node => node.classList.add('motion-visible'));
    return null;
  }
  targets.forEach(node => node.classList.add('motion-reveal'));
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('motion-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  targets.forEach(node => observer.observe(node));
  return observer;
}

function initAmbientParallax() {
  const root = document.documentElement;
  const portal = document.querySelector('.portal');
  if (!portal) return () => {};
  let pointerFrame = 0;
  let scrollFrame = 0;

  const setPointer = event => {
    if (reducedMotion.matches || !matchMedia('(pointer:fine)').matches || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      const rect = portal.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
      portal.style.setProperty('--pointer-x', x.toFixed(3));
      portal.style.setProperty('--pointer-y', y.toFixed(3));
    });
  };

  const resetPointer = () => {
    portal.style.setProperty('--pointer-x', '0');
    portal.style.setProperty('--pointer-y', '0');
  };

  const setScroll = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      root.style.setProperty('--page-progress', Math.min(1, Math.max(0, scrollY / total)).toFixed(4));
    });
  };

  portal.addEventListener('pointermove', setPointer, { passive: true });
  portal.addEventListener('pointerleave', resetPointer);
  addEventListener('scroll', setScroll, { passive: true });
  addEventListener('resize', setScroll, { passive: true });
  setScroll();

  return () => {
    portal.removeEventListener('pointermove', setPointer);
    portal.removeEventListener('pointerleave', resetPointer);
    removeEventListener('scroll', setScroll);
    removeEventListener('resize', setScroll);
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
  };
}

export function initSignatureMotion() {
  document.documentElement.classList.add('motion-ready');
  const stage = document.getElementById('art-stage');
  const portal = document.querySelector('.portal');
  const gallery = document.querySelector('.gallery-experience');
  let intermissionObserver = initIntermission();
  let revealObserver = initSectionReveals();
  const cleanupAmbient = initAmbientParallax();

  subscribe((_, changed) => {
    if (changed === 'world') {
      pulse(stage, 'world-shift', 900);
      pulse(portal, 'world-copy-shift', 680);
    }
    if (changed === 'artworkIndex') pulse(gallery, 'gallery-shift', 560);
  });

  reducedMotion.addEventListener?.('change', event => {
    document.documentElement.classList.toggle('motion-reduced', event.matches);
    if (event.matches) {
      intermissionObserver?.disconnect();
      revealObserver?.disconnect();
      intermissionObserver = null;
      revealObserver = null;
      stage?.classList.remove('world-shift');
      portal?.classList.remove('world-copy-shift');
      gallery?.classList.remove('gallery-shift');
      document.querySelector('.intermission')?.classList.remove('motion-entered');
      document.querySelectorAll('.motion-reveal').forEach(node => node.classList.add('motion-visible'));
      return;
    }
    intermissionObserver = initIntermission();
    revealObserver = initSectionReveals();
  });

  addEventListener('pagehide', cleanupAmbient, { once: true });
}
