// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const navbar = document.querySelector('.navbar');
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const scrollTopBtn = document.getElementById('scrollTop');
const contactForm = document.getElementById('contact-form');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');
const scrollProgress = document.querySelector('.scroll-progress');

// --- Theme Toggle ---
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
} else {
    // Default is dark
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    let theme = 'dark';
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        theme = 'light';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// --- Mobile Menu Toggle ---
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// --- Scroll Logic (Progress, Sticky Nav, Scroll Top, Active Link) ---
window.addEventListener('scroll', () => {
    // Scroll Progress Bar
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = scrolled + "%";

    // Navbar styling
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 14px 36px rgba(0, 0, 0, 0.22)';
        navbar.style.background = 'var(--bg-nav)';
    } else {
        navbar.style.padding = '0.75rem 0';
        navbar.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.18)';
        navbar.style.background = 'var(--bg-nav)';
    }

    // Scroll to Top Button
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }

    // Scroll Spy
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes('#' + current)) {
            li.classList.add('active');
        }
    });
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- Entrance Animations with Enhanced Intersection Observer ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Keep observing for repeated animations on re-entry
        }
    });
}, observerOptions);

const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => observer.observe(el));

const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, {
    threshold: 0.28,
    rootMargin: '0px 0px -80px 0px'
});

timelineItems.forEach(item => timelineObserver.observe(item));

// --- Enhanced Element Animation on Scroll ---
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            el.classList.add('animated');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// --- Enhanced Typing Effect with Better Cursor ---
const typingElement = document.getElementById('typing-text');
if (typingElement) {
    const text = typingElement.innerText;
    typingElement.innerText = '';
    typingElement.style.opacity = '1';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            const char = text.charAt(i);
            typingElement.innerHTML += char;
            i++;
            // Variable typing speed for more natural feel
            const speed = char === ' ' ? 30 : 40;
            setTimeout(typeWriter, speed);
        } else {
            // Add Blinking Cursor after typing done
            typingElement.innerHTML += '<span class="cursor-blink"></span>';
        }
    }

    // Start delay
    setTimeout(typeWriter, 800);
}


// --- Contact Form ---
if (contactForm) {
    contactForm.addEventListener('submit', () => {
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
    });
}

// --- Scroll Velocity Detection for Smooth Animations ---
let lastScrollTop = 0;
let scrollVelocity = 0;

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    scrollVelocity = scrollTop - lastScrollTop;
    lastScrollTop = scrollTop;
    
    // Apply subtle effect based on scroll velocity
    const elements = document.querySelectorAll('.skill-card');
    elements.forEach((el, index) => {
        const offsetTop = el.offsetTop;
        const isInView = scrollTop + window.innerHeight > offsetTop && scrollTop < offsetTop + el.offsetHeight;
        
        if (isInView && scrollVelocity !== 0) {
            el.style.transition = 'transform 0.3s ease-out';
        }
    });
});
