/* ================================================================
   script.js — La Mécatronique, Article par Sulaimanu Adamu Bello
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. READING PROGRESS BAR ──────────────────────────────── */
  const bar = document.getElementById('progress-bar');

  window.addEventListener('scroll', () => {
    const docH  = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });


  /* ── 2. SCROLL-REVEAL (IntersectionObserver) ──────────────── */
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
          revealObserver.unobserve(entry.target);   // fire once only
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll(revealSelector).forEach((el) => {
    revealObserver.observe(el);
  });


  /* ── 3. TOC ACTIVE LINK ───────────────────────────────────── */
  const headings = document.querySelectorAll('.article-body h2[id], .article-body h3[id]');
  const tocLinks = document.querySelectorAll('.toc-list a');

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
            // Scroll TOC list to keep active item in view (mobile)
            activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      });
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
  );

  headings.forEach((h) => tocObserver.observe(h));


  /* ── 4. SMOOTH SCROLL (TOC links + any anchor) ────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90; // header height compensation
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── 5. COPY LINK BUTTON ─────────────────────────────────── */
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const label = copyBtn.querySelector('span');
        const svg   = copyBtn.querySelector('svg');

        const originalLabel = label.textContent;
        label.textContent = 'Lien copié !';
        svg.innerHTML = '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
        copyBtn.style.borderColor = 'var(--gold)';
        copyBtn.querySelector('svg').style.fill = 'var(--gold)';
        label.style.color = 'var(--gold)';

        setTimeout(() => {
          label.textContent = originalLabel;
          svg.innerHTML = '<path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>';
          copyBtn.style.borderColor = '';
          copyBtn.querySelector('svg').style.fill = '';
          label.style.color = '';
        }, 2500);
      }).catch(() => {
        // Fallback for non-secure contexts
        const label = copyBtn.querySelector('span');
        label.textContent = 'Utilisez Ctrl+C';
        setTimeout(() => { label.textContent = 'Copier le lien'; }, 2000);
      });
    });
  }


  /* ── 6. HEADER SHRINK on scroll ──────────────────────────── */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.style.padding = window.scrollY > 60
      ? '.6rem 2.5rem'
      : '.9rem 2.5rem';
  }, { passive: true });

});
