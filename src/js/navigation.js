/** Active chapter indication and passive, throttled reading progress. */
export function initNavigation() {
  const progress = document.getElementById('scroll-progress');
  let ticking = false;
  function update() {
    const total = document.documentElement.scrollHeight - innerHeight;
    const value = total > 0 ? Math.min(100, 100 * scrollY / total) : 0;
    progress.style.width = `${value}%`;
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener('resize', update);
  update();
  const sections = document.querySelectorAll('main section[id]');
  const nav = document.querySelectorAll('.header-nav a, .rail-nav a');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        nav.forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle(link.closest('.rail-nav') ? 'is-active' : 'current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-30% 0px -50% 0px' });
    sections.forEach(section => observer.observe(section));
  }
}
