/* ============================================================================
   KEYWORD POOL
   A pool of keywords that filters the resource list on the same page.

   Used on two pages with different defaults:
     /resources/     collapsed behind a toggle; unfiltered = show all entries
     /lab/keywords/  expanded; unfiltered = show nothing until a term is picked

   Both render identical entry markup via layouts/partials/resource-groups.html,
   so there is one filtering code path.

   All keywords are the same size until one is selected: the selection grows and
   the rest shrink. Because the pool is a wrapping flex container, that size
   change reflows the row and physically pushes neighbours aside.

   The magnetic hover is NOT reimplemented here — it calls
   initBoldTextGlow('.keyword') from mouse-effects.js so the feel matches bold
   text elsewhere on the site.
   ========================================================================= */
(function () {
  'use strict';

  const wrap = document.querySelector('.keyword-pool-wrap');
  const dataEl = document.getElementById('keyword-data');
  const pool = document.getElementById('keyword-pool');
  if (!wrap || !dataEl || !pool) return;

  const status = wrap.querySelector('.keyword-pool-status');
  const clearBtn = wrap.querySelector('.keyword-clear');
  const toggle = wrap.querySelector('.keyword-toggle');
  const showAllWhenEmpty = wrap.dataset.unfiltered !== 'none';

  let terms;
  try {
    terms = JSON.parse(dataEl.textContent);
  } catch (e) {
    console.error('keyword-pool: could not parse keyword data', e);
    return;
  }
  if (!terms.length) return;

  terms.sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));

  const REDUCED_MOTION =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // IS_MOBILE is a global from mouse-effects.js; fall back if that file is absent.
  const isTouch = typeof IS_MOBILE !== 'undefined'
    ? IS_MOBILE
    : ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const entries = Array.from(document.querySelectorAll('.resource-entry'));
  const groups = Array.from(document.querySelectorAll('.resource-group'));

  // ---- Build the word elements -------------------------------------------
  // Deliberately no inline font-size or opacity: sizing is entirely CSS-driven
  // off the .has-selection / .is-active classes, so the two states can animate.
  const nodes = terms.map(t => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'keyword';
    el.textContent = t.term;
    el.dataset.term = t.term;
    el.setAttribute('aria-pressed', 'false');
    const n = `${t.count} ${t.count === 1 ? 'page' : 'pages'}`;
    el.title = t.gloss ? `${t.gloss} (${n})` : n;
    return { el, data: t, phase: Math.random() * Math.PI * 2 };
  });

  nodes.forEach(n => pool.appendChild(n.el));

  // ---- Drift --------------------------------------------------------------
  if (!REDUCED_MOTION) {
    let raf = null;
    const start = performance.now();
    const drift = (now) => {
      const t = (now - start) / 1000;
      nodes.forEach(n => {
        const x = Math.sin(t * 0.25 + n.phase) * 4;
        const y = Math.cos(t * 0.19 + n.phase * 1.3) * 3;
        n.el.style.setProperty('--drift-x', x.toFixed(2) + 'px');
        n.el.style.setProperty('--drift-y', y.toFixed(2) + 'px');
      });
      raf = requestAnimationFrame(drift);
    };
    const startDrift = () => { if (raf === null) raf = requestAnimationFrame(drift); };
    const stopDrift = () => { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } };
    startDrift();
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stopDrift() : startDrift();
    });
  }

  // ---- Filtering ----------------------------------------------------------
  function apply(term) {
    pool.classList.toggle('has-selection', !!term);

    nodes.forEach(n => {
      const on = n.data.term === term;
      n.el.classList.toggle('is-active', on);
      n.el.setAttribute('aria-pressed', String(on));
    });

    let shown = 0;
    entries.forEach(entry => {
      const tags = (entry.dataset.tags || '').split(/\s+/).filter(Boolean);
      const visible = term ? tags.indexOf(term) !== -1 : showAllWhenEmpty;
      entry.hidden = !visible;
      if (visible) shown++;
    });

    // Hide a group heading once all of its entries are filtered out.
    groups.forEach(g => {
      const any = Array.from(g.querySelectorAll('.resource-entry')).some(e => !e.hidden);
      g.hidden = !any;
    });

    if (clearBtn) clearBtn.hidden = !term;

    if (status) {
      if (!term) {
        status.textContent = showAllWhenEmpty
          ? ''
          : `${terms.length} keywords. Select one to list the resources tagged with it.`;
      } else {
        const match = terms.find(t => t.term === term);
        const count = shown;
        status.textContent =
          `${count} ${count === 1 ? 'resource' : 'resources'} tagged "${term}"` +
          (match && match.gloss ? ` — ${match.gloss}` : '');
      }
    }
  }

  function select(term) {
    // Writing the hash makes a filtered view linkable.
    history.replaceState(null, '', term ? '#' + encodeURIComponent(term) : location.pathname);
    apply(term);
    if (term) expand();
  }

  // ---- Collapse / expand --------------------------------------------------
  function setCollapsed(collapsed) {
    wrap.dataset.collapsed = String(collapsed);
    pool.hidden = collapsed;
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.textContent = collapsed ? 'Browse by keyword' : 'Hide keywords';
    }
  }
  function expand() {
    if (wrap.dataset.collapsed === 'true') setCollapsed(false);
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      setCollapsed(wrap.dataset.collapsed !== 'true');
    });
  }

  // ---- Events -------------------------------------------------------------
  pool.addEventListener('click', (e) => {
    const btn = e.target.closest('.keyword');
    if (!btn) return;
    // Clicking the active word clears the filter.
    select(btn.classList.contains('is-active') ? null : btn.dataset.term);
  });

  if (clearBtn) clearBtn.addEventListener('click', () => select(null));

  window.addEventListener('hashchange', () => {
    apply(decodeURIComponent((location.hash || '').replace(/^#/, '')) || null);
  });

  // ---- Init ---------------------------------------------------------------
  const initial = decodeURIComponent((location.hash || '').replace(/^#/, ''));
  const known = initial && terms.some(t => t.term === initial);
  setCollapsed(wrap.dataset.collapsed === 'true' && !known);
  apply(known ? initial : null);

  // Reuse the site's magnetic text physics rather than duplicating it.
  if (!isTouch && !REDUCED_MOTION && typeof initBoldTextGlow === 'function') {
    initBoldTextGlow('.keyword');
  }
})();
