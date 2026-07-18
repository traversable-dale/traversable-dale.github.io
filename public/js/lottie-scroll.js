/*
  lottie-scroll.js — plays Lottie animations as they scroll into view.

  Each target is a <div class="lottie-scroll"> with data attributes emitted by
  the {{< lottie >}} shortcode. Two modes:

    mode="play"   (default) — play once (or loop) when the element enters view,
                              controlled by an IntersectionObserver.
    mode="scrub"            — map the element's scroll progress through the
                              viewport onto the animation timeline (scrubbing).

  Requires lottie_light.min.js (the global `lottie`) to be loaded first.
*/
(function () {
  if (typeof lottie === 'undefined') {
    console.error('lottie-scroll.js: lottie library not loaded');
    return;
  }

  var containers = document.querySelectorAll('div.lottie-scroll');
  if (!containers.length) return; // nothing to do on this page

  containers.forEach(function (container) {
    var src = container.getAttribute('data-lottie-src');
    if (!src) {
      console.error('lottie-scroll.js: missing data-lottie-src');
      return;
    }

    var mode = (container.getAttribute('data-lottie-mode') || 'play').toLowerCase();
    var loop = String(container.getAttribute('data-lottie-loop')).toLowerCase() === 'true';

    var anim = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: mode === 'scrub' ? false : loop,
      autoplay: false,
      path: src,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        progressiveLoad: true,
        hideOnTransparent: true
      }
    });

    if (mode === 'scrub') {
      // Drive the timeline from scroll position. anim.goToAndStop needs frames,
      // which are only known once the data is loaded.
      var totalFrames = 0;
      anim.addEventListener('DOMLoaded', function () {
        totalFrames = anim.getDuration(true); // true = in frames
        updateScrub();
      });

      var ticking = false;
      function updateScrub() {
        var rect = container.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        // progress: 0 when element's top hits bottom of viewport,
        //           1 when element's bottom leaves top of viewport.
        var progress = (vh - rect.top) / (vh + rect.height);
        progress = Math.max(0, Math.min(1, progress));
        if (totalFrames) anim.goToAndStop(progress * totalFrames, true);
        ticking = false;
      }
      function onScroll() {
        if (!ticking) {
          window.requestAnimationFrame(updateScrub);
          ticking = true;
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    } else {
      // play mode: play when it scrolls into view.
      var played = false;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (loop) {
              anim.play();
            } else if (!played) {
              anim.goToAndPlay(0, true);
              played = true;
            }
          } else if (loop) {
            anim.pause();
          }
        });
      }, { threshold: 0.25 });
      observer.observe(container);
    }
  });
})();
