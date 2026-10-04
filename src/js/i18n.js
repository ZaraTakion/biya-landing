/** Only one language is active at a time; all runtime states use this dictionary. */
import * as pt from '../data/translations/pt-BR.js';
import * as en from '../data/translations/en.js';
import { getState, setLanguage, subscribe } from './state.js';
const dictionary = { pt, en };
const htmlKeys = new Set([
  'portfolio', 'world.file', 'chapter2', 'archive.title',
  'intermission.title', 'signal.title', 'about.title', 'footer.title'
]);
export function t(key) { return dictionary[getState().language].strings[key] ?? key; }
export function worldCopy(world) { return dictionary[getState().language].worlds[world]; }
export function artworkCopy(index) { return dictionary[getState().language].artworkCopy[index]; }
export function languageLabel() { return getState().language === 'pt' ? 'pt-BR' : 'en'; }
export function announce(message) {
  const live = document.getElementById('interaction-status');
  if (live) { live.textContent = ''; requestAnimationFrame(() => { live.textContent = message; }); }
}
/** Controlled HTML fragments from code only, never user input or remote metadata. */
function paintStaticTranslations() {
  document.documentElement.lang = languageLabel();
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(node => {
    const key = node.dataset.i18nHtml;
    if (htmlKeys.has(key)) node.innerHTML = t(key);
  });
  for (const [attr, dataName] of [['aria-label', 'i18nAriaLabel'], ['alt', 'i18nAlt'], ['content', 'i18nContent']]) {
    document.querySelectorAll(`[data-i18n-${attr}]`).forEach(node => {
      node.setAttribute(attr, t(node.dataset[dataName]));
    });
  }
  document.title = t('document.title');
  document.querySelectorAll('[data-set-language]').forEach(button => {
    const selected = button.dataset.setLanguage === getState().language;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('is-current', selected);
  });
}
export function initI18n() {
  document.querySelectorAll('[data-set-language]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.setLanguage));
  });
  subscribe((state, changed) => { if (changed === 'language') paintStaticTranslations(); });
  paintStaticTranslations();
}
