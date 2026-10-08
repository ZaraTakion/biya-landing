import { useEffect, useRef, useState } from 'react';
import type { Language } from './data';
import { copy } from './data';
import { useDialogAccessibility } from './useDialogAccessibility';

const SEQUENCE = ['b', 'i', 'y', 'a'];

export default function EasterEgg({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogAccessibility(open, dialogRef, () => setOpen(false));

  useEffect(() => {
    let cursor = 0;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;

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
    <div className="easter-layer" role="presentation" onPointerDown={event => {
      if (event.target === event.currentTarget) setOpen(false);
    }}>
      <div className="heart-rain" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index}>♡</span>
        ))}
      </div>
      <div
        ref={dialogRef}
        className="easter-card"
        role="dialog"
        aria-modal="true"
        aria-label={t.easterEgg}
        aria-describedby="easter-hint"
        tabIndex={-1}
      >
        <span className="easter-sigil" aria-hidden="true">✦</span>
        <strong>{t.easterEgg}</strong>
        <p id="easter-hint">{t.easterHint}</p>
        <button type="button" onClick={() => setOpen(false)}>{t.close}</button>
      </div>
    </div>
  );
}
