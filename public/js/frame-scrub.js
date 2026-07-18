/*
  frame-scrub.js — scroll-driven canvas frame-sequence scrubber.

  The classic "scrollytelling video" effect: preload a folder of frames and
  draw the current one to a <canvas> based on scroll position. No Lottie, no
  flicker, pixel-sharp, and fully in sync with the scrollbar.

  Markup (emitted by the {{< frameseq >}} shortcode):

    <div class="frame-scrub" data-frame-dir="/lottie/cat-frames"
         data-frame-count="423" data-frame-pad="3" data-frame-ext="webp"
         data-frame-sticky="true">
      <canvas></canvas>
    </div>
*/
(function () {
  var roots = document.querySelectorAll('.frame-scrub');
  if (!roots.length) return;
  roots.forEach(setup);

  function setup(root) {
    var dir = root.getAttribute('data-frame-dir');
    var count = parseInt(root.getAttribute('data-frame-count'), 10);
    var pad = parseInt(root.getAttribute('data-frame-pad') || '3', 10);
    var ext = root.getAttribute('data-frame-ext') || 'webp';
    var canvas = root.querySelector('canvas');
    if (!dir || !count || !canvas) {
      console.error('frame-scrub.js: missing dir/count/canvas');
      return;
    }

    var ctx = canvas.getContext('2d');
    var frames = new Array(count);
    var current = -1;

    // The sticky wrapper (if present) is what actually travels through the
    // viewport; fall back to the canvas box for inline (non-sticky) mode.
    var track = root.closest('.frame-scrub-track') || root;

    function frameURL(i) {
      var num = String(i);
      while (num.length < pad) num = '0' + num;
      return dir + '/frame_' + num + '.' + ext;
    }

    // Preload every frame. They're small (~7 KB); the browser keeps them
    // compressed and decodes on draw, so memory stays reasonable.
    var firstLoaded = false;
    for (var i = 0; i < count; i++) {
      (function (idx) {
        var img = new Image();
        img.decoding = 'async';
        img.src = frameURL(idx);
        img.onload = function () {
          if (!firstLoaded) { firstLoaded = true; resize(); }
          if (idx === current) drawIndex(idx, true); // fill in a frame we scrolled to before it loaded
        };
        frames[idx] = img;
      })(i);
    }

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var w = root.clientWidth;
      var h = root.clientHeight;
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
      if (!img || !img.complete || img.naturalWidth === 0) return; // not ready yet
      if (i === current && !force) return;
      current = i;
      var cw = root.clientWidth;
      var ch = root.clientHeight;
      // "contain" letterbox to preserve the frame's aspect ratio
      var ir = img.naturalWidth / img.naturalHeight;
      var cr = cw / ch;
      var dw, dh;
      if (ir > cr) { dw = cw; dh = cw / ir; } else { dh = ch; dw = ch * ir; }
      var dx = (cw - dw) / 2;
      var dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
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

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          drawIndex(progressToFrame(), false);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    resize();
    onScroll();
  }
})();
