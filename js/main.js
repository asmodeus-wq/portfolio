// ============================================
// STRICT One-Panel-At-A-Time Horizontal Snap
// Works on ALL devices (desktop + phones)
// Vertical finger movement on phone = horizontal panel change (like desktop wheel)
// Also supports horizontal swipe as alternative
// Matches reference site experience across screen sizes
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const panels = Array.from(wrapper.querySelectorAll('.panel'));
    if (panels.length === 0) return;

    let currentIndex = 0;
    let isLocked = false;
    let lastActionTime = 0;
    const COOLDOWN_MS = 750;
    const THRESHOLD = 35; // lower threshold for better mobile feel

    // IMPORTANT: Set explicit width so all panels are laid out (fixes missing/white space on mobile)
    wrapper.style.width = `${panels.length * 100}vw`;

    function forceStartAtHero() {
        gsap.set(wrapper, { x: 0 });
        currentIndex = 0;
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
            duration: 0.42,
            ease: "power2.out",
            onComplete: () => {
                setTimeout(() => { isLocked = false; }, COOLDOWN_MS);
            }
        });
    }

    // Desktop + tablet wheel (vertical scroll moves horizontal panels)
    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (isLocked) return;

        const now = Date.now();
        if (now - lastActionTime < 180) return;
        lastActionTime = now;

        if (e.deltaY > 0) goToPanel(currentIndex + 1);
        else if (e.deltaY < 0) goToPanel(currentIndex - 1);
    }, { passive: false });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isLocked) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goToPanel(currentIndex + 1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goToPanel(currentIndex - 1); }
    });

    // ========== MOBILE TOUCH: Vertical finger movement controls panels ==========
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

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        const isVertical = absDeltaY > absDeltaX * 0.75; // prioritize vertical gesture
        const hasDistance = Math.max(absDeltaX, absDeltaY) > THRESHOLD;
        const isFast = deltaTime < 650;

        if (hasDistance && isFast && (isVertical || absDeltaX > THRESHOLD)) {
            const now = Date.now();
            if (now - lastActionTime < 180) return;
            lastActionTime = now;

            // Vertical up or left swipe = next panel
            // Vertical down or right swipe = previous panel
            if (deltaY < 0 || deltaX < 0) {
                goToPanel(currentIndex + 1);
            } else {
                goToPanel(currentIndex - 1);
            }
        }
    }, { passive: true });

    // Prevent native vertical scroll from fighting us when user intends to change panels
    wrapper.addEventListener('touchmove', function(e) {
        if (isLocked) return;
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        const dX = currentX - touchStartX;
        const dY = currentY - touchStartY;

        // If strong vertical movement, take control (hijack for panel change)
        if (Math.abs(dY) > Math.abs(dX) * 0.8 && Math.abs(dY) > 25) {
            e.preventDefault();
        }
    }, { passive: false });

    // Keep position correct on resize / orientation change
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isLocked) {
                gsap.set(wrapper, { x: -panels[currentIndex].offsetLeft });
            }
        }, 280);
    });

    window.addEventListener('load', forceStartAtHero);
    window.addEventListener('pageshow', forceStartAtHero);

    // ========== MOBILE NAV MENU (fix for hamburger button) ==========
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

            // Close handlers
            const closeBtn = mobileMenu.querySelector('#close-mobile-menu');
            if (closeBtn) closeBtn.addEventListener('click', () => mobileMenu.remove());

            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(() => mobileMenu.remove(), 80);
                });
            });
        });
    }

    console.log('%c[Portfolio] Horizontal snap + mobile nav ready (vertical scroll gesture works on phones)', 'color:#10b981');
});