import { useEffect } from 'react';
import type { World } from './data';

export function useDocumentMeta(title: string, description: string, lang: string) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description;
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;
    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;
    const twTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    if (twTitle) twTitle.content = title;
    const twDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    if (twDesc) twDesc.content = description;
  }, [title, description, lang]);
}

export function useWorldBody(world: World) {
  useEffect(() => {
    document.body.dataset.world = world;
    return () => {
      delete document.body.dataset.world;
    };
  }, [world]);
}

export function useImmersion() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('motion-ready');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let pointerFrame = 0;
    let scrollFrame = 0;

    const portal = document.querySelector<HTMLElement>('.portal');
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    const revealAll = () => revealTargets.forEach(node => node.classList.add('motion-visible'));

    let observer: IntersectionObserver | null = null;
    if (!reduce.matches && 'IntersectionObserver' in window) {
      revealTargets.forEach(node => node.classList.add('motion-reveal'));
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('motion-visible');
          observer?.unobserve(entry.target);
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
      revealTargets.forEach(node => observer?.observe(node));
    } else {
      revealAll();
    }

    const setScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        const progress = Math.min(1, Math.max(0, scrollY / total));
        root.style.setProperty('--page-progress', progress.toFixed(4));
      });
    };

    const setPointer = (event: PointerEvent) => {
      if (!portal || reduce.matches || event.pointerType !== 'mouse' || pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const rect = portal.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
        const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
        portal.style.setProperty('--pointer-x', x.toFixed(3));
        portal.style.setProperty('--pointer-y', y.toFixed(3));
      });
    };

    const resetPointer = () => {
      portal?.style.setProperty('--pointer-x', '0');
      portal?.style.setProperty('--pointer-y', '0');
    };

    const onReduce = (event: MediaQueryListEvent) => {
      root.classList.toggle('motion-reduced', event.matches);
      if (event.matches) {
        observer?.disconnect();
        observer = null;
        revealAll();
        resetPointer();
      }
    };

    addEventListener('scroll', setScroll, { passive: true });
    addEventListener('resize', setScroll, { passive: true });
    portal?.addEventListener('pointermove', setPointer, { passive: true });
    portal?.addEventListener('pointerleave', resetPointer);
    reduce.addEventListener?.('change', onReduce);
    setScroll();

    return () => {
      observer?.disconnect();
      removeEventListener('scroll', setScroll);
      removeEventListener('resize', setScroll);
      portal?.removeEventListener('pointermove', setPointer);
      portal?.removeEventListener('pointerleave', resetPointer);
      reduce.removeEventListener?.('change', onReduce);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      root.classList.remove('motion-ready', 'motion-reduced');
    };
  }, []);
}

export function useArtworkDeterrence() {
  useEffect(() => {
    const protect = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('.protected-art')) event.preventDefault();
    };

    document.addEventListener('contextmenu', protect);
    document.addEventListener('dragstart', protect);
    document.addEventListener('copy', protect);

    return () => {
      document.removeEventListener('contextmenu', protect);
      document.removeEventListener('dragstart', protect);
      document.removeEventListener('copy', protect);
    };
  }, []);
}
