// ============================================
// Clean One-Panel-At-A-Time Horizontal Snap
// Starts at Hero, One gesture = One panel only
// Long/hard/light scroll = exactly one panel, then ~1.1s cooldown
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const panels = Array.from(wrapper.querySelectorAll('.panel'));
    if (panels.length === 0) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    let currentIndex = 0;
    let isAnimating = false;
    let lastMoveTime = 0;
    const COOLDOWN_MS = 1100; // ~1.1 seconds cooldown after each move

    // ALWAYS force start at first panel (Hero / Landing page)
    function forceStartAtHero() {
        gsap.set(wrapper, { x: 0 });
        currentIndex = 0;
        window.scrollTo(0, 0);
    }

    forceStartAtHero();

    function goToPanel(index) {
        if (isAnimating || index < 0 || index >= panels.length) return;

        isAnimating = true;
        currentIndex = index;

        const targetX = -panels[index].offsetLeft;

        gsap.to(wrapper, {
            x: targetX,
            duration: 0.42,
            ease: "power2.out",
            onComplete: () => {
                isAnimating = false;
            }
        });
    }

    // Wheel handler - STRICT one gesture = one panel
    // No matter light/hard/long/short scroll, only one panel moves
    // Then you must wait ~1.1s or start a new deliberate scroll
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();

        if (isAnimating) return;

        const now = Date.now();
        if (now - lastMoveTime < COOLDOWN_MS) {
            return; // Still in cooldown - ignore further scrolls
        }

        lastMoveTime = now;

        if (e.deltaY > 0) {
            // Any downward scroll (light or hard) = next panel only
            goToPanel(currentIndex + 1);
        } else if (e.deltaY < 0) {
            // Any upward scroll = previous panel only
            goToPanel(currentIndex - 1);
        }
    }, { passive: false });

    // Keyboard support (one key = one panel)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isAnimating && (Date.now() - lastMoveTime > COOLDOWN_MS)) {
                lastMoveTime = Date.now();
                goToPanel(currentIndex + 1);
            }
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isAnimating && (Date.now() - lastMoveTime > COOLDOWN_MS)) {
                lastMoveTime = Date.now();
                goToPanel(currentIndex - 1);
            }
        }
    });

    // Extra safety: force hero on load and pageshow (back/forward cache)
    window.addEventListener('load', forceStartAtHero);
    window.addEventListener('pageshow', forceStartAtHero);

    // Keep current panel position on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isAnimating) {
                gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
            }
        }, 250);
    });

    console.log('%c[Portfolio] Strict one-panel snap initialized (starts at Hero, 1.1s cooldown)', 'color:#10b981');
});