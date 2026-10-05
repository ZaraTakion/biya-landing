/** Crystal/Ghost are design modes, not official lore. */
import { getState, setWorld, subscribe } from './state.js';
import { announce, t, worldCopy } from './i18n.js';
const byId = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function render() {
  const { world } = getState();
  const copy = worldCopy(world);
  document.body.dataset.world = world;
  byId('world-kicker').textContent = copy.kicker;
  // Trusted, hardcoded emphasis tags in editorial translations.
  byId('world-title').innerHTML = copy.title;
  byId('world-description').textContent = copy.desc;
  byId('stage-caption').textContent = copy.caption;
  byId('world-no').textContent = world === 'crystal' ? '1' : '2';
  for (const variant of ['crystal', 'ghost']) {
    byId(`stage-${variant}`).setAttribute('aria-hidden', String(variant !== world));
  }
  document.querySelectorAll('[data-set-world]').forEach(button => {
    const active = button.dataset.setWorld === world;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('is-active', active);
  });
}
function animateWorldCopy() {
  if (reducedMotion.matches || typeof Element === 'undefined' || !Element.prototype.animate) return;
  [byId('world-kicker'), byId('world-title'), byId('world-description'), byId('stage-caption')]
    .filter(Boolean)
    .forEach((element, index) => {
      element.animate(
        [{ opacity: .58 }, { opacity: 1 }],
        { duration: 300 + index * 35, delay: index * 18, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
    });
}
function parallax() {
  if (!matchMedia('(pointer:fine)').matches || reducedMotion.matches) return;
  const portal = document.querySelector('.portal');
  const stage = byId('art-stage');
  let pending = false; let x = 0; let y = 0;
  portal.addEventListener('pointermove', event => {
    const rect = portal.getBoundingClientRect();
    x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    y = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
    if (!pending) { pending = true; requestAnimationFrame(() => {
      stage.style.transform = `translate3d(${x}px,${y}px,0)`;
      pending = false;
    }); }
  }, { passive: true });
  portal.addEventListener('pointerleave', () => { stage.style.transform = ''; });
  reducedMotion.addEventListener?.('change', event => {
    if (event.matches) stage.style.transform = '';
  });
}
export function initWorld() {
  document.querySelectorAll('[data-set-world]').forEach(button => button.addEventListener('click', () => {
    setWorld(button.dataset.setWorld);
  }));
  document.addEventListener('keydown', event => {
    const focused = document.activeElement;
    if (event.key.toLowerCase() !== 'g' || event.ctrlKey || event.altKey || event.metaKey || event.repeat) return;
    if (focused?.isContentEditable || /^(INPUT|SELECT|TEXTAREA)$/.test(focused?.tagName || '')) return;
    if (byId('image-dialog')?.open) return;
    setWorld(getState().world === 'crystal' ? 'ghost' : 'crystal');
  });
  subscribe((state, changed) => {
    if (changed === 'world' || changed === 'language') render();
    if (changed === 'world') {
      animateWorldCopy();
      announce(t('world.announce.' + state.world));
    }
  });
  render();
  parallax();
}
