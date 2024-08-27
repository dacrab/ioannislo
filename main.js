/*===== DOM ELEMENTS =====*/
const elements = {
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav__link'),
    sections: document.querySelectorAll('section[id]'),
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    moonIcon: document.getElementById('moon-icon'),
    sunIcon: document.getElementById('sun-icon')
};

/*===== UTILITY FUNCTIONS =====*/
const utils = {
    updateYear: () => {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    },
    updateAge: () => {
        const birthdate = new Date('2000-12-22');
        const age = Math.floor((new Date() - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
        document.getElementById('age').textContent = age;
    },
    applyTheme: (theme) => {
        const isDark = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        document.body.classList.add('theme-transition');
        document.documentElement.style.setProperty('--body-bg', isDark ? '#121212' : '#fff');
        document.documentElement.style.setProperty('--text-color', isDark ? '#e0e0e0' : 'var(--second-color)');
        elements.moonIcon.style.display = isDark ? 'none' : 'block';
        elements.sunIcon.style.display = isDark ? 'block' : 'none';
        document.body.classList.toggle('dark-theme', isDark);
        setTimeout(() => document.body.classList.remove('theme-transition'), 300);
    },
    showToast: (message) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => toast.remove(), { once: true });
            }, 2500);
        });
    }
};

/*===== MENU FUNCTIONALITY =====*/
const menu = {
    toggle: () => {
        elements.navMenu.classList.toggle('show');
        elements.navToggle.classList.toggle('active');
    },
    linkAction: function() {
        elements.navLinks.forEach(n => n.classList.remove('active'));
        this.classList.add('active');
        elements.navMenu.classList.remove('show');
        elements.navToggle.classList.remove('active');
    }
};

/*===== SCROLL REVEAL ANIMATION =====*/
const initializeScrollReveal = () => {
    ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    }).reveal(
        '.home__title, .home__description, .button, .home__img, .home__social-icon, .about__img, .about__subtitle, .about__text, .skills__subtitle, .skills__text, .skill-item, .skills__img, .contact__input',
        { delay: 200, interval: 200 }
    );
};

/*===== EMAIL COPY FUNCTIONALITY =====*/
const handleEmailCopy = function(event) {
    if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        event.preventDefault();
        const email = this.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email)
            .then(() => utils.showToast('Email copied to clipboard'))
            .catch(err => {
                console.error('Failed to copy email: ', err);
                utils.showToast('Failed to copy email');
            });
    }
};

/*===== EVENT LISTENERS =====*/
document.addEventListener('DOMContentLoaded', () => {
    if (elements.navToggle && elements.navMenu) {
        elements.navToggle.addEventListener('click', menu.toggle);
        elements.navLinks.forEach(link => link.addEventListener('click', menu.linkAction));
    } else {
        console.error('Navigation elements not found');
    }

    utils.applyTheme(localStorage.getItem('theme') || 'light');
    utils.updateAge();
    utils.updateYear();
    document.body.classList.add('body-visible', 'loaded');

    initializeScrollReveal();
});

elements.darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    utils.applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

window.addEventListener('scroll', _.throttle(() => {
    const scrollY = window.scrollY;
    elements.sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 58;
        const sectionId = section.id;
        const sectionLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
        if (sectionLink) {
            sectionLink.classList.toggle('active-link', scrollY > sectionTop && scrollY <= sectionTop + sectionHeight);
        }
    });
}, 100));

document.documentElement.style.scrollBehavior = 'smooth';

document.querySelectorAll('.contact__button[href^="mailto:"], .home__social-icon[href^="mailto:"], .footer__icon.email-copy')
    .forEach(emailLink => emailLink.addEventListener('click', handleEmailCopy));