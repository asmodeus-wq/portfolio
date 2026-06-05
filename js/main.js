// ============================================
// IMPROVED Horizontal Snap - Better Trackpad + Mobile
// Enhanced wheel/trackpad support with momentum detection
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
    const COOLDOWN_MS = 420;
    const WHEEL_THRESHOLD = 35;
    const TOUCH_THRESHOLD = 28;

    wrapper.style.width = `${panels.length * 100}vw`;
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'nowrap';

    function lockBodyScroll() {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100dvh';
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
        currentIndex = index;

        const targetX = -panels[index].offsetLeft;

        gsap.to(wrapper, {
            x: targetX,
            duration: 0.45,
            ease: "power3.out",
            onComplete: () => {
                setTimeout(() => { isLocked = false; wheelAccumulator = 0; }, COOLDOWN_MS);
            }
        });
    }

    // =============== IMPROVED WHEEL / TRACKPAD ===============
    wrapper.addEventListener('wheel', function(e) {
        if (isLocked) return;

        e.preventDefault();

        wheelAccumulator += e.deltaY;

        const now = Date.now();
        if (now - lastActionTime < 80) return;

        if (Math.abs(wheelAccumulator) > WHEEL_THRESHOLD) {
            lastActionTime = now;
            if (wheelAccumulator > 0) {
                goToPanel(currentIndex + 1);
            } else {
                goToPanel(currentIndex - 1);
            }
            wheelAccumulator = 0;
        }
    }, { passive: false });

    // =============== KEYBOARD ===============
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

    // =============== MOBILE TOUCH ===============
    let touchStartY = 0;
    let touchStartTime = 0;

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

        const absDelta = Math.abs(deltaY);

        if (absDelta > TOUCH_THRESHOLD && deltaTime < 650) {
            const now = Date.now();
            if (now - lastActionTime < 120) return;
            lastActionTime = now;

            if (deltaY < -18) { // swipe up
                goToPanel(currentIndex + 1);
            } else if (deltaY > 18) { // swipe down
                goToPanel(currentIndex - 1);
            }
        }
    }, { passive: true });

    wrapper.addEventListener('touchmove', function(e) {
        if (isLocked) return;
        const currentY = e.changedTouches[0].screenY;
        const dY = currentY - touchStartY;
        if (Math.abs(dY) > 20) {
            e.preventDefault();
        }
    }, { passive: false });

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
            lockBodyScroll();
        }, 150);
    });

    window.addEventListener('load', forceStartAtHero);
    window.addEventListener('pageshow', forceStartAtHero);

    // Mobile menu (unchanged)
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

    console.log('%c[Portfolio] Horizontal snap v2 — improved trackpad + touch', 'color:#10b981');
});