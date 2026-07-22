/**
 * NEW AYYANAR STORES - Interactive Business Site JavaScript
 * Handles:
 * - Instant Bilingual (Tamil <-> English) Language Engine
 * - Custom AOS Scroll Reveal Animations
 * - Animated Statistics Counter (slot-machine style)
 * - Mobile Navigation Drawer Toggle
 * - WhatsApp Inquiry Form Handler
 * - Sticky Header & Back-to-top trigger
 * - Hero Parallax Scroll Effect
 * - Custom Cursor (desktop)
 * - Scroll Progress Bar
 * - data-reveal Intersection Observer
 * - 3D Tilt Card Effect
 * - Stagger Children Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current active language (Default 'en' or from localStorage)
  let currentLang = localStorage.getItem('ayynar_lang') || 'en';

  // DOM Element Selectors
  const langToggleBtn    = document.getElementById('langToggleBtn');
  const header           = document.getElementById('header');
  const mobileToggle     = document.getElementById('mobileToggle');
  const navMenu          = document.getElementById('navMenu');
  const backToTopBtn     = document.getElementById('backToTop');
  const inquiryForm      = document.getElementById('inquiryForm');
  const scrollProgress   = document.getElementById('scroll-progress');
  const heroScene        = document.getElementById('heroParallaxScene');
  const cursorDot        = document.getElementById('cursorDot');
  const cursorRing       = document.getElementById('cursorRing');

  /* ==========================================================================
     1. BILINGUAL TRANSLATION ENGINE
     ========================================================================== */
  function applyTranslations(lang) {
    currentLang = lang;
    localStorage.setItem('ayynar_lang', lang);

    // Toggle body class for font adjustments
    if (lang === 'ta') {
      document.body.classList.add('lang-ta');
      document.body.classList.remove('lang-en');
      document.documentElement.lang = 'ta';
    } else {
      document.body.classList.add('lang-en');
      document.body.classList.remove('lang-ta');
      document.documentElement.lang = 'en';
    }

    // Translate standard text content elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Translate input placeholders
    const placeholderElems = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElems.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    // Translate option text in selects
    const selectOptions = document.querySelectorAll('[data-i18n-opt]');
    selectOptions.forEach(opt => {
      const key = opt.getAttribute('data-i18n-opt');
      if (translations[lang] && translations[lang][key]) {
        opt.textContent = translations[lang][key];
      }
    });
  }

  const heroLangToggleBtn = document.getElementById('heroLangToggleBtn');

  // Language Toggle Button Events (Navbar & Hero Section)
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'ta' : 'en';
      applyTranslations(newLang);
    });
  }

  if (heroLangToggleBtn) {
    heroLangToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'ta' : 'en';
      applyTranslations(newLang);
    });
  }

  // Initialize translations on startup
  applyTranslations(currentLang);

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close menu when clicking any nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  /* ==========================================================================
     3. CUSTOM CURSOR (desktop pointer: fine only)
     ========================================================================== */
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let ringX = 0, ringY = 0;
    let dotX  = 0, dotY  = 0;
    let mouseX = 0, mouseY = 0;
    let rafId;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Dot follows instantly
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top  = dotY + 'px';

      // Ring lags slightly for smooth feel
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';

      rafId = requestAnimationFrame(animateCursor);
    }
    rafId = requestAnimationFrame(animateCursor);

    // Expand ring on hoverable elements
    const hoverTargets = document.querySelectorAll('a, button, .product-card, .hotel-card, .why-card, .about-card, .bulk-item-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });
  }

  /* ==========================================================================
     4. SCROLL PROGRESS BAR + HEADER + BACK-TO-TOP
     ========================================================================== */
  const docEl  = document.documentElement;
  const bodyEl = document.body;

  function onScroll() {
    const scrollPos = window.scrollY;
    const docHeight = Math.max(
      bodyEl.scrollHeight, bodyEl.offsetHeight,
      docEl.clientHeight,  docEl.scrollHeight, docEl.offsetHeight
    ) - window.innerHeight;
    const pct = docHeight > 0 ? (scrollPos / docHeight) * 100 : 0;

    // Scroll progress bar
    if (scrollProgress) scrollProgress.style.width = pct + '%';

    // Header shadow
    if (header) {
      header.classList.toggle('scrolled', scrollPos > 40);
    }

    // Back to top
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('active', scrollPos > 400);
    }

    // Parallax hero background
    if (heroScene) {
      const shift = scrollPos * 0.35;
      heroScene.style.transform = `translateY(${shift}px)`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     5. DATA-REVEAL INTERSECTION OBSERVER (replaces old AOS system)
     ========================================================================== */
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Also reveal child section-tags
        const tag = entry.target.querySelector('.section-tag');
        if (tag) tag.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     6. LEGACY AOS SCROLL REVEAL (for data-aos elements not yet migrated)
     ========================================================================== */
  const aosObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px', threshold: 0.12 });

  document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

  /* ==========================================================================
     7. STAGGER-CHILDREN REVEAL OBSERVER
        Adds 'revealed' to each child with transition-delay set by :nth-child CSS
     ========================================================================== */
  const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          // Give each child a slight extra delay based on index
          setTimeout(() => {
            child.classList.add('revealed');
          }, i * 70);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });

  document.querySelectorAll('.stagger-children').forEach(el => {
    // Pre-apply [data-reveal] to each child if not already set
    Array.from(el.children).forEach(child => {
      if (!child.hasAttribute('data-reveal')) {
        child.setAttribute('data-reveal', '');
      }
    });
    staggerObserver.observe(el);
  });

  /* ==========================================================================
     8. SECTION HEADER TAGS REVEAL (slide-in underline)
     ========================================================================== */
  const tagObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.section-header').forEach(header => {
    const tag = header.querySelector('.section-tag');
    if (tag) tagObserver.observe(tag);

    // Animate section-header itself
    header.setAttribute('data-reveal', '');
    revealObserver.observe(header);
  });

  /* ==========================================================================
     9. 3D TILT CARD EFFECT
     ========================================================================== */
  function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const rotX   = dy * -8;   // up to 8deg X
        const rotY   = dx *  8;   // up to 8deg Y
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }
  initTiltCards();

  /* ==========================================================================
     10. STATISTICAL COUNTER — SLOT-MACHINE STYLE
     ========================================================================== */
  let countersTriggered = false;
  const counterSection  = document.querySelector('.counter-section');

  function slotMachineCounter(el) {
    const targetText = el.getAttribute('data-count');
    const targetNum  = parseInt(targetText, 10);
    const hasPlus    = targetText.includes('+');
    const duration   = 1600; // ms
    const fps        = 60;
    const steps      = Math.round((duration / 1000) * fps);
    let   step       = 0;

    el.classList.add('counting');

    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

    const tick = () => {
      step++;
      const progress = step / steps;
      const val      = Math.round(ease(progress) * targetNum);
      el.textContent = val + (hasPlus ? '+' : '');

      if (step < steps) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = targetNum + (hasPlus ? '+' : '');
        el.classList.remove('counting');
        el.classList.add('done');
      }
    };

    requestAnimationFrame(tick);
  }

  if (counterSection) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersTriggered) {
          countersTriggered = true;
          document.querySelectorAll('.counter-number').forEach(slotMachineCounter);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(counterSection);
  }

  /* ==========================================================================
     11. WHATSAPP INQUIRY FORM LAUNCHER
     ========================================================================== */
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', e => {
      e.preventDefault();

      const name         = document.getElementById('name').value.trim();
      const phone        = document.getElementById('phone').value.trim();
      const typeSelect   = document.getElementById('customerType');
      const customerType = typeSelect.options[typeSelect.selectedIndex].text;
      const message      = document.getElementById('message').value.trim();

      // Format WhatsApp Message in Dual Languages (English & Tamil)
      const waText = 
        `*NEW INQUIRY / புதிய விசாரணை*\n` +
        `*NEW AYYANAR STORES (நியூ அய்யனார் ஸ்டோர்ஸ்)*\n\n` +
        `👤 *Name / பெயர்:* ${name}\n` +
        `📞 *Phone / தொலைபேசி:* ${phone}\n` +
        `🏢 *Category / வாடிக்கையாளர் வகை:* ${customerType}\n` +
        `📝 *Requirements / தேவைகள்:* ${message || 'N/A'}\n\n` +
        `_Sent via New Ayyanar Stores Website (நியூ அய்யனார் ஸ்டோர்ஸ்)_`;

      const encodedText = encodeURIComponent(waText);
      const whatsappUrl = `https://wa.me/919715098017?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');
    });
  }
});
