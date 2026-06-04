// ============================================
// Horizontal Full-Page Snap Scroll - Instant + Smooth Glide
// One scroll = One panel. Clean, no stuck, no skipping.
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
        let isAnimating = false;

        // Force start at Hero (panel 0) cleanly
        gsap.set(wrapper, { x: 0 });
        window.scrollTo(0, 0);

        // Get exact X position for any panel
        function getPanelX(index) {
            let x = 0;
            for (let i = 0; i < index; i++) {
                x -= panels[i].offsetWidth;
            }
            return x;
        }

        // Smoothly move to a panel (slightly slow premium glide ~0.42s)
        function goToPanel(targetIndex) {
            if (targetIndex < 0 || targetIndex >= panels.length || isAnimating) return;
            if (targetIndex === currentIndex) return;

            isAnimating = true;
            const oldIndex = currentIndex;
            currentIndex = targetIndex;

            gsap.to(wrapper, {
                x: getPanelX(targetIndex),
                duration: 0.42,           // Slightly slow smooth transition you liked
                ease: 'power2.out',
                onComplete: () => {
                    isAnimating = false;
                }
            });

            // Update active nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            if (navLinks[targetIndex]) navLinks[targetIndex].classList.add('active');
        }

        // ============================================
        // WHEEL / TRACKPAD HANDLER - Very sensitive
        // One scroll gesture = move exactly one panel
        // ============================================
        let wheelTimeout = null;

        wrapper.addEventListener('wheel', function(e) {
            e.preventDefault(); // Prevent normal vertical scroll

            if (isAnimating) return; // Ignore while moving

            const direction = e.deltaY > 0 ? 1 : -1;
            const targetIndex = currentIndex + direction;

            // Move exactly one panel (no skipping even on hard scroll)
            goToPanel(targetIndex);

            // Small cooldown so trackpad doesn't fire multiple times too fast
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                // ready for next gesture
            }, 80);
        }, { passive: false });

        // Also allow clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                goToPanel(index);
            });
        });

        // Keyboard arrows (bonus)
        document.addEventListener('keydown', (e) => {
            if (isAnimating) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPanel(currentIndex + 1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPanel(currentIndex - 1);
        });

        // Make sure we really start at panel 0
        setTimeout(() => {
            goToPanel(0);
            window.scrollTo(0, 0);
        }, 120);

        // Refresh positions on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Recalculate current position after resize
                gsap.set(wrapper, { x: getPanelX(currentIndex) });
            }, 300);
        });

        console.log('%c[Portfolio] Wheel snap initialized (one scroll = one panel, 0.42s smooth glide)', 'color:#10b981');
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