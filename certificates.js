// ===== NAVIGATION =====
const menuButton = document.getElementById('menuButton');
const navMenu = document.getElementById('navMenu');
const closeMenu = document.getElementById('closeMenu');
const navOverlay = document.getElementById('navOverlay');

function openNav() {
    navMenu.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNav() {
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuButton.addEventListener('click', openNav);
closeMenu.addEventListener('click', closeNav);
navOverlay.addEventListener('click', closeNav);

// Close nav on link click
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));
