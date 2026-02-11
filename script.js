/* ================================================================
   script.js — La Mécatronique | Sulaimanu Adamu Bello
   Version 2.0 — Production Ready
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────────
     0. PRÉFÉRENCE MOUVEMENT RÉDUIT
     ───────────────────────────────────────────────────────────── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ─────────────────────────────────────────────────────────────
     1. SCROLL UNIFIÉ — toutes les logiques scroll en un seul handler
     ───────────────────────────────────────────────────────────── */
  const progressBar  = document.getElementById('progress-bar');
  const header       = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  function onScroll() {
    const scrollY = window.scrollY;
    const docH    = document.documentElement.scrollHeight - window.innerHeight;

    /* 1a — Barre de progression */
    if (progressBar) {
      const pct = docH > 0 ? (scrollY / docH) * 100 : 0;
      progressBar.style.width = pct + '%';
    }

    /* 1b — Header : rétrécissement + ombre au scroll */
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    /* 1c — Bouton retour en haut : apparaît après 400px */
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // appel initial pour état correct sans scroll


  /* ─────────────────────────────────────────────────────────────
     2. SCROLL-REVEAL (IntersectionObserver)
     ───────────────────────────────────────────────────────────── */
  if (!reduceMotion) {
    const revealSelector = [
      '.article-body h2',
      '.article-body h3',
      '.article-body p',
      '.article-body ul',
      '.article-body ol',
      '.article-body blockquote',
      '.article-img-wrap',
      '.stat-row',
      '.highlight-box',
      '.video-wrap',
      '.article-intro',
      '.sources-block',
    ].join(', ');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -36px 0px' }
    );

    document.querySelectorAll(revealSelector).forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    /* Si reduced-motion : tout visible immédiatement */
    document.querySelectorAll(
      '.article-body h2, .article-body h3, .article-body p, ' +
      '.article-body ul, .article-body ol, .article-body blockquote, ' +
      '.article-img-wrap, .stat-row, .highlight-box, .video-wrap, ' +
      '.article-intro, .sources-block'
    ).forEach((el) => el.classList.add('visible'));
  }


  /* ─────────────────────────────────────────────────────────────
     3. TOC — LIEN ACTIF AU SCROLL
     ───────────────────────────────────────────────────────────── */
  const headings = document.querySelectorAll('.article-body h2[id], .article-body h3[id]');
  const tocLinks = document.querySelectorAll('.toc-list a');

  if (headings.length && tocLinks.length) {
    const tocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tocLinks.forEach((a) => a.classList.remove('active'));
            const activeLink = document.querySelector(
              `.toc-list a[href="#${entry.target.id}"]`
            );
            if (activeLink) {
              activeLink.classList.add('active');
              /* garder le lien actif visible dans la TOC scrollable */
              activeLink.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
            }
          }
        });
      },
      { rootMargin: '-80px 0px -62% 0px', threshold: 0 }
    );

    headings.forEach((h) => tocObserver.observe(h));
  }


  /* ─────────────────────────────────────────────────────────────
     4. SMOOTH SCROLL (ancres + TOC)
     ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 62;
      const offset   = headerH + 14;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top:      targetTop,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });

      /* Mise à jour de l'URL sans recharger */
      history.pushState(null, '', href);
    });
  });


  /* ─────────────────────────────────────────────────────────────
     5. BOUTON COPIER LE LIEN
     ───────────────────────────────────────────────────────────── */
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const label = copyBtn.querySelector('span');
      const svg   = copyBtn.querySelector('svg');
      const originalLabel = label.textContent;

      try {
        await navigator.clipboard.writeText(window.location.href);

        /* Feedback visuel — succès */
        label.textContent = 'Lien copié !';
        svg.innerHTML     = '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
        copyBtn.style.cssText = 'border-color: var(--gold); background: rgba(184,147,58,.06);';
        label.style.color = 'var(--gold)';
        svg.style.fill    = 'var(--gold)';

        setTimeout(() => {
          label.textContent = originalLabel;
          svg.innerHTML     = '<path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>';
          copyBtn.style.cssText = '';
          label.style.color = '';
          svg.style.fill    = '';
        }, 2600);

      } catch {
        /* Fallback si clipboard API indisponible */
        label.textContent = 'Appuyez Ctrl+C';
        setTimeout(() => { label.textContent = originalLabel; }, 2000);
      }
    });
  }


  /* ─────────────────────────────────────────────────────────────
     6. BOUTON RETOUR EN HAUT
     ───────────────────────────────────────────────────────────── */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }


  /* ─────────────────────────────────────────────────────────────
     7. IMAGES — PLACEHOLDER QUAND ABSENTES
     ───────────────────────────────────────────────────────────── */
  const SVG_PLACEHOLDER = `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="56" height="56" rx="4" stroke-width="1.5"/>
      <circle cx="22" cy="24" r="5" stroke-width="1.5"/>
      <path d="M4 42l16-14 12 10 10-8 18 14" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;

  document.querySelectorAll('.article-img-wrap img').forEach((img) => {
    const wrap = img.closest('.article-img-wrap');
    if (!wrap) return;

    function showPlaceholder() {
      /* Lire le alt text pour le label */
      const altText = img.getAttribute('alt') || 'Image à venir';
      const filename = img.getAttribute('src').split('/').pop();

      const ph = document.createElement('div');
      ph.className = 'img-placeholder';
      ph.innerHTML = `${SVG_PLACEHOLDER}<span>${filename}</span>`;
      ph.title = altText;

      img.replaceWith(ph);
    }

    if (img.complete && img.naturalWidth === 0) {
      showPlaceholder();
    } else {
      img.addEventListener('error', showPlaceholder, { once: true });
    }
  });

  /* Avatar : même traitement */
  const avatar = document.querySelector('.author-avatar img');
  if (avatar) {
    function showAvatarFallback() {
      const fallback = avatar.nextElementSibling;
      avatar.style.display  = 'none';
      if (fallback) fallback.style.display = 'flex';
    }
    if (avatar.complete && avatar.naturalWidth === 0) {
      showAvatarFallback();
    } else {
      avatar.addEventListener('error', showAvatarFallback, { once: true });
    }
  }


  /* ─────────────────────────────────────────────────────────────
     8. ACCESSIBILITÉ — NAVIGATION CLAVIER SUR LA TOC
     ───────────────────────────────────────────────────────────── */
  const tocList = document.querySelector('.toc-list');
  if (tocList) {
    tocList.addEventListener('keydown', (e) => {
      const links = [...tocList.querySelectorAll('a')];
      const i     = links.indexOf(document.activeElement);
      if (i === -1) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[Math.min(i + 1, links.length - 1)].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        links[Math.max(i - 1, 0)].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        links[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        links[links.length - 1].focus();
      }
    });
  }

});