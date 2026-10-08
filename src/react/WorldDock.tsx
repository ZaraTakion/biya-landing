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
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const portal = document.getElementById('portal');
    const footer = document.querySelector<HTMLElement>('.footer');
    if (!portal) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Reveal the control when the opening composition is almost out of view.
      // Direct geometry also handles programmatic jumps to an archive anchor.
      const remaining = portal.getBoundingClientRect().bottom;
      setPastPortal(remaining < Math.max(140, window.innerHeight * .36));
      // The bottom-fixed control must clear the footer's social and policy
      // links before it can cover them, especially at 320px / zoom.
      if (footer) {
        setNearFooter(footer.getBoundingClientRect().top < window.innerHeight - Math.min(180, window.innerHeight * .26));
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // The full-size frequency selector remains in the portal.
  // Don't overlay interactive game controls, footer navigation or a dialog.
  if (!pastPortal || nearFooter || active === 'game') return null;

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
