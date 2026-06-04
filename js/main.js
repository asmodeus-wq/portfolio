// ============================================
// Strict One-Panel-At-A-Time Horizontal Snap
// Light or hard/long scroll = exactly ONE panel, then ~1.1s cooldown
// Never skips, never chains, always starts at Hero
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const panels = Array.from(wrapper.querySelectorAll('.panel'));
    if (panels.length === 0) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    let currentIndex = 0;
    let isLocked = false;
    let lastScrollTime = 0;
    const COOLDOWN = 1150; // ~1.15 seconds - user must stop and scroll again

    // ALWAYS start at Hero / Landing page (panel 0)
    function resetToHero() {
        gsap.set(wrapper, { x: 0 });
        currentIndex = 0;
        window.scrollTo(0, 0);
    }

    resetToHero();

    function goToPanel(index) {
        if (isLocked || index < 0 || index >= panels.length) return;

        isLocked = true;
        currentIndex = index;

        const targetX = -panels[index].offsetLeft;

        gsap.to(wrapper, {
            x: targetX,
            duration: 0.42,
            ease: "power2.out",
            onComplete: () => {
                // Keep locked for cooldown period so user must deliberately scroll again
                setTimeout(() => {
                    isLocked = false;
                }, COOLDOWN);
            }
        });
    }

    // Wheel handler - ANY scroll (light/hard/long/short) = exactly one panel
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();

        if (isLocked) return;

        const now = Date.now();
        // Extra safety: ignore if within cooldown window
        if (now - lastScrollTime < 180) return;

        lastScrollTime = now;

        if (e.deltaY > 0) {
            goToPanel(currentIndex + 1);
        } else if (e.deltaY < 0) {
            goToPanel(currentIndex - 1);
        }
    }, { passive: false });

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (isLocked) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            goToPanel(currentIndex + 1);
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToPanel(currentIndex - 1);
        }
    });

    // Force hero on load / pageshow (back-forward cache)
    window.addEventListener('load', resetToHero);
    window.addEventListener('pageshow', resetToHero);

    // Keep position on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isLocked) {
                gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
            }
        }, 250);
    });

    console.log('%c[Portfolio] Strict one-panel snap ready (Hero start + strict lock)', 'color:#10b981');
});