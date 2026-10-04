/** Application entry point, no bundler or heavy framework necessary. */
import { initI18n, t } from './i18n.js';
import { initWorld } from './world.js';
import { initGallery } from './gallery.js';
import { initNavigation } from './navigation.js';
import { media } from '../data/media.js';
import { subscribe } from './state.js';

function renderMediaLabels() {
  document.querySelectorAll('[data-broadcast]').forEach(link => {
    const item = media[Number(link.dataset.broadcast)];
    if (!item) return;
    const name = item.label || t('signal.third');
    link.setAttribute('aria-label', `${name}: ${t('signal.channel')}`);
  });
}

initI18n();
initWorld();
initGallery();
initNavigation();
renderMediaLabels();
subscribe((state, type) => { if (type === 'language') renderMediaLabels(); });
