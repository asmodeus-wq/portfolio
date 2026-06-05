// ============================================
// HORIZONTAL SNAP v3 - Robust Trackpad + Touch Fix
// Better momentum handling, passive listeners, and thresholds
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const panels = Array.from(wrapper.querySelectorAll('.panel'));
    if (panels.length === 0) return;

    let currentIndex = 0;
    let isLocked = false;
    let lastActionTime = 0;
    let wheelAccumulator = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const COOLDOWN_MS = 380;
    const WHEEL_THRESHOLD = 40;
    const TOUCH_THRESHOLD = 35;

    // Setup
    wrapper.style.width = `${panels.length * 100}vw`;
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'nowrap';

    function lockBodyScroll() {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100dvh';
        document.body.style.overscrollBehavior = 'none';
    }
    lockBodyScroll();

    function forceStartAtHero() {
        gsap.set(wrapper, { x: 0 });
        currentIndex = 0;
    }

    forceStartAtHero();

    function goToPanel(index) {
        if (isLocked || index < 0 || index >= panels.length) return;

        isLocked = true;
        currentIndex = Math.max(0, Math.min(index, panels.length - 1));

        const targetX = -panels[currentIndex].offsetLeft;

        gsap.to(wrapper, {
            x: targetX,
            duration: 0.5,
            ease: "power3.out",
            onComplete: () => {
                setTimeout(() => {
                    isLocked = false;
                    wheelAccumulator = 0;
                }, COOLDOWN_MS);
            }
        });
    }

    // WHEEL / TRACKPAD - Improved
    let wheelTimeout;
    wrapper.addEventListener('wheel', function(e) {
        if (isLocked) return;

        e.preventDefault();
        wheelAccumulator += e.deltaY * 1.2;  // Slight boost for trackpad sensitivity

        clearTimeout(wheelTimeout);

        wheelTimeout = setTimeout(() => {
            const now = Date.now();
            if (now - lastActionTime < 100) return;

            if (Math.abs(wheelAccumulator) > WHEEL_THRESHOLD) {
                lastActionTime = now;
                if (wheelAccumulator > 0) {
                    goToPanel(currentIndex + 1);
                } else {
                    goToPanel(currentIndex - 1);
                }
                wheelAccumulator = 0;
            }
        }, 40); // Short delay to accumulate momentum

    }, { passive: false });

    // KEYBOARD
    document.addEventListener('keydown', function(e) {
        if (isLocked) return;
        if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            goToPanel(currentIndex + 1);
        }
        if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
            e.preventDefault();
            goToPanel(currentIndex - 1);
        }
    });

    // TOUCH - More reliable
    wrapper.addEventListener('touchstart', function(e) {
        if (isLocked) return;
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
        wheelAccumulator = 0;
    }, { passive: true });

    wrapper.addEventListener('touchend', function(e) {
        if (isLocked) return;

        const touchEndY = e.changedTouches[0].screenY;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = Date.now() - touchStartTime;

        if (Math.abs(deltaY) > TOUCH_THRESHOLD && deltaTime < 700) {
            const now = Date.now();
            if (now - lastActionTime < 150) return;
            lastActionTime = now;

            if (deltaY < -25) { // swipe up -> next
                goToPanel(currentIndex + 1);
            } else if (deltaY > 25) { // swipe down -> prev
                goToPanel(currentIndex - 1);
            }
        }
    }, { passive: true });

    wrapper.addEventListener('touchmove', function(e) {
        if (isLocked) return;
        const currentY = e.changedTouches[0].screenY;
        const dY = currentY - touchStartY;
        if (Math.abs(dY) > 25) {
            e.preventDefault();
        }
    }, { passive: false });

    // Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
            lockBodyScroll();
        }, 120);
    });

    window.addEventListener('load', forceStartAtHero);
    window.addEventListener('pageshow', forceStartAtHero);

    // Mobile menu (kept as-is)
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function() {
            let mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.remove();
                return;
            }

            mobileMenu = document.createElement('div');
            mobileMenu.id = 'mobile-menu';
            mobileMenu.className = 'fixed inset-0 bg-white z-[200] flex flex-col p-6 md:hidden';
            mobileMenu.innerHTML = `
                <div class="flex justify-between items-center mb-10">
                    <a href="index.html" class="flex items-center gap-x-3 no-underline">
                        <div class="w-9 h-9 bg-[#0EA5E9] rounded-full flex items-center justify-center">
                            <span class="text-white font-bold text-xl">FQ</span>
                        </div>
                        <span class="font-semibold text-xl tracking-tight text-[#0F172A]">Faizan Quazi</span>
                    </a>
                    <button id="close-mobile-menu" class="text-4xl text-[#334155] leading-none">×</button>
                </div>

                <div class="flex flex-col gap-y-5 text-xl font-medium">
                    <a href="about.html" class="nav-link text-[#334155] py-1">About</a>
                    <a href="experience.html" class="nav-link text-[#334155] py-1">Career</a>
                    <a href="process.html" class="nav-link text-[#334155] py-1">Process</a>
                    <a href="work.html" class="nav-link text-[#334155] py-1">Work</a>
                    <a href="contact.html" class="nav-link text-[#334155] py-1">Contact</a>
                </div>

                <div class="mt-auto pt-8 text-xs text-[#64748B]">
                    Based in Pune, India
                </div>
            `;
            document.body.appendChild(mobileMenu);

            const closeBtn = mobileMenu.querySelector('#close-mobile-menu');
            if (closeBtn) closeBtn.addEventListener('click', () => mobileMenu.remove());

            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(() => mobileMenu.remove(), 80);
                });
            });
        });
    }

    console.log('%c[Portfolio] Horizontal snap v3 — robust trackpad + touch', 'color:#10b981; font-weight:bold');
});
