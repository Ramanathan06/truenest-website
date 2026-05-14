document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initReveal();

    const headerEl = document.getElementById('shared-header');
    const footerEl = document.getElementById('shared-footer');

    if (headerEl) {
        fetch('header.html')
            .then(r => r.text())
            .then(html => {
                headerEl.innerHTML = html;
                initNavScroll();
                initMobileMenu();
                highlightActiveNav();
            })
            .catch(e => console.error('Header load error:', e));
    }

    if (footerEl) {
        fetch('footer.html')
            .then(r => r.text())
            .then(html => { footerEl.innerHTML = html; })
            .catch(e => console.error('Footer load error:', e));
    }

    function initNavScroll() {
        const nav = document.querySelector('nav.fixed.top-0');
        if (!nav) return;
        nav.querySelectorAll('a[data-nav-page]').forEach(a => a.classList.add('nav-link-underline'));
        const update = () => {
            nav.classList.toggle('nav-scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    function initReveal() {
        const els = document.querySelectorAll('.reveal, .reveal-clip-up, .reveal-pop, .reveal-zoom, .reveal-soft');
        if (!els.length || !('IntersectionObserver' in window)) {
            els.forEach(el => el.classList.add('visible'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        els.forEach(el => io.observe(el));
    }

    function initMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        if (!btn || !menu) return;
        btn.addEventListener('click', () => {
            const open = menu.classList.toggle('hidden');
            btn.setAttribute('aria-expanded', String(!open));
        });
    }

    function initCursorGlow() {
        if (matchMedia('(hover: none), (pointer: coarse)').matches) return;
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        glow.style.opacity = '0';
        document.body.appendChild(glow);
        let raf = 0, tx = 0, ty = 0;
        window.addEventListener('mousemove', (e) => {
            tx = e.clientX; ty = e.clientY;
            if (!raf) raf = requestAnimationFrame(() => {
                glow.style.left = tx + 'px';
                glow.style.top  = ty + 'px';
                glow.style.opacity = '1';
                raf = 0;
            });
        }, { passive: true });
        window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    }

    function highlightActiveNav() {
        const page = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('[data-nav-page]').forEach(link => {
            if (link.dataset.navPage === page) {
                link.classList.add('text-primary');
            }
        });
    }
});
