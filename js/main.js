// ============================================
// Faizan Quazi Portfolio - Main JavaScript
// Includes advanced GSAP Scroll effects (inspired by Lewis template)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function() {
            const navLinks = document.querySelector('.hidden.md\:flex');
            if (navLinks) {
                if (navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                } else {
                    navLinks.style.display = 'flex';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = 'rgba(10, 10, 10, 0.98)';
                    navLinks.style.padding = '24px 24px 32px';
                    navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                    navLinks.style.gap = '16px';
                }
            }
        });
    }

    // Active Navigation on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

                const mobileNav = document.querySelector('.hidden.md\:flex');
                if (mobileNav && window.innerWidth < 768) {
                    mobileNav.style.display = 'none';
                }
            }
        });
    });

    // ============================================
    // ADVANCED EFFECTS - GSAP ScrollTrigger
    // ============================================

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        
        // 1. Hero subtle parallax on scroll
        gsap.to('.hero-section', {
            backgroundPosition: '50% 100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // 2. Scroll-triggered fade/slide up animations for sections
        const animatedSections = document.querySelectorAll('#about, #expertise, #experience, #testimonials');
        
        animatedSections.forEach((section, index) => {
            gsap.fromTo(section, 
                { 
                    opacity: 0, 
                    y: 60 
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // 3. HORIZONTAL SCROLL SECTION (The main advanced effect you asked for)
        const horizontalContainer = document.querySelector('.horizontal-scroll-container');
        const horizontalInner = document.querySelector('.horizontal-scroll-inner');

        if (horizontalContainer && horizontalInner) {
            
            // Calculate the scroll distance
            const scrollWidth = horizontalInner.scrollWidth - horizontalContainer.clientWidth;

            gsap.to(horizontalInner, {
                x: -scrollWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: horizontalContainer,
                    pin: true,                    // Pins the section while scrolling
                    scrub: 1.2,                 // Smooth scrubbing
                    start: 'center center',
                    end: () => '+=' + scrollWidth,
                    invalidateOnRefresh: true
                }
            });

            // Optional: Add some card entrance animation when they come into view
            gsap.utils.toArray('.horizontal-card').forEach((card, i) => {
                gsap.fromTo(card, 
                    { opacity: 0.6, scale: 0.95 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: gsap.getTweensOf(horizontalInner)[0], // link to horizontal animation
                            start: 'left 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });
        }

        // 4. Subtle parallax on project images inside horizontal scroll
        gsap.utils.toArray('.horizontal-card img').forEach(img => {
            gsap.to(img, {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: img,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

    } else {
        console.warn('GSAP not loaded - falling back to basic interactions');
    }

    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mobileNav = document.querySelector('.hidden.md\:flex');
            if (mobileNav && mobileNav.style.display === 'flex') {
                mobileNav.style.display = 'none';
            }
        }
    });

    console.log('%c[Portfolio] Advanced GSAP effects initialized (Horizontal scroll + Scroll animations)', 'color:#10b981');
});