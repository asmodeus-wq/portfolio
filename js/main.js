// ============================================
// STRICT One-Panel-At-A-Time Horizontal Snap
// Works reliably on ALL devices (desktop + phones)
// Vertical finger movement on phone = horizontal panel change
// Finger UP = next panel, Finger DOWN = previous panel
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const panels = Array.from(wrapper.querySelectorAll('.panel'));
    if (panels.length === 0) return;

    let currentIndex = 0;
    let isLocked = false;
    let lastActionTime = 0;
    const COOLDOWN_MS = 680;  // Increased to prevent skipping on hard/fast scrolls
    const THRESHOLD = 22; // slightly more sensitive for reliable back gesture

    // Set explicit width so all panels are laid out horizontally
    wrapper.style.width = `${panels.length * 100}vw`;
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'nowrap';

    // On mobile, prevent native vertical scroll from fighting the horizontal snap
    function lockBodyScroll() {
        if (window.innerWidth <= 900) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100dvh';
        }
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
            duration: 0.42,
            ease: "power2.out",
            onComplete: () => {
                setTimeout(() => { isLocked = false; }, COOLDOWN_MS);
            }
        });
    }

    // Desktop + tablet wheel
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (isLocked) return;

        const now = Date.now();
        if (now - lastActionTime < 160) return;  // Increased cooldown for wheel
        lastActionTime = now;

        if (e.deltaY > 0) goToPanel(currentIndex + 1);
        else if (e.deltaY < 0) goToPanel(currentIndex - 1);
    }, { passive: false });

    // Keyboard
    document.addEventListener('keydown', function(e) {
        if (isLocked) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goToPanel(currentIndex + 1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goToPanel(currentIndex - 1); }
    });

    // ========== MOBILE: Vertical drag UP = next, DOWN = previous ==========
    let touchStartY = 0;
    let touchStartTime = 0;

    wrapper.addEventListener('touchstart', function(e) {
        if (isLocked) return;
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
    }, { passive: true });

    wrapper.addEventListener('touchend', function(e) {
        if (isLocked) return;

        const touchEndY = e.changedTouches[0].screenY;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = Date.now() - touchStartTime;

        const absDeltaY = Math.abs(deltaY);
        const hasDistance = absDeltaY > THRESHOLD;
        const isFast = deltaTime < 550;

        if (hasDistance && isFast) {
            const now = Date.now();
            if (now - lastActionTime < 140) return;
            lastActionTime = now;

            if (deltaY < 0) {
                // Finger UP → next panel
                goToPanel(currentIndex + 1);
            } else if (deltaY > 0) {
                // Finger DOWN → previous panel (back)
                goToPanel(currentIndex - 1);
            }
        }
    }, { passive: true });

    // Take control on vertical touchmove to prevent native scroll
    wrapper.addEventListener('touchmove', function(e) {
        if (isLocked) return;
        const currentY = e.changedTouches[0].screenY;
        const dY = currentY - touchStartY;

        if (Math.abs(dY) > 16) {
            e.preventDefault();
        }
    }, { passive: false });

    // Keep position correct on resize/orientation change
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isLocked) {
                gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
            }
            lockBodyScroll();
        }, 200);
    });

    window.addEventListener('load', forceStartAtHero);
    window.addEventListener('pageshow', forceStartAtHero);

    // Mobile hamburger menu
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
                        <div class="w-9 h-9 bg-[#2C5EAD] rounded-full flex items-center justify-center">
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

    console.log('%c[Portfolio] Horizontal snap ready — vertical drag on phone now works reliably for all panels', 'color:#10b981');
});