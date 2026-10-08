import { useEffect, useMemo, useRef, useState } from 'react';
import EasterEgg from './EasterEgg';
import MiniGame from './MiniGame';
import { artworks, copy, links, media, worlds, type Language, type World } from './data';
import { useArtworkDeterrence, useDocumentMeta, useImmersion, useWorldBody } from './useImmersion';

const externalRel = 'noopener noreferrer';

function useActiveSection() {
  const [active, setActive] = useState('portal');

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
    if (!('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id);
      }
    }, { rootMargin: '-30% 0px -52% 0px', threshold: 0.01 });

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      setProgress(Math.min(100, Math.max(0, (scrollY / total) * 100)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

function ProtectedImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <span className="protected-frame">
      <img
        {...props}
        className={`protected-art ${props.className ?? ''}`.trim()}
        draggable={false}
      />
      <span className="rights-badge" aria-hidden="true">© RIGHTS PRESERVED</span>
    </span>
  );
}

function Header({
  language,
  setLanguage,
  active,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
  active: string;
}) {
  const t = copy[language];
  const nav = [
    ['portal', t.nav[0]],
    ['archive', t.nav[1]],
    ['signal', t.nav[2]],
    ['game', t.nav[3]],
    ['about', t.nav[4]],
  ] as const;

  return (
    <>
      <div className="concept-bar">
        <span>BIYA / PARALLEL WORLDS</span>
        <span className="bar-middle">{t.concept}</span>
        <span>{t.role}</span>
      </div>
      <header className="header">
        <a aria-label="Biya, back to start" className="brand" href="#portal">
          B<span aria-hidden="true">✦</span>YA <span className="brand-mark">/ 02</span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          {nav.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'current' : undefined}
              aria-current={active === id ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="language-switch" role="group" aria-label={language === 'pt' ? 'Idioma' : 'Language'}>
          {(['pt', 'en'] as const).map(value => (
            <button
              key={value}
              type="button"
              lang={value === 'pt' ? 'pt-BR' : 'en'}
              className={`language-option ${language === value ? 'is-current' : ''}`}
              aria-pressed={language === value}
              onClick={() => setLanguage(value)}
            >
              {value.toUpperCase()}
            </button>
          ))}
        </div>
        <a className="header-link" href={links.x} rel={externalRel} target="_blank">
          @BIYA_YU <span aria-hidden="true">↗</span>
        </a>
      </header>
    </>
  );
}

function Portal({
  language,
  world,
  setWorld,
}: {
  language: Language;
  world: World;
  setWorld: (world: World) => void;
}) {
  const t = copy[language];
  const w = worlds[language][world];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) return;
      if (event.key.toLowerCase() === 'g' && !event.repeat && !event.metaKey && !event.ctrlKey && !event.altKey) {
        setWorld(world === 'crystal' ? 'ghost' : 'crystal');
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [world, setWorld]);

  return (
    <section className="portal" id="portal" aria-labelledby="portal-title">
      <div className="portal-noise" aria-hidden="true" />
      <div className="portal-grid" aria-hidden="true" />
      <div className="aura aura-left" aria-hidden="true" />
      <div className="aura aura-right" aria-hidden="true" />
      <div className="world-ambient" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <i key={index} className={`ambient-node ambient-${(index % 5) + 1}`} />)}
        <span className="ambient-sigil ambient-sigil-a">✦</span>
        <span className="ambient-sigil ambient-sigil-b">✧</span>
        <span className="ambient-sigil ambient-sigil-c">✦</span>
      </div>
      <span className="portal-serial" aria-hidden="true">CAP.01 / PORTAL</span>

      <div className="portal-copy" data-reveal>
        <div className="section-index">
          <span className="index-orb" />
          <span>{t.welcome}</span>
          <span className="index-line" />
          <span>001</span>
        </div>
        <p className="hero-kicker">{w.kicker}</p>
        <h1 id="portal-title">BIYA<span className="hero-period">.</span></h1>
        <p className="hero-subtitle">
          {w.titleLead}<br />{language === 'pt' ? 'e ' : ''}<em>{w.titleAccent}</em>
        </p>
        <p className="hero-description">{w.desc}</p>

        <div className="world-control" role="group" aria-label={language === 'pt' ? 'Escolha o universo visual' : 'Choose a visual world'}>
          <span className="switch-name">{t.switchLabel}</span>
          <div className="world-buttons">
            {(['crystal', 'ghost'] as const).map((value, index) => (
              <button
                key={value}
                type="button"
                className={`world-choice ${world === value ? 'is-active' : ''}`}
                aria-pressed={world === value}
                onClick={() => setWorld(value)}
              >
                <span className="world-indicator" />
                {value.toUpperCase()}
                <span className="shortcut">0{index + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hero-actions">
          <a className="button-enter" href="#archive">
            <span>{t.explore}</span><span className="button-symbol" aria-hidden="true">↗</span>
          </a>
          <a className="hero-plain" href={links.vgen} rel={externalRel} target="_blank">
            {t.portfolio} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="art-stage" id="art-stage" aria-label={t.stageAria} data-reveal>
        <div className="stage-shadow" aria-hidden="true" />
        <div className="stage-shape stage-shape-a" aria-hidden="true" />
        <div className="stage-shape stage-shape-b" aria-hidden="true" />
        <div className="stage-inner">
          <ProtectedImage
            id="stage-crystal"
            className="stage-visual"
            src="/assets/avatars/crystal.webp"
            alt={t.crystalAlt}
            width={768}
            height={1280}
            fetchPriority="high"
            decoding="async"
            aria-hidden={world !== 'crystal'}
          />
          <ProtectedImage
            id="stage-ghost"
            className="stage-visual"
            src="/assets/avatars/ghost.webp"
            alt={t.ghostAlt}
            width={1700}
            height={1160}
            fetchPriority="low"
            decoding="async"
            aria-hidden={world !== 'ghost'}
          />
        </div>
        <div className="stage-sticker">
          <span className="sticker-symbol" aria-hidden="true">✳</span>
          <span>BIYA<br />ART<br />STUDIO</span>
        </div>
        <span className="stage-corner corner-top">WORLD_0{world === 'crystal' ? '1' : '2'}</span>
        <span className="stage-corner corner-bottom">{w.caption}</span>
        <span className="stage-vertical" aria-hidden="true">ART / IDENTITY / PARALLEL WORLDS</span>
      </div>

      <div className="portal-bottom">
        <span>{language === 'pt' ? 'EXPLORE AS OBRAS' : 'EXPLORE THE ARTWORK'}</span>
        <span className="bottom-sigil" aria-hidden="true">✧　✦　✧</span>
        <a aria-label={language === 'pt' ? 'Ir para o arquivo de artes' : 'Go to art archive'} href="#archive">↓</a>
      </div>
    </section>
  );
}

function Ribbon({ language }: { language: Language }) {
  const words = language === 'pt'
    ? ['ILUSTRAÇÃO', 'VTUBER', 'PERSONAGENS & ILUSTRAÇÕES', 'CRYSTAL / GHOST', 'ILUSTRAÇÃO', 'VTUBER']
    : ['ILLUSTRATION', 'VTUBER', 'CHARACTERS & ILLUSTRATION', 'CRYSTAL / GHOST', 'ILLUSTRATION', 'VTUBER'];

  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-inner">
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>{word}{index < words.length - 1 ? '　✳' : ''}</span>
        ))}
      </div>
    </div>
  );
}

function Archive({ language }: { language: Language }) {
  const t = copy[language];
  const [index, setIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const startX = useRef<number | null>(null);
  const art = artworks[index];
  const artCopy = art[language];

  const show = (next: number) => setIndex((next + artworks.length) % artworks.length);

  return (
    <section className="archive" id="archive" aria-labelledby="archive-title">
      <div className="archive-decor" aria-hidden="true">A</div>
      <div className="archive-heading" data-reveal>
        <div>
          <span className="mini-label"><span className="little-cross">✳</span>{t.archiveChapter}</span>
          <h2 id="archive-title">{t.archiveTitleA}<br /><em>{t.archiveTitleB}</em></h2>
        </div>
        <div className="archive-lede">
          <span>{t.archivePre}</span>
          <p>{t.archiveDesc}</p>
          <span className="archive-lede-arrow">↙</span>
        </div>
      </div>

      <div
        className="gallery-experience"
        role="group"
        aria-label={language === 'pt' ? 'Visualizador interativo de artes da Biya' : 'Interactive viewer for Biya’s art'}
        tabIndex={0}
        data-reveal
        onKeyDown={event => {
          if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
        }}
        onPointerDown={event => {
          if (event.pointerType !== 'mouse') startX.current = event.clientX;
        }}
        onPointerUp={event => {
          if (event.pointerType !== 'mouse' && startX.current !== null && Math.abs(event.clientX - startX.current) >= 50) {
            show(index + (event.clientX < startX.current ? 1 : -1));
          }
          startX.current = null;
        }}
      >
        <div className="art-showcase">
          <div className="gallery-halo" aria-hidden="true" />
          <span className="gallery-cross gallery-cross-tl" aria-hidden="true">+</span>
          <span className="gallery-cross gallery-cross-br" aria-hidden="true">+</span>
          <ProtectedImage
            id="gallery-image"
            src={art.src}
            alt={artCopy.alt}
            width={art.width}
            height={art.height}
            loading="lazy"
            decoding="async"
          />
          <div className="showcase-controls">
            <button className="round-arrow" type="button" aria-label={t.previous} onClick={() => show(index - 1)}>←</button>
            <button className="round-arrow" type="button" aria-label={t.next} onClick={() => show(index + 1)}>→</button>
          </div>
          <button className="expand-art" type="button" onClick={() => setDialogOpen(true)}>{t.expand}</button>
        </div>
        <div className="gallery-info">
          <span className="gallery-serial">
            <span>ARCHIVE / BIYA_YU</span>
            <span>{String(index + 1).padStart(2, '0')} — {String(artworks.length).padStart(2, '0')}</span>
          </span>
          <div className="gallery-title-area">
            <p>{artCopy.tag}</p>
            <h3>{artCopy.title}</h3>
            <p>{artCopy.desc}</p>
          </div>
          <div className="gallery-bottom">
            <div className="gallery-dots" aria-label={language === 'pt' ? 'Selecionar obra' : 'Select artwork'}>
              {artworks.map((item, dotIndex) => (
                <button
                  key={item.id}
                  type="button"
                  className={dotIndex === index ? 'is-active' : undefined}
                  aria-label={`${dotIndex + 1}: ${item[language].title}`}
                  aria-current={dotIndex === index}
                  onClick={() => show(dotIndex)}
                />
              ))}
            </div>
            <span>{language === 'pt' ? 'DESLIZE / ◀ ▶' : 'SWIPE / ◀ ▶'}</span>
          </div>
        </div>
      </div>

      <div className="archive-footer">
        <span>{language === 'pt' ? 'UMA SELEÇÃO DO ACERVO DA BIYA' : 'A SELECTION FROM BIYA’S COLLECTION'}</span>
        <span>{t.archiveFooter}</span>
      </div>

      {dialogOpen && (
        <div className="react-dialog-backdrop" role="presentation" onPointerDown={event => {
          if (event.target === event.currentTarget) setDialogOpen(false);
        }}>
          <div className="react-dialog" role="dialog" aria-modal="true" aria-label={artCopy.title}>
            <div className="dialog-top">
              <span>{artCopy.title}</span>
              <button type="button" onClick={() => setDialogOpen(false)}>{language === 'pt' ? '✕ FECHAR' : '✕ CLOSE'}</button>
            </div>
            <ProtectedImage src={art.src} alt={artCopy.alt} width={art.width} height={art.height} />
            <p className="dialog-rights">{t.rightsShort}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function Intermission({ language }: { language: Language }) {
  return (
    <section className="intermission" aria-label={language === 'pt' ? 'Transição entre universos' : 'Transition between worlds'}>
      <div className="intermission-ink" aria-hidden="true">{language === 'pt' ? 'O OUTRO LADO' : 'THE OTHER SIDE'}</div>
      <p data-reveal>{copy[language].intermission}</p>
      <div className="intermission-symbol" aria-hidden="true">✦</div>
    </section>
  );
}

function Signal({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <section className="signal" id="signal" aria-labelledby="signal-title">
      <div className="section-number">
        <span>{t.signalChapter}</span>
        <span>{language === 'pt' ? 'DO OUTRO LADO DA TELA' : 'ON THE OTHER SIDE OF THE SCREEN'}</span>
      </div>
      <div className="signal-heading" data-reveal>
        <h2 id="signal-title">{t.signalTitleA} <em>{t.signalTitleB}</em><span>↗</span></h2>
        <p>{t.signalDesc}</p>
      </div>
      <div className="signal-rail">
        {media.map((item, index) => (
          <a
            key={item.src}
            className={`broadcast broadcast-${['one', 'two', 'three'][index]}`}
            href={links.youtube}
            rel={externalRel}
            target="_blank"
            data-reveal
          >
            <div className="broadcast-thumb">
              <ProtectedImage src={item.src} alt={item.label} width={item.width} height={item.height} loading="lazy" />
              <span className="broadcast-play" aria-hidden="true">↗</span>
            </div>
            <div className="broadcast-meta">
              <span>{String(index + 1).padStart(2, '0')} / {language === 'pt' ? 'ARQUIVO DE LIVES' : 'STREAM ARCHIVE'}</span>
              <strong>{item.label}</strong>
              <span>{t.channel}</span>
            </div>
          </a>
        ))}
      </div>
      <div className="signal-end">
        <span>{language === 'pt' ? 'CONHEÇA AS TRANSMISSÕES' : 'EXPLORE THE STREAMS'}</span>
        <a href={links.youtube} rel={externalRel} target="_blank">{t.channel}</a>
      </div>
    </section>
  );
}

function About({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <span className="about-signal" aria-hidden="true">SIGNAL / 005</span>
      <div className="about-art" data-reveal>
        <div className="about-sun" aria-hidden="true" />
        <ProtectedImage
          src="/assets/avatars/casual.webp"
          alt={language === 'pt' ? 'Personagem da Biya com boné e roupa clara' : 'Biya’s character wearing a cap and light outfit'}
          width={1536}
          height={2048}
          loading="lazy"
        />
        <span className="about-picture-caption">{language === 'pt' ? 'VISUAL DA PERSONAGEM · ROUPA ALTERNATIVA' : 'CHARACTER VISUAL · ALTERNATE OUTFIT'}</span>
      </div>
      <div className="about-copy" data-reveal>
        <span className="mini-label">{t.aboutChapter}</span>
        <p className="script-word">{t.aboutScript}</p>
        <h2 id="about-title">{t.aboutTitleA}<br /><em>{t.aboutTitleB}</em></h2>
        <p className="about-description">{t.aboutDesc}</p>
        <div className="social-table">
          <a href={links.x} rel={externalRel} target="_blank">
            <span>X / TWITTER</span><strong>@BiyA_YU</strong><span>↗</span>
          </a>
          <a href={links.vgen} rel={externalRel} target="_blank">
            <span>{t.commissions}</span><strong>VGEN</strong><span>↗</span>
          </a>
          <a href={links.youtube} rel={externalRel} target="_blank">
            <span>{t.videos}</span><strong>YOUTUBE</strong><span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ language }: { language: Language }) {
  const t = copy[language];
  return (
    <footer className="footer">
      <div className="footer-top">
        <p>{t.footerTitle}</p>
        <a href="#portal">{t.back}</a>
      </div>
      <button
        className="footer-wordmark easter-trigger"
        type="button"
        aria-label={language === 'pt' ? 'Biya' : 'Biya'}
        onClick={() => {
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'i' }));
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y' }));
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
        }}
      >
        B<span>✦</span>YA
      </button>
      <div className="footer-bottom">
        <span>BIYA / PARALLEL WORLDS</span>
        <span>{t.protection}</span>
        <span>{t.authorized}</span>
        <a className="footer-policy" href="/art-policy.html">{t.policy}</a>
      </div>
    </footer>
  );
}

function RailNav({ language, active }: { language: Language; active: string }) {
  const labels = language === 'pt'
    ? [['portal', 'PORTAL'], ['archive', 'ARQUIVO'], ['signal', 'SINAL'], ['game', 'JOGO'], ['about', 'SOBRE']]
    : [['portal', 'PORTAL'], ['archive', 'ARCHIVE'], ['signal', 'SIGNAL'], ['game', 'GAME'], ['about', 'ABOUT']];

  return (
    <nav className="rail-nav" aria-label={language === 'pt' ? 'Navegação por capítulos' : 'Chapter navigation'}>
      {labels.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={active === id ? 'is-active' : undefined} aria-current={active === id ? 'location' : undefined}>
          <span className="rail-dot" /><span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('biya-language') === 'en' ? 'en' : 'pt';
    } catch {
      return 'pt';
    }
  });
  const [world, setWorld] = useState<World>('crystal');
  const active = useActiveSection();
  const progress = useScrollProgress();
  const t = useMemo(() => copy[language], [language]);

  useDocumentMeta(t.title, t.description, t.htmlLang);
  useWorldBody(world);
  useImmersion();
  useArtworkDeterrence();

  useEffect(() => {
    try {
      localStorage.setItem('biya-language', language);
    } catch {
      // Storage is optional.
    }
  }, [language]);

  return (
    <>
      <a className="skip-link" href="#main">{language === 'pt' ? 'Pular para o conteúdo' : 'Skip to content'}</a>
      <div className="progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <Header language={language} setLanguage={setLanguage} active={active} />
      <main id="main">
        <Portal language={language} world={world} setWorld={setWorld} />
        <Ribbon language={language} />
        <Archive language={language} />
        <Intermission language={language} />
        <Signal language={language} />
        <MiniGame language={language} />
        <About language={language} />
        <Footer language={language} />
      </main>
      <RailNav language={language} active={active} />
      <EasterEgg language={language} />
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {world === 'crystal' ? worlds[language].crystal.caption : worlds[language].ghost.caption}
      </p>
    </>
  );
}
