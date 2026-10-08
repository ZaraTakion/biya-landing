import { useEffect, useRef, useState } from 'react';
import type { Language, World } from './data';
import { copy } from './data';
import { nextWorld, resolvePulse, type PulseItem } from './gameLogic';

type Status = 'idle' | 'running' | 'over';

const BEST_KEY = 'biya-parallel-pulse-best';

function drawCrystal(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#d8d8ff';
  ctx.strokeStyle = '#8e78c9';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(-r * 0.72, -r * 0.72, r * 1.44, r * 1.44);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawGhost(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#b989df';
  ctx.strokeStyle = '#553265';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -r * 0.18, r * 0.78, Math.PI, 0);
  ctx.lineTo(r * 0.78, r * 0.56);
  ctx.quadraticCurveTo(r * 0.38, r * 0.2, 0, r * 0.6);
  ctx.quadraticCurveTo(-r * 0.38, r * 0.2, -r * 0.78, r * 0.56);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#25192e';
  ctx.beginPath();
  ctx.arc(-r * 0.25, -r * 0.12, r * 0.08, 0, Math.PI * 2);
  ctx.arc(r * 0.25, -r * 0.12, r * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export default function MiniGame({ language }: { language: Language }) {
  const t = copy[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World>('crystal');
  const statusRef = useRef<Status>('idle');
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const missesRef = useRef(0);
  const bestRef = useRef(0);
  const toggleRef = useRef<() => void>(() => undefined);

  const [world, setWorld] = useState<World>('crystal');
  const [status, setStatus] = useState<Status>('idle');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [misses, setMisses] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      const saved = Number.parseInt(localStorage.getItem(BEST_KEY) ?? '0', 10);
      if (Number.isFinite(saved) && saved > 0) {
        bestRef.current = saved;
        setBest(saved);
      }
    } catch {
      // Storage is optional.
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 720;
    let height = 390;
    let dpr = 1;
    let raf = 0;
    let previous = performance.now();
    let spawnClock = 0;
    let nextId = 1;
    let items: PulseItem[] = [];
    let particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; world: World }> = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(300, Math.round(rect.width));
      height = Math.max(270, Math.min(440, Math.round(width * (window.innerWidth < 600 ? 0.74 : 0.54))));
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const reset = () => {
      items = [];
      particles = [];
      spawnClock = 0;
      scoreRef.current = 0;
      comboRef.current = 0;
      missesRef.current = 0;
      worldRef.current = 'crystal';
      setScore(0);
      setCombo(0);
      setMisses(0);
      setWorld('crystal');
    };

    const finish = () => {
      statusRef.current = 'over';
      setStatus('over');
      if (scoreRef.current > bestRef.current) {
        bestRef.current = scoreRef.current;
        setBest(scoreRef.current);
        try {
          localStorage.setItem(BEST_KEY, String(scoreRef.current));
        } catch {
          // Storage is optional.
        }
      }
    };

    const start = () => {
      if (statusRef.current === 'running') return;
      reset();
      statusRef.current = 'running';
      setStatus('running');
    };

    const toggle = () => {
      if (statusRef.current !== 'running') {
        start();
        return;
      }
      const next = nextWorld(worldRef.current);
      worldRef.current = next;
      setWorld(next);
    };
    toggleRef.current = toggle;

    const spawn = () => {
      const kind: World = Math.random() > 0.5 ? 'crystal' : 'ghost';
      items.push({
        id: nextId++,
        x: width + 42,
        y: 60 + Math.random() * Math.max(80, height - 120),
        kind,
        radius: 15 + Math.random() * 6,
        speed: 150 + Math.min(150, scoreRef.current * 0.45),
      });
    };

    const burst = (x: number, y: number, kind: World) => {
      for (let i = 0; i < 8; i += 1) {
        const angle = (Math.PI * 2 * i) / 8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * (35 + Math.random() * 55),
          vy: Math.sin(angle) * (35 + Math.random() * 55),
          life: 0.65,
          world: kind,
        });
      }
    };

    const update = (dt: number) => {
      if (statusRef.current !== 'running') return;

      spawnClock += dt;
      const interval = Math.max(0.64, 1.18 - scoreRef.current * 0.0018);
      if (spawnClock >= interval) {
        spawnClock = 0;
        spawn();
      }

      const captureX = width * 0.22;
      for (const item of items) {
        item.x -= item.speed * dt;
        if (item.x <= captureX && item.x > captureX - item.speed * dt - 8) {
          const result = resolvePulse(
            worldRef.current,
            item.kind,
            scoreRef.current,
            comboRef.current,
            missesRef.current,
          );
          scoreRef.current = result.score;
          comboRef.current = result.combo;
          missesRef.current = result.misses;
          setScore(result.score);
          setCombo(result.combo);
          setMisses(result.misses);
          burst(captureX, item.y, item.kind);
          item.x = -1000;
          if (result.misses >= 3) finish();
        }
      }

      items = items.filter(item => item.x > -80);

      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      }
      particles = particles.filter(p => p.life > 0);
    };

    const draw = () => {
      const ghost = worldRef.current === 'ghost';
      const bg = ctx.createLinearGradient(0, 0, width, height);
      if (ghost) {
        bg.addColorStop(0, '#130f1d');
        bg.addColorStop(0.55, '#2e2040');
        bg.addColorStop(1, '#171221');
      } else {
        bg.addColorStop(0, '#f8f7ff');
        bg.addColorStop(0.58, '#e8e8f8');
        bg.addColorStop(1, '#f2ddea');
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.globalAlpha = ghost ? 0.18 : 0.13;
      ctx.strokeStyle = ghost ? '#b786dd' : '#8075c8';
      ctx.lineWidth = 1;
      const spacing = 56;
      const offset = (performance.now() * 0.012) % spacing;
      for (let x = -spacing + offset; x < width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const captureX = width * 0.22;
      const pulse = (Math.sin(performance.now() * 0.004) + 1) / 2;
      ctx.strokeStyle = ghost ? '#d7adf1' : '#8e85c8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(captureX, height / 2, 38 + pulse * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(captureX, height / 2, 51 + pulse * 6, 0, Math.PI * 2);
      ctx.globalAlpha = 0.18 + pulse * 0.16;
      ctx.stroke();
      ctx.globalAlpha = 1;

      for (const item of items) {
        if (item.kind === 'crystal') drawCrystal(ctx, item.x, item.y, item.radius);
        else drawGhost(ctx, item.x, item.y, item.radius);
      }

      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life * 1.6);
        ctx.fillStyle = p.world === 'crystal' ? '#f8d8ef' : '#c49be2';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = ghost ? '#f4eafb' : '#28243a';
      ctx.font = '900 11px Arial';
      ctx.fillText(ghost ? 'GHOST // 02' : 'CRYSTAL // 01', 18, 26);

      if (statusRef.current !== 'running') {
        ctx.fillStyle = ghost ? 'rgba(13,9,18,.66)' : 'rgba(247,245,255,.76)';
        ctx.fillRect(0, 0, width, height);

        if (statusRef.current === 'idle') {
          ctx.save();
          ctx.globalAlpha = ghost ? 0.72 : 0.62;
          drawCrystal(ctx, width * 0.70, height * 0.34, 16);
          drawGhost(ctx, width * 0.78, height * 0.66, 19);
          ctx.fillStyle = ghost ? 'rgba(245,232,252,.72)' : 'rgba(55,45,72,.58)';
          ctx.font = '900 8px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('CRYSTAL', width * 0.70, height * 0.34 + 35);
          ctx.fillText('GHOST', width * 0.78, height * 0.66 + 38);
          ctx.textAlign = 'start';
          ctx.strokeStyle = ghost ? 'rgba(218,177,238,.42)' : 'rgba(125,107,174,.34)';
          ctx.setLineDash([5, 7]);
          ctx.beginPath();
          ctx.moveTo(width * 0.64, height * 0.50);
          ctx.lineTo(width * 0.84, height * 0.50);
          ctx.stroke();
          ctx.restore();
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = ghost ? '#f6e8ff' : '#28243a';
        ctx.font = '900 23px Arial';
        ctx.fillText(statusRef.current === 'over' ? t.gameOver : t.gameReady, width / 2, height / 2 - 5);
        ctx.font = '700 11px Arial';
        ctx.fillText(t.gameHow, width / 2, height / 2 + 25);
        ctx.textAlign = 'start';
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.034, (now - previous) / 1000);
      previous = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    raf = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      toggleRef.current = () => undefined;
    };
  }, [t.gameHow, t.gameOver, t.gameReady]);

  const activate = () => {
    toggleRef.current();
    canvasRef.current?.focus();
  };

  return (
    <section className="pulse-section" id="game" aria-labelledby="pulse-title">
      <div className="section-number">
        <span>{t.gameChapter}</span>
        <span>{world === 'crystal' ? t.gameCrystal : t.gameGhost}</span>
      </div>
      <div className="pulse-layout">
        <div className="pulse-copy" data-reveal>
          <p className="mini-label">CRYSTAL × GHOST / ARCADE</p>
          <h2 id="pulse-title">{t.gameTitle}</h2>
          <p>{t.gameDesc}</p>
          <p className="pulse-help" id="pulse-help">{t.gameHow}</p>
        </div>
        <div className="pulse-machine" data-world={world} data-reveal>
          <div className="pulse-hud" aria-live="polite">
            <div><span>{t.gameScore}</span><strong>{score}</strong></div>
            <div><span>{t.gameCombo}</span><strong>×{combo}</strong></div>
            <div><span>{t.gameBest}</span><strong>{best}</strong></div>
            <div><span>MISS</span><strong>{misses}/3</strong></div>
          </div>
          <canvas
            ref={canvasRef}
            className="pulse-canvas"
            tabIndex={0}
            aria-label={t.gameHow}
            aria-describedby="pulse-help"
            onPointerDown={event => {
              event.preventDefault();
              activate();
            }}
            onKeyDown={event => {
              if ([' ', 'Enter', 'ArrowUp'].includes(event.key)) {
                event.preventDefault();
                activate();
              }
            }}
          />
          <button className="pulse-button" type="button" onClick={activate}>
            {status === 'over' ? t.gameRetry : status === 'idle' ? t.gameStart : world === 'crystal' ? t.gameGhost : t.gameCrystal}
          </button>
        </div>
      </div>
    </section>
  );
}
