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
        navbar.style.boxShadow = 'var(--shadow-md)';
        navbar.style.background = 'rgba(3, 0, 20, 0.95)'; // Creating a deeper background on scroll
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = 'none';
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

// --- Entrance Animations ---
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(el => observer.observe(el));

// --- Typing Effect ---
const typingElement = document.getElementById('typing-text');
if (typingElement) {
    const text = typingElement.innerText;
    typingElement.innerText = '';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            // Add Blinking Cursor after typing done
            typingElement.innerHTML += '<span class="cursor-blink"></span>';
        }
    }

    // Start delay
    setTimeout(typeWriter, 500);
}


// --- Contact Form ---
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        // Simulate sending
        setTimeout(() => {
            submitBtn.innerText = 'Message Sent!';
            submitBtn.style.background = 'var(--secondary-color)';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.style.background = 'var(--gradient-main)'; /* Reset to gradient */
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}
