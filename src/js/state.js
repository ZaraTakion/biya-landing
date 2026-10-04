/** Single source of truth for the UI. Never persist the art-direction state as lore. */
const STORE_KEY = 'biya-language';
const validLanguages = new Set(['pt', 'en']);
const validWorlds = new Set(['crystal', 'ghost']);
const listeners = new Set();

function storedLanguage() {
  try {
    const stored = localStorage.getItem(STORE_KEY);
    return validLanguages.has(stored) ? stored : 'pt';
  } catch { return 'pt'; }
}
const current = { language: storedLanguage(), world: 'crystal', artworkIndex: 0 };
export function getState() { return { ...current }; }
export function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
function notify(property) { const snapshot = getState(); for (const listener of listeners) listener(snapshot, property); }
export function setLanguage(language) {
  if (!validLanguages.has(language) || language === current.language) return;
  current.language = language;
  try { localStorage.setItem(STORE_KEY, language); } catch { /* Storage is optional. */ }
  notify('language');
}
export function setWorld(world) {
  if (!validWorlds.has(world) || world === current.world) return;
  current.world = world;
  notify('world');
}
export function setArtworkIndex(index, length) {
  if (!Number.isInteger(index) || !Number.isInteger(length) || length < 1) return;
  current.artworkIndex = ((index % length) + length) % length;
  notify('artworkIndex');
}
