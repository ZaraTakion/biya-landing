import { useEffect, useState } from 'react';
import type { Language, World } from './data';

interface Props {
  language: Language;
  world: World;
  active: string;
  setWorld: (world: World) => void;
}

/**
 * A small, functional frequency controller shown only after visitors
 * leave the portal. No illustrations are altered or duplicated.
 */
export default function WorldDock({ language, world, active, setWorld }: Props) {
  const [pastPortal, setPastPortal] = useState(false);

  useEffect(() => {
    const portal = document.getElementById('portal');
    if (!portal) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setPastPortal(!entry.isIntersecting && entry.boundingClientRect.bottom < 140);
    }, { rootMargin: '-115px 0px 0px 0px', threshold: 0 });
    observer.observe(portal);
    return () => observer.disconnect();
  }, []);

  // The full-size frequency selector remains in the portal.
  // Don't overlay interactive game controls or an open modal.
  if (!pastPortal || active === 'portal' || active === 'game') return null;

  return (
    <aside className="biya-world-dock" aria-label={language === 'pt' ? 'Mudar a atmosfera do site' : 'Change the site atmosphere'}>
      <span className="biya-world-dock-label" aria-hidden="true">✦ {language === 'pt' ? 'FREQUÊNCIA' : 'FREQUENCY'}</span>
      <div className="biya-world-dock-options" role="group" aria-label={language === 'pt' ? 'Universo visual' : 'Visual world'}>
        {(['crystal', 'ghost'] as const).map(option => (
          <button
            key={option}
            type="button"
            className={option === world ? 'is-current' : ''}
            aria-pressed={option === world}
            aria-label={language === 'pt' ? `Mudar para ${option === 'crystal' ? 'Crystal' : 'Ghost'}` : `Switch to ${option === 'crystal' ? 'Crystal' : 'Ghost'}`}
            onClick={() => setWorld(option)}
          >
            <span aria-hidden="true" className="biya-world-dock-icon">{option === 'crystal' ? '◇' : '◌'}</span>
            <span>{option === 'crystal' ? 'CRYSTAL' : 'GHOST'}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
