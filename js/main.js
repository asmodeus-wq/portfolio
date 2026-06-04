// ============================================
// Horizontal Full-Page Scroll - Smooth + Quick Settle
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
        const panels = Array.from(wrapper.querySelectorAll('.panel'));

        setTimeout(() => {
            let totalWidth = 0;
            panels.forEach(p => totalWidth += p.offsetWidth);

            const scrollDistance = totalWidth - window.innerWidth + 80;

            gsap.to(wrapper, {
                x: -scrollDistance,
                ease: 'none',
                scrollTrigger: {
                    trigger: wrapper,
                    pin: true,
                    scrub: 0.3,                    // Good sensitivity
                    start: 'top top',
                    end: () => '+=' + scrollDistance,
                    invalidateOnRefresh: true,
                    snap: {
                        snapTo: (progress) => {
                            if (panels.length <= 1) return progress;
                            
                            const snapPoints = panels.map((_, i) => i / (panels.length - 1));
                            
                            // Find closest snap point
                            let closest = snapPoints[0];
                            let minDist = Math.abs(progress - closest);
                            
                            for (let i = 1; i < snapPoints.length; i++) {
                                const dist = Math.abs(progress - snapPoints[i]);
                                if (dist < minDist) {
                                    minDist = dist;
                                    closest = snapPoints[i];
                                }
                            }
                            return closest;
                        },
                        duration: { min: 0.15, max: 0.3 },   // Quick settle after releasing scroll
                        ease: "power2.out"
                    }
                }
            });

            // Active navigation
            const navLinks = document.querySelectorAll('.nav-link');
            panels.forEach((panel, index) => {
                ScrollTrigger.create({
                    trigger: panel,
                    start: 'left center',
                    end: 'right center',
                    onToggle: self => {
                        if (self.isActive) {
                            navLinks.forEach(l => l.classList.remove('active'));
                            if (navLinks[index]) {
                                navLinks[index].classList.add('active');
                            }
                        }
                    }
                });
            });

            // Subtle panel animation
            panels.forEach((panel, i) => {
                if (i === 0) return;
                gsap.fromTo(panel, 
                    { opacity: 0.7, scale: 0.98 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: panel,
                            start: 'left 70%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });
        }, 350);
    }

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') window.scrollBy({ left: 600, behavior: 'smooth' });
        if (e.key === 'ArrowLeft') window.scrollBy({ left: -600, behavior: 'smooth' });
    });

    // Refresh on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);
    });

    console.log('%c[Portfolio] Horizontal scroll initialized (smooth + quick settle)', 'color:#10b981');
});