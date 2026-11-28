/**
 * Randi Zakaria Putra — Ultra-Lightweight 3D Z-Depth Portfolio Engine
 * Google Web Performance Standards:
 * - Single Canvas (#cv) renders both Deep Space Starfield + Celestial Thread
 * - Zero idle CPU burn (ticker sleeps when camera rests)
 * - Zero per-frame zIndex / DOM-query / getBoundingClientRect thrashing
 * - GSAP 3 ScrollTrigger (numeric bounds) + ScrollToPlugin + Reversible Menu + Image-Origin Modal
 */
(function initExperienceEngine() {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const ScrollToPlugin = window.ScrollToPlugin;

  /* -------------------------------------------------------------------------
     0. Apple-Style Multilingual Greeting Preloader + Seamless Exit to Main
     ------------------------------------------------------------------------- */
  const TRANSITION_KEY = 'rz_nav_transition';
  const loaderEl = doc.getElementById('apple-loader');
  const greetingEl = doc.getElementById('apple-greeting');
  const loaderSubEl = doc.getElementById('apple-sub');
  const GREETINGS = ['Hello', 'Halo', 'Ciao', 'Bonjour', 'こんにちは', 'Hola', '안녕하세요'];

  function runApplePreloader() {
    if (!loaderEl || !greetingEl) return;

    try {
      window.sessionStorage.removeItem(TRANSITION_KEY);
    } catch {
      // ignore storage restrictions
    }

    const reduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !gsap) {
      loaderEl.classList.add('is-done');
      return;
    }

    let finished = false;
    const tl = gsap.timeline();

    const revealExperience = () => {
      if (finished) return;
      finished = true;
      tl.kill();

      const heroTitle = doc.querySelector('.hero-fullname');
      const heroLogosNode = doc.querySelectorAll('#hero-bouquet .hero-logo');
      const outTl = gsap.timeline({
        onComplete: () => {
          loaderEl.classList.add('is-done');
          if (heroTitle) gsap.set(heroTitle, { clearProps: 'transform,opacity' });
        },
      });

      outTl
        .to(greetingEl, { opacity: 0, y: -18, duration: 0.26, ease: 'power2.in' })
        .to(loaderSubEl, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '<')
        .to(
          loaderEl,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.72,
            ease: 'power4.inOut',
          },
          '-=0.06',
        );

      if (heroTitle) {
        outTl.fromTo(
          heroTitle,
          { opacity: 0, scale: 0.92, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.52',
        );
      }

      if (heroLogosNode.length) {
        outTl.fromTo(
          heroLogosNode,
          { opacity: 0 },
          { opacity: 1, duration: 0.55, stagger: 0.04, ease: 'power2.out', clearProps: 'opacity' },
          '-=0.5',
        );
      }
    };

    // Allow instant skip on click/tap
    loaderEl.addEventListener('click', revealExperience, { once: true });

    gsap.set(greetingEl, { opacity: 0, y: 12 });
    gsap.fromTo(
      loaderSubEl,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
    );

    GREETINGS.forEach((word, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === GREETINGS.length - 1;
      const holdDur = isFirst ? 0.24 : isLast ? 0.22 : 0.12;

      tl.call(() => {
        greetingEl.textContent = word;
      })
        .fromTo(
          greetingEl,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: isFirst ? 0.3 : 0.16, ease: 'power2.out' },
        )
        .to(greetingEl, {
          opacity: isLast ? 1 : 0,
          y: isLast ? 0 : -10,
          duration: isLast ? 0.01 : 0.13,
          delay: holdDur,
          ease: 'power2.in',
        });
    });

    tl.call(revealExperience);
  }

  function transitionBackToMain(href) {
    try {
      window.sessionStorage.setItem(TRANSITION_KEY, 'to-main');
    } catch {
      // ignore storage restrictions
    }

    if (!loaderEl || !greetingEl || !gsap) {
      window.location.href = href;
      return;
    }

    loaderEl.classList.remove('is-done');
    greetingEl.textContent = 'RANN.';
    if (loaderSubEl) loaderSubEl.textContent = 'Returning to Main Portfolio';

    gsap.set(loaderEl, { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 });
    gsap.set([greetingEl, loaderSubEl], { opacity: 0, y: 14 });

    const exitTl = gsap.timeline({
      onComplete: () => {
        window.location.href = href;
      },
    });

    exitTl
      .to(loaderEl, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.56,
        ease: 'power4.inOut',
      })
      .to(
        [greetingEl, loaderSubEl],
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          stagger: 0.05,
          ease: 'power2.out',
        },
        '-=0.22',
      );
  }

  doc.addEventListener('click', (e) => {
    const backLink = e.target.closest && e.target.closest('a[href="/"]');
    if (backLink && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      transitionBackToMain('/?from=experience');
    }
  });

  runApplePreloader();

  const qs = (sel, parent) => (parent || doc).querySelector(sel);
  const qsa = (sel, parent) => Array.from((parent || doc).querySelectorAll(sel));
  const clamp = (val, min, max) => (val < min ? min : val > max ? max : val);
  const smoothstep = (t) => {
    const x = clamp(t, 0, 1);
    return x * x * x * (x * (x * 6 - 15) + 10);
  };
  const parseNum = (val, fallback) => {
    const n = parseFloat(val);
    return Number.isNaN(n) ? fallback : n;
  };
  const parsePair = (str) => {
    const parts = (str || '0,0').split(',');
    return [parseNum(parts[0], 0), parseNum(parts[1], 0)];
  };

  const CONFIG = {
    email: 'randizakariaputra22@gmail.com',
    capabilities: [
      'Fullstack',
      'Backend',
      'QA',
      'RESTful API',
      'Server Management',
    ],
    techStack: [
      { name: 'Laravel', icon: 'devicon-laravel-original' },
      { name: 'Spring Boot', icon: 'devicon-spring-original' },
      { name: 'Go', icon: 'devicon-go-original-wordmark' },
      { name: 'Django', icon: 'devicon-django-plain' },
      { name: 'Vue.js', icon: 'devicon-vuejs-plain' },
      { name: 'React', icon: 'devicon-react-original' },
      { name: 'Next.js', icon: 'devicon-nextjs-original-wordmark' },
      { name: 'Tailwind', icon: 'devicon-tailwindcss-original' },
      { name: 'MySQL', icon: 'devicon-mysql-original' },
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
      { name: 'SQLite', icon: 'devicon-sqlite-plain' },
      { name: 'Docker', icon: 'devicon-docker-plain' },
      { name: 'Git', icon: 'devicon-git-plain' },
      { name: 'IoT / Arduino', icon: 'devicon-arduino-plain' },
      { name: 'Unity', icon: 'devicon-unity-plain' },
      { name: 'Three.js', icon: 'devicon-threejs-original' },
    ],
    projects: window.PROJECTS || [],
  };

  /* -------------------------------------------------------------------------
     1. Populate Engineering Capabilities & Visual Tech Stack Stop
     ------------------------------------------------------------------------- */
  function populateCapabilities() {
    const svcStop = qs('.svc-st');
    if (svcStop) {
      const coords = [
        [-0.26, -0.18, 0.08, -0.12, -0.32],
        [0.26, -0.12, 0.08, 0.12, -0.15],
        [-0.22, 0.12, 0.08, 0.0, 0.02],
        [0.24, 0.24, 0.08, -0.1, 0.19],
        [0.0, 0.02, 0.08, 0.08, 0.35],
      ];

      svcStop.insertAdjacentHTML(
        'beforeend',
        CONFIG.capabilities
          .map((name, idx) => {
            const c = coords[idx];
            return (
              `<div class="el" data-abs="1" data-p="${c[0]},${c[1]}" ` +
              `data-mp="${c[3]},${c[4]}" data-z="${c[2]}" data-f="0,0">` +
              `<p class="d svc-nm">${name}</p></div>`
            );
          })
          .join(''),
      );
    }

    const techGrid = qs('#tech-3d-grid');
    if (techGrid) {
      techGrid.innerHTML = CONFIG.techStack
        .map(
          (item) =>
            `<button type="button" class="tech-3d-item" title="${item.name}">` +
            `<i class="${item.icon}"></i><span>${item.name}</span></button>`,
        )
        .join('');
    }
  }

  /* -------------------------------------------------------------------------
     2. Populate Selected Work 3D Stops (lightweight WebP card thumbnails)
     ------------------------------------------------------------------------- */
  function populateWorkStops() {
    const mount = qs('#work-stops');
    if (!mount) return;

    const cardSlots = [
      { x: -0.22, y: -0.02, ax: 0.06, ay: 0.28 },
      { x: 0.22, y: 0.04, ax: -0.04, ay: -0.28 },
      { x: -0.19, y: 0.0, ax: 0.24, ay: 0.32 },
    ];

    mount.outerHTML = CONFIG.projects
      .map((proj, idx) => {
        const slot = cardSlots[idx % cardSlots.length];
        const side = slot.x < 0 ? 'l' : 'r';
        const dir = slot.x < 0 ? 1 : -1;
        const labelIdx = String(idx + 1).padStart(2, '0');
        const total = String(CONFIG.projects.length).padStart(2, '0');
        const shortName = proj.shortTitle || proj.title;

        return (
          `<section class="st" data-label="Work" data-gap="${idx ? 2.8 : 2.1}" ` +
          `data-hold=".4" data-ease=".5" data-a="${slot.ax},${slot.ay}" data-ma="${0.4 * dir},0.34">` +
          `<div class="el" data-p="${slot.x},${slot.y}" data-mp="0,-0.02" data-z="0" ` +
          `data-f="${slot.x < 0 ? -0.22 : 0.22},0" data-r="${slot.x < 0 ? 14 : -14}">` +
          `<button type="button" class="card ${side}" data-proj="${idx}" style="width:clamp(270px,30vw,500px)">` +
          `<span class="fig work-cover"><img src="${proj.cardImage}" alt="${shortName}" loading="lazy" decoding="async"></span>` +
          `<span class="meta"><span class="mono">${labelIdx} / ${total}</span><span class="mono">${proj.category}</span></span>` +
          `<span class="d ${idx % 2 ? 't2' : 'b7'}">${shortName}</span>` +
          `<span class="small work-copy">${proj.company} · ${proj.year}</span>` +
          `<span class="mono open">View project<i aria-hidden="true"></i></span>` +
          `</button></div></section>`
        );
      })
      .join('');
  }

  /* -------------------------------------------------------------------------
     3. Reversible GSAP Fullscreen Menu
     ------------------------------------------------------------------------- */
  const burgerBtn = qs('#burger');
  const menuEl = qs('#menu');
  const menuItems = qsa('#menu ol li');
  let isMenuOpen = false;
  let pendingAfterMenuClose = null;
  let menuTimeline = null;

  function getMenuTimeline() {
    if (menuTimeline || !gsap || !menuEl) return menuTimeline;
    gsap.set(menuEl, {
      visibility: 'hidden',
      clipPath: 'circle(0% at calc(100% - 40px) 40px)',
    });
    gsap.set(menuItems, { opacity: 0, y: 20 });

    menuTimeline = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        menuEl.style.visibility = 'hidden';
        root.classList.remove('menu-open');
        if (pendingAfterMenuClose) {
          const cb = pendingAfterMenuClose;
          pendingAfterMenuClose = null;
          cb();
        }
      },
    });

    menuTimeline
      .to(
        menuEl,
        {
          clipPath: 'circle(150% at calc(100% - 40px) 40px)',
          duration: 0.52,
          ease: 'power3.inOut',
        },
        0,
      )
      .to(
        menuItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.035,
          ease: 'power3.out',
        },
        0.12,
      );

    return menuTimeline;
  }

  function setMenuOpen(open, onClosed) {
    const tl = getMenuTimeline();
    isMenuOpen = !!open;
    if (burgerBtn) burgerBtn.setAttribute('aria-expanded', String(isMenuOpen));

    if (!tl) {
      root.classList.toggle('menu-open', isMenuOpen);
      if (menuEl) menuEl.style.visibility = isMenuOpen ? 'visible' : 'hidden';
      if (!isMenuOpen && onClosed) onClosed();
      return;
    }

    if (isMenuOpen) {
      pendingAfterMenuClose = null;
      menuEl.style.visibility = 'visible';
      root.classList.add('menu-open');
      tl.timeScale(1).play();
    } else {
      pendingAfterMenuClose = onClosed || null;
      if (tl.progress() > 0) {
        tl.timeScale(1.25).reverse();
      } else {
        menuEl.style.visibility = 'hidden';
        root.classList.remove('menu-open');
        if (pendingAfterMenuClose) {
          const cb = pendingAfterMenuClose;
          pendingAfterMenuClose = null;
          cb();
        }
      }
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => setMenuOpen(!isMenuOpen));
  }

  /* -------------------------------------------------------------------------
     4. Full-Page Project Case Study (Image-Origin GSAP Expand/Collapse)
     ------------------------------------------------------------------------- */
  const projDialog = qs('#proj');
  const projCloseBtn = qs('#pvx');
  let activeProjIndex = -1;
  let activeCardTrigger = null;

  function computeImageInset(triggerBtn) {
    const img = triggerBtn ? triggerBtn.querySelector('.work-cover img') || triggerBtn : null;
    if (!img) return 'inset(15% 15% 15% 15% round 14px)';
    const rect = img.getBoundingClientRect();
    return (
      `inset(${Math.max(0, rect.top).toFixed(1)}px ` +
      `${Math.max(0, window.innerWidth - rect.right).toFixed(1)}px ` +
      `${Math.max(0, window.innerHeight - rect.bottom).toFixed(1)}px ` +
      `${Math.max(0, rect.left).toFixed(1)}px round 12px)`
    );
  }

  function renderProjectMarkup(idx) {
    const proj = CONFIG.projects[idx];
    const nextProj = CONFIG.projects[(idx + 1) % CONFIG.projects.length];
    if (!proj || !projDialog) return;

    const highlightsHtml = proj.highlights.length
      ? `<div><span class="mono">Key Engineering Highlights</span><ul class="pv-highlights">` +
        proj.highlights.map((h) => `<li>${h}</li>`).join('') +
        `</ul></div>`
      : '';

    const stackHtml = proj.services.length
      ? `<div><span class="mono">Tech Stack</span><div class="pv-stack">` +
        proj.services.map((s) => `<span>${s}</span>`).join('') +
        `</div></div>`
      : '';

    const metricsHtml = proj.metrics ? `<div class="pv-metrics">${proj.metrics}</div>` : '';

    const actionsHtml =
      `<div class="pv-actions">` +
      (proj.liveUrl
        ? `<a class="pv-btn-primary" href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer">Visit Live Site &#8599;</a>`
        : '') +
      (proj.githubUrl
        ? `<a class="pv-btn-secondary" href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub Repository &#8599;</a>`
        : '') +
      `</div>`;

    const galleryHtml = proj.images
      .map((src, i) => {
        const isMob =
          proj.device === 'mobile' ||
          src.includes('-mobile') ||
          src.includes('cinemax') ||
          src.includes('flowledger-home') ||
          src.includes('flowledger-transactions');
        return (
          `<figure class="${isMob ? 'is-mobile-shot' : ''}">` +
          `<img src="${src}" alt="${proj.title} screenshot ${i + 1}" loading="${i > 0 ? 'lazy' : 'eager'}" decoding="async">` +
          `</figure>`
        );
      })
      .join('');

    projDialog.innerHTML =
      `<div class="pv">` +
      `<div class="pv-l">` +
      `<span class="mono">${String(idx + 1).padStart(2, '0')} / ${String(CONFIG.projects.length).padStart(2, '0')} · ${proj.category} · ${proj.period}</span>` +
      `<h2 class="d b9">${proj.title}</h2>` +
      metricsHtml +
      `<div><span class="mono">Overview</span><p style="margin-top:10px">${proj.description}</p></div>` +
      highlightsHtml +
      `<dl class="pv-dl"><dt>Organization / Context</dt><dd>${proj.company}</dd></dl>` +
      stackHtml +
      actionsHtml +
      `<button type="button" class="pv-next" id="pvn"><span class="mono">Next project</span><span class="d t1">${nextProj.shortTitle || nextProj.title}</span></button>` +
      `</div>` +
      `<div class="pv-r">${galleryHtml}</div>` +
      `</div>`;

    projDialog.scrollTop = 0;

    const nextBtn = qs('#pvn', projDialog);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIdx = (idx + 1) % CONFIG.projects.length;
        activeProjIndex = nextIdx;
        activeCardTrigger = doc.querySelector(`[data-proj="${nextIdx}"]`);
        renderProjectMarkup(nextIdx);
      });
    }
  }

  function openProject(idx, triggerBtn) {
    activeProjIndex = idx;
    activeCardTrigger = triggerBtn;
    renderProjectMarkup(idx);

    projDialog.classList.add('show');
    root.style.overflow = 'hidden';

    if (gsap) {
      gsap.killTweensOf(projDialog);
      if (isMobile) {
        projDialog.style.clipPath = 'none';
        gsap.fromTo(
          projDialog,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.34, ease: 'power3.out', clearProps: 'transform' },
        );
      } else {
        const startInset = computeImageInset(triggerBtn);
        gsap.fromTo(
          projDialog,
          { clipPath: startInset, opacity: 0.9 },
          {
            clipPath: 'inset(0px 0px 0px 0px round 0px)',
            opacity: 1,
            duration: 0.58,
            ease: 'power4.inOut',
          },
        );
      }
    } else {
      projDialog.style.clipPath = 'none';
    }

    if (projCloseBtn) projCloseBtn.focus({ preventScroll: true });
  }

  function closeProject() {
    if (activeProjIndex < 0) return;
    const targetBtn = activeCardTrigger || doc.querySelector(`[data-proj="${activeProjIndex}"]`);

    const finishClose = () => {
      projDialog.classList.remove('show');
      projDialog.innerHTML = '';
      projDialog.style.opacity = '';
      projDialog.style.clipPath = '';
      projDialog.style.transform = '';
      root.style.overflow = '';
      activeProjIndex = -1;
    };

    if (gsap) {
      gsap.killTweensOf(projDialog);
      if (isMobile) {
        gsap.to(projDialog, {
          opacity: 0,
          y: 28,
          duration: 0.24,
          ease: 'power2.in',
          onComplete: finishClose,
        });
      } else {
        const endInset = computeImageInset(targetBtn);
        gsap.to(projDialog, {
          clipPath: endInset,
          opacity: 0,
          duration: 0.44,
          ease: 'power3.inOut',
          onComplete: finishClose,
        });
      }
    } else {
      finishClose();
    }
  }

  if (projCloseBtn) projCloseBtn.addEventListener('click', closeProject);

  doc.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (activeProjIndex >= 0) closeProject();
      else if (isMenuOpen) setMenuOpen(false);
    }
  });

  doc.addEventListener('click', (e) => {
    const card = e.target.closest && e.target.closest('[data-proj]');
    if (card) {
      openProject(Number(card.dataset.proj), card);
    }
  });

  /* -------------------------------------------------------------------------
     5. Copy Email
     ------------------------------------------------------------------------- */
  const copyBtn = qs('#copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const reset = (msg) => {
        copyBtn.textContent = msg;
        setTimeout(() => {
          copyBtn.textContent = 'Copy email';
        }, 1800);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(CONFIG.email).then(
          () => reset('Copied'),
          () => reset('Select & Copy'),
        );
      } else {
        reset('Select & Copy');
      }
    });
  }

  /* -------------------------------------------------------------------------
     6. Core 3D Z-Depth Camera + Single-Canvas Starfield & Celestial Thread
     ------------------------------------------------------------------------- */
  populateCapabilities();
  populateWorkStops();

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    root.classList.remove('is3d');
    return;
  }

  root.classList.add('is3d');
  if ('scrollRestoration' in history) {
    try {
      history.scrollRestoration = 'manual';
    } catch {
      // ignore restricted history environments
    }
  }
  window.scrollTo(0, 0);

  const canvas = qs('#cv');
  const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null;
  const spacerEl = qs('#spacer');
  const featuredSection = qs('#assist-ding');
  const featuredPanel = featuredSection ? qs('.panel', featuredSection) : null;
  const featuredFlys = featuredSection ? qsa('.fly', featuredSection) : [];
  const featuredInner = featuredSection ? qs('.dk-in', featuredSection) : null;
  const countEl = qs('#count');
  const hudEl = qs('#hud');
  const hudNumEl = qs('#hudn');
  const hudLabelEl = qs('#hudl');
  const hudTicksEl = qs('#ticks');

  let viewW = window.innerWidth;
  let viewH = window.innerHeight;
  let isMobile = viewW < 768;
  let focalLen = 1000;
  let stops = [];
  let elements = [];
  let keyStops = [];
  let curveSamples = [];
  let stars = [];
  let cachedTicks = [];
  let maxCurveZ = 0;
  let featuredStop = null;
  let totalScrollPx = 0;
  let targetScrollY = 0;
  let currentScrollK = 0;
  let lastRenderedK = -1;
  let dirty = true;
  let countAnimated = false;
  let lastHudLabel = '';
  let scrollTriggerInstance = null;

  const STAR_COLORS = ['#f8fafc', '#bae6fd', '#38bdf8', '#a5b4fc'];

  function initStars() {
    const count = isMobile ? 35 : 68;
    stars = new Array(count);
    for (let i = 0; i < count; i++) {
      const depth = 0.3 + Math.random() * 0.9;
      stars[i] = {
        x: Math.random() * viewW,
        y: Math.random() * viewH,
        size: depth > 0.85 ? 2 : 1.2,
        depth,
        alpha: 0.25 + Math.random() * 0.6,
        color: STAR_COLORS[i % STAR_COLORS.length],
      };
    }
  }

  function buildSceneLayout() {
    const prevRatio = totalScrollPx ? clamp(window.scrollY / totalScrollPx, 0, 1) : 0;
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    isMobile = viewW < 768;
    focalLen = isMobile ? 860 : clamp(viewW * 0.78, 900, 1360);

    // Single opaque canvas at DPR=1 for zero-lag 60-120fps on all devices
    if (canvas) {
      canvas.width = viewW;
      canvas.height = viewH;
    }
    initStars();

    stops = [];
    elements = [];
    featuredStop = null;

    let cursorZ = 0;
    qsa('.st').forEach((sec, idx) => {
      const gap = parseNum(sec.dataset.gap, 2.8);
      if (idx > 0) cursorZ += gap * focalLen;

      const anchor = parsePair(isMobile && sec.dataset.ma ? sec.dataset.ma : sec.dataset.a);
      const stop = {
        sec,
        id: sec.id,
        label: sec.dataset.label || '',
        z: cursorZ,
        gap,
        hold: parseNum(sec.dataset.hold, 0.55),
        ease: parseNum(sec.dataset.ease, 0.8),
        ax: anchor[0],
        ay: anchor[1],
        isFeatured: !!sec.dataset.dk,
        sHold: 0,
        holdPx: 0,
      };
      stops.push(stop);
      if (stop.isFeatured) featuredStop = stop;

      qsa('.el', sec).forEach((el) => {
        const pos = parsePair(isMobile && el.dataset.mp ? el.dataset.mp : el.dataset.p);
        const fly = parsePair(el.dataset.f);
        const zOff = parseNum(el.dataset.z, 0);
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
        elements.push({
          el,
          stop,
          abs: parseNum(el.dataset.abs, 0),
          x: pos[0],
          y: pos[1],
          zOff,
          z: cursorZ + zOff * focalLen,
          fadeDist: Math.min(1.65, Math.max(1, gap * 0.8)) * focalLen,
          fx: isMobile ? fly[0] * 0.45 : fly[0],
          fy: fly[1],
          rotY: isMobile ? 0 : parseNum(el.dataset.r, 0),
          visible: false,
          clickable: false,
          node: el.querySelector('.node'),
        });
      });
    });

    // Build scroll-to-cameraZ mapping
    keyStops = [];
    let scrollAcc = 0;
    const speedFactor = isMobile ? 0.5 : 0.44;
    stops.forEach((st, idx) => {
      const baseZc = st.z - focalLen;
      if (idx > 0) scrollAcc += st.gap * speedFactor * viewH;
      const drift = st.isFeatured || idx === 0 ? 0 : 0.1;
      const holdPx = st.isFeatured ? st.hold * viewH : st.hold * viewH * 0.55;

      keyStops.push({ s: scrollAcc, zc: baseZc - drift * focalLen, ease: idx ? st.ease * 0.45 : 0 });
      st.sHold = scrollAcc;
      st.holdPx = holdPx;
      scrollAcc += holdPx;
      keyStops.push({ s: scrollAcc, zc: baseZc + (st.isFeatured ? 0 : 0.1) * focalLen, ease: 0 });
    });

    totalScrollPx = scrollAcc;
    if (spacerEl) spacerEl.style.height = `${totalScrollPx + viewH}px`;

    // Build Hermite 3D curve for celestial sky thread
    const pts = [{ z: stops[0].z, x: stops[0].ax * viewW, y: stops[0].ay * viewH }];
    let flip = 1;
    for (let i = 1; i < stops.length; i++) {
      const prev = stops[i - 1];
      const curr = stops[i];
      if (curr.gap >= 2.1) {
        flip = -flip;
        pts.push({
          z: prev.z + (curr.z - prev.z) * 0.5,
          x: flip * (isMobile ? 0.72 : 0.92) * viewW,
          y: (flip > 0 ? -0.38 : 0.42) * viewH,
        });
      }
      pts.push({ z: curr.z, x: curr.ax * viewW, y: curr.ay * viewH });
    }

    maxCurveZ = pts[pts.length - 1].z;
    curveSamples = [];
    const tanX = [];
    const tanY = [];
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[Math.min(pts.length - 1, i + 1)];
      const dz = Math.max(1, p1.z - p0.z);
      tanX[i] = i === 0 || i === pts.length - 1 ? 0 : (p1.x - p0.x) / dz;
      tanY[i] = i === 0 || i === pts.length - 1 ? 0 : (p1.y - p0.y) / dz;
    }

    for (let i = 0; i < pts.length - 1; i++) {
      const g = pts[i];
      const h = pts[i + 1];
      const dz = Math.max(1, h.z - g.z);
      const segs = Math.max(16, Math.round((dz / focalLen) * 22));
      for (let j = 0; j < segs; j++) {
        const t = j / segs;
        const t2 = t * t;
        const t3 = t2 * t;
        const h00 = 2 * t3 - 3 * t2 + 1;
        const h10 = t3 - 2 * t2 + t;
        const h01 = -2 * t3 + 3 * t2;
        const h11 = t3 - t2;
        curveSamples.push({
          z: g.z + dz * t,
          x: h00 * g.x + h10 * dz * tanX[i] + h01 * h.x + h11 * dz * tanX[i + 1],
          y: h00 * g.y + h10 * dz * tanY[i] + h01 * h.y + h11 * dz * tanY[i + 1],
        });
      }
    }
    curveSamples.push({ z: maxCurveZ, x: pts[pts.length - 1].x, y: pts[pts.length - 1].y });

    if (featuredInner) {
      featuredInner.style.transform = '';
      const maxH = viewH - (isMobile ? 120 : 150);
      if (featuredInner.offsetHeight > maxH) {
        featuredInner.style.transform = `scale(${(maxH / featuredInner.offsetHeight).toFixed(3)})`;
      }
    }

    if (hudTicksEl) {
      hudTicksEl.innerHTML = stops
        .filter((st, idx) => idx === 0 || st.gap >= 2.1)
        .map(
          (st) =>
            `<i class="tk" data-s="${st.sHold}" title="${st.label}" style="top:${((st.sHold / totalScrollPx) * 100).toFixed(2)}%"></i>`,
        )
        .join('');
      cachedTicks = qsa('.tk', hudTicksEl).map((el) => ({ el, s: Number(el.dataset.s) }));
    }

    currentScrollK = prevRatio * totalScrollPx;
    targetScrollY = currentScrollK;
    if (prevRatio > 0 && activeProjIndex < 0) window.scrollTo(0, currentScrollK);
  }

  function scrollToCameraZ(s) {
    if (s <= keyStops[0].s) return keyStops[0].zc;
    for (let i = 1; i < keyStops.length; i++) {
      const a = keyStops[i - 1];
      const b = keyStops[i];
      if (s <= b.s) {
        let t = (s - a.s) / Math.max(1, b.s - a.s);
        t = t * (1 - b.ease) + smoothstep(t) * b.ease;
        return a.zc + (b.zc - a.zc) * t;
      }
    }
    return keyStops[keyStops.length - 1].zc;
  }

  /* Single-Canvas Renderer: Pure Black + Parallax Stars + Celestial Thread (<0.5ms/frame) */
  function renderCanvas(cameraZ, scrollPx) {
    if (!ctx) return;

    // 1. Pure black space backdrop
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, viewW, viewH);

    // 2. Parallax stars driven directly by scroll depth (zero extra canvas!)
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const sy = ((s.y - scrollPx * 0.08 * s.depth) % viewH + viewH) % viewH;
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x | 0, sy | 0, s.size, s.size);
    }

    // 3. Celestial sky-blue / indigo 3D thread
    const cx = viewW * 0.5;
    const cy = viewH * 0.5;
    const nearClip = 0.12 * focalLen;
    const farClip = Math.min(cameraZ + 3.1 * focalLen, maxCurveZ);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let mirror = 0; mirror < 2; mirror++) {
      ctx.save();
      if (mirror === 1) {
        ctx.translate(viewW, 0);
        ctx.scale(-1, 1);
      }

      ctx.strokeStyle = mirror === 0 ? '#38bdf8' : '#818cf8';
      ctx.globalAlpha = mirror === 0 ? 0.72 : 0.42;
      ctx.lineWidth = 1.8;
      ctx.beginPath();

      let started = false;
      let lastPt = null;
      for (let i = 0; i < curveSamples.length; i++) {
        const pt = curveSamples[i];
        if (pt.z < cameraZ + nearClip) {
          started = false;
          continue;
        }
        if (pt.z > farClip) break;

        const dz = pt.z - cameraZ;
        const scale = focalLen / dz;
        const sx = cx + pt.x * scale;
        const sy = cy + pt.y * scale;

        if (!started) {
          ctx.moveTo(sx, sy);
          started = true;
        } else {
          ctx.lineTo(sx, sy);
        }
        lastPt = { x: sx, y: sy, scale };
      }
      ctx.stroke();

      if (lastPt) {
        const r = clamp(4.2 * lastPt.scale, 2.5, 8);
        ctx.fillStyle = mirror === 0 ? '#38bdf8' : '#818cf8';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  /* Fast 3D Element Projection — ZERO zIndex mutations per frame */
  function renderElements(cameraZ) {
    const cx = viewW * 0.5;
    const cy = viewH * 0.5;

    for (let i = 0; i < elements.length; i++) {
      const item = elements[i];
      const dz = item.z - cameraZ;
      const baseDist = focalLen * (1 + item.zOff);
      const offset = dz - baseDist;

      if (offset > 2.4 * focalLen || dz < 0.18 * focalLen) {
        if (item.visible) {
          item.el.style.visibility = 'hidden';
          item.visible = false;
        }
        if (item.clickable) {
          item.el.style.pointerEvents = 'none';
          item.clickable = false;
        }
        continue;
      }

      const scale = (item.abs ? focalLen * item.abs : baseDist) / dz;
      const approach = offset > 0 ? smoothstep(offset / (1.8 * focalLen)) : 0;
      const px = cx + (item.x + item.fx * approach) * viewW * scale;
      const py = cy + (item.y + item.fy * approach) * viewH * scale;

      const alpha =
        offset > 0
          ? 1 - smoothstep((offset - 0.45 * item.fadeDist) / (0.55 * item.fadeDist))
          : 1 - smoothstep((-offset - 0.22 * focalLen) / (0.4 * focalLen));

      if (alpha < 0.015) {
        if (item.visible) {
          item.el.style.visibility = 'hidden';
          item.visible = false;
        }
        if (item.clickable) {
          item.el.style.pointerEvents = 'none';
          item.clickable = false;
        }
        continue;
      }

      if (!item.visible) {
        item.el.style.visibility = 'visible';
        item.visible = true;
      }

      const canClick = alpha > 0.35 && scale > 0.55 && scale < 2.1;
      if (canClick !== item.clickable) {
        item.clickable = canClick;
        item.el.style.pointerEvents = canClick ? 'auto' : 'none';
      }

      item.el.style.opacity = alpha.toFixed(3);
      item.el.style.transform =
        `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0) ` +
        `translate(-50%,-50%) perspective(1100px) ` +
        `rotateY(${(item.rotY * approach).toFixed(2)}deg) scale(${scale.toFixed(4)})`;

      if (item.node) {
        item.node.classList.toggle('on', offset < 0.05 * focalLen);
      }
    }

    // Trigger 20+ production apps counter smoothly when Numbers stop enters focus
    const numStop = stops.find((st) => st.id === 'numbers');
    if (numStop && countEl) {
      const dist = numStop.z - cameraZ - focalLen;
      if (!countAnimated && dist < 0.5 * focalLen && dist > -0.8 * focalLen) {
        countAnimated = true;
        const obj = { val: 0 };
        if (gsap) {
          gsap.to(obj, {
            val: 20,
            duration: 0.9,
            ease: 'power3.out',
            onUpdate: () => {
              countEl.textContent = String(Math.round(obj.val));
            },
          });
        } else {
          countEl.textContent = '20';
        }
      } else if (countAnimated && dist > 1.3 * focalLen) {
        countAnimated = false;
        countEl.textContent = '0';
      }
    }
  }

  function renderFeaturedPanel(scrollPx) {
    if (!featuredStop || !featuredSection || !featuredPanel) return;

    const start = featuredStop.sHold;
    const hold = featuredStop.holdPx;
    const enter = smoothstep((scrollPx - (start - 0.72 * viewH)) / viewH);
    const mid = (scrollPx - (start + 0.05 * viewH)) / (0.9 * viewH);
    const exit = smoothstep((scrollPx - (start + hold - viewH)) / viewH);

    if (enter <= 0 || exit >= 1) {
      if (featuredSection.style.visibility !== 'hidden') {
        featuredSection.style.visibility = 'hidden';
        featuredSection.style.pointerEvents = 'none';
      }
      return;
    }

    featuredSection.style.visibility = 'visible';
    const radius = Math.hypot(viewW, viewH) * 0.62 * enter + 1;
    featuredPanel.style.clipPath = `circle(${radius.toFixed(1)}px at 50% 50%)`;
    const exitScale = 1 - 0.75 * exit;
    featuredPanel.style.transform = `perspective(1200px) translate3d(0,${(-exit * viewH * 0.04).toFixed(1)}px,0) rotateX(${(exit * 12).toFixed(2)}deg) scale(${exitScale.toFixed(4)})`;
    featuredPanel.style.borderRadius = `${(exit * 32).toFixed(1)}px`;
    featuredPanel.style.opacity = (1 - smoothstep((exit - 0.65) / 0.35)).toFixed(3);
    featuredSection.style.pointerEvents = enter > 0.95 && exit < 0.2 ? 'auto' : 'none';

    for (let i = 0; i < featuredFlys.length; i++) {
      const q = 1 - smoothstep(mid * 1.5 - i * 0.12);
      featuredFlys[i].style.setProperty('--q', q.toFixed(3));
    }
  }

  function renderHud(scrollPx) {
    if (!hudEl || !stops.length) return;
    let active = stops[0];
    let activeIdx = 0;
    let majorIdx = 0;

    for (let i = 0; i < stops.length; i++) {
      const st = stops[i];
      if (st.gap >= 2.1 || i === 0) {
        if (scrollPx >= st.sHold - 0.55 * viewH) {
          active = st;
          activeIdx = majorIdx;
        }
        majorIdx++;
      }
    }

    if (active.label !== lastHudLabel) {
      lastHudLabel = active.label;
      if (hudLabelEl) hudLabelEl.textContent = active.label;
      if (hudNumEl) hudNumEl.textContent = String(activeIdx + 1).padStart(2, '0');
    }

    hudEl.style.setProperty('--p', clamp(scrollPx / totalScrollPx, 0, 1).toFixed(4));
    for (let i = 0; i < cachedTicks.length; i++) {
      cachedTicks[i].el.classList.toggle('on', cachedTicks[i].s <= scrollPx + 2);
    }
  }

  /* Numeric ScrollTrigger — ZERO getBoundingClientRect() on scroll */
  function setupGsapScroll() {
    if (!gsap || !ScrollTrigger) return;
    if (ScrollToPlugin) gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    else gsap.registerPlugin(ScrollTrigger);

    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }

    scrollTriggerInstance = ScrollTrigger.create({
      start: 0,
      end: () => Math.max(1, totalScrollPx),
      onUpdate: (self) => {
        targetScrollY = self.progress * totalScrollPx;
      },
    });
  }

  function flyToScroll(targetY) {
    if (gsap && ScrollToPlugin) {
      gsap.to(window, {
        scrollTo: targetY,
        duration: 1.0,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }

  doc.addEventListener('click', (e) => {
    const goEl = e.target.closest && e.target.closest('[data-go]');
    if (goEl) {
      e.preventDefault();
      const targetId = goEl.dataset.go;
      const executeScroll = () => {
        const match = stops.find((st) => st.id === targetId || (targetId === 'assist-ding' && st.isFeatured));
        if (match) flyToScroll(match.sHold + (match.isFeatured ? match.holdPx * 0.45 : 2));
      };
      if (isMenuOpen) setMenuOpen(false, executeScroll);
      else executeScroll();
      return;
    }

    const tick = e.target.closest && e.target.closest('.tk');
    if (tick) {
      flyToScroll(Number(tick.dataset.s) + 2);
    }
  });

  const heroLogos = qsa('#hero-bouquet .hero-logo').map((el) => ({
    el,
    sx: parseNum(el.dataset.sx, 0),
    sy: parseNum(el.dataset.sy, 0),
    sr: parseNum(el.dataset.sr, 0),
  }));

  /* Scroll-synced Hero Bouquet: assembles tightly around RANDI at top, scatters outward on scroll, re-assembles when scrolling back up */
  function renderHeroBouquet(scrollPx) {
    if (!heroLogos.length) return;
    const heroSpan = Math.max(1, viewH * 0.95);
    const t = smoothstep(clamp(scrollPx / heroSpan, 0, 1));
    const scaleFactor = isMobile ? 0.52 : 1;

    for (let i = 0; i < heroLogos.length; i++) {
      const logo = heroLogos[i];
      const tx = logo.sx * scaleFactor * t;
      const ty = logo.sy * scaleFactor * t;
      const rot = logo.sr * t;
      const sc = 1 + 0.18 * t;
      logo.el.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) rotate(${rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
    }
  }

  /* Zero-Idle-Burn GSAP Ticker Loop */
  function onTick(_time, deltaMs) {
    // Always read live window.scrollY on touch devices for immediate bi-directional scroll
    if (isTouchDevice || !gsap || !ScrollTrigger) {
      targetScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    }

    const dt = Math.min(0.05, (deltaMs || 16) / 1000);
    const diff = targetScrollY - currentScrollK;
    if (isTouchDevice) {
      // Snappier direct response on touch so upward/downward swipe feels native
      currentScrollK += diff * Math.min(1, dt * 16);
      if (Math.abs(diff) < 0.5) currentScrollK = targetScrollY;
    } else if (Math.abs(diff) > 0.25) {
      currentScrollK += diff * (1 - Math.exp(-dt * 8.5));
    } else if (diff !== 0) {
      currentScrollK = targetScrollY;
    }

    // Sleep when idle — 0% CPU/GPU usage between scrolls!
    if (!dirty && Math.abs(currentScrollK - lastRenderedK) < 0.05) {
      return;
    }

    lastRenderedK = currentScrollK;
    dirty = false;

    const cameraZ = scrollToCameraZ(currentScrollK);
    renderCanvas(cameraZ, currentScrollK);
    renderHeroBouquet(currentScrollK);
    renderElements(cameraZ);
    renderFeaturedPanel(currentScrollK);
    renderHud(currentScrollK);
  }

  buildSceneLayout();
  setupGsapScroll();

  if (gsap) {
    gsap.ticker.add(onTick);
  } else {
    (function fallbackLoop() {
      onTick(0, 16);
      requestAnimationFrame(fallbackLoop);
    })();
  }

  let resizeTimer = null;
  let lastLayoutWidth = window.innerWidth;
  const isTouchDevice =
    window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  window.addEventListener(
    'resize',
    () => {
      // CRITICAL MOBILE FIX: ignore vertical address-bar show/hide resize events
      // so scrolling back up never snaps or rebuilds the scene!
      if (isTouchDevice && window.innerWidth === lastLayoutWidth) {
        return;
      }
      lastLayoutWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildSceneLayout();
        setupGsapScroll();
        dirty = true;
      }, 180);
    },
    { passive: true },
  );

  if (doc.fonts && doc.fonts.ready) {
    doc.fonts.ready.then(() => {
      buildSceneLayout();
      setupGsapScroll();
      dirty = true;
    });
  }
})();
