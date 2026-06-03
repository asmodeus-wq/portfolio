// ============================================
// Horizontal Full-Page Scroll (Lewis style)
// Entire site scrolls left ↔ right through big panels
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.getElementById('horizontal-wrapper');
    if (!wrapper) return;

    // Calculate total scroll width
    const panels = wrapper.querySelectorAll('.panel');
    const totalWidth = Array.from(panels).reduce((sum, panel) => sum + panel.offsetWidth, 0);

    // Convert vertical scroll into horizontal movement
    gsap.to(wrapper, {
        x: () => -(totalWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: 1.5,
            start: 'top top',
            end: () => '+=' + (totalWidth - window.innerWidth),
            invalidateOnRefresh: true
        }
    });

    // Active nav highlighting based on horizontal position
    const navLinks = document.querySelectorAll('.nav-link');
    
    panels.forEach((panel, index) => {
        ScrollTrigger.create({
            trigger: panel,
            start: 'left center',
            end: 'right center',
            onToggle: self => {
                if (self.isActive) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const targetLink = document.querySelector(`a[href="#${panel.id}"]`);
                    if (targetLink) targetLink.classList.add('active');
                }
            }
        });
    });

    // Subtle scale/opacity animation on panels as they come into view
    panels.forEach((panel, i) => {
        if (i === 0) return; // skip hero
        gsap.fromTo(panel, 
            { opacity: 0.6, scale: 0.98 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: panel,
                    start: 'left 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Inner horizontal scroll for Work section (optional extra)
    const hContainer = document.querySelector('.horizontal-scroll-container');
    const hInner = document.querySelector('.horizontal-scroll-inner');
    if (hContainer && hInner) {
        const dist = hInner.scrollWidth - hContainer.clientWidth;
        gsap.to(hInner, {
            x: -dist,
            ease: 'none',
            scrollTrigger: {
                trigger: hContainer,
                scrub: 1.2,
                start: 'left left',
                end: () => '+=' + dist
            }
        });
    }

    // Keyboard support (arrow keys)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') window.scrollBy({ left: 300, behavior: 'smooth' });
        if (e.key === 'ArrowLeft') window.scrollBy({ left: -300, behavior: 'smooth' });
    });

    console.log('%c[Portfolio] Full horizontal scrolling initialized', 'color:#10b981');
});