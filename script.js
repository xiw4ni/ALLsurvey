/* ========================================
   AAL Surveying & Aeronautical Mapping
   JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // === HEADER SCROLL ===
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // === MOBILE MENU ===
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });

    // === ACTIVE NAV LINK ON SCROLL ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // === COUNTER ANIMATION ===
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsBar);
    }

    // === CHARTS FILTER TABS ===
    const chartTabs = document.querySelectorAll('.chart-tab');
    const chartCards = document.querySelectorAll('.chart-card');

    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            chartTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            chartCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // === SCROLL REVEAL ANIMATION ===
    const revealElements = document.querySelectorAll(
        '.premium-card, .service-card, .chart-card, .field-card, .project-card, .leader-card, .auto-feature, .credible-inner, .automated-inner'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // === SERVICES CAROUSEL (auto-rotating) ===
    const scCarousel = document.getElementById('servicesCarousel');
    const scTrack = document.getElementById('servicesTrack');
    if (scCarousel && scTrack) {
        const originals = Array.from(scTrack.querySelectorAll('.service-card'));
        const total = originals.length;

        // Cards live in a carousel now, so skip the scroll-reveal effect for them
        originals.forEach(card => {
            revealObserver.unobserve(card);
            card.style.opacity = '1';
            card.style.transform = '';
            card.style.transition = '';
        });

        // Clone the first cards at the end so the loop looks endless
        const MAX_VISIBLE = 4;
        originals.slice(0, MAX_VISIBLE).forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            scTrack.appendChild(clone);
        });

        let index = 0;
        let timer = null;
        const DELAY = 3000;

        function stepSize() {
            const card = scTrack.querySelector('.service-card');
            const gap = parseFloat(getComputedStyle(scTrack).columnGap) || 0;
            return card.getBoundingClientRect().width + gap;
        }

        function render(animate) {
            scTrack.style.transition = animate ? '' : 'none';
            scTrack.style.transform = `translateX(${-index * stepSize()}px)`;
            if (!animate) { void scTrack.offsetWidth; scTrack.style.transition = ''; }
        }

        function next() {
            index += 1;
            render(true);
            if (index >= total) {
                scTrack.addEventListener('transitionend', function snap(e) {
                    if (e.target !== scTrack) return;
                    scTrack.removeEventListener('transitionend', snap);
                    index = 0;
                    render(false);
                });
            }
        }

        function prev() {
            if (index <= 0) {
                index = total;
                render(false);
            }
            requestAnimationFrame(() => {
                index -= 1;
                render(true);
            });
        }

        function start() {
            stop();
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            timer = setInterval(next, DELAY);
        }

        function stop() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        scCarousel.querySelector('.sc-next').addEventListener('click', () => { next(); start(); });
        scCarousel.querySelector('.sc-prev').addEventListener('click', () => { prev(); start(); });
        scCarousel.addEventListener('mouseenter', stop);
        scCarousel.addEventListener('mouseleave', start);
        scCarousel.addEventListener('focusin', stop);
        scCarousel.addEventListener('focusout', start);
        document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
        window.addEventListener('resize', () => render(false));

        start();
    }

    // === CONTACT FORM ===
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#22C55E';
            btn.style.borderColor = '#22C55E';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // === PROJECT IMAGE LIGHTBOX ===
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close image">&times;</button><img src="" alt="">';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.project-card img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // === CHART CAROUSELS (one per group, auto-rotating) ===
    document.querySelectorAll('.chart-carousel').forEach(root => {
        const track = root.querySelector('.cc-track');
        const arrows = root.querySelectorAll('.sc-arrow');
        const originals = Array.from(track.querySelectorAll('.cc-slide'));
        const total = originals.length;
        const MAX_VISIBLE = 4;
        const DELAY = 3500;
        let index = 0;
        let timer = null;

        // Clone the first slides at the end so the loop looks endless
        originals.slice(0, MAX_VISIBLE).forEach(slide => {
            const clone = slide.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        // Click an image to see it full size
        track.addEventListener('click', (e) => {
            const img = e.target.closest('.cc-slide img');
            if (img) openLightbox(img.currentSrc || img.src, img.alt);
        });

        function perView() {
            return parseInt(getComputedStyle(root).getPropertyValue('--cc-per-view')) || 1;
        }

        function canSlide() {
            return total > perView();
        }

        function stepSize() {
            const slide = track.querySelector('.cc-slide');
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            return slide.getBoundingClientRect().width + gap;
        }

        function render(animate) {
            track.style.transition = animate ? '' : 'none';
            track.style.transform = `translateX(${-index * stepSize()}px)`;
            if (!animate) { void track.offsetWidth; track.style.transition = ''; }
        }

        function next() {
            if (!canSlide()) return;
            index += 1;
            render(true);
            if (index >= total) {
                track.addEventListener('transitionend', function snap(e) {
                    if (e.target !== track) return;
                    track.removeEventListener('transitionend', snap);
                    index = 0;
                    render(false);
                });
            }
        }

        function prev() {
            if (!canSlide()) return;
            if (index <= 0) {
                index = total;
                render(false);
            }
            requestAnimationFrame(() => {
                index -= 1;
                render(true);
            });
        }

        function stop() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        function start() {
            stop();
            if (!canSlide()) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            timer = setInterval(next, DELAY);
        }

        function update() {
            const slidable = canSlide();
            arrows.forEach(a => a.classList.toggle('is-hidden', !slidable));
            if (!slidable) index = 0;
            render(false);
            start();
        }

        root.querySelector('.sc-next').addEventListener('click', () => { next(); start(); });
        root.querySelector('.sc-prev').addEventListener('click', () => { prev(); start(); });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        root.addEventListener('focusin', stop);
        root.addEventListener('focusout', start);
        document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
        window.addEventListener('resize', update);

        update();
    });

    // === SMOOTH SCROLL FOR ALL ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});

// === CSS ANIMATION KEYFRAMES (injected) ===
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);