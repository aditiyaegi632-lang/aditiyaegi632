/**
 * script.js (diperbarui)
 * - Menambahkan listener scroll untuk menambahkan class 'scrolled' pada header
 *   sehingga header/ navbar mendapatkan shadow dan latar yang lebih solid saat pengguna menggulir.
 * - Menjaga interaktivitas lain tetap utuh (smooth scroll, reveal, progress bar, mobile nav, form validation).
 */

/* ----------------------------
   Helper & DOM references
   ---------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
const navLinks = document.querySelectorAll('.nav-link');
const revealElements = document.querySelectorAll('.reveal');
const progressContainers = document.querySelectorAll('.progress');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const yearEl = document.getElementById('year');
const siteHeader = document.getElementById('site-header');

/* Set current year di footer */
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* ----------------------------
   Mobile nav toggle
   ---------------------------- */
if(navToggle){
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });
}

/* ----------------------------
   Smooth scroll untuk anchor links
   ---------------------------- */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if(target){
      // Smooth scroll dan offset jika perlu (header fixed) -> kita gunakan block: 'start'
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // tutup mobile nav bila terbuka
      siteNav.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ----------------------------
   Scroll reveal dan intersection observer
   - Memasukkan class 'active' ke elemen .reveal saat mereka masuk viewport
   - Juga memicu animasi progress bar
   ---------------------------- */
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.15
};

const onIntersection = (entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('active');

      // Jika container progress terlihat, animate bars
      if(entry.target.id === 'skills' || entry.target.querySelectorAll && entry.target.querySelectorAll('.progress').length > 0){
        animateProgressBars();
      }

      // Once shown, we can unobserve to improve performance
      obs.unobserve(entry.target);
    }
  });
};

const revealObserver = new IntersectionObserver(onIntersection, observerOptions);
revealElements.forEach(el => revealObserver.observe(el));

/* ----------------------------
   Animasi progress bar
   - Membaca attribute data-percentage di parent .progress
   ---------------------------- */
function animateProgressBars(){
  progressContainers.forEach(container => {
    const bar = container.querySelector('.progress-bar');
    const percentage = parseInt(container.getAttribute('data-percentage') || '0', 10);
    // mencegah animasi ulang: cek jika sudah pernah di-set width lebih dari 0
    if(bar && parseInt(bar.style.width) === 0){
      // animasi halus: gunakan timeout kecil agar CSS transition terlihat
      setTimeout(() => {
        bar.style.width = `${percentage}%`;
      }, 80);
    }
  });
}

/* ----------------------------
   Scroll-spy
   - Highlight nav link aktif berdasarkan section yang terlihat
   ---------------------------- */
const sections = document.querySelectorAll(
  '#about, #education, #experience, #skills, #contact'
);
const spyOptions = {
  root: null,
  rootMargin: '-40% 0px -40% 0px',
  threshold: 0
};

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    if(!id) return;
    const link = document.querySelector(`a[href="#${id}"]`);
    if(entry.isIntersecting){
      // Hapus class active dari semua link lalu berikan pada link yang sesuai
      navLinks.forEach(n => n.classList.remove('active'));
      if(link) link.classList.add('active');
    }
  });
}, spyOptions);

sections.forEach(sec => spyObserver.observe(sec));

/* ----------------------------
   Simple contact form validation
   - Tidak mengirim data ke server (demo), hanya validasi & notifikasi
   ---------------------------- */
if(contactForm){
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Ambil elemen input
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Clear previous errors
    clearErrors();

    // Validasi sederhana
    let hasError = false;
    if(!name.value.trim()){
      showError('error-name', 'Nama harus diisi.');
      hasError = true;
    }
    if(!validateEmail(email.value)){
      showError('error-email', 'Email tidak valid.');
      hasError = true;
    }
    if(!message.value.trim() || message.value.trim().length < 10){
      showError('error-message', 'Pesan minimal 10 karakter.');
      hasError = true;
    }

    if(hasError){
      formStatus.textContent = 'Periksa form dan coba lagi.';
      formStatus.style.color = '#d9534f';
      return;
    }

    // Simulasi pengiriman sukses (di dunia nyata, kirim ke server via fetch/ajax)
    formStatus.style.color = 'green';
    formStatus.textContent = 'Pesan berhasil dikirim! Terima kasih. (Simulasi)';

    // Reset form setelah 1 detik
    setTimeout(() => {
      contactForm.reset();
      clearErrors();
    }, 1000);
  });

  // Reset handlers
  contactForm.addEventListener('reset', () => {
    clearErrors();
    formStatus.textContent = '';
  });
}

/* ----------------------------
   Helper functions untuk form
   ---------------------------- */
function showError(id, message){
  const el = document.getElementById(id);
  if(el){
    el.textContent = message;
  }
}

function clearErrors(){
  const errors = document.querySelectorAll('.error');
  errors.forEach(e => e.textContent = '');
}

function validateEmail(email){
  // RegEx sederhana untuk validasi format email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ----------------------------
   Accessibility improvements: keyboard nav close
   ---------------------------- */
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    // tutup mobile nav jika terbuka
    if(siteNav.classList.contains('open')){
      siteNav.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

/* ----------------------------
   Header scroll handling
   - Tambah class 'scrolled' saat pengguna menggulir untuk memperjelas navbar
   ---------------------------- */
function handleHeaderOnScroll(){
  if(!siteHeader) return;
  const threshold = 12; // px
  if(window.scrollY > threshold){
    if(!siteHeader.classList.contains('scrolled')){
      siteHeader.classList.add('scrolled');
    }
  } else {
    siteHeader.classList.remove('scrolled');
  }
}

// Debounce sederhana untuk performa (opsional kecil)
let scrollTimeout = null;
window.addEventListener('scroll', () => {
  if(scrollTimeout) cancelAnimationFrame(scrollTimeout);
  scrollTimeout = requestAnimationFrame(handleHeaderOnScroll);
});

// Panggil sekali saat load untuk men-set status awal
handleHeaderOnScroll();

/* ----------------------------
   Optional: Lazy-init progress bars jika halaman sudah berada di posisi skills
   (apabila pengguna langsung membuka link #skills)
   ---------------------------- */
window.addEventListener('load', () => {
  // Jika #skills sudah di viewport saat load, animate langsung
  const skillsSection = document.getElementById('skills');
  if(skillsSection){
    const rect = skillsSection.getBoundingClientRect();
    if(rect.top < window.innerHeight && rect.bottom >= 0){
      animateProgressBars();
    }
  }

  // Trigger reveal check in case some elements are already visible
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - (window.innerHeight * 0.10)){
      el.classList.add('active');
    }
  });
});