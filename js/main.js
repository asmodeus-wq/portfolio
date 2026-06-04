// ============================================
// Horizontal Full-Page Scroll - Clean Instant Snap + Smooth Glide
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    const panels = Array.from(wrapper.querySelectorAll('.panel'));
    if (panels.length === 0) return;

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
        
        // Always force start at Hero (panel 0)
        gsap.set(wrapper, { x: 0 });
        window.scrollTo(0, 0);

        let currentIndex = 0;
        let isSnapping = false;

        // Get exact X position for a panel
        function getPanelX(index) {
            let x = 0;
            for (let i = 0; i < index; i++) {
                x -= panels[i].offsetWidth;
            }
            return x;
        }

        // Smoothly tween to a specific panel (slightly slow glide ~0.38s)
        function goToPanel(targetIndex, duration = 0.38) {
            if (targetIndex < 0 || targetIndex >= panels.length || isSnapping) return;
            if (targetIndex === currentIndex) return;

            isSnapping = true;
            const oldIndex = currentIndex;
            currentIndex = targetIndex;

            gsap.to(wrapper, {
                x: getPanelX(targetIndex),
                duration: duration,
                ease: 'power2.out',
                onComplete: () => {
                    isSnapping = false;
                }
            });

            // Update nav
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            if (navLinks[targetIndex]) navLinks[targetIndex].classList.add('active');
        }

        // Calculate total horizontal scroll distance
        function getTotalDistance() {
            let total = 0;
            panels.forEach(p => total += p.offsetWidth);
            return total - window.innerWidth;
        }

        const totalDistance = getTotalDistance();

        // Main ScrollTrigger - follows your scroll with light scrub
        ScrollTrigger.create({
            trigger: wrapper,
            pin: true,
            scrub: 0.22,                    // Light scrub so slight scroll feels responsive
            start: 'top top',
            end: () => '+=' + totalDistance,
            invalidateOnRefresh: true,
            immediateRender: true,
            onUpdate: function(self) {
                if (isSnapping) return; // Don't fight the snap tween

                const progress = self.progress;
                const snapPoints = panels.map((_, i) => i / (panels.length - 1));

                // Find closest panel
                let closestIndex = 0;
                let minDist = Math.abs(progress - snapPoints[0]);

                for (let i = 1; i < snapPoints.length; i++) {
                    const dist = Math.abs(progress - snapPoints[i]);
                    if (dist < minDist) {
                        minDist = dist;
                        closestIndex = i;
                    }
                }

                // Only allow moving ONE panel at a time (no skipping)
                const diff = closestIndex - currentIndex;
                let targetIndex = currentIndex;

                if (diff > 1) targetIndex = currentIndex + 1;
                else if (diff < -1) targetIndex = currentIndex - 1;
                else targetIndex = closestIndex;

                // If we crossed into a new adjacent panel, snap to it quickly
                if (targetIndex !== currentIndex && !isSnapping) {
                    // Instant decision, slightly slow smooth glide
                    requestAnimationFrame(() => {
                        goToPanel(targetIndex, 0.38);
                    });
                }
            }
        });

        // Nav clicks
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                goToPanel(index, 0.4);
            });
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (isSnapping) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPanel(currentIndex + 1, 0.38);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPanel(currentIndex - 1, 0.38);
        });

        // Force clean start at panel 0
        setTimeout(() => {
            goToPanel(0, 0);
            ScrollTrigger.refresh();
            window.scrollTo(0, 0);
        }, 100);

        // Refresh on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 300);
        });

        console.log('%c[Portfolio] Clean snap initialized (instant decision + 0.38s smooth glide, no skip)', 'color:#10b981');
    }

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

});