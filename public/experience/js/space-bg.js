/**
 * Lightweight Deep Space Starfield
 * Pure black canvas (#000000), DPR=1, fillRect batching (<0.2ms/frame).
 */
(function initSpaceStarfield() {
  'use strict';

  const canvas = document.getElementById('space-canvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let stars = [];
  let lastScrollY = window.scrollY || 0;
  let scrollVelocity = 0;
  let frameCount = 0;

  const STAR_PALETTE = [
    '#f8fafc', // starlight white
    '#bae6fd', // sky blue
    '#38bdf8', // aurora cyan
    '#a5b4fc', // celestial indigo
  ];

  function createStars() {
    const count = width < 768 ? 36 : 72;
    stars = new Array(count);
    for (let i = 0; i < count; i++) {
      const depth = 0.3 + Math.random() * 0.9;
      stars[i] = {
        x: Math.random() * width,
        y: Math.random() * height,
        size: depth > 0.85 ? 2 : 1.3,
        depth,
        alpha: 0.3 + Math.random() * 0.65,
        color: STAR_PALETTE[i % STAR_PALETTE.length],
      };
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createStars();
    render(true);
  }

  function render(force) {
    // Throttle ambient twinkle to 30fps unless actively scrolling
    const currentY = window.scrollY || 0;
    const delta = currentY - lastScrollY;
    lastScrollY = currentY;
    scrollVelocity += (Math.max(-24, Math.min(24, delta * 0.12)) - scrollVelocity) * 0.15;

    frameCount++;
    if (!force && Math.abs(scrollVelocity) < 0.08 && frameCount % 2 !== 0) {
      return;
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!prefersReducedMotion) {
        const speed = (0.12 + Math.abs(scrollVelocity) * 0.35) * s.depth;
        s.y -= scrollVelocity < 0 ? -speed : speed;
        if (s.y < -2) {
          s.y = height + 2;
          s.x = Math.random() * width;
        } else if (s.y > height + 2) {
          s.y = -2;
          s.x = Math.random() * width;
        }
      }
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x | 0, s.y | 0, s.size, s.size);
    }
    ctx.globalAlpha = 1;
  }

  resize();

  let resizeTimer = null;
  window.addEventListener(
    'resize',
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    },
    { passive: true },
  );

  if (window.gsap && window.gsap.ticker) {
    window.gsap.ticker.add(function onTick() {
      render(false);
    });
  } else {
    (function loop() {
      render(false);
      requestAnimationFrame(loop);
    })();
  }
})();
