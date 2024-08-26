/*===== DOM ELEMENTS =====*/
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');

/*===== UTILITY FUNCTIONS =====*/
const updateYear = () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
};

const updateAge = () => {
    const birthdate = new Date('2000-12-22');
    const age = Math.floor((new Date() - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
    document.getElementById('age').textContent = age;
};

const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.body.classList.add('theme-transition');
    document.documentElement.style.setProperty('--body-bg', isDark ? '#121212' : '#fff');
    document.documentElement.style.setProperty('--text-color', isDark ? '#e0e0e0' : 'var(--second-color)');
    moonIcon.style.display = isDark ? 'none' : 'block';
    sunIcon.style.display = isDark ? 'block' : 'none';
    document.body.classList.toggle('dark-theme', isDark);
    setTimeout(() => document.body.classList.remove('theme-transition'), 300);
};

const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    toast.offsetHeight; // Trigger reflow
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, 2500);
    });
};

/*===== MENU FUNCTIONALITY =====*/
const toggleMenu = () => {
    navMenu.classList.toggle('show');
    navToggle.classList.toggle('active');
};

const linkAction = function() {
    navLinks.forEach(n => n.classList.remove('active'));
    this.classList.add('active');
    navMenu.classList.remove('show');
};

/*===== SKILLS ANIMATION =====*/
const animateSkills = () => {
    document.querySelectorAll('.skills__bar').forEach(bar => {
        const value = bar.parentElement.querySelector('.skills__percentage').textContent;
        requestAnimationFrame(() => {
            bar.style.width = value;
            bar.addEventListener('transitionend', () => bar.classList.add('filled'), { once: true });
        });
    });
};

/*===== SCROLL REVEAL ANIMATION =====*/
const initializeScrollReveal = () => {
    ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    }).reveal(
        '.home__title, .button, .home__img, .home__social-icon, .about__img, .about__subtitle, .about__text, .skills__subtitle, .skills__text, .skill-item, .skills__img, .contact__input',
        { delay: 200, interval: 200 }
    );
};

/*===== SKILLS OBSERVER =====*/
const initializeSkillsObserver = () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) observer.observe(skillsSection);
};

/*===== EMAIL COPY FUNCTIONALITY =====*/
const handleEmailCopy = function(event) {
    if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        event.preventDefault();
        const email = this.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email)
            .then(() => showToast('Email copied to clipboard'))
            .catch(err => {
                console.error('Failed to copy email: ', err);
                showToast('Failed to copy email');
            });
    }
};

/*===== EVENT LISTENERS =====*/
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(localStorage.getItem('theme') || 'light');
    updateAge();
    updateYear();
    document.body.classList.add('body-visible', 'loaded');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMenu);
        navLinks.forEach(link => link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }));
    } else {
        console.error('Navigation elements not found');
    }

    initializeSkillsObserver();
    initializeScrollReveal();
});

darkModeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

window.addEventListener('scroll', _.throttle(() => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
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

navLinks.forEach(n => n.addEventListener('click', linkAction));

document.querySelectorAll('.contact__button[href^="mailto:"], .home__social-icon[href^="mailto:"], .footer__icon.email-copy')
    .forEach(emailLink => emailLink.addEventListener('click', handleEmailCopy));