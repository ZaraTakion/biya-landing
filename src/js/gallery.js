/** Gallery navigation, keyboard support, swipe, image dialog & accessible state. */
import { artworks } from '../data/artworks.js';
import { getState, subscribe, setArtworkIndex } from './state.js';
import { artworkCopy, announce, t } from './i18n.js';
const $ = id => document.getElementById(id);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let lastTrigger = null;
let fadeTimer = null;
let dots = [];
function currentArt() {
  const i = getState().artworkIndex;
  return { ...artworks[i], ...artworkCopy(i) };
}
function render() {
  const i = getState().artworkIndex;
  const a = currentArt();
  const image = $('gallery-image');
  // Explicit dimensions avoid layout shifts when navigating differently-sized images.
  image.src = a.src;
  image.alt = a.alt;
  image.width = a.width;
  image.height = a.height;
  $('gallery-title').textContent = a.title;
  $('gallery-tag').textContent = a.tag;
  $('gallery-desc').textContent = a.desc;
  $('gallery-count').textContent = `${String(i+1).padStart(2, '0')} — ${String(artworks.length).padStart(2, '0')}`;
  dots.forEach((button, index) => {
    button.classList.toggle('is-active', index === i);
    button.setAttribute('aria-current', index === i ? 'true' : 'false');
    button.setAttribute('aria-label', `${t('gallery.dots.aria')}: ${index+1}, ${artworkCopy(index).title}`);
  });
  if ($('image-dialog').open) {
    $('dialog-image').src = a.src;
    $('dialog-image').alt = a.alt;
    $('dialog-image').width = a.width;
    $('dialog-image').height = a.height;
    $('dialog-title').textContent = a.title;
  }
}
function show(index) {
  clearTimeout(fadeTimer);
  $('gallery-image').classList.remove('is-changing');
  setArtworkIndex(index, artworks.length);
  if (!reduceMotion.matches) {
    // Fade only after the state update, not while the image might be missing.
    $('gallery-image').classList.add('is-changing');
    fadeTimer = setTimeout(() => $('gallery-image').classList.remove('is-changing'), 170);
  }
}
function modal() {
  lastTrigger = document.activeElement;
  const art = currentArt();
  $('dialog-image').src = art.src;
  $('dialog-image').alt = art.alt;
  $('dialog-image').width = art.width;
  $('dialog-image').height = art.height;
  $('dialog-title').textContent = art.title;
  $('image-dialog').showModal();
  $('dialog-close').focus();
}
export function initGallery() {
  dots = artworks.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.addEventListener('click', () => show(index));
    $('gallery-dots').append(button);
    return button;
  });
  $('gallery-next').addEventListener('click', () => show(getState().artworkIndex + 1));
  $('gallery-prev').addEventListener('click', () => show(getState().artworkIndex - 1));
  const gallery = document.querySelector('.gallery-experience');
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(getState().artworkIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let startX = null;
  gallery.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') startX = event.clientX;
  });
  gallery.addEventListener('pointerup', event => {
    if (event.pointerType !== 'mouse' && startX !== null && Math.abs(event.clientX - startX) >= 50) {
      show(getState().artworkIndex + (event.clientX < startX ? 1 : -1));
    }
    startX = null;
  });
  gallery.addEventListener('pointercancel', () => { startX = null; });
  $('gallery-expand').addEventListener('click', modal);
  $('dialog-close').addEventListener('click', () => $('image-dialog').close());
  $('image-dialog').addEventListener('click', e => { if (e.target === $('image-dialog')) $('image-dialog').close(); });
  $('image-dialog').addEventListener('close', () => lastTrigger?.focus());
  subscribe((state, changed) => {
    if (changed === 'artworkIndex' || changed === 'language') render();
    if (changed === 'artworkIndex') {
      const a = currentArt();
      announce(t('gallery.announce').replace('{index}', String(state.artworkIndex+1)).replace('{total}', String(artworks.length)).replace('{title}', a.title));
    }
  });
  render();
}
