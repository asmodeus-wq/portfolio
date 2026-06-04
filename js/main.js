// ============================================
// Horizontal Full-Page Scroll - INSTANT Panel Snap
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
        
        // Force start at first panel (Hero)
        gsap.set(wrapper, { x: 0 });
        window.scrollTo(0, 0);

        let currentIndex = 0;
        let isAnimating = false;

        // Calculate panel positions
        function getPanelX(index) {
            let x = 0;
            for (let i = 0; i < index; i++) {
                x -= panels[i].offsetWidth;
            }
            return x;
        }

        // Instantly snap to a specific panel
        function snapToPanel(index, duration = 0.35) {
            if (index < 0 || index >= panels.length || isAnimating) return;
            
            isAnimating = true;
            currentIndex = index;

            gsap.to(wrapper, {
                x: getPanelX(index),
                duration: duration,
                ease: 'power2.out',
                onComplete: () => {
                    isAnimating = false;
                }
            });

            // Update active nav
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            if (navLinks[index]) navLinks[index].classList.add('active');
        }

        // Wheel handler - instant response
        let wheelTimeout;
        wrapper.addEventListener('wheel', function(e) {
            e.preventDefault();

            if (isAnimating) return;

            clearTimeout(wheelTimeout);

            const direction = e.deltaY > 0 ? 1 : -1;
            const nextIndex = currentIndex + direction;

            // Snap immediately to next/prev panel
            snapToPanel(nextIndex, 0.32);

        }, { passive: false });

        // Also allow clicking nav links to jump
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                snapToPanel(index, 0.4);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (isAnimating) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                snapToPanel(currentIndex + 1, 0.3);
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                snapToPanel(currentIndex - 1, 0.3);
            }
        });

        // Make sure we start at panel 0
        setTimeout(() => {
            snapToPanel(0, 0);
            ScrollTrigger.refresh();
        }, 100);

        // Refresh on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
                snapToPanel(currentIndex, 0);
            }, 200);
        });

        console.log('%c[Portfolio] Instant panel snap initialized', 'color:#10b981');
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