// ============================================
// STRICT One-Panel-At-A-Time Horizontal Snap
// Light OR hard/long scroll = EXACTLY ONE panel
// Then ~1 second cooldown before next scroll works
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
    let lastWheelTime = 0;
    const COOLDOWN_MS = 1050; // User must stop and scroll again after ~1 sec

    // ALWAYS force start at Hero / Landing page (panel 0)
    function forceStartAtHero() {
        gsap.set(wrapper, { x: 0 });
        currentIndex = 0;
        window.scrollTo(0, 0);
    }

    forceStartAtHero();

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
                // Keep locked for cooldown so user must deliberately scroll again
                setTimeout(() => {
                    isLocked = false;
                }, COOLDOWN_MS);
            }
        });
    }

    // Wheel handler - ANY scroll (light/hard/long/short) = exactly ONE panel
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();

        if (isLocked) return;

        const now = Date.now();

        // Extra safety: ignore rapid events from the same long gesture
        if (now - lastWheelTime < 220) {
            return;
        }
        lastWheelTime = now;

        if (e.deltaY > 0) {
            goToPanel(currentIndex + 1);
        } else if (e.deltaY < 0) {
            goToPanel(currentIndex - 1);
        }
    }, { passive: false });

    // Keyboard support (also respects lock)
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
    window.addEventListener('load', forceStartAtHero);
    window.addEventListener('pageshow', forceStartAtHero);

    // Keep position correct on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isLocked) {
                gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
            }
        }, 280);
    });

    console.log('%c[Portfolio] STRICT one-panel snap ready (no skipping even on hard scrolls)', 'color:#10b981');
});