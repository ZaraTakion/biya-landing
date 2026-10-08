import { useEffect, useState } from 'react';
import type { Language } from './data';
import { copy } from './data';

const SEQUENCE = ['b', 'i', 'y', 'a'];

export default function EasterEgg({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cursor = 0;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) return;

      const key = event.key.toLowerCase();
      if (key === SEQUENCE[cursor]) {
        cursor += 1;
        if (cursor === SEQUENCE.length) {
          cursor = 0;
          setOpen(true);
        }
        return;
      }
      cursor = key === SEQUENCE[0] ? 1 : 0;
    };

    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;

  const t = copy[language];

  return (
    <div className="easter-layer" role="dialog" aria-modal="true" aria-label={t.easterEgg}>
      <div className="heart-rain" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index}>♡</span>
        ))}
      </div>
      <div className="easter-card">
        <span className="easter-sigil" aria-hidden="true">✦</span>
        <strong>{t.easterEgg}</strong>
        <p>{t.easterHint}</p>
        <button type="button" onClick={() => setOpen(false)}>{t.close}</button>
      </div>
    </div>
  );
}
