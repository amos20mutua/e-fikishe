/* Minimal site script: nav toggle, parallax, basic form stub, year fill */
document.addEventListener('DOMContentLoaded', () => {
  // year
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  // nav toggle
  const nav = document.querySelector('.nav');
  let toggle = document.getElementById('navToggle');
  // If no toggle button present (some pages), create one for mobile
  if (!toggle) {
    const headerInner = document.querySelector('.header-inner');
    if (headerInner) {
      toggle = document.createElement('button');
      toggle.id = 'navToggle';
      toggle.className = 'nav-toggle';
      toggle.setAttribute('aria-label','Toggle navigation');
      toggle.innerHTML = '☰';
      headerInner.appendChild(toggle);
    }
  }
  if (toggle && nav){
    toggle.addEventListener('click', ()=>{
      console.log('[NAV] Hamburger clicked');
      const header = document.querySelector('.site-header');
      if (header) {
        header.classList.toggle('nav-open');
        console.log('[NAV] nav-open toggled:', header.classList.contains('nav-open'));
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href'); if (!href || href === '#') return;
      const el = document.querySelector(href); if (!el) return;
      e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // Lightweight parallax for elements with .parallax
  (function(){
    const els = Array.from(document.querySelectorAll('.parallax'));
    if (!els.length) return;
    let ticking = false;
    function update(){
      const vh = window.innerHeight || document.documentElement.clientHeight;
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.08;
        const center = rect.top + rect.height/2;
        const screenCenter = vh/2;
        const dist = (center - screenCenter) / vh; // -1..1
        const ty = Math.round(-dist * 40 * speed);
        const content = el.querySelector('.parallax-content') || el.firstElementChild;
        if (content) content.style.transform = `translate3d(0, ${ty}px, 0)`;
        // background
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none'){
          const posY = Math.round(-dist * 30 * speed);
          el.style.backgroundPosition = `50% ${50 + posY}%`;
        }
      });
      ticking = false;
    }
    function onScroll(){ if (ticking) return; ticking = true; requestAnimationFrame(update); }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    setTimeout(onScroll,80);
  })();

  /* ------------------------------------------------------------------
     Per-element parallax: moves any element with `data-parallax-speed`
     This enables multi-layer parallax inside hero mockups (fast, medium, slow)
  ------------------------------------------------------------------ */
  (function initLayersParallax(){
    const layers = Array.from(document.querySelectorAll('[data-parallax-speed]'));
    if (!layers.length) return;
    let ticking = false;
    function update(){
      const vh = window.innerHeight || document.documentElement.clientHeight;
      layers.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.08;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height/2;
        const screenCenter = vh/2;
        const dist = (elCenter - screenCenter) / vh;
        const ty = Math.round(-dist * 60 * speed);
        // support optional zooming on elements via data-parallax-zoom
        const zoomAttr = parseFloat(el.getAttribute('data-parallax-zoom')) || 0;
        let scale = 1;
        if (zoomAttr) {
          // Special case: impact tiles should scale more dramatically
          if (el.classList && el.classList.contains('impact-tile')){
            const mag = zoomAttr * 2.6;
            scale = 1 + Math.cos(dist * Math.PI) * mag;
            scale = Math.max(0.9, Math.min(2.2, scale));
          } else {
            // map dist (-1..1) to a smooth cosine curve for natural zooming
            scale = 1 + Math.cos(dist * Math.PI) * zoomAttr;
            // clamp to reasonable bounds
            scale = Math.max(0.85, Math.min(1.35, scale));
          }
        }
        // add a small horizontal drift so tiles move over each other nicely
        const tx = Math.round(dist * 30 * speed);
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;

        // if this is a dev-tile, bias z-index by speed so some tiles overlay others
        if (el.classList && el.classList.contains('dev-tile')){
          const base = 280;
          const z = base + Math.round(speed * 200) + Math.round((1 - Math.abs(dist)) * 40);
          el.style.zIndex = z;
          // gently vary opacity for depth
          const depthOpacity = 0.85 + Math.min(0.15, speed * 0.6);
          el.style.opacity = depthOpacity;
        }

        // impact tiles: make middle tile scale up and overlay others while scrolling
        if (el.classList && el.classList.contains('impact-tile')){
          const base = 320;
          const z = base + Math.round(speed * 200) + Math.round((1 - Math.abs(dist)) * 60);
          el.style.zIndex = z;
          const depthOpacity = 0.78 + Math.min(0.18, speed * 0.6);
          // when scaled large, make the tile translucent so the tiles behind are still visible
          if (scale > 1.18) {
            el.style.opacity = 0.6;
          } else {
            el.style.opacity = depthOpacity;
          }
        }
      });
      ticking = false;
    }
    function onScroll(){ if (ticking) return; ticking = true; requestAnimationFrame(update); }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    setTimeout(onScroll, 60);
  })();

  // contact form stub
  const form = document.getElementById('contactForm');
  if (form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('c-name')?.value || '';
      const email = document.getElementById('c-email')?.value || '';
      const msg = document.getElementById('c-message')?.value || '';
      if (!name || !email || !msg) { alert('Please complete all fields.'); return; }
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...'; btn.disabled = true;
      setTimeout(()=>{ btn.textContent = 'Sent'; btn.disabled = false; alert('Message sent (demo).'); form.reset(); }, 700);
    });
  }
});
/*
  script.js — interactions for the E-Fikishe single-page site
  - Year fill
  - Mobile nav toggle
  - Smooth scroll for internal links
  - Scroll reveal using IntersectionObserver
  - Animated counters for stats
  - Contact form stub (no backend) and deck download stub
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1) Set year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Add sticky header shadow and center-on-scroll behavior
  const headerEl = document.querySelector('.site-header');
  const heroEl = document.querySelector('.hero');
  function onScrollHeader(){
    if(!headerEl) return;
    if(window.scrollY > 8) headerEl.classList.add('scrolled'); else headerEl.classList.remove('scrolled');
    // Center header into translucent bar after passing hero area
    const threshold = heroEl ? Math.max(120, heroEl.offsetHeight - 120) : 140;
    if (window.scrollY > threshold) headerEl.classList.add('centered'); else headerEl.classList.remove('centered');
  }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, {passive:true});

  // Page transitions: fade-in on load, fade-out on internal navigation
  // Adds `is-loaded` class after DOM ready to trigger CSS entrance animations.
  document.body.classList.add('is-rendering');
  requestAnimationFrame(() => {
    // small delay for CSS to pick up initial state
    setTimeout(() => document.body.classList.add('is-loaded'), 40);
  });

  // Intercept same-origin relative links to create a smooth fade-out transition.
  // Links with `target="_blank"`, `data-no-transition`, mailto/tel links are ignored.
  document.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      const target = a.getAttribute('target');
      const noTrans = a.hasAttribute('data-no-transition');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || target === '_blank' || noTrans) return;
      // allow hash links to scroll without full page transition
      if (href.startsWith('#')) return;
      // only handle same-origin relative links
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        ev.preventDefault();
        document.body.classList.add('is-exiting');
        // give CSS time to animate out then navigate
        setTimeout(() => { window.location.href = url.href; }, 330);
      } catch (e) {
        // if URL parsing fails, don't block the link
      }
    });
  });

  // 2) Mobile nav toggle — use header class to show overlay menu and close on link click
  const toggle = document.getElementById('navToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      console.log('[NAV] Hamburger clicked (mobile)');
      const header = document.querySelector('.site-header');
      if (header) {
        header.classList.toggle('nav-open');
        console.log('[NAV] nav-open toggled (mobile):', header.classList.contains('nav-open'));
      }
    });
    // close mobile menu when clicking any nav link
    document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
      console.log('[NAV] Nav link clicked, closing menu');
      const header = document.querySelector('.site-header');
      if (header) header.classList.remove('nav-open');
    }));
    // close button inside mobile nav
    document.querySelectorAll('.nav-close').forEach(b => b.addEventListener('click', () => {
      console.log('[NAV] Nav close button clicked');
      const header = document.querySelector('.site-header');
      if (header) header.classList.remove('nav-open');
    }));
  }

  // ensure hero videos autoplay/resume when visible (improves battery by pausing offscreen)
  const heroVideos = document.querySelectorAll('.parallax-media video');
  if (heroVideos.length && 'IntersectionObserver' in window) {
    const vObs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        const v = en.target;
        if (en.isIntersecting) { v.play().catch(()=>{}); } else { v.pause(); }
      });
    }, { threshold: 0.3 });
    heroVideos.forEach(v => vObs.observe(v));
  }

  // small float animation for decorative cards (gentle horizontal movement)
  const floats = document.querySelectorAll('.card-float');
  if (floats.length) {
    floats.forEach((f, i) => {
      const dur = 6000 + (i * 800);
      f.animate([
        { transform: 'translateY(6px) translateX(0)' },
        { transform: 'translateY(-6px) translateX(6px)' },
        { transform: 'translateY(6px) translateX(0)' }
      ], { duration: dur, iterations: Infinity, easing: 'ease-in-out' });
    });
  }

    // Donate-only contact modal (inserted once, DRY)
    (function initDonateContactModal(){
      if (document.getElementById('donateContactModal')) return;
      const modalHtml = `
        <div id="donateContactModal" class="waitlist-overlay" style="display:none;">
          <div class="waitlist-panel" role="dialog" aria-modal="true">
            <h2>Supporter contact</h2>
            <p class="muted">Supporter and partner contact is handled via donations. Use this form if you are a donor, partner, or investor.</p>
            <form id="donateContactForm" class="waitlist-form">
              <label><span class="muted">Full name</span><input id="donateName" name="name" type="text" required></label>
              <label><span class="muted">Email</span><input id="donateEmail" name="email" type="email" required></label>
              <label><span class="muted">Message</span><textarea id="donateMessage" name="message" rows="4" required></textarea></label>
              <div class="form-actions"><button class="btn btn-primary" type="submit">Send request</button></div>
            </form>
            <div style="margin-top:12px;text-align:right"><button id="donateContactClose" class="btn btn-ghost">Close</button></div>
          </div>
        </div>`;
      document.body.insertAdjacentHTML('beforeend', modalHtml);

      // openers
      document.querySelectorAll('.open-donate-contact').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const modal = document.getElementById('donateContactModal');
          if (!modal) return;
          modal.style.display = 'flex';
          const name = document.getElementById('donateName');
          if (name) name.focus();
        });
      });

      // closer
      const closeBtn = document.getElementById('donateContactClose');
      if (closeBtn) closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('donateContactModal'); if (modal) modal.style.display = 'none';
      });

      // form handling (demo)
      const dForm = document.getElementById('donateContactForm');
      if (dForm) dForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const n = document.getElementById('donateName')?.value.trim();
        const e = document.getElementById('donateEmail')?.value.trim();
        const m = document.getElementById('donateMessage')?.value.trim();
        const emailRe = /^\S+@\S+\.\S+$/;
        if (!n || !e || !m) { alert('Please complete all fields.'); return; }
        if (!emailRe.test(e)) { alert('Please enter a valid email.'); return; }
        // simulate send
        const submit = dForm.querySelector('button[type="submit"]');
        if (submit) { submit.disabled = true; submit.textContent = 'Sending...'; }
        setTimeout(() => {
          alert('Thank you — your request has been received. We will follow up with supporter contact options.');
          const modal = document.getElementById('donateContactModal'); if (modal) modal.style.display = 'none';
          if (submit) { submit.disabled = false; submit.textContent = 'Send request'; }
          dForm.reset();
        }, 900);
      });
    })();

  // 3) Smooth scroll for links with data-scroll
  // select nav element locally to avoid reference errors
  const navEl = document.querySelector('.nav');
  document.querySelectorAll('a[data-scroll]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      target.scrollIntoView({behavior: 'smooth', block: 'start'});
      // close nav on mobile after click (overlay pattern)
      if (navEl && window.innerWidth < 720) {
        const header = document.querySelector('.site-header');
        if (header) header.classList.remove('nav-open');
      }
    });
  });

  // Waitlist overlay open/close handlers (login link should open waitlist)
  document.querySelectorAll('.open-waitlist, #loginLink').forEach(el => {
    el.addEventListener('click', (ev) => {
      ev.preventDefault();
      const overlay = document.getElementById('waitlistOverlay');
      if (!overlay) return;
      overlay.style.display = 'flex';
      const name = document.getElementById('w-name'); if (name) name.focus();
    });
  });

  const waitClose = document.getElementById('waitlistClose');
  if (waitClose) waitClose.addEventListener('click', () => {
    const overlay = document.getElementById('waitlistOverlay'); if (overlay) overlay.style.display = 'none';
  });

  const wForm = document.getElementById('waitlistForm');
  if (wForm) wForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = document.getElementById('w-name')?.value.trim();
    const email = document.getElementById('w-email')?.value.trim();
    if (!name || !email) { alert('Please provide name and email.'); return; }
    const btn = wForm.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Joining...'; }
    setTimeout(() => {
      alert('Thanks — you have been added to the waitlist (demo).');
      const overlay = document.getElementById('waitlistOverlay'); if (overlay) overlay.style.display = 'none';
      if (btn) { btn.disabled = false; btn.textContent = 'Join waitlist'; }
      wForm.reset();
    }, 900);
  });

  // 4) Scroll reveal using IntersectionObserver
  // Use a slightly generous rootMargin so elements reveal just before entering viewport.
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.06, rootMargin: '0px 0px -8% 0px'});
    reveals.forEach(r => obs.observe(r));
  } else {
    // fallback for older browsers
    reveals.forEach(r => r.classList.add('is-revealed'));
  }

  // 5) Animated counters (supports integers and decimals)
  function animateCounter(el, target) {
    const start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = start + (target - start) * easeOutCubic(progress);
      // if target is fractional (e.g., 3.6) show one decimal
      const display = (Math.round(target) !== target) ? value.toFixed(1) : Math.round(value);
      el.textContent = display;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  // Observe counters when visible
  const counterEls = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counterEls.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target.querySelector('.stat-value');
          const raw = parseFloat(entry.target.getAttribute('data-target'));
          if (el && raw) animateCounter(el, raw);
          cObs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    counterEls.forEach(c => cObs.observe(c));
  } else {
    // fallback: start immediately
    counterEls.forEach(c => {
      const el = c.querySelector('.stat-value');
      const raw = parseFloat(c.getAttribute('data-target'));
      if (el && raw) animateCounter(el, raw);
    });
  }

  // Small reusable form helpers for inline validation (used by multiple forms)
  function clearFieldErrors(form) {
    if (!form) return;
    form.querySelectorAll('.field-error').forEach(n => n.remove());
  }

  function showFieldError(field, message) {
    if (!field) return;
    clearFieldErrors(field.form);
    const note = document.createElement('div');
    note.className = 'field-error muted-small';
    note.style.marginTop = '8px';
    note.textContent = message;
    field.insertAdjacentElement('afterend', note);
    field.focus();
  }

  // Simple carousel for featured items
  (function initCarousel(){
    const carousel = document.getElementById('featuredCarousel');
    if(!carousel) return;
    const track = carousel.querySelector('.carousel-track');
    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
    const prev = carousel.querySelector('.carousel-control.prev');
    const next = carousel.querySelector('.carousel-control.next');
    let index = 0;
    const visible = Math.max(1, Math.floor((carousel.querySelector('.carousel-track-wrap').offsetWidth) / 300));

    function update(){
      const itemWidth = items[0].getBoundingClientRect().width + 12; // include gap
      const x = -index * itemWidth;
      track.style.transform = `translateX(${x}px)`;
    }

    function prevSlide(){ index = Math.max(0, index - 1); update(); }
    function nextSlide(){ index = Math.min(items.length - visible, index + 1); update(); }

    prev.addEventListener('click', prevSlide);
    next.addEventListener('click', nextSlide);

    // auto-advance every 4.5s, but pause on hover
    let auto = setInterval(()=>{ nextSlide(); if(index >= items.length - visible) index = 0; }, 4500);
    carousel.addEventListener('mouseenter', ()=> clearInterval(auto));
    carousel.addEventListener('mouseleave', ()=> auto = setInterval(()=>{ nextSlide(); if(index >= items.length - visible) index = 0; }, 4500));

    // responsive: recalc on resize
    window.addEventListener('resize', ()=> setTimeout(update,120));
    update();
  })();

  /* ------------------------------------------------------------------
     Simple performant parallax for sections with class `parallax`
     - Use `data-parallax-speed` on the element (0.03..0.3) for intensity
     - Moves the inner `.parallax-content` subtly to create depth
  ------------------------------------------------------------------ */
  (function initParallax(){
    const els = Array.from(document.querySelectorAll('.parallax'));
    if (!els.length) return;

    const state = { ticking: false };

    function update(){
      const sc = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.08;
        const depth = speed;
        // compute progress from center of viewport (-1 .. 1)
        const elCenter = rect.top + rect.height / 2;
        const screenCenter = vh / 2;
        const dist = (elCenter - screenCenter) / vh; // -1..1-ish
        const ty = Math.round(-dist * 40 * depth); // translate up to ~40px
        const content = el.querySelector('.parallax-content') || el.firstElementChild;
        if (content) content.style.transform = `translate3d(0, ${ty}px, 0)`;
        // subtle background parallax via background-position if present
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none') {
          const posY = Math.round(-dist * 30 * depth);
          el.style.backgroundPosition = `50% ${50 + posY}%`;
        }
      });
      state.ticking = false;
    }

    function onScroll(){ if (state.ticking) return; state.ticking = true; requestAnimationFrame(update); }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    // initial
    setTimeout(onScroll, 80);
  })();

  /* ------------------------------------------------------------------
     Floating decorative tiles — subtle parallax offset tied to scroll
     - Non-interactive background elements that move at different depths
  ------------------------------------------------------------------ */
  (function initFloatingTiles(){
    const tiles = Array.from(document.querySelectorAll('.float-tiles .tile'));
    if (!tiles.length) return;

    function update(){
      const sc = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      tiles.forEach((t, i) => {
        const depth = parseFloat(t.getAttribute('data-depth')) || 0.12;
        // compute a gentle translate and subtle rotation based on scroll
        const ty = Math.round((sc * depth) % (vh)) * 0.06;
        const rot = (sc * depth * 0.01) % 6 - 3; // small rotation -3..3deg
        t.style.transform = `translate3d(0, ${ty}px, 0) rotate(${rot}deg) scale(${1 + depth*0.06})`;
        // increase brightness slightly when near top to give depth
        const opacity = 0.32 + (depth * 0.4);
        t.style.opacity = opacity;
      });
    }

    let ticking = false;
    function onScroll(){ if (ticking) return; ticking = true; requestAnimationFrame(()=>{ update(); ticking=false; }); }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    // initial position
    setTimeout(update, 60);
  })();

  /* ------------------------------------------------------------------
     Gallery parallax / scale on scroll
     - Scales gallery items slightly based on distance from viewport center
  ------------------------------------------------------------------ */
  (function initGalleryParallax(){
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    if (!items.length) return;

    function updateItem(el){
      const speed = parseFloat(el.getAttribute('data-speed')) || 1;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const elCenter = rect.top + rect.height/2;
      const screenCenter = vh/2;
      const dist = Math.abs(elCenter - screenCenter);
      const max = vh/2 + rect.height/2;
      const t = Math.max(0, 1 - (dist / max));
      const scale = (0.92 + (0.2 * t * speed));
      const translateY = Math.round((-18 * t * speed));
      el.style.transform = `translateY(${translateY}px) scale(${scale})`;
      el.style.zIndex = Math.round(100 + t*100*speed);
      if (t > 0.04) el.style.boxShadow = '0 28px 70px rgba(6,24,30,0.12)'; else el.style.boxShadow = '';
    }

    let ticking = false;
    function onScroll(){ if (ticking) return; ticking = true; requestAnimationFrame(()=>{ items.forEach(i=> updateItem(i)); ticking = false; }); }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    // initial
    setTimeout(onScroll, 120);
  })();

  /* ------------------------------------------------------------------
     Live code typing simulation for `.live-code` tile
     - Cycles through a few short code snippets to simulate activity
  ------------------------------------------------------------------ */
  (function initLiveCode(){
    const el = document.getElementById('liveCode');
    if (!el) return;
    const snippets = [
      "// building the dispatch loop\nfunction assignRide(order){\n  // find nearest rider\n  // allocate battery-friendly route\n}\n",
      "// sample telemetry packet\n{ riderId: 42, lat: -1.2921, lng: 36.8219, battery: 78 }\n",
      "// TODO: integrate payment provider\n// TODO: add retry for failed deliveries\n",
      "// dev: running local mock server...\nHTTP 200 OK\n"
    ];
    let i = 0;

    function typeSnippet(str, target, cb){
      target.textContent = '';
      let pos = 0;
      function step(){
        pos += Math.ceil(Math.random()*2);
        target.textContent = str.slice(0,pos);
        target.parentElement.scrollTop = 9999;
        if (pos < str.length) setTimeout(step, 40 + Math.random()*80);
        else setTimeout(cb, 800 + Math.random()*1200);
      }
      step();
    }

    function loop(){
      typeSnippet(snippets[i], el, ()=>{ i = (i+1) % snippets.length; loop(); });
    }
    // start when element is visible; use IntersectionObserver if available
    if ('IntersectionObserver' in window){
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            loop();
            obs.disconnect();
          }
        });
      }, { threshold: 0.2 });
      obs.observe(el);
    } else { loop(); }
  })();

  // 6) Contact form stub (no backend). Replace with API call or form provider.
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFieldErrors(form);
      const nameField = form.querySelector('#c-name');
      const emailField = form.querySelector('#c-email');
      const messageField = form.querySelector('#c-message');
      const name = nameField?.value.trim();
      const email = emailField?.value.trim();
      const message = messageField?.value.trim();
      const note = document.getElementById('formNote');
      const submit = form.querySelector('button[type="submit"]');
      const emailRe = /^\S+@\S+\.\S+$/;
      if (!name) { showFieldError(nameField, 'Please enter your name.'); return; }
      if (!email || !emailRe.test(email)) { showFieldError(emailField, 'Please enter a valid email.'); return; }
      if (!message) { showFieldError(messageField, 'Please enter a short message.'); return; }
      console.info('Contact form (local stub):', {name, email, message});
      submit.textContent = 'Sending...';
      submit.disabled = true;
      setTimeout(() => {
        submit.textContent = 'Sent';
        if (note) note.textContent = 'Thanks — we will get back to you within 2 working days.';
        // keep name & email for convenience but clear message
        if (messageField) messageField.value = '';
        submit.disabled = false;
      }, 800);
    });
  }

  // Booking form: validate and show confirmation summary (client-side demo)
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFieldErrors(bookingForm);
      const name = bookingForm.querySelector('#name').value.trim();
      const email = bookingForm.querySelector('#email').value.trim();
      const phone = bookingForm.querySelector('#phone').value.trim();
      const pickup = bookingForm.querySelector('#pickup').value.trim();
      const destination = bookingForm.querySelector('#destination').value.trim();
      const date = bookingForm.querySelector('#date').value;
      const time = bookingForm.querySelector('#time').value;
      const packageDetails = bookingForm.querySelector('#package').value.trim();

      const emailRe = /^\S+@\S+\.\S+$/;
      if (!name) { showFieldError(bookingForm.querySelector('#name'), 'Please enter your name.'); return; }
      if (!email || !emailRe.test(email)) { showFieldError(bookingForm.querySelector('#email'), 'Please enter a valid email address.'); return; }
      if (!phone || phone.length < 7) { showFieldError(bookingForm.querySelector('#phone'), 'Please enter a valid phone number.'); return; }
      if (!pickup) { showFieldError(bookingForm.querySelector('#pickup'), 'Please enter a pickup address.'); return; }
      if (!destination) { showFieldError(bookingForm.querySelector('#destination'), 'Please enter a destination address.'); return; }
      if (!date) { showFieldError(bookingForm.querySelector('#date'), 'Please select a pickup date.'); return; }
      if (!time) { showFieldError(bookingForm.querySelector('#time'), 'Please select a pickup time.'); return; }
      if (!packageDetails) { showFieldError(bookingForm.querySelector('#package'), 'Please describe the package (weight, size, fragile).'); return; }

      const confirmation = document.getElementById('bookingConfirmation');
      confirmation.style.display = 'block';
      confirmation.innerHTML = `
        <strong>Booking request received (demo)</strong>
        <p><strong>Name:</strong> ${escapeHtml(name)}<br>
        <strong>Email:</strong> ${escapeHtml(email)}<br>
        <strong>Phone:</strong> ${escapeHtml(phone)}<br>
        <strong>Pickup:</strong> ${escapeHtml(pickup)}<br>
        <strong>Destination:</strong> ${escapeHtml(destination)}<br>
        <strong>When:</strong> ${escapeHtml(date)} ${escapeHtml(time)}<br>
        <strong>Package:</strong> ${escapeHtml(packageDetails)}</p>
        <p class="muted">This is a demo booking — no dispatch or payment has occurred. For live pilots we provide confirmation and tracking via our operations dashboard.</p>
      `;
      bookingForm.reset();
    });
  }

  // Donation form: demo payment flow
  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    // quick preset amount buttons
    document.querySelectorAll('.donate-amt').forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = btn.getAttribute('data-amt');
        const input = document.getElementById('donationAmount');
        if (input) input.value = amt;
      });
    });

    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // inline validation
      const nameField = document.getElementById('donorName');
      const emailField = document.getElementById('donorEmail');
      const amountField = document.getElementById('donationAmount');
      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const amt = parseFloat(amountField.value);
      const result = document.getElementById('donationResult');
      // clear previous field errors
      [nameField, emailField, amountField].forEach(f => {
        const next = f.nextElementSibling; if (next && next.classList && next.classList.contains('field-error')) next.remove();
      });
      const emailRe = /^\S+@\S+\.\S+$/;
      if (!name) { showFieldError(nameField, 'Please enter your name.'); return; }
      if (!email || !emailRe.test(email)) { showFieldError(emailField, 'Please enter a valid email.'); return; }
      if (!amt || amt <= 0) { showFieldError(amountField, 'Please enter a valid donation amount.'); return; }
      // Simulate payment processing with small animation
      result.textContent = '';
      const btn = donationForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Processing…';
      setTimeout(() => {
        result.textContent = `Thank you ${name}. Donation of $${amt.toFixed(2)} received (demo). We will contact ${email} with a receipt.`;
        donationForm.reset();
        btn.disabled = false; btn.textContent = 'Donate Now';
      }, 900);
    });
  }

  // Simple client-side investor login (demo only) ------------------------------------------------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('investorEmail').value.trim();
      const pass = document.getElementById('investorPass').value;
      const note = document.getElementById('loginNote');
      const DEMO_PASSPHRASE = 'investor2025'; // demo passphrase — change for real demos
      if (pass === DEMO_PASSPHRASE) {
        // set a short-lived session flag in localStorage (demo)
        localStorage.setItem('efikishe_investor', JSON.stringify({email: email, ts: Date.now()}));
        if (note) note.textContent = 'Access granted — redirecting...';
        setTimeout(() => { window.location.href = 'investor.html'; }, 600);
      } else {
        if (note) note.textContent = 'Incorrect passphrase (demo).';
      }
    });
  }

  // Protect investor page: if present, check session
  if (window.location.pathname.endsWith('investor.html')) {
    const session = localStorage.getItem('efikishe_investor');
    if (!session) {
      // redirect to login if no session
      window.location.href = 'login.html';
    }
  }

  // small helper: escape HTML to avoid injection in demo strings
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m]; });
  }
  
  // Micro-interactions: subtle pressed state for buttons and focus styles for inputs
  // Adds `is-pressed` on pointerdown to trigger CSS scale/shadow, removed on pointerup/leave.
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('pointerdown', (e) => { b.classList.add('is-pressed'); });
    b.addEventListener('pointerup', (e) => { b.classList.remove('is-pressed'); });
    b.addEventListener('pointerleave', (e) => { b.classList.remove('is-pressed'); });
  });

  // Input focus interactions: add .is-focused to inputs for CSS highlighting
  document.querySelectorAll('input, textarea, select').forEach(inp => {
    inp.addEventListener('focus', () => inp.classList.add('is-focused'));
    inp.addEventListener('blur', () => inp.classList.remove('is-focused'));
  });

  // 7) Deck button: open placeholder or trigger download (stub)
  const deckBtn = document.getElementById('downloadDeck');
  if (deckBtn) {
    deckBtn.addEventListener('click', () => {
      // Replace URL with actual hosted deck when available
      const deckUrl = '#';
      if (deckUrl === '#') {
        alert('Investor deck link not configured. Replace deckUrl in script.js with hosted PDF link.');
      } else {
        window.open(deckUrl, '_blank');
      }
    });
  }

  /* ------------------------------------------------------------------
     Waitlist overlay & launch guard
     - Keeps the public site inaccessible until set to 'launched'.
     - Collects waitlist submissions to localStorage (demo storage).
     - Admin can enter a launch code to unlock the site locally.
     NOTE: For production, wire the waitlist to a server or form provider.
  ------------------------------------------------------------------ */
  (function waitlistGuard(){
    const OVERLAY_ID = 'waitlistOverlay';
    const WAITLIST_KEY = 'efikishe_waitlist';
    const LAUNCHED_KEY = 'efikishe_launched';
    const DEMO_LAUNCH_CODE = 'efikishe2025'; // unified demo admin unlock — change for real use

    // waitlist overlay behavior: open on click (Eden-like), do not show automatically
    function isLaunched(){ return localStorage.getItem(LAUNCHED_KEY) === 'true'; }
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return; // overlay markup missing

    const wlForm = document.getElementById('waitlistForm');
    const wlNote = document.getElementById('waitlistNote');
    const launchInput = document.getElementById('launchCode');
    const launchBtn = document.getElementById('launchBtn') || document.getElementById('unlockBtn');

    function openOverlay(){
      if (isLaunched()) return; // if site marked launched, don't open
      overlay.style.display = 'flex';
      document.body.classList.add('lock-scroll');
      const first = document.getElementById('w-name'); if (first) first.focus();
    }

    function closeOverlay(){
      overlay.style.display = 'none';
      document.body.classList.remove('lock-scroll');
    }

    // Attach click listeners to any element that should open the waitlist form
    document.querySelectorAll('.open-waitlist, #openWaitlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Do not interrupt donors on the donate page — open donor contact modal instead
        const isDonate = /donate\.html$/.test(window.location.pathname) || window.location.href.indexOf('donate.html') !== -1;
        if (isDonate){
          const donorBtn = document.querySelector('.open-donate-contact');
          if (donorBtn) { donorBtn.click(); return; }
          return; // otherwise silently ignore on donate page
        }
        openOverlay();
      });
    });

    // If the site has been marked launched, disable waitlist buttons (they are no longer needed)
    if (isLaunched()) {
      document.querySelectorAll('.open-waitlist, #openWaitlist').forEach(el => {
        try { el.setAttribute('aria-disabled','true'); el.classList.add('muted-small'); el.disabled = true; el.textContent = 'Launching soon'; } catch(e){}
      });
    }

    // Close overlay on background click or ESC
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlay(); });
    // close button inside panel
    const closeBtn = document.getElementById('waitlistClose');
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.preventDefault(); closeOverlay(); });

    function saveWaitlistEntry(entry){
      try{
        const raw = localStorage.getItem(WAITLIST_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push(entry);
        localStorage.setItem(WAITLIST_KEY, JSON.stringify(arr));
        console.info('Waitlist saved (local demo):', entry);
      }catch(e){ console.warn('Failed to save waitlist entry locally', e); }
    }

    if (wlForm){
      wlForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const name = document.getElementById('w-name')?.value.trim();
        const email = document.getElementById('w-email')?.value.trim();
        const phone = document.getElementById('w-phone')?.value.trim();
        const interest = document.getElementById('w-interest')?.value || '';
        const emailRe = /^\S+@\S+\.\S+$/;
        if (!name) { showFieldError(document.getElementById('w-name'),'Please enter your name.'); return; }
        if (!email || !emailRe.test(email)) { showFieldError(document.getElementById('w-email'),'Please enter a valid email.'); return; }
        const entry = {name, email, phone, interest, ts: Date.now()};
        saveWaitlistEntry(entry);
        if (wlNote) wlNote.textContent = 'Thanks — you are on the waitlist. We will email you when access opens.';
        wlForm.reset();
        // close overlay after success (small delay)
        setTimeout(closeOverlay, 900);
      });
    }

    // Admin launch button: unlock site locally when correct code provided
    if (launchBtn && launchInput){
      launchBtn.addEventListener('click', () => {
        const code = (launchInput.value || '').trim();
        if (code === DEMO_LAUNCH_CODE){
          localStorage.setItem(LAUNCHED_KEY, 'true');
          overlay.style.display = 'none';
          document.body.classList.remove('lock-scroll');
          console.info('Site unlocked locally via demo launch code.');
        } else {
          if (wlNote) wlNote.textContent = 'Incorrect code.';
        }
      });
    }

    // Accessibility: focus the first input
    const first = document.getElementById('w-name');
    if (first) first.focus();
  })();

  /* ------------------------------------------------------------------
     Interactive cards: allow click/tap to expand details for cards
     - Adds toggle for elements that contain `.card-extra` or `.profile-extra`
  ------------------------------------------------------------------ */
  (function cardExpand(){
    document.querySelectorAll('.profile-card, .service-card, .carousel-item.card, .impact-card').forEach(card => {
      // if the card has extra content, make it toggleable
      const extra = card.querySelector('.profile-extra, .card-extra, .service-extra, .extra');
      if (!extra) return;
      card.classList.add('card'); // ensure .card base rules apply
      card.setAttribute('tabindex','0');
      card.setAttribute('role','button');
      card.addEventListener('click', (e) => {
        // ignore clicks on links or buttons inside card
        const tag = e.target.tagName.toLowerCase();
        if (['a','button','input','textarea','select'].includes(tag)) return;
        card.classList.toggle('is-expanded');
      });
      // allow keyboard toggling
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('is-expanded'); } });
    });
  })();

  // helper: show hint to download PDF by printing from the browser
  const pdfHint = document.getElementById('downloadPdfHint');
  if (pdfHint){
    pdfHint.addEventListener('click', (e)=>{
      e.preventDefault();
      alert('To create a PDF: open the proposal page (View proposal) and use your browser Print → Save as PDF.');
    });
  }

  // impact videos: click to toggle play/unmute and add parallax zoom while scrolling
  (function initImpactVideos(){
    const vids = Array.from(document.querySelectorAll('.impact-video'));
    if (!vids.length) return;
    vids.forEach(v => {
      const btn = v.parentElement.querySelector('.impact-play');
      if (btn) btn.addEventListener('click', (ev)=>{
        ev.preventDefault();
        if (v.paused) { v.muted = false; v.play().catch(()=>{}); btn.textContent = '❚❚'; }
        else { v.pause(); v.muted = true; btn.textContent = '▶'; }
      });
    });

    // add parallax zoom for impact tiles using data-parallax-zoom if present
    function update(){
      const vh = window.innerHeight || document.documentElement.clientHeight;
      vids.forEach(v => {
        const rect = v.getBoundingClientRect();
        const center = rect.top + rect.height/2;
        const dist = (center - vh/2) / vh; // -1..1
        const zoom = 0.06; // mild zoom
        const scale = 1 + Math.cos(dist * Math.PI) * zoom;
        v.style.transform = `scale(${scale})`;
      });
    }
    let tick = false; function onScroll(){ if (tick) return; tick = true; requestAnimationFrame(()=>{ update(); tick=false; }); }
    window.addEventListener('scroll', onScroll, {passive:true}); setTimeout(onScroll,80);
  })();
});

