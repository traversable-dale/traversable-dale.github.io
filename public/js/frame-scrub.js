/*
  frame-scrub.js — scroll-driven canvas frame-sequence scrubber.

  The "scrollytelling video" effect: preload a folder of frames and draw the
  current one to a <canvas> based on scroll position. No Lottie, no flicker,
  pixel-sharp, in sync with the scrollbar.

  Features:
    - Loading state: canvas hidden behind a "loading… NN%" indicator until every
      frame is in. In sticky mode the page is prevented from scrolling past the
      pinned animation while it loads, so you never scroll through a blank box.
    - Responsive sources: a smaller frame set is used on narrow screens, which
      is what keeps mobile smooth (¼ the pixels to decode per draw).
    - devicePixelRatio capped at 2, opaque canvas context, and one draw per
      animation frame.

  Markup (emitted by the {{< frameseq >}} shortcode):

    <div class="frame-scrub" data-frame-dir="/lottie/cat-frames"
         data-frame-dir-small="/lottie/cat-frames-sm" data-frame-small-max="768"
         data-frame-count="423" data-frame-pad="3" data-frame-ext="webp"
         data-frame-lock="true">
      <canvas></canvas>
      <div class="frame-scrub-loader">…</div>
    </div>
*/
(function () {
  var roots = document.querySelectorAll('.frame-scrub');
  if (!roots.length) return;
  roots.forEach(setup);

  function setup(root) {
    var dirFull = root.getAttribute('data-frame-dir');
    var dirSmall = root.getAttribute('data-frame-dir-small') || '';
    var smallMax = parseInt(root.getAttribute('data-frame-small-max') || '768', 10);
    var count = parseInt(root.getAttribute('data-frame-count'), 10);
    var pad = parseInt(root.getAttribute('data-frame-pad') || '3', 10);
    var ext = root.getAttribute('data-frame-ext') || 'webp';
    var lockScroll = root.getAttribute('data-frame-lock') === 'true';
    var canvas = root.querySelector('canvas');
    var loader = root.querySelector('.frame-scrub-loader');
    var pctEl = root.querySelector('.frame-scrub-pct');

    if (!dirFull || !count || !canvas) {
      console.error('frame-scrub.js: missing dir/count/canvas');
      return;
    }

    // Choose the resolution once, up front. Deliberately not re-evaluated on
    // resize — swapping sources mid-session would re-download every frame.
    var dir = (dirSmall && window.innerWidth <= smallMax) ? dirSmall : dirFull;

    // alpha:false — the frames are opaque, and it lets the compositor skip
    // blending. Meaningful on mobile.
    var ctx = canvas.getContext('2d', { alpha: false });
    var frames = new Array(count);
    var loaded = 0;
    var current = -1;
    var ready = false;

    // The sticky wrapper (if present) is what travels through the viewport;
    // fall back to the canvas box for inline mode.
    var track = root.closest('.frame-scrub-track') || root;

    function frameURL(i) {
      var num = String(i);
      while (num.length < pad) num = '0' + num;
      return dir + '/frame_' + num + '.' + ext;
    }

    /* ---------- preload ---------- */

    function onOneSettled() {
      loaded++;
      if (pctEl) pctEl.textContent = Math.round((loaded / count) * 100) + '%';
      if (loaded >= count) finish();
    }

    for (var i = 0; i < count; i++) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = onOneSettled;
      img.onerror = onOneSettled; // a missing frame must not hang the loader forever
      img.src = frameURL(i);
      frames[i] = img;
    }

    function finish() {
      if (ready) return;
      ready = true;
      root.classList.add('is-ready'); // CSS fades the canvas in and hides the loader
      resize();
      drawIndex(progressToFrame(), true);
    }

    /* ---------- drawing ---------- */

    function resize() {
      // Cap DPR: a 3x phone would otherwise push 9x the pixels per draw.
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = root.clientWidth;
      var h = root.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawIndex(current < 0 ? 0 : current, true);
    }

    function drawIndex(i, force) {
      if (i < 0) i = 0;
      var img = frames[i];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      if (i === current && !force) return;
      current = i;
      var cw = root.clientWidth;
      var ch = root.clientHeight;
      if (!cw || !ch) return;
      // "contain" letterbox, preserving the frame's aspect ratio
      var ir = img.naturalWidth / img.naturalHeight;
      var cr = cw / ch;
      var dw, dh;
      if (ir > cr) { dw = cw; dh = cw / ir; } else { dh = ch; dw = ch * ir; }
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function progressToFrame() {
      var rect = track.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      // 0 when the track's top reaches the bottom of the viewport,
      // 1 when its bottom leaves the top of the viewport.
      var p = (vh - rect.top) / (vh + rect.height);
      p = Math.max(0, Math.min(1, p));
      return Math.min(count - 1, Math.round(p * (count - 1)));
    }

    /* ---------- scroll ---------- */

    // While frames are still loading, don't let the page travel past the point
    // where the animation pins — otherwise you scroll through an empty box.
    function clampScrollWhileLoading() {
      if (ready || !lockScroll) return;
      var startY = track.getBoundingClientRect().top + window.pageYOffset;
      if (window.pageYOffset > startY) window.scrollTo(0, startY);
    }

    var ticking = false;
    function onScroll() {
      clampScrollWhileLoading();
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (ready) drawIndex(progressToFrame(), false);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    resize();
  }
})();
