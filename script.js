/**
 * script.js — Final Fix Version
 * Perbaikan scroll-spy, smooth scroll, dan navbar active state
 */

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const revealElements = document.querySelectorAll('.reveal');
const progressContainers = document.querySelectorAll('.progress');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const yearEl = document.getElementById('year');
const siteHeader = document.getElementById('site-header');

if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================
   MOBILE NAV
============================ */
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });
}

/* ============================
   SMOOTH SCROLL (fixed)
============================ */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Tutup navbar mobile
      siteNav.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ============================
   REVEAL ANIMATION
============================ */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');

      if (entry.target.querySelectorAll('.progress').length > 0) {
        animateProgressBars();
      }

      obs.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));

function animateProgressBars() {
  progressContainers.forEach(container => {
    const bar = container.querySelector('.progress-bar');
    const percentage = parseInt(container.getAttribute('data-percentage') || '0', 10);

    // FIX: hanya jalan sekali, memastikan animasi bekerja
    if (bar && !bar.dataset.filled) {
      bar.dataset.filled = "true";

      setTimeout(() => {
        bar.style.width = `${percentage}%`;
      }, 80);
    }
  });
}

/* ============================
   SCROLL-SPY (Super Stable Version)
============================ */
const sections = document.querySelectorAll('#about, #education, #experience, #skills, #contact');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    if (!id) return;

    const link = document.querySelector(`a[href="#${id}"]`);

    if (entry.isIntersecting) {
      navLinks.forEach(n => n.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
}, {
  root: null,
  rootMargin: '-30% 0px -40% 0px',
  threshold: 0.1
});

sections.forEach(sec => spyObserver.observe(sec));

/* ============================
   FORM VALIDATION
============================ */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    clearErrors();
    let hasError = false;

    if (!name.value.trim()) {
      showError('error-name', 'Nama harus diisi.');
      hasError = true;
    }
    if (!validateEmail(email.value)) {
      showError('error-email', 'Email tidak valid.');
      hasError = true;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError('error-message', 'Pesan minimal 10 karakter.');
      hasError = true;
    }

    if (hasError) {
      formStatus.textContent = 'Periksa form dan coba lagi.';
      formStatus.style.color = '#d9534f';
      return;
    }

    formStatus.style.color = 'green';
    formStatus.textContent = 'Pesan berhasil dikirim! Terima kasih. (Simulasi)';

    setTimeout(() => {
      contactForm.reset();
      clearErrors();
    }, 1000);
  });

  contactForm.addEventListener('reset', () => {
    clearErrors();
    formStatus.textContent = '';
  });
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function clearErrors() {
  const errors = document.querySelectorAll('.error');
  errors.forEach(e => e.textContent = '');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================
   ESCAPE CLOSE NAV
============================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && siteNav.classList.contains('open')) {
    siteNav.classList.remove('open');
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ============================
   HEADER SCROLL EFFECT
============================ */
function handleHeaderOnScroll() {
  if (!siteHeader) return;

  if (window.scrollY > 12) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}

let scrollTimeout = null;
window.addEventListener('scroll', () => {
  if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
  scrollTimeout = requestAnimationFrame(handleHeaderOnScroll);
});
handleHeaderOnScroll();

/* ============================
   FORCE REVEAL ON LOAD
============================ */
window.addEventListener('load', () => {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - (window.innerHeight * 0.10)) {
      el.classList.add('active');
    }
  });
});
