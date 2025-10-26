// ===============================
// BIYA LANDING - SCRIPT PRINCIPAL
// ===============================

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});

// Efeito de revelação ao rolar
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
  const triggerPoint = window.innerHeight * 0.85;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < triggerPoint) {
      el.classList.add('show');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Efeito de fade para header ao rolar
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.style.background = 'rgba(12,12,13,0.9)';
    header.style.backdropFilter = 'blur(12px)';
  } else {
    header.style.background = 'rgba(12,12,13,0.7)';
    header.style.backdropFilter = 'blur(8px)';
  }
});
