// ============================================
// Faizan Quazi Portfolio - AGGRESSIVE CLEAN PILING
// Previous section completely hides when next one piles on
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const el = document.getElementById(a.getAttribute('href').slice(1));
            if (el) {
                e.preventDefault();
                window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // AGGRESSIVE VERTICAL PILING - Previous content gets HIDDEN
    // ============================================

    const chapters = ['#about', '#expertise', '#experience', '#testimonials', '#contact'];

    chapters.forEach((selector) => {
        const section = document.querySelector(selector);
        if (!section) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'piling-wrapper';
        section.parentNode.insertBefore(wrapper, section);
        wrapper.appendChild(section);

        // Pin + strong piling
        ScrollTrigger.create({
            trigger: wrapper,
            start: 'top top',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
            scrub: 2.5,

            onUpdate: (self) => {
                const p = self.progress;

                // Very aggressive: push way up + fade out completely
                const y = p * -200;
                const scale = 1 - (p * 0.15);
                const opacity = Math.max(1 - (p * 0.6), 0.3);

                gsap.to(section, {
                    y: y,
                    scale: Math.max(scale, 0.85),
                    opacity: opacity,
                    duration: 0.1,
                    overwrite: 'auto',
                    ease: 'none'
                });
            }
        });

        // When next section enters, quickly hide current one completely
        ScrollTrigger.create({
            trigger: wrapper,
            start: 'bottom 50%',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                const p = self.progress;

                gsap.to(section, {
                    y: -200 + (p * 200),
                    scale: 0.85 + (p * 0.15),
                    opacity: 0.3 + (p * 0.7),
                    duration: 0.1,
                    overwrite: 'auto'
                });
            }
        });
    });

    // Horizontal work section (unchanged)
    const hContainer = document.querySelector('.horizontal-scroll-container');
    const hInner = document.querySelector('.horizontal-scroll-inner');

    if (hContainer && hInner) {
        const dist = hInner.scrollWidth - hContainer.clientWidth;
        gsap.to(hInner, {
            x: -dist,
            ease: 'none',
            scrollTrigger: {
                trigger: hContainer,
                pin: true,
                scrub: 2,
                start: 'center center',
                end: () => '+=' + dist
            }
        });
    }

    console.log('%c[Portfolio] Aggressive clean piling active - previous content hides', 'color:#10b981');
});