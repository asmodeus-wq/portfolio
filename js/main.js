// ============================================
// Horizontal Full-Page Scroll - Fixed Animations
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    // Always enable horizontal scroll on desktop, graceful fallback on mobile
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
        const panels = wrapper.querySelectorAll('.panel');
        let totalWidth = 0;
        panels.forEach(p => totalWidth += p.offsetWidth);

        // Main horizontal scroll animation
        gsap.to(wrapper, {
            x: () => -(totalWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
                trigger: wrapper,
                pin: true,
                scrub: 1.6,
                start: 'top top',
                end: () => '+=' + (totalWidth - window.innerWidth),
                invalidateOnRefresh: true
            }
        });

        // Active navigation
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

        // Subtle scale + fade animation as panels enter
        panels.forEach((panel, index) => {
            if (index === 0) return;
            gsap.fromTo(panel,
                { opacity: 0.65, scale: 0.97 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: panel,
                        start: 'left 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }

    // Inner horizontal scroll in Work section (works everywhere)
    const hContainer = document.querySelector('.horizontal-scroll-container');
    const hInner = document.querySelector('.horizontal-scroll-inner');
    if (hContainer && hInner) {
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
    }

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\:flex');
            if (nav) {
                nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
            }
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') window.scrollBy({ left: 500, behavior: 'smooth' });
        if (e.key === 'ArrowLeft') window.scrollBy({ left: -500, behavior: 'smooth' });
    });

    console.log('%c[Portfolio] Horizontal scroll + animations restored', 'color:#10b981');
});