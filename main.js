/*===== DOM ELEMENTS =====*/
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');

/*===== UTILITY FUNCTIONS =====*/
function updateYear() {
    const yearElement = document.getElementById('current-year');
    yearElement.textContent = new Date().getFullYear();
}

function updateAge() {
    const birthdate = new Date('2000-12-22');
    const age = new Date(Date.now() - birthdate.getTime()).getUTCFullYear() - 1970;
    document.getElementById('age').textContent = age;
}

function toggleMenuIcon() {
    const toggle = document.querySelector('.nav__toggle');
    toggle.classList.toggle('toggle-x');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.body.classList.add('theme-transition');
    document.documentElement.style.setProperty('--body-bg', theme === 'dark' ? '#121212' : '#fff');
    document.documentElement.style.setProperty('--text-color', theme === 'dark' ? '#e0e0e0' : 'var(--second-color)');
    
    moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    sunIcon.style.display = theme === 'dark' ? 'block' : 'none';

    setTimeout(() => document.body.classList.remove('theme-transition'), 300);
}

/*===== MENU FUNCTIONALITY =====*/
function toggleMenu() {
    navMenu.classList.toggle('show');
    navToggle.classList.toggle('active');
}

function showMenu(toggleId, navId) {
    const toggle = document.getElementById(toggleId);
    const nav = document.getElementById(navId);

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        });
    }
}

/*===== SKILLS ANIMATION =====*/
function animateSkills() {
    const skillBars = document.querySelectorAll('.skills__bar');
    skillBars.forEach(bar => {
        const value = bar.parentElement.querySelector('.skills__percentage').textContent;
        setTimeout(() => {
            bar.style.width = value;
            bar.addEventListener('transitionend', () => {
                bar.classList.add('filled');
            }, { once: true });
        }, 300);
    });
}

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 2000,
    reset: true
});

/*===== EVENT LISTENERS =====*/
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(localStorage.getItem('theme') || 'light');
    updateAge();
    updateYear();
    document.body.classList.add('body-visible', 'loaded');

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('toggle-x');
        });

        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                navToggle.classList.remove('toggle-x');
            });
        });
    } else {
        console.error('Navigation elements not found');
    }
});

navToggle.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
    });
});

darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 58;
        const sectionId = section.getAttribute('id');
        const sectionLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            sectionLink.classList.add('active-link');
        } else {
            sectionLink.classList.remove('active-link');
        }
    });
});

document.documentElement.style.scrollBehavior = 'smooth';

document.querySelector('.nav__toggle').addEventListener('click', toggleMenuIcon);

document.querySelectorAll('.nav__link').forEach(item => {
    item.addEventListener('click', () => {
        const toggle = document.querySelector('.nav__toggle');
        if (toggle.classList.contains('toggle-x')) {
            toggle.classList.remove('toggle-x');
        }
        document.getElementById('nav-menu').classList.remove('show');
    });
});

/*===== INITIALIZATION =====*/
showMenu('nav-toggle', 'nav-menu');

// ScrollReveal Animations
sr.reveal('.home__title', {});
sr.reveal('.button', { delay: 200 });
sr.reveal('.home__img', { delay: 400, opacity: 1, distance: '20px' });
sr.reveal('.home__social-icon', { interval: 200 });
sr.reveal('.about__img', {});
sr.reveal('.about__subtitle', { delay: 400 });
sr.reveal('.about__text', { delay: 400 });
sr.reveal('.skills__subtitle', {});
sr.reveal('.skills__text', {});
sr.reveal('.skill-item', { interval: 100 });
sr.reveal('.skills__img', { delay: 600 });
sr.reveal('.work__img', { interval: 200 });
sr.reveal('.contact__input', { interval: 200 });

// Skills Animation Observer
const skillsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillsObserver.observe(document.querySelector('.skills'));