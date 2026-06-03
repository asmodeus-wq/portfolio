// ============================================
// Faizan Quazi Portfolio - Main JavaScript
// Smooth interactions, mobile menu, active nav
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
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
            const sectionHeight = section.clientHeight;
            
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
    updateActiveNav(); // Initial call

    // Smooth scroll for anchor links (enhanced)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const offset = 80; // Account for fixed navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileNav = document.querySelector('.hidden.md\:flex');
                if (mobileNav && window.innerWidth < 768) {
                    mobileNav.style.display = 'none';
                }
            }
        });
    });

    // Subtle parallax effect on hero (optional, performant)
    const hero = document.querySelector('.min-h-\[100dvh\]');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < 600) {
                hero.style.transform = `translateY(${scrolled * 0.15}px)`;
                hero.style.opacity = 1 - (scrolled / 900);
            }
        }, { passive: true });
    }

    // Keyboard accessibility - close mobile menu on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mobileNav = document.querySelector('.hidden.md\:flex');
            if (mobileNav && mobileNav.style.display === 'flex') {
                mobileNav.style.display = 'none';
            }
        }
    });

    // Optional: Lazy loading hint for images (already using native loading)
    console.log('%c[Portfolio] Faizan Quazi site initialized successfully.', 'color:#666');
});