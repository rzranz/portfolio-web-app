/**
 * RandiLoader — Single Reusable Page Transition & Loading Engine
 * Shared identically between Main Portfolio (/) and 3D Experience (/experience/).
 *
 * Public API:
 *   window.RandiLoader.enter('greetings' | 'brand', { onDone })
 *   window.RandiLoader.autoEnter('greetings' | 'brand', { always: boolean })
 *   window.RandiLoader.navigateTo(url, nextMode)
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
        transition: clip-path 0.72s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.35s ease;
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
        gap: 16px;
        padding: 0 24px;
        text-align: center;
        transition: opacity 0.26s ease, transform 0.26s ease;
      }
      #${ROOT_ID} .rz-inner.rz-fade-out {
        opacity: 0;
        transform: translateY(-14px);
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
        font-size: 30px;
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 1;
        color: #f8fafc;
      }
      #${ROOT_ID} .rz-brand-name span {
        color: #38bdf8;
      }
      #${ROOT_ID} .rz-track {
        width: 192px;
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
      #${ROOT_ID} .rz-greeting {
        font-size: clamp(44px, 8.5vw, 96px);
        font-weight: 600;
        letter-spacing: -0.035em;
        line-height: 1.08;
        color: #f8fafc;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.18s ease, transform 0.18s ease;
      }
      #${ROOT_ID} .rz-greeting.rz-show {
        opacity: 1;
        transform: translateY(0);
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

  function runBrandLoader(el, onDone) {
    el.innerHTML =
      '<div class="rz-inner">' +
      '<div class="rz-brand">' +
      '<img src="/RLogo.svg" alt="Randi Logo" />' +
      '<span class="rz-brand-name">RANN<span>.</span></span>' +
      '</div>' +
      '<div class="rz-track"><div class="rz-bar"></div></div>' +
      '<span class="rz-pct">0%</span>' +
      '</div>';

    const inner = el.querySelector('.rz-inner');
    const bar = el.querySelector('.rz-bar');
    const pct = el.querySelector('.rz-pct');
    const duration = 850;
    const start = performance.now();

    function step(now) {
      const raw = Math.min(1, (now - start) / duration);
      // Ease in-out cubic
      const eased = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      if (bar) bar.style.transform = `scaleX(${eased.toFixed(4)})`;
      if (pct) pct.textContent = `${Math.round(eased * 100)}%`;

      if (raw < 1) {
        activeRaf = requestAnimationFrame(step);
      } else {
        activeRaf = 0;
        activeTimers.push(setTimeout(() => finishLift(el, inner, onDone), 100));
      }
    }

    activeRaf = requestAnimationFrame(step);
  }

  function runGreetingsLoader(el, onDone) {
    el.innerHTML =
      '<div class="rz-inner" style="cursor:pointer;">' +
      '<span class="rz-greeting">Hello</span>' +
      '</div>';

    const inner = el.querySelector('.rz-inner');
    const wordEl = el.querySelector('.rz-greeting');
    let finished = false;

    const complete = () => {
      if (finished) return;
      finished = true;
      clearTimers();
      finishLift(el, inner, onDone);
    };

    el.addEventListener('click', complete, { once: true });

    let idx = 0;
    function showNext() {
      if (finished) return;
      if (idx >= GREETINGS.length) {
        complete();
        return;
      }
      const isFirst = idx === 0;
      const isLast = idx === GREETINGS.length - 1;
      wordEl.textContent = GREETINGS[idx];
      wordEl.classList.remove('rz-show');

      // Force frame so transition triggers cleanly
      activeRaf = requestAnimationFrame(() => {
        wordEl.classList.add('rz-show');
        const hold = isFirst ? 340 : isLast ? 300 : 190;
        activeTimers.push(
          setTimeout(() => {
            if (isLast) {
              complete();
            } else {
              wordEl.classList.remove('rz-show');
              idx += 1;
              activeTimers.push(setTimeout(showNext, 130));
            }
          }, hold),
        );
      });
    }

    showNext();
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

    if (mode === 'greetings') {
      runGreetingsLoader(el, opts.onDone);
    } else {
      runBrandLoader(el, opts.onDone);
    }
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
    el.innerHTML =
      '<div class="rz-inner">' +
      '<div class="rz-brand">' +
      '<img src="/RLogo.svg" alt="Randi Logo" />' +
      '<span class="rz-brand-name">RANN<span>.</span></span>' +
      '</div>' +
      '</div>';

    el.classList.remove('rz-hidden', 'rz-lift');
    el.classList.add('rz-from-bottom');

    // Slide obsidian curtain cleanly up from bottom, then navigate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.remove('rz-from-bottom');
        activeTimers.push(
          setTimeout(() => {
            window.location.href = url;
          }, 520),
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
