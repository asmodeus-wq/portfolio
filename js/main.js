// ============================================
// Faizan Quazi Portfolio - Advanced Version
// Vertical Card Flipping + Piling Scroll Effects
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const nav = document.querySelector('.hidden.md\:flex');
            if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Active Nav
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => { if (scrollY >= (section.offsetTop - 200)) current = section.getAttribute('id'); });
        navLinks.forEach(link => { link.classList.remove('active'); if (link.getAttribute('href') === `#${current}`) link.classList.add('active'); });
    }
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.getElementById(this.getAttribute('href').substring(1));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // VERTICAL CARD FLIPPING + SCROLL PILING EFFECT
    // ============================================
    const flipCards = document.querySelectorAll('.flip-card');

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && flipCards.length > 0) {
        
        flipCards.forEach((card, index) => {
            
            // Click to flip
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });

            // Scroll-triggered flip + piling effect
            ScrollTrigger.create({
                trigger: card,
                start: 'top 75%',
                end: 'bottom 40%',
                onEnter: () => {
                    if (!card.classList.contains('flipped')) {
                        card.classList.add('flipped');
                    }
                    gsap.to(card, { scale: 0.96, duration: 0.6, ease: 'power2.out' });
                },
                onLeaveBack: () => {
                    card.classList.remove('flipped');
                    gsap.to(card, { scale: 1, duration: 0.4, ease: 'power2.out' });
                }
            });

            // Additional piling / stacking feel
            ScrollTrigger.create({
                trigger: card,
                start: 'top 30%',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    gsap.to(card, { y: progress * 30, duration: 0.1, overwrite: 'auto' });
                }
            });
        });

        // Pin the work section for stronger piling feel
        ScrollTrigger.create({
            trigger: '#work',
            start: 'top top',
            end: '+=400',
            pin: true,
            pinSpacing: true,
            scrub: 1
        });

    } else {
        flipCards.forEach(card => {
            card.addEventListener('click', () => card.classList.toggle('flipped'));
        });
    }

    // Subtle hero parallax
    if (typeof gsap !== 'undefined') {
        gsap.to('.hero-section', {
            backgroundPosition: '50% 80%',
            ease: 'none',
            scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
        });
    }

    console.log('%c[Portfolio] Vertical flip cards + piling scroll effects initialized', 'color:#10b981');
});