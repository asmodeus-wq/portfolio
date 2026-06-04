// ============================================
// STRICT One-Panel-At-A-Time Horizontal Snap
// Works on desktop + landscape phones (16:9)
// Light OR hard/long scroll = EXACTLY ONE panel
// Then ~1 second cooldown before next scroll works
// Never skips, never chains, always starts at Hero
// Touch/swipe support added for mobile
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const panels = Array.from(wrapper.querySelectorAll('.panel'));
    if (panels.length === 0) return;

    // Enable on desktop OR landscape phones (16:9 mobile view)
    const isNarrowMobilePortrait = window.innerWidth < 768 && window.innerHeight > window.innerWidth;
    if (isNarrowMobilePortrait) {
        // On narrow portrait phones, fall back to normal vertical scroll (CSS handles it)
        console.log('%c[Portfolio] Mobile portrait: vertical scroll mode', 'color:#64748b');
        return;
    }

    let currentIndex = 0;
    let isLocked = false;
    let lastWheelTime = 0;
    const COOLDOWN_MS = 1050;

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
                setTimeout(() => {
                    isLocked = false;
                }, COOLDOWN_MS);
            }
        });
    }

    // Wheel handler - ANY scroll = exactly ONE panel
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();

        if (isLocked) return;

        const now = Date.now();
        if (now - lastWheelTime < 220) return;
        lastWheelTime = now;

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

    // Touch / Swipe support for phones & tablets
    let touchStartX = 0;
    let touchStartY = 0;

    wrapper.addEventListener('touchstart', function(e) {
        if (isLocked) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    wrapper.addEventListener('touchend', function(e) {
        if (isLocked) return;

        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Only horizontal swipes (ignore mostly vertical)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX < 0) {
                goToPanel(currentIndex + 1);
            } else {
                goToPanel(currentIndex - 1);
            }
        }
    }, { passive: true });

    // Force hero on load / pageshow
    window.addEventListener('load', forceStartAtHero);
    window.addEventListener('pageshow', forceStartAtHero);

    // Keep position correct on resize (important for orientation change)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isLocked) {
                gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
            }
        }, 280);
    });

    console.log('%c[Portfolio] STRICT one-panel snap ready (desktop + landscape phones)', 'color:#10b981');
});