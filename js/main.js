// ===== Role-cycling tagline =====
const roles = ['Financial Analysis', 'VLSI & Semiconductors', 'Gaming Enthusiast'];
let roleIndex = 0;
const roleEl = document.getElementById('role-text');

function cycleRole() {
  roleEl.classList.add('fade-out');
  setTimeout(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleEl.textContent = roles[roleIndex];
    roleEl.classList.remove('fade-out');
  }, 350);
}

if (roleEl) {
  roleEl.textContent = roles[0];
  setInterval(cycleRole, 2800);
}

// ===== Theme toggle (in-memory only, resets on refresh) =====
let theme = 'dark';
const themeToggle = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

function applyTheme() {
  document.documentElement.classList.toggle('light-theme', theme === 'light');
  iconSun.classList.toggle('hidden', theme !== 'light');
  iconMoon.classList.toggle('hidden', theme === 'light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });
}

// ===== Mobile nav toggle =====
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ===== Header scroll shadow + scroll progress bar =====
const header = document.getElementById('site-header');
const progressBar = document.getElementById('scroll-progress');

const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  if (progressBar) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Active nav link highlighting =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length && window.IntersectionObserver) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => navObserver.observe(s));
}

// ===== Stat count-up on scroll =====
function animateCountUp(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toFixed(decimals);
    }
  }
  requestAnimationFrame(tick);
}

const countEls = document.querySelectorAll('.count-up');
if (countEls.length && window.IntersectionObserver) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  countEls.forEach((el) => countObserver.observe(el));
}

// ===== Footer year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Custom cursor tracker (desktop only) =====
const cursorRing = document.getElementById('cursor-ring');
if (cursorRing && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let started = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!started) {
      ringX = mouseX;
      ringY = mouseY;
      started = true;
      cursorRing.classList.add('visible');
    }
  });

  document.addEventListener('mouseleave', () => cursorRing.classList.remove('visible'));
  document.addEventListener('mouseenter', () => cursorRing.classList.add('visible'));

  function trackCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(trackCursor);
  }
  requestAnimationFrame(trackCursor);

  document.querySelectorAll('a, button, .card, .resume-card, .badge, .whatsapp-card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

// ===== Init libraries =====
if (window.lucide) lucide.createIcons();
if (window.AOS) AOS.init({ once: true, duration: 700, offset: 80, easing: 'ease-out-cubic' });
