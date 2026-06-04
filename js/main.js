// ============================================
// Horizontal Full-Page Scroll - Instant Snap
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
        if (panels.length === 0) return;

        let lastActiveIndex = 0;

        // IMPORTANT: Force start at first panel (Hero)
        gsap.set(wrapper, { x: 0 });

        setTimeout(() => {
            let totalWidth = 0;
            panels.forEach(p => totalWidth += p.offsetWidth);

            const scrollDistance = totalWidth - window.innerWidth + 80;

            // Main horizontal scroll with instant snap
            gsap.to(wrapper, {
                x: -scrollDistance,
                ease: 'none',
                scrollTrigger: {
                    trigger: wrapper,
                    pin: true,
                    scrub: 0.15,                    // Very responsive to small scrolls
                    start: 'top top',
                    end: () => '+=' + scrollDistance,
                    invalidateOnRefresh: true,
                    immediateRender: true,
                    snap: {
                        snapTo: (progress) => {
                            if (panels.length <= 1) return progress;

                            const snapPoints = panels.map((_, i) => i / (panels.length - 1));

                            // Find closest snap point
                            let closestIndex = 0;
                            let minDist = Math.abs(progress - snapPoints[0]);

                            for (let i = 1; i < snapPoints.length; i++) {
                                const dist = Math.abs(progress - snapPoints[i]);
                                if (dist < minDist) {
                                    minDist = dist;
                                    closestIndex = i;
                                }
                            }

                            // Prevent skipping multiple panels (only move 1 at a time)
                            const currentIndex = lastActiveIndex;
                            let targetIndex = closestIndex;
                            if (Math.abs(closestIndex - currentIndex) > 1) {
                                targetIndex = currentIndex + (closestIndex > currentIndex ? 1 : -1);
                            }

                            lastActiveIndex = targetIndex;
                            return snapPoints[targetIndex];
                        },
                        duration: 0.06,           // Almost instant snap
                        ease: "power1.out"
                    }
                }
            });

            // Active nav link highlighting
            const navLinks = document.querySelectorAll('.nav-link');
            panels.forEach((panel, index) => {
                ScrollTrigger.create({
                    trigger: panel,
                    start: 'left center',
                    end: 'right center',
                    onToggle: self => {
                        if (self.isActive) {
                            lastActiveIndex = index;
                            navLinks.forEach(l => l.classList.remove('active'));
                            if (navLinks[index]) navLinks[index].classList.add('active');
                        }
                    }
                });
            });

            // Subtle panel entrance animation
            panels.forEach((panel, i) => {
                if (i === 0) return;
                gsap.fromTo(panel, 
                    { opacity: 0.75, scale: 0.985 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: panel,
                            start: 'left 60%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Final safety refresh
            ScrollTrigger.refresh();
            window.scrollTo(0, 0);

        }, 250);
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
        if (e.key === 'ArrowRight') window.scrollBy({ left: 700, behavior: 'smooth' });
        if (e.key === 'ArrowLeft') window.scrollBy({ left: -700, behavior: 'smooth' });
    });

    // Refresh on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);
    });

    console.log('%c[Portfolio] Horizontal scroll initialized (instant snap)', 'color:#10b981');
});