// ============================================
// UNIVERSAL NAVBAR - Single source of truth
// Edit ONLY this file to update nav on ALL pages
// ============================================

function injectNavbar() {
    const placeholder = document.getElementById('navbar');
    if (!placeholder) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navHTML = `
        <nav class="fixed top-0 left-0 right-0 z-[200] bg-white/90 backdrop-blur-lg border-b border-slate-200">
            <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <a href="index.html" class="flex items-center gap-x-3 no-underline">
                    <div class="w-9 h-9 bg-[#0EA5E9] rounded-full flex items-center justify-center">
                        <span class="text-white font-bold text-xl">FQ</span>
                    </div>
                    <h1 class="font-semibold text-xl tracking-tight text-[#0F172A]">Faizan Quazi</h1>
                </a>
                
                <div class="hidden md:flex items-center gap-x-8 text-sm font-medium">
                    <a href="about.html" class="nav-link ${currentPage === 'about.html' ? 'active text-[#0EA5E9]' : 'text-[#334155]'}">About</a>
                    <a href="experience.html" class="nav-link ${currentPage === 'experience.html' ? 'active text-[#0EA5E9]' : 'text-[#334155]'}">Career</a>
                    <a href="process.html" class="nav-link ${currentPage === 'process.html' ? 'active text-[#0EA5E9]' : 'text-[#334155]'}">Process</a>
                    <a href="work.html" class="nav-link ${currentPage === 'work.html' ? 'active text-[#0EA5E9]' : 'text-[#334155]'}">Work</a>
                    <a href="contact.html" class="nav-link ${currentPage === 'contact.html' ? 'active text-[#0EA5E9]' : 'text-[#334155]'}">Contact</a>
                </div>

                <button id="mobile-menu-btn" class="md:hidden text-2xl text-[#334155]">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </nav>
    `;

    placeholder.outerHTML = navHTML;

    // Mobile menu
    setTimeout(() => {
        const mobileBtn = document.getElementById('mobile-menu-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', function() {
                let mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) { mobileMenu.remove(); return; }

                mobileMenu = document.createElement('div');
                mobileMenu.id = 'mobile-menu';
                mobileMenu.className = 'fixed inset-0 bg-white z-[200] flex flex-col p-6 md:hidden';
                mobileMenu.innerHTML = `
                    <div class="flex justify-between items-center mb-10">
                        <a href="index.html" class="flex items-center gap-x-3 no-underline">
                            <div class="w-9 h-9 bg-[#0EA5E9] rounded-full flex items-center justify-center">
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

                    <div class="mt-auto pt-8 text-xs text-[#64748B]">Based in Pune, India</div>
                `;
                document.body.appendChild(mobileMenu);

                const closeBtn = mobileMenu.querySelector('#close-mobile-menu');
                if (closeBtn) closeBtn.addEventListener('click', () => mobileMenu.remove());

                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => setTimeout(() => mobileMenu.remove(), 80));
                });
            });
        }
    }, 50);
}

document.addEventListener('DOMContentLoaded', injectNavbar);