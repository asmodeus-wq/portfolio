// ============================================
// Faizan Quazi Portfolio - Main JavaScript
// Full vertical PILING effect (like Lewis template Pilling demo)
// + Horizontal scroll work section
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function() {
            const navLinks = document.querySelector('.hidden.md\:flex');
            if (navLinks) {
                navLinks.style.display = (navLinks.style.display === 'flex') ? 'none' : 'flex';
                if (navLinks.style.display === 'flex') {
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = 'rgba(10, 10, 10, 0.98)';
                    navLinks.style.padding = '24px';
                    navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                }
            }
        });
    }

    // Active nav
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            if (scrollY >= (section.offsetTop - 200)) current = section.getAttribute('id');
        });
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    }
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Smooth anchor scroll
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
    // FULL PAGE VERTICAL PILING EFFECT (Lewis style)
    // Every major chapter/section piles on top of the previous one
    // ============================================

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

        const pilingSections = [
            '#about',
            '#expertise',
            '#experience',
            '#testimonials',
            '#contact'
        ];

        pilingSections.forEach((selector, index) => {
            const section = document.querySelector(selector);
            if (!section) return;

            // Create a wrapper for better control (optional but cleaner)
            const wrapper = document.createElement('div');
            wrapper.className = 'piling-wrapper';
            section.parentNode.insertBefore(wrapper, section);
            wrapper.appendChild(section);

            // Pin each section and create piling effect
            ScrollTrigger.create({
                trigger: wrapper,
                start: 'top top',
                end: 'bottom top',
                pin: true,
                pinSpacing: false,
                scrub: 1.5,
                invalidateOnRefresh: true,

                onUpdate: (self) => {
                    const progress = self.progress;
                    
                    // Scale + slight y movement to create "piling card" feeling
                    const scale = 1 - (progress * 0.08);           // subtle scale down
                    const y = progress * -40;                      // move up slightly
                    const opacity = 1 - (progress * 0.15);

                    gsap.to(section, {
                        scale: Math.max(scale, 0.92),
                        y: y,
                        opacity: Math.max(opacity, 0.85),
                        duration: 0.1,
                        overwrite: true,
                        ease: 'none'
                    });
                }
            });

            // When next section starts coming in, bring current one back a bit
            ScrollTrigger.create({
                trigger: wrapper,
                start: 'bottom 60%',
                end: 'bottom top',
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    gsap.to(section, {
                        scale: 0.92 + (progress * 0.08),
                        y: -40 + (progress * 40),
                        opacity: 0.85 + (progress * 0.15),
                        duration: 0.1,
                        overwrite: true
                    });
                }
            });
        });

        // ============================================
        // HORIZONTAL SCROLL WORK SECTION (still advanced)
        // ============================================
        const horizontalContainer = document.querySelector('.horizontal-scroll-container');
        const horizontalInner = document.querySelector('.horizontal-scroll-inner');

        if (horizontalContainer && horizontalInner) {
            const scrollWidth = horizontalInner.scrollWidth - horizontalContainer.clientWidth;

            gsap.to(horizontalInner, {
                x: -scrollWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: horizontalContainer,
                    pin: true,
                    scrub: 1.5,
                    start: 'center center',
                    end: () => '+=' + scrollWidth,
                    invalidateOnRefresh: true
                }
            });

            // Card entrance inside horizontal
            gsap.utils.toArray('.horizontal-card').forEach((card) => {
                gsap.fromTo(card, 
                    { opacity: 0.7, scale: 0.96 },
                    {
                        opacity: 1, scale: 1, duration: 0.5,
                        scrollTrigger: {
                            trigger: card,
                            start: 'left 75%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });
        }

        // Subtle parallax on some images
        gsap.utils.toArray('.horizontal-card img').forEach(img => {
            gsap.to(img, {
                yPercent: -12,
                ease: 'none',
                scrollTrigger: {
                    trigger: img,
                    scrub: true
                }
            });
        });

    } else {
        console.warn('GSAP ScrollTrigger not available');
    }

    console.log('%c[Portfolio] Full vertical PILING + Horizontal scroll initialized — Lewis template style', 'color:#10b981');
});