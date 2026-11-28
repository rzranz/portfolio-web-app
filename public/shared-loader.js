/**
 * RandiLoader — Single Unified Reusable Page Transition & Loading Engine
 * Shared identically between Main Portfolio (/) and 3D Experience (/experience/).
 *
 * Both modes share the EXACT same layout, timing, progress bar (0% -> 100%),
 * and upward curtain lift:
 *   - 'greetings' (Main -> 3D Experience): Apple-style multilingual greetings + 0-100% bar
 *   - 'brand'     (3D Experience -> Main): Logo + RANN. + 0-100% bar
 */
(function initRandiLoader() {
  'use strict';

  const STORAGE_KEY = 'rz_loader_mode';
  const GREETINGS = ['Hello', 'Halo', 'Ciao', 'Bonjour', 'こんにちは', 'Hola', '안녕하세요'];
  const STYLE_ID = 'rz-shared-loader-style';
  const ROOT_ID = 'rz-shared-loader';

  let activeRaf = 0;
  let activeTimers = [];
  let isNavigating = false;

  function clearTimers() {
    if (activeRaf) {
      cancelAnimationFrame(activeRaf);
      activeRaf = 0;
    }
    while (activeTimers.length) {
      clearTimeout(activeTimers.pop());
    }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID} {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: #000000;
        color: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        clip-path: inset(0% 0% 0% 0%);
        opacity: 1;
        transition: clip-path 0.72s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.32s ease;
        font-family: "Poppins", -apple-system, BlinkMacSystemFont, sans-serif;
      }
      #${ROOT_ID}.rz-hidden {
        display: none;
        pointer-events: none;
      }
      #${ROOT_ID}.rz-lift {
        clip-path: inset(0% 0% 100% 0%);
        pointer-events: none;
      }
      #${ROOT_ID}.rz-from-bottom {
        clip-path: inset(100% 0% 0% 0%);
        transition: none;
      }
      #${ROOT_ID} .rz-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18px;
        padding: 0 24px;
        text-align: center;
        transition: opacity 0.26s ease, transform 0.26s ease;
      }
      #${ROOT_ID} .rz-inner.rz-fade-out {
        opacity: 0;
        transform: translateY(-14px);
      }
      #${ROOT_ID} .rz-stage {
        min-height: 76px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #${ROOT_ID} .rz-brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
      }
      #${ROOT_ID} .rz-brand img {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: block;
      }
      #${ROOT_ID} .rz-brand-name {
        font-size: 32px;
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 1;
        color: #f8fafc;
      }
      #${ROOT_ID} .rz-brand-name span {
        color: #38bdf8;
      }
      #${ROOT_ID} .rz-greeting {
        font-size: clamp(38px, 7.5vw, 72px);
        font-weight: 600;
        letter-spacing: -0.035em;
        line-height: 1.08;
        color: #f8fafc;
      }
      #${ROOT_ID} .rz-track {
        width: 200px;
        height: 2px;
        background: #1e293b;
        border-radius: 999px;
        overflow: hidden;
      }
      #${ROOT_ID} .rz-bar {
        width: 100%;
        height: 100%;
        background: #38bdf8;
        transform: scaleX(0);
        transform-origin: left center;
      }
      #${ROOT_ID} .rz-pct {
        font-family: "JetBrains Mono", ui-monospace, Menlo, monospace;
        font-size: 12px;
        letter-spacing: 0.22em;
        color: #94a3b8;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function getOrCreateOverlay() {
    injectStyles();
    let el = document.getElementById(ROOT_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = ROOT_ID;
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      (document.body || document.documentElement).appendChild(el);
    }
    return el;
  }

  function finishLift(el, inner, onDone) {
    if (inner) inner.classList.add('rz-fade-out');
    activeTimers.push(
      setTimeout(() => {
        el.classList.add('rz-lift');
        activeTimers.push(
          setTimeout(() => {
            el.classList.add('rz-hidden');
            el.classList.remove('rz-lift');
            if (typeof onDone === 'function') onDone();
          }, 740),
        );
      }, 180),
    );
  }

  /* Single unified 0% -> 100% loader used identically by both 'greetings' and 'brand' */
  function runUnifiedLoader(el, isGreetings, onDone) {
    const headerHtml = isGreetings
      ? '<span class="rz-greeting">Hello</span>'
      : '<div class="rz-brand">' +
        '<img src="/RLogo.svg" alt="Randi Logo" />' +
        '<span class="rz-brand-name">RANN<span>.</span></span>' +
        '</div>';

    el.innerHTML =
      '<div class="rz-inner">' +
      '<div class="rz-stage">' + headerHtml + '</div>' +
      '<div class="rz-track"><div class="rz-bar"></div></div>' +
      '<span class="rz-pct">0%</span>' +
      '</div>';

    const inner = el.querySelector('.rz-inner');
    const bar = el.querySelector('.rz-bar');
    const pct = el.querySelector('.rz-pct');
    const greetingEl = isGreetings ? el.querySelector('.rz-greeting') : null;

    // Identical smooth 0-100% duration for both directions
    const duration = isGreetings ? 1350 : 1050;
    const start = performance.now();
    let lastGreetingIdx = 0;

    function step(now) {
      const raw = Math.min(1, (now - start) / duration);
      // Smooth cubic ease-in-out for consistent visual cadence
      const eased = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      if (bar) bar.style.transform = `scaleX(${eased.toFixed(4)})`;
      if (pct) pct.textContent = `${Math.round(eased * 100)}%`;

      if (greetingEl) {
        const idx = Math.min(GREETINGS.length - 1, Math.floor(raw * GREETINGS.length));
        if (idx !== lastGreetingIdx) {
          lastGreetingIdx = idx;
          greetingEl.textContent = GREETINGS[idx];
        }
      }

      if (raw < 1) {
        activeRaf = requestAnimationFrame(step);
      } else {
        activeRaf = 0;
        activeTimers.push(setTimeout(() => finishLift(el, inner, onDone), 120));
      }
    }

    activeRaf = requestAnimationFrame(step);
  }

  function enter(mode, options) {
    const opts = options || {};
    clearTimers();
    isNavigating = false;

    const el = getOrCreateOverlay();
    el.classList.remove('rz-hidden', 'rz-lift', 'rz-from-bottom');

    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }

    if (window.location.search.includes('from=experience')) {
      const cleanUrl = window.location.pathname + window.location.hash;
      try {
        window.history.replaceState(null, '', cleanUrl);
      } catch {
        // ignore history restrictions
      }
    }

    runUnifiedLoader(el, mode === 'greetings', opts.onDone);
  }

  function shouldAutoEnter(defaultMode, always) {
    if (always) return defaultMode;
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored === 'greetings' || stored === 'brand') return stored;
    } catch {
      // ignore
    }
    if (window.location.search.includes('from=experience')) return 'brand';
    if (document.referrer && document.referrer.includes('/experience')) return 'brand';
    return null;
  }

  function autoEnter(defaultMode, options) {
    const opts = options || {};
    const trigger = () => {
      const mode = shouldAutoEnter(defaultMode, !!opts.always);
      if (mode) enter(mode, opts);
    };

    if (document.body) {
      trigger();
    } else {
      document.addEventListener('DOMContentLoaded', trigger, { once: true });
    }

    // Also handle browser Back/Forward cache (bfcache)
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        enter(defaultMode, opts);
      }
    });
  }

  function navigateTo(url, nextMode) {
    if (isNavigating) return;
    isNavigating = true;
    clearTimers();

    try {
      window.sessionStorage.setItem(STORAGE_KEY, nextMode || 'brand');
    } catch {
      // ignore
    }

    const el = getOrCreateOverlay();
    el.innerHTML = '';
    el.classList.remove('rz-hidden', 'rz-lift');
    el.classList.add('rz-from-bottom');

    // Clean obsidian curtain slides up smoothly, then destination plays the unified 0-100% loader
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.remove('rz-from-bottom');
        activeTimers.push(
          setTimeout(() => {
            window.location.href = url;
          }, 420),
        );
      });
    });
  }

  window.RandiLoader = {
    enter,
    autoEnter,
    navigateTo,
  };
})();
