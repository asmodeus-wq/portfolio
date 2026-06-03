// ============================================
// Faizan Quazi Portfolio - Clean Vertical PILING (Lewis style)
// Each chapter is a big card that piles on top of the previous one
// Previous content gets pushed up and covered as you scroll
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Active nav + smooth scroll (kept simple)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) {
                e.preventDefault();
                window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // PROPER VERTICAL PILING EFFECT (like Lewis Pilling demo)
    // ============================================

    const chapters = ['#about', '#expertise', '#experience', '#testimonials', '#contact'];

    chapters.forEach((sel, i) => {
        const section = document.querySelector(sel);
        if (!section) return;

        // Create piling wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'piling-wrapper';
        section.parentNode.insertBefore(wrapper, section);
        wrapper.appendChild(section);

        // Main piling ScrollTrigger
        ScrollTrigger.create({
            trigger: wrapper,
            start: 'top top',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
            scrub: 2,                    // slower, smoother scrub
            invalidateOnRefresh: true,

            onUpdate: function(self) {
                const p = self.progress;

                // Stronger piling motion: push previous section up and fade it out
                // so it gets properly covered by the next card
                const yMove = p * -120;           // push up more
                const scaleVal = 1 - (p * 0.12);  // subtle shrink
                const fade = Math.max(1 - (p * 0.35), 0.65);

                gsap.to(section, {
                    y: yMove,
                    scale: Math.max(scaleVal, 0.88),
                    opacity: fade,
                    duration: 0.05,
                    overwrite: 'auto',
                    ease: 'none'
                });
            }
        });

        // When the NEXT section starts entering, quickly restore the current one
        // so the piling feels clean (previous card gets covered properly)
        ScrollTrigger.create({
            trigger: wrapper,
            start: 'bottom 55%',
            end: 'bottom top',
            scrub: true,
            onUpdate: function(self) {
                const p = self.progress;
                gsap.to(section, {
                    y: -120 + (p * 120),
                    scale: 0.88 + (p * 0.12),
                    opacity: 0.65 + (p * 0.35),
                    duration: 0.05,
                    overwrite: 'auto'
                });
            }
        });
    });

    // ============================================
    // HORIZONTAL SCROLL WORK (kept as is - it's good)
    // ============================================
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
                scrub: 1.8,
                start: 'center center',
                end: () => '+=' + dist
            }
        });
    }

    console.log('%c[Portfolio] Clean vertical PILING effect active (Lewis style)', 'color:#10b981');
});