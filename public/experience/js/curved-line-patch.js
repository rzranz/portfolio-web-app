/**
 * Curved Vermilion Guide Line Patch
 * Draws a shortened, less tilted curved line on a new canvas above #cv
 * Constants defined at top for easy adjustment
 */

(function() {
  'use strict';

  // ============ CONFIGURATION CONSTANTS ============
  const CURVED_LINE_CONFIG = {
    // Length: 30% of original (shorter curve)
    LENGTH_RATIO: 0.30,
    
    // Tilt reduction: 30% of original (less tilted)
    TILT_RATIO: 0.30,
    
    // Top end: aligned with "S" flower top
    // Bottom end: 5% below last "U" baseline
    TOP_OFFSET_RATIO: 0.0,
    BOTTOM_OFFSET_RATIO: 0.05,
    
    // Palette: Vermilion guide line
    COLOR_START: [198, 47, 40],    // #C62F28
    COLOR_END: [198, 47, 40],
    
    // Line width (relative to viewport)
    BASE_LINE_WIDTH: 1.5,
    MAX_LINE_WIDTH: 3,
    
    // NO DOT at end - removed extra accent dot
    SHOW_END_DOT: false,
    
    // Z-index: above #cv (z-index: 1), above .el (z-index: 2), below #hud (z-index: 30)
    Z_INDEX: 3,
  };
  
  // Clean up unused constants
  delete CURVED_LINE_CONFIG.DOT_SIZE_MIN;
  delete CURVED_LINE_CONFIG.DOT_SIZE_MAX;
  delete CURVED_LINE_CONFIG.FINAL_DOT_SIZE_MIN;
  delete CURVED_LINE_CONFIG.FINAL_DOT_SIZE_MAX;
  delete CURVED_LINE_CONFIG.GLOW_MULTIPLIER;
  delete CURVED_LINE_CONFIG.GLOW_OPACITY;

  let canvas = null;
  let ctx = null;
  let garden = null;
  let heroEl = null;
  let animationId = null;
  let lastScrollY = 0;
  let targetScrollY = 0;
  const LERP_FACTOR = 0.12;

  function init() {
    // Wait for garden to be ready
    if (window.__garden) {
      garden = window.__garden;
      setupCanvas();
      startAnimation();
    } else {
      // Poll for garden
      const checkGarden = setInterval(() => {
        if (window.__garden) {
          clearInterval(checkGarden);
          garden = window.__garden;
          setupCanvas();
          startAnimation();
        }
      }, 100);
    }
  }

  function setupCanvas() {
    heroEl = document.querySelector('#hero .hero-scene');

    // Create new canvas for the curved line
    canvas = document.createElement('canvas');
    canvas.id = 'curved-guide-line';
  canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    canvas.style.height = '100lvh';
    canvas.style.zIndex = CURVED_LINE_CONFIG.Z_INDEX.toString();
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'block';
    
    document.body.appendChild(canvas);
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getScrollProgress() {
    // Use scrollY directly since --k CSS variable doesn't update
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    return Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }

  function getLetterPositions() {
    if (!garden || !garden.letters) return null;
    const letters = garden.letters.filter(l => l.ch !== ' ' && l.els);
    if (letters.length < 5) return null;
    
    // Get S (first) and U (last) positions
    const sLetter = letters[0];  // S
    const uLetter = letters[4];  // last U
    
    // Convert garden coordinates to viewport coordinates
    // Garden canvas is inside .el which has transform
    const heroEl = document.querySelector('#hero .el');
    const gardenCanvas = document.getElementById('garden-canvas');
    
    if (!heroEl || !gardenCanvas) return null;
    
    const canvasRect = gardenCanvas.getBoundingClientRect();
    const scaleX = canvasRect.width / garden.W;
    const scaleY = canvasRect.height / garden.H;
    const fx = garden._focalShiftX || 0;
    const fy = garden._focalShiftY || 0;
    const slideShift = garden._slideShift || 0;
    const gapShift = garden._slideGapShift || 0;
    const sDrawnX = sLetter.x - slideShift + gapShift + fx;
    const sDrawnY = sLetter.y + fy;
    const uDrawnX = uLetter.x + slideShift + gapShift + fx;
    const uDrawnY = uLetter.y + fy;
    const sTop = sDrawnY - garden.S * 0.75;
    const uBaseline = uDrawnY + garden.S * 0.1;
    const uBottom =
      uBaseline + garden.S * 0.1 * CURVED_LINE_CONFIG.BOTTOM_OFFSET_RATIO;
    
    return {
      sX: canvasRect.left + sDrawnX * scaleX,
      sY: canvasRect.top + sTop * scaleY,
      uX: canvasRect.left + uDrawnX * scaleX,
      uY: canvasRect.top + uBottom * scaleY,
      sBaselineY: canvasRect.top + sDrawnY * scaleY,
      uBaselineY: canvasRect.top + uBaseline * scaleY,
    };
  }

  function lerpColor(c1, c2, t) {
    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * t),
      Math.round(c1[1] + (c2[1] - c1[1]) * t),
      Math.round(c1[2] + (c2[1] - c1[2]) * t),
    ];
  }

  function drawCurvedLine(progress) {
    if (!ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (!heroEl || heroEl.style.visibility !== 'visible') return;
    
    const pos = getLetterPositions();
    if (!pos) return;
    
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    
    // Apply length ratio - only draw portion of the curve
    const drawProgress = progress * CURVED_LINE_CONFIG.LENGTH_RATIO;
    
    // Define curve points (simplified bezier curve from S to U)
    // Original curve likely had more swoosh; we reduce tilt by TILT_RATIO
    const startX = pos.sX;
    const startY = pos.sY;
    const endX = pos.uX;
    const endY = pos.uY;
    
    // Control points for bezier curve
    // Reduce horizontal offset (tilt) by TILT_RATIO
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const tiltOffset = (endX - startX) * 0.3 * CURVED_LINE_CONFIG.TILT_RATIO;
    
    const cp1x = startX + tiltOffset;
    const cp1y = startY + (midY - startY) * 0.3;
    const cp2x = endX - tiltOffset;
    const cp2y = midY + (endY - midY) * 0.7;
    
    // Draw the curve
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 1;
    
    // Number of segments
    const segments = 50;
    const drawnSegments = Math.max(1, Math.floor(segments * drawProgress));
    
    for (let i = 0; i < drawnSegments; i++) {
      const t0 = i / segments;
      const t1 = (i + 1) / segments;
      
      if (t0 >= drawProgress) break;
      
      // Bezier interpolation
      const getPoint = (t) => {
        const u = 1 - t;
        const uu = u * u;
        const uuu = uu * u;
        const tt = t * t;
        const ttt = tt * t;
        
        const x = uuu * startX + 3 * uu * t * cp1x + 3 * u * tt * cp2x + ttt * endX;
        const y = uuu * startY + 3 * uu * t * cp1y + 3 * u * tt * cp2y + ttt * endY;
        return { x, y };
      };
      
      const p0 = getPoint(t0);
      const p1 = getPoint(Math.min(t1, drawProgress));
      
      // Line width tapers
      const width = CURVED_LINE_CONFIG.BASE_LINE_WIDTH + 
        (CURVED_LINE_CONFIG.MAX_LINE_WIDTH - CURVED_LINE_CONFIG.BASE_LINE_WIDTH) * t0;
      
      // Color interpolates from start to end
      const color = lerpColor(
        CURVED_LINE_CONFIG.COLOR_START,
        CURVED_LINE_CONFIG.COLOR_END,
        t0
      );
      
      ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.lineWidth = width;
      ctx.globalAlpha = 1;
      
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
    }
    
    // Draw dot at end of drawn curve (if enabled)
    if (drawProgress > 0 && CURVED_LINE_CONFIG.SHOW_END_DOT) {
      const endT = Math.min(drawProgress, 1);
      const u = 1 - endT;
      const uu = u * u;
      const uuu = uu * u;
      const tt = endT * endT;
      const ttt = tt * endT;
      
      const dotX = uuu * startX + 3 * uu * endT * cp1x + 3 * u * tt * cp2x + ttt * endX;
      const dotY = uuu * startY + 3 * uu * endT * cp1y + 3 * u * tt * cp2y + ttt * endY;
      
      const dotSize = CURVED_LINE_CONFIG.DOT_SIZE_MIN + 
        (CURVED_LINE_CONFIG.DOT_SIZE_MAX - CURVED_LINE_CONFIG.DOT_SIZE_MIN) * endT;
      
      ctx.fillStyle = `rgb(${CURVED_LINE_CONFIG.COLOR_END[0]}, ${CURVED_LINE_CONFIG.COLOR_END[1]}, ${CURVED_LINE_CONFIG.COLOR_END[2]})`;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow
      ctx.globalAlpha = CURVED_LINE_CONFIG.GLOW_OPACITY;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotSize * CURVED_LINE_CONFIG.GLOW_MULTIPLIER, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function animate() {
    // Smooth scroll following (lerp)
    targetScrollY = window.scrollY;
    lastScrollY += (targetScrollY - lastScrollY) * LERP_FACTOR;
    
    const progress = getScrollProgress();
    drawCurvedLine(progress);
    
    animationId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (animationId) cancelAnimationFrame(animationId);
    animate();
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose config for debugging
  window.__curvedLineConfig = CURVED_LINE_CONFIG;
})();