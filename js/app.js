(function () {
  // Update year if present
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // HAMBURGER / MOBILE NAV
  const burger = document.querySelector('.hamburger');
  // Prefer an explicit drawer first, else fall back to the main nav
  const drawer = document.getElementById('drawer') || document.querySelector('nav.primary');

  function isVisible(el) {
    return el && window.getComputedStyle(el).display !== 'none' && el.offsetParent !== null;
  }

  function openMenu() {
    if (!drawer) return;
    // Strategy 1: drawer element → use data-open attribute that your CSS can hook into
    if (drawer.id === 'drawer') {
      drawer.setAttribute('data-open', '1');
      document.body.classList.add('nav-open');
    } else {
      // Strategy 2: no drawer → inline-toggle for mobile without touching your CSS
      // If it's hidden by media query, we force it to block on mobile
      drawer.style.display = 'block';
      document.body.classList.add('nav-open');
    }
    if (burger) burger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!drawer) return;
    if (drawer.id === 'drawer') {
      drawer.setAttribute('data-open', '0');
    } else {
      drawer.style.display = ''; // revert to stylesheet default
    }
    document.body.classList.remove('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    const opened = document.body.classList.contains('nav-open') ||
      (drawer && drawer.getAttribute('data-open') === '1');
    opened ? closeMenu() : openMenu();
  }

  if (burger && drawer) {
    // ARIA wiring
    if (!burger.getAttribute('aria-controls')) {
      // point to drawer if it has an id, else set one on nav.primary
      if (!drawer.id) drawer.id = 'primary-nav';
      burger.setAttribute('aria-controls', drawer.id);
    }
    burger.setAttribute('aria-expanded', 'false');

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const clickInsideMenu = drawer.contains(e.target);
      const clickBurger = burger.contains(e.target);
      if (!clickInsideMenu && !clickBurger) closeMenu();
    });

    // Close on Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // COUNT-UP (unchanged)
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          const st = performance.now();
          const dur = 1200;
          function tick(t) {
            const p = Math.min((t - st) / dur, 1);
            el.textContent = Math.floor(target * p);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    obs.observe(el);
  });

  // FAQ accordions (unchanged)
  document.querySelectorAll('.accordion summary').forEach((sum) => {
    sum.addEventListener('click', () => {
      const d = sum.parentElement;
      document.querySelectorAll('.accordion details').forEach((x) => {
        if (x !== d) x.removeAttribute('open');
      });
    });
  });
})();
// ===== Portfolio: auto images + filters =====
(function () {
  // Lazy image fill using Unsplash Source (you can replace later)
  const tiles = document.querySelectorAll('.pf-grid .pf-tile');
  const toURL = (q) => {
    const qs = encodeURIComponent(q);
    // 1x and 2x for retina
    return {
      x1: `https://source.unsplash.com/800x500/?${qs}`,
      x2: `https://source.unsplash.com/1600x1000/?${qs}`
    };
  };

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const tile = entry.target;
        const img = tile.querySelector('img');
        const thumb = tile.querySelector('.pf-thumb');
        const label = tile.querySelector('.pf-label h3')?.textContent?.trim() || 'work';
        const kw = tile.getAttribute('data-keyword') || label.toLowerCase().replace(/[^a-z0-9]+/g, ',');
        const { x1, x2 } = toURL(kw);

        if (img) {
          img.alt = img.alt || label;
          img.src = x1;
          img.srcset = `${x1} 1x, ${x2} 2x`;
          img.addEventListener('load', () => thumb && thumb.classList.add('is-loaded'), { once: true });
          img.addEventListener('error', () => { if (img.parentNode) img.parentNode.classList.add('is-loaded'); }, { once: true });
        }
        obs.unobserve(tile);
      });
    }, { rootMargin: '120px' }
  ) : null;

  tiles.forEach(tile => io ? io.observe(tile) : null);

  // Simple filter chips
  const chips = document.querySelectorAll('.pf-chip');
  const setActive = (chip) => {
    chips.forEach(c => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-selected', c === chip ? 'true' : 'false'); });
  };
  const applyFilter = (val) => {
    const v = (val || 'all').toLowerCase();
    tiles.forEach(t => {
      const tags = (t.getAttribute('data-tags') || '').toLowerCase();
      const show = v === 'all' || tags.split(',').map(s => s.trim()).includes(v);
      if (show) t.removeAttribute('hidden'); else t.setAttribute('hidden', '');
    });
  };
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      setActive(chip);
      applyFilter(chip.dataset.filter);
    });
  });
})();
// --- Auto-fill testimonial avatars with placeholders (swap later if needed) ---
(function () {
  const cards = document.querySelectorAll('.testimonials .t-card');
  const pick = (el, fallback) =>
    el?.textContent?.trim() || fallback;

  cards.forEach((card, i) => {
    const avatar = card.querySelector('.t-avatar');
    if (!avatar) return;

    const name = pick(card.querySelector('.t-name'), `Client ${i+1}`);
    const kw = card.getAttribute('data-keyword') ||
               `${name} business portrait india`;
    const url1x = `https://source.unsplash.com/200x200/?${encodeURIComponent(kw)}`;
    const url2x = `https://source.unsplash.com/400x400/?${encodeURIComponent(kw)}`;

    const img = new Image();
    img.alt = `${name} — avatar`;
    img.src = url1x;
    img.srcset = `${url1x} 1x, ${url2x} 2x`;
    img.loading = 'lazy';
    img.decoding = 'async';

    img.addEventListener('load', () => {
      avatar.classList.add('has-img');
      avatar.innerHTML = "";
      avatar.appendChild(img);
    }, { once: true });

    // if it fails, initials remain visible
  });
})();
// Close the mobile drawer when any link inside it is clicked
(function () {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;

  // Use event delegation so it works for all links
  drawer.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    // Let navigation happen normally; just close the menu
    // Use a microtask so we don't interfere with default nav
    Promise.resolve().then(() => {
      document.body.classList.remove('nav-open');
      drawer.setAttribute('data-open', '0');
      const burger = document.querySelector('.hamburger');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    });
  });
})();
// Insights: lazy-fill cover images
(function () {
  const posts = document.querySelectorAll('.posts-grid .post');
  if (!posts.length) return;

  const loadCover = (post) => {
    const img = post.querySelector('img');
    const fig = post.querySelector('.post-cover');
    if (!img || !fig) return;

    const label = post.querySelector('h3')?.textContent?.trim() || 'insight';
    const kw = post.getAttribute('data-keyword') || label.toLowerCase().replace(/[^a-z0-9]+/g, ',');
    const base = 'https://source.unsplash.com';
    const x1 = `${base}/900x506/?${encodeURIComponent(kw)}`;
    const x2 = `${base}/1800x1012/?${encodeURIComponent(kw)}`;

    img.src = x1;
    img.srcset = `${x1} 1x, ${x2} 2x`;
    img.addEventListener('load', () => fig.classList.add('is-loaded'), { once: true });
    img.addEventListener('error', () => fig.classList.add('is-loaded'), { once: true });
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        loadCover(e.target);
        obs.unobserve(e.target);
      });
    }, { rootMargin: '160px' });
    posts.forEach(p => io.observe(p));
  } else {
    posts.forEach(loadCover);
  }
})();
(function () {
  const HEADER = document.querySelector('.header');
  const headerOffset = () => (HEADER ? HEADER.getBoundingClientRect().height : 0) + 10;

  // Inject a tiny highlight style (no CSS edits needed)
  const s = document.createElement('style');
  s.textContent = `
    .flash-highlight { box-shadow: 0 0 0 3px #ffd0d0, 0 12px 30px rgba(0,0,0,.12)!important; transition: box-shadow .2s ease; }
    @keyframes bump { 0%{transform:translateY(0)} 50%{transform:translateY(-4px)} 100%{transform:translateY(0)} }
    .flash-bump { animation: bump .4s ease; }
  `;
  document.head.appendChild(s);

  function jumpTo(hash) {
    const id = (hash || '').replace('#', '');
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    window.history.pushState(null, '', '#' + id);
    window.scrollTo({ top: y, behavior: 'smooth' });

    // focus + flash
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    el.classList.add('flash-highlight', 'flash-bump');
    setTimeout(() => el.classList.remove('flash-highlight', 'flash-bump'), 1200);
  }

  function handleClick(e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.length <= 1) return;
    e.preventDefault();
    jumpTo(href);
  }

  // Wire up DM and Policy chips
  document.querySelectorAll('.dm-filters, .policy-nav').forEach(nav => {
    nav.addEventListener('click', handleClick);
  });

  // Also support direct hash on load
  window.addEventListener('load', () => {
    if (location.hash) setTimeout(() => jumpTo(location.hash), 120);
  });
})();
