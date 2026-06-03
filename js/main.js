// ============================================
// Horizontal Full-Page Scroll - Optimized
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    // Performance: Only enable heavy horizontal scroll on desktop
    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
        const panels = wrapper.querySelectorAll('.panel');
        const totalWidth = Array.from(panels).reduce((sum, panel) => sum + panel.offsetWidth, 0);

        gsap.to(wrapper, {
            x: () => -(totalWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
                trigger: wrapper,
                pin: true,
                scrub: 1.8,
                start: 'top top',
                end: () => '+=' + (totalWidth - window.innerWidth),
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });

        // Active nav
        const navLinks = document.querySelectorAll('.nav-link');
        panels.forEach(panel => {
            ScrollTrigger.create({
                trigger: panel,
                start: 'left center',
                end: 'right center',
                onToggle: self => {
                    if (self.isActive) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        const link = document.querySelector(`a[href="#${panel.id}"]`);
                        if (link) link.classList.add('active');
                    }
                }
            });
        });

        // Light entrance animation
        panels.forEach((panel, i) => {
            if (i === 0) return;
            gsap.fromTo(panel, { opacity: 0.7 }, {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: panel,
                    start: 'left 75%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    // Inner horizontal scroll for Work (works on all screens)
    const hContainer = document.querySelector('.horizontal-scroll-container');
    const hInner = document.querySelector('.horizontal-scroll-inner');
    if (hContainer && hInner) {
        const dist = hInner.scrollWidth - hContainer.clientWidth;
        if (dist > 0) {
            gsap.to(hInner, {
                x: -dist,
                ease: 'none',
                scrollTrigger: {
                    trigger: hContainer,
                    scrub: 1.2,
                    start: 'left left',
                    end: () => '+=' + dist
                }
            });
        }
    }

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Keyboard arrows
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') window.scrollBy({ left: 400, behavior: 'smooth' });
        if (e.key === 'ArrowLeft') window.scrollBy({ left: -400, behavior: 'smooth' });
    });

    console.log('%c[Portfolio] Optimized horizontal scroll ready', 'color:#10b981');
});