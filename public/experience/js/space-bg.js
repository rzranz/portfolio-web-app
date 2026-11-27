/* Deep Space Starfield Particles — 60fps Canvas 2D with scroll-velocity parallax */
(function () {
  var canvas = document.getElementById("space-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var w = 0,
    h = 0,
    dpr = 1,
    stars = [],
    lastScroll = window.scrollY || 0,
    scrollBoost = 0;

  var COLORS = [
    "248, 250, 252", // starlight white
    "147, 197, 253", // sky blue
    "56, 189, 248",  // aurora cyan
    "167, 139, 250", // nebula violet
  ];

  function initStars() {
    var count = w < 768 ? 85 : 170;
    stars = [];
    for (var i = 0; i < count; i++) {
      var depth = 0.25 + Math.random() * 0.95;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.45 + Math.random() * 1.35) * depth,
        depth: depth,
        alpha: 0.25 + Math.random() * 0.65,
        twinkleSpeed: 0.008 + Math.random() * 0.022,
        phase: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initStars();
  }

  function draw() {
    var currentScroll = window.scrollY || 0;
    var delta = currentScroll - lastScroll;
    lastScroll = currentScroll;
    scrollBoost += (Math.max(-28, Math.min(28, delta * 0.14)) - scrollBoost) * 0.12;

    ctx.clearRect(0, 0, w, h);

    // Subtle deep-space nebula glow washes
    var g1 = ctx.createRadialGradient(w * 0.2, h * 0.25, 0, w * 0.2, h * 0.25, Math.max(w, h) * 0.55);
    g1.addColorStop(0, "rgba(56, 189, 248, 0.055)");
    g1.addColorStop(1, "rgba(3, 5, 12, 0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    var g2 = ctx.createRadialGradient(w * 0.82, h * 0.72, 0, w * 0.82, h * 0.72, Math.max(w, h) * 0.5);
    g2.addColorStop(0, "rgba(129, 140, 248, 0.06)");
    g2.addColorStop(1, "rgba(3, 5, 12, 0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (!prefersReduced) {
        s.phase += s.twinkleSpeed;
        s.y -= (0.08 + Math.abs(scrollBoost) * 0.35) * s.depth * (scrollBoost < 0 ? -1 : 1);
        if (s.y < -4) {
          s.y = h + 4;
          s.x = Math.random() * w;
        } else if (s.y > h + 4) {
          s.y = -4;
          s.x = Math.random() * w;
        }
      }
      var a = s.alpha * (0.65 + 0.35 * Math.sin(s.phase));
      ctx.fillStyle = "rgba(" + s.color + "," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });

  if (window.gsap && window.gsap.ticker) {
    window.gsap.ticker.add(draw);
  } else {
    (function loop() {
      draw();
      requestAnimationFrame(loop);
    })();
  }
})();
