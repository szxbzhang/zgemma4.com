// ZGemma4.com — Main JavaScript

(function () {
    'use strict';

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Mobile nav toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- Smooth active nav highlighting ----
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach((a) => {
                    const href = a.getAttribute('href');
                    a.style.color = href === `#${id}` ? 'var(--primary)' : '';
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    // ---- Scroll reveal animation ----
    const revealElements = document.querySelectorAll(
        '.feature-card, .firmware-card, .support-card, .highlight-card, .community-stat, .step'
    );

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Add base hidden state via JS (progressive enhancement)
    revealElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.5s ease ${(i % 3) * 0.08}s, transform 0.5s ease ${(i % 3) * 0.08}s`;
        revealObserver.observe(el);
    });

    // Add revealed class handler
    document.addEventListener('animationend', () => {}, { once: true });

    // Patch: apply styles directly when revealed
    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // ---- Counter animation for community stats ----
    const counters = document.querySelectorAll('.community-stat-number');
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));

    function animateCounter(el) {
        const raw = el.textContent;
        const match = raw.match(/^([\d.]+)([^\d]*)$/);
        if (!match) return;

        const end = parseFloat(match[1]);
        const suffix = match[2] || '';
        const duration = 1200;
        const start = performance.now();

        const isFloat = match[1].includes('.');

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = end * eased;

            el.textContent = isFloat
                ? value.toFixed(1) + suffix
                : Math.round(value) + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = raw;
            }
        };

        requestAnimationFrame(tick);
    }

    // ---- Download button feedback ----
    document.querySelectorAll('.firmware-card .btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const original = btn.textContent;
            btn.textContent = '⏳ Preparing...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = '✓ Ready!';
                setTimeout(() => {
                    btn.textContent = original;
                    btn.disabled = false;
                }, 1500);
            }, 800);
        });
    });

    // ---- Support / community link feedback ----
    document.querySelectorAll('.support-link, .community-btn').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // In a real deployment these would navigate to actual URLs
        });
    });

})();
