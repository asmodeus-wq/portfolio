// ============================================
// Clean One-Panel-At-A-Time Horizontal Snap
// Starts at Hero, Light scroll = Next panel only
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
    let lastWheelTime = 0;

    // ALWAYS start at first panel (Hero / Landing page)
    gsap.set(wrapper, { x: 0 });
    currentIndex = 0;

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

    // Wheel handler - very sensitive, one gesture = one panel
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();

        const now = Date.now();
        if (now - lastWheelTime < 320) return; // prevent rapid skipping
        lastWheelTime = now;

        if (isAnimating) return;

        if (e.deltaY > 0) {
            // scroll down → next panel
            goToPanel(currentIndex + 1);
        } else if (e.deltaY < 0) {
            // scroll up → previous panel
            goToPanel(currentIndex - 1);
        }
    }, { passive: false });

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            goToPanel(currentIndex + 1);
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToPanel(currentIndex - 1);
        }
    });

    // Safety: Force start at hero on any load/refresh
    window.addEventListener('load', () => {
        gsap.set(wrapper, { x: 0 });
        currentIndex = 0;
    });

    // Refresh positions on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
        }, 250);
    });

    console.log('%c[Portfolio] Clean one-panel snap initialized (starts at Hero)', 'color:#10b981');
});