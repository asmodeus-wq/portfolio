// ============================================
// Horizontal Full-Page Scroll - Smooth Snap (No Skip, No Split View)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const panels = Array.from(wrapper.querySelectorAll('.panel'));
    if (panels.length === 0) return;

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
        
        // Always start at first panel (Hero)
        gsap.set(wrapper, { x: 0 });
        window.scrollTo(0, 0);

        let currentIndex = 0;
        let isAnimating = false;
        let lastScrollProgress = 0;

        // Calculate total scroll distance
        function getTotalScrollDistance() {
            let total = 0;
            panels.forEach(p => total += p.offsetWidth);
            return total - window.innerWidth;
        }

        // Get target X for a specific panel index
        function getPanelX(index) {
            let x = 0;
            for (let i = 0; i < index; i++) {
                x -= panels[i].offsetWidth;
            }
            return x;
        }

        // Smooth snap to a panel (slightly slow but smooth transition ~0.42s)
        function snapToPanel(targetIndex, duration = 0.42) {
            if (targetIndex < 0 || targetIndex >= panels.length || isAnimating) return;
            
            isAnimating = true;
            const oldIndex = currentIndex;
            currentIndex = targetIndex;

            gsap.to(wrapper, {
                x: getPanelX(targetIndex),
                duration: duration,
                ease: 'power2.out',
                onComplete: () => {
                    isAnimating = false;
                }
            });

            // Update nav active state
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            if (navLinks[targetIndex]) navLinks[targetIndex].classList.add('active');
        }

        // Main ScrollTrigger setup
        const totalDistance = getTotalScrollDistance();

        const scrollTrigger = ScrollTrigger.create({
            trigger: wrapper,
            pin: true,
            scrub: 0.25,                    // Responsive to scroll input
            start: 'top top',
            end: () => '+=' + totalDistance,
            invalidateOnRefresh: true,
            immediateRender: true,
            onUpdate: function(self) {
                // Track progress for snap decision
                lastScrollProgress = self.progress;
            },
            snap: {
                snapTo: (progress) => {
                    if (isAnimating) return lastScrollProgress; // Don't fight animation

                    const snapPoints = panels.map((_, i) => i / (panels.length - 1));
                    
                    // Find closest snap point
                    let closest = 0;
                    let minDist = Math.abs(progress - snapPoints[0]);
                    
                    for (let i = 1; i < snapPoints.length; i++) {
                        const dist = Math.abs(progress - snapPoints[i]);
                        if (dist < minDist) {
                            minDist = dist;
                            closest = i;
                        }
                    }

                    // CRITICAL: Only allow moving to adjacent panel (prevent skipping)
                    const diff = closest - currentIndex;
                    let targetIndex = currentIndex;
                    
                    if (diff > 1) {
                        targetIndex = currentIndex + 1;   // Max +1
                    } else if (diff < -1) {
                        targetIndex = currentIndex - 1;   // Max -1
                    } else {
                        targetIndex = closest;
                    }

                    // Only snap if we're actually changing panel
                    if (targetIndex !== currentIndex && !isAnimating) {
                        // Use requestAnimationFrame so it feels instant decision but smooth transition
                        requestAnimationFrame(() => {
                            snapToPanel(targetIndex, 0.42);
                        });
                    }

                    return snapPoints[currentIndex]; // Stay on current until snap completes
                },
                duration: 0.08,           // Very fast decision/commit
                ease: 'none'
            }
        });

        // Nav link clicks - smooth transition
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!isAnimating) {
                    snapToPanel(index, 0.45);
                }
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (isAnimating) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                snapToPanel(currentIndex + 1, 0.42);
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                snapToPanel(currentIndex - 1, 0.42);
            }
        });

        // Make sure we start at panel 0 cleanly
        setTimeout(() => {
            snapToPanel(0, 0);
            ScrollTrigger.refresh();
            window.scrollTo(0, 0);
        }, 80);

        // Refresh on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 250);
        });

        console.log('%c[Portfolio] Smooth horizontal snap initialized (no skip, smooth 0.42s transition)', 'color:#10b981');
    }

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

});