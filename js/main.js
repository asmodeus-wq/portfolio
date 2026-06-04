// ============================================
// Horizontal Full-Page Scroll - Snappier Version
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
        const panels = wrapper.querySelectorAll('.panel');

        setTimeout(() => {
            let totalWidth = 0;
            panels.forEach(p => totalWidth += p.offsetWidth);

            const scrollDistance = totalWidth - window.innerWidth + 150;

            // Create labels for each panel (for snapping)
            panels.forEach((panel, i) => {
                ScrollTrigger.create({
                    trigger: panel,
                    start: 'left center',
                    end: 'right center',
                    id: `panel-${i}`
                });
            });

            gsap.to(wrapper, {
                x: -scrollDistance,
                ease: 'none',
                scrollTrigger: {
                    trigger: wrapper,
                    pin: true,
                    scrub: 0.6,                    // Tighter response (was 1.7)
                    start: 'top top',
                    end: () => '+=' + scrollDistance,
                    invalidateOnRefresh: true,
                    snap: {
                        snapTo: (progress) => {
                            // Snap to nearest panel after ~35% scrolled into it
                            const panelCount = panels.length;
                            if (panelCount <= 1) return progress;
                            
                            const panelWidth = 1 / (panelCount - 1);
                            const currentPanel = Math.floor(progress / panelWidth);
                            const panelProgress = (progress % panelWidth) / panelWidth;
                            
                            // If scrolled more than 35% into the next panel, commit to it
                            if (panelProgress > 0.35) {
                                return Math.min((currentPanel + 1) * panelWidth, 1);
                            } 
                            // If scrolled back past 35% of current panel, go back
                            else if (panelProgress < 0.65 && currentPanel > 0) {
                                return currentPanel * panelWidth;
                            }
                            
                            return currentPanel * panelWidth;
                        },
                        duration: { min: 0.25, max: 0.45 },
                        ease: "power2.out"
                    }
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

            // Subtle panel animation
            panels.forEach((panel, i) => {
                if (i === 0) return;
                gsap.fromTo(panel, 
                    { opacity: 0.65, scale: 0.97 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: panel,
                            start: 'left 75%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                });
            });
        }, 400);
    }

    // Inner horizontal scroll in Work section
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
            const nav = document.querySelector('.hidden.md\\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Keyboard arrows
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') window.scrollBy({ left: 500, behavior: 'smooth' });
        if (e.key === 'ArrowLeft') window.scrollBy({ left: -500, behavior: 'smooth' });
    });

    // Refresh ScrollTrigger on resize (helps desktop view on mobile)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);
    });

    console.log('%c[Portfolio] Horizontal scroll initialized (snappier)', 'color:#10b981');
});