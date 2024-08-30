/*===== DOM ELEMENTS =====*/
const elements = {
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav__link'),
    sections: document.querySelectorAll('section[id]'),
    darkModeToggle: document.getElementById('dark-mode-toggle'),
    moonIcon: document.getElementById('moon-icon'),
    sunIcon: document.getElementById('sun-icon'),
    currentYear: document.getElementById('current-year'),
    age: document.getElementById('age')
};

/*===== UTILITY FUNCTIONS =====*/
const utils = {
    updateYear: () => elements.currentYear.textContent = new Date().getFullYear(),
    updateAge: () => {
        const birthdate = new Date('2000-12-22');
        elements.age.textContent = Math.floor((Date.now() - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
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
        const toast = Object.assign(document.createElement('div'), {
            className: 'toast',
            textContent: message
        });
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
    linkAction: (event) => {
        elements.navLinks.forEach(n => n.classList.remove('active'));
        event.currentTarget.classList.add('active');
        elements.navMenu.classList.remove('show');
        elements.navToggle.classList.remove('active');
    }
};

/*===== SCROLL REVEAL ANIMATION =====*/
const initializeScrollReveal = () => {
    const sr = ScrollReveal({
        duration: 1000,
        reset: false,
        distance: '40px',
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        opacity: 0
    });

    const isMobile = window.innerWidth <= 768;

    const revealConfigs = {
        home: [
            { selector: '.home__title', config: { origin: 'left', delay: 100, duration: 1200 } },
            { selector: '.home__description', config: { origin: 'right', delay: 200, duration: 1200 } },
            { selector: '.home__buttons', config: { origin: 'bottom', delay: 300, interval: 200 } },
            { selector: '.home__img', config: { origin: 'top', delay: 400, scale: 0.9, duration: 1500 } },
            { selector: '.home__social-icon', config: { origin: 'left', delay: 500, interval: 150, distance: '60px', rotate: { x: 0, y: isMobile ? 0 : 90, z: 0 }, duration: 1000 } }
        ],
        about: [
            { selector: '.about__img', config: { origin: 'left', delay: 100, scale: 0.95, rotate: { x: 0, y: isMobile ? 0 : 15, z: isMobile ? 0 : -15 }, duration: 1500 } },
            { selector: '.about__subtitle', config: { origin: 'top', delay: 200, duration: 1000 } },
            { selector: '.about__text', config: { origin: 'right', delay: 300, duration: 1200 } },
            { selector: '#age', config: { origin: 'bottom', delay: 400, duration: 800 } }
        ],
        skills: [
            { selector: '.skills__subtitle', config: { origin: 'left', delay: 100, duration: 1000 } },
            { selector: '.skills__text', config: { origin: 'right', delay: 200, duration: 1200 } },
            { selector: '.skill-item', config: { origin: 'bottom', interval: 70, delay: 300, distance: '30px', scale: 0.8, rotate: { x: 0, y: 0, z: isMobile ? 0 : 15 }, duration: 1000 } },
            { selector: '.skills__img', config: { origin: 'right', delay: 400, scale: 0.95, rotate: { x: isMobile ? 0 : 15, y: isMobile ? 0 : 15, z: 0 }, duration: 1500 } }
        ],
        contact: [
            { selector: '.contact__title', config: { origin: 'top', delay: 100, duration: 1000 } },
            { selector: '.contact__button', config: { origin: 'bottom', delay: 200, interval: 150, distance: '60px', scale: 0.9, duration: 1200 } }
        ],
        footer: [
            { selector: '.footer__title', config: { origin: 'top', delay: 100, duration: 1000 } },
            { selector: '.footer__social', config: { origin: 'bottom', delay: 200, interval: 150, duration: 1200 } },
            { selector: '.footer__copy', config: { origin: 'left', delay: 300, duration: 1000 } },
            { selector: '#current-year', config: { origin: 'right', delay: 400, duration: 800 } }
        ]
    };

    Object.values(revealConfigs).flat().forEach(({ selector, config }) => sr.reveal(selector, config));
};

/*===== EMAIL COPY FUNCTIONALITY =====*/
const handleEmailCopy = (event) => {
    if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        event.preventDefault();
        const email = event.currentTarget.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email)
            .then(() => utils.showToast('Email copied to clipboard'))
            .catch(err => {
                console.error('Failed to copy email: ', err);
                utils.showToast('Failed to copy email');
            });
    }
};

/*===== SCROLL HANDLER =====*/
const handleScroll = _.throttle(() => {
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
}, 100);

/*===== SMOOTH SCROLL =====*/
const smoothScroll = (target, duration) => {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    const ease = (t, b, c, d) => {
        t /= d / 2;
        return t < 1 ? c / 2 * t * t + b : -c / 2 * ((--t) * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
};

/*===== INTERACTION FEEDBACK =====*/
const addInteractionFeedback = () => {
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 150);
        });
    });
};

/*===== PROGRESSIVE ENHANCEMENT =====*/
const enhanceProgressively = () => {
    if ('IntersectionObserver' in window) {
        // Implement lazy loading using Intersection Observer
        initializeLazyLoading();
    } else {
        // Fallback to simpler implementation for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => img.src = img.dataset.src);
    }

    if (CSS.supports('backdrop-filter', 'blur(10px)')) {
        document.body.classList.add('supports-backdrop-filter');
    }
};

/*===== LAZY LOADING =====*/
const initializeLazyLoading = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("lazy");
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
};

/*===== EVENT LISTENERS =====*/
const addEventListeners = () => {
    if (elements.navToggle && elements.navMenu) {
        elements.navToggle.addEventListener('click', menu.toggle);
        elements.navLinks.forEach(link => link.addEventListener('click', menu.linkAction));
    } else {
        console.error('Navigation elements not found');
    }

    elements.darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        utils.applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    window.addEventListener('scroll', handleScroll);

    document.querySelectorAll('.contact__button[href^="mailto:"], .home__social-icon[href^="mailto:"], .footer__icon.email-copy')
        .forEach(emailLink => emailLink.addEventListener('click', handleEmailCopy));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScroll(target, 1000);
            }
        });
    });
};

/*===== INITIALIZATION =====*/
const initialize = () => {
    utils.applyTheme(localStorage.getItem('theme') || 'light');
    utils.updateAge();
    utils.updateYear();
    document.body.classList.add('body-visible', 'loaded');

    initializeScrollReveal();
    addEventListeners();
    addInteractionFeedback();
    enhanceProgressively();
};

document.addEventListener('DOMContentLoaded', initialize);