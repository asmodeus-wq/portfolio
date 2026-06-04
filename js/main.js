// ============================================
// STRICT One-Panel-At-A-Time Horizontal Snap
// Works on ALL devices (desktop + phones)
// Swipe horizontally on phone to move between full panels
// Wheel / keyboard on desktop
// Matches reference site horizontal panel experience on phone too
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const panels = Array.from(wrapper.querySelectorAll('.panel'));
    if (panels.length === 0) return;

    let currentIndex = 0;
    let isLocked = false;
    let lastActionTime = 0;
    const COOLDOWN_MS = 900;
    const SWIPE_THRESHOLD = 40; // pixels

    function forceStartAtHero() {
        gsap.set(wrapper, { x: 0 });
        currentIndex = 0;
        // Don't force scrollTo on mobile to avoid conflicting with native
        if (window.innerWidth > 768) {
            window.scrollTo(0, 0);
        }
    }

    forceStartAtHero();

    function goToPanel(index) {
        if (isLocked || index < 0 || index >= panels.length) return;

        isLocked = true;
        currentIndex = index;

        const targetX = -panels[index].offsetLeft;

        gsap.to(wrapper, {
            x: targetX,
            duration: 0.38,
            ease: "power2.out",
            onComplete: () => {
                setTimeout(() => { isLocked = false; }, COOLDOWN_MS);
            }
        });
    }

    // Desktop wheel
    wrapper.addEventListener('wheel', function(e) {
        if (window.innerWidth < 768) return; // let mobile handle with touch
        e.preventDefault();
        if (isLocked) return;

        const now = Date.now();
        if (now - lastActionTime < 200) return;
        lastActionTime = now;

        if (e.deltaY > 0) goToPanel(currentIndex + 1);
        else if (e.deltaY < 0) goToPanel(currentIndex - 1);
    }, { passive: false });

    // Keyboard (mainly desktop)
    document.addEventListener('keydown', function(e) {
        if (isLocked) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goToPanel(currentIndex + 1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goToPanel(currentIndex - 1); }
    });

    // ========== MOBILE TOUCH SWIPE (primary on phone) ==========
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    wrapper.addEventListener('touchstart', function(e) {
        if (isLocked) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
    }, { passive: true });

    wrapper.addEventListener('touchend', function(e) {
        if (isLocked) return;

        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = Date.now() - touchStartTime;

        // Require mostly horizontal swipe, decent speed, and enough distance
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
        const isFastEnough = deltaTime < 600;
        const hasDistance = Math.abs(deltaX) > SWIPE_THRESHOLD;

        if (isHorizontal && isFastEnough && hasDistance) {
            const now = Date.now();
            if (now - lastActionTime < 200) return;
            lastActionTime = now;

            if (deltaX < 0) {
                goToPanel(currentIndex + 1);
            } else {
                goToPanel(currentIndex - 1);
            }
        }
    }, { passive: true });

    // Optional: prevent vertical scroll interference during horizontal intent
    wrapper.addEventListener('touchmove', function(e) {
        if (isLocked) return;
        // If user is swiping more horizontally than vertically, take control
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        const deltaX = currentX - touchStartX;
        const deltaY = currentY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > 20) {
            e.preventDefault(); // help capture the gesture
        }
    }, { passive: false });

    // Keep position on resize/orientation
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isLocked) {
                gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
            }
        }, 300);
    });

    window.addEventListener('load', forceStartAtHero);
    window.addEventListener('pageshow', forceStartAtHero);

    console.log('%c[Portfolio] Horizontal snap active on phones + desktop (swipe to change panels)', 'color:#10b981');
});