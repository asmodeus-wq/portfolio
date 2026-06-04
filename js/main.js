// ============================================
// Horizontal Full-Page Snap Scroll - Ultra Responsive
// One scroll gesture = Exactly one panel
// Near-instant decision (50ms) + smooth 0.45s glide
// Short cooldown to prevent skipping
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
        
        let currentIndex = 0;
        let isLocked = false;
        let accumulatedDelta = 0;
        let wheelTimer = null;

        // Force start at Hero cleanly
        gsap.set(wrapper, { x: 0 });
        window.scrollTo(0, 0);

        function getPanelX(index) {
            let x = 0;
            for (let i = 0; i < index; i++) {
                x -= panels[i].offsetWidth;
            }
            return x;
        }

        function goToPanel(targetIndex) {
            if (targetIndex < 0 || targetIndex >= panels.length || isLocked) return;
            if (targetIndex === currentIndex) return;

            isLocked = true;
            currentIndex = targetIndex;

            gsap.to(wrapper, {
                x: getPanelX(targetIndex),
                duration: 0.45,
                ease: 'power2.out',
                onComplete: () => {
                    setTimeout(() => {
                        isLocked = false;
                    }, 320); // Much shorter cooldown ~0.32s
                }
            });

            // Update nav
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            if (navLinks[targetIndex]) navLinks[targetIndex].classList.add('active');
        }

        // ============================================
        // WHEEL / TRACKPAD - Much faster response
        // ============================================
        window.addEventListener('wheel', function(e) {
            if (isLocked) {
                e.preventDefault();
                return;
            }

            accumulatedDelta += e.deltaY;
            e.preventDefault();

            clearTimeout(wheelTimer);

            // Much faster pause detection (50ms instead of 120ms)
            wheelTimer = setTimeout(() => {
                if (Math.abs(accumulatedDelta) < 6) {
                    accumulatedDelta = 0;
                    return;
                }

                const direction = accumulatedDelta > 0 ? 1 : -1;
                const targetIndex = currentIndex + direction;

                goToPanel(targetIndex);
                accumulatedDelta = 0;
            }, 50); // 50ms - almost instant decision
        }, { passive: false });

        // Allow nav clicks to jump
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!isLocked) goToPanel(index);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (isLocked) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPanel(currentIndex + 1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPanel(currentIndex - 1);
        });

        // Make sure we start at panel 0
        setTimeout(() => {
            goToPanel(0);
            window.scrollTo(0, 0);
        }, 100);

        // Recalculate on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                gsap.set(wrapper, { x: getPanelX(currentIndex) });
            }, 300);
        });

        console.log('%c[Portfolio] Ultra-responsive wheel snap (50ms decision, 0.45s glide)', 'color:#10b981');
    }

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

});