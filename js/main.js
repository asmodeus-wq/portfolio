// ============================================
// Horizontal Scroll - Better Mobile Desktop View Support
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    // Run horizontal logic if screen is reasonably wide (helps with desktop view on mobile Chrome)
    const runHorizontal = window.innerWidth >= 600;

    if (runHorizontal) {
        const panels = wrapper.querySelectorAll('.panel');
        
        setTimeout(() => {
            let totalWidth = 0;
            panels.forEach(p => totalWidth += p.offsetWidth);

            // Extra distance so last panel is fully visible
            const scrollDistance = totalWidth - window.innerWidth + 200;

            gsap.to(wrapper, {
                x: -scrollDistance,
                ease: 'none',
                scrollTrigger: {
                    trigger: wrapper,
                    pin: true,
                    scrub: 1.7,
                    start: 'top top',
                    end: () => '+=' + scrollDistance,
                    invalidateOnRefresh: true
                }
            });

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

            panels.forEach((panel, i) => {
                if (i === 0) return;
                gsap.fromTo(panel, { opacity: 0.65, scale: 0.97 }, {
                    opacity: 1, scale: 1, duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: panel,
                        start: 'left 75%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });
        }, 400);
    }

    // Inner horizontal in Work section
    const hContainer = document.querySelector('.horizontal-scroll-container');
    const hInner = document.querySelector('.horizontal-scroll-inner');
    if (hContainer && hInner) {
        setTimeout(() => {
            const dist = hInner.scrollWidth - hContainer.clientWidth;
            if (dist > 50) {
                gsap.to(hInner, {
                    x: -dist,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: hContainer,
                        scrub: 1.3,
                        start: 'left left',
                        end: () => '+=' + dist
                    }
                });
            }
        }, 500);
    }

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') window.scrollBy({ left: 500, behavior: 'smooth' });
        if (e.key === 'ArrowLeft') window.scrollBy({ left: -500, behavior: 'smooth' });
    });

    // Refresh on resize (helps desktop view on mobile Chrome)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);
    });

    console.log('%c[Portfolio] Improved last panel visibility + placeholder hero visual', 'color:#10b981');
});