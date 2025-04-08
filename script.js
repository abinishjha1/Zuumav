// Performance optimized JavaScript with smooth animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initializeAnimations();
    
    // Mobile menu functionality
    initializeMobileMenu();
    
    // Smooth scrolling
    initializeSmoothScroll();
    
    // Form handling
    initializeForm();
    
    // Loading animation
    handleLoading();

    // Cache DOM elements
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const body = document.body;
    const forms = {
        contact: document.querySelector('.contact-form'),
        newsletter: document.querySelector('.newsletter-form')
    };

    // Lazy loading images with IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Animate elements on scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animateOnScroll.observe(element);
    });

    // Handle device orientation changes
    window.addEventListener('orientationchange', () => {
        // Reset mobile menu state
        nav.classList.remove('active');
        burger.classList.remove('active');
        body.style.overflow = '';
    });

    // Prevent zoom on input focus for iOS
    const touchInputs = document.querySelectorAll('input, textarea');
    touchInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.setAttribute('readonly', 'readonly');
            setTimeout(() => {
                input.removeAttribute('readonly');
            }, 50);
        });
    });
});

function initializeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Add fade-in class to elements
    document.querySelectorAll('.model-card, .feature-card').forEach(card => {
        card.classList.add('fade-in');
    });
}

function initializeMobileMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    burger?.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav?.classList.contains('active') && 
            !nav.contains(e.target) && 
            !burger?.contains(e.target)) {
            nav.classList.remove('active');
            burger?.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showMessage('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            showMessage('Error sending message. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.querySelector('.contact-form');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function handleLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        window.addEventListener('load', () => {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        });
    }
}

// Prevent zoom on input focus for iOS devices
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.model-card, .service-card, .stat-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .model-card, .service-card, .stat-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .model-card.animate, .service-card.animate, .stat-item.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .burger.toggle .line1 {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .burger.toggle .line2 {
        opacity: 0;
    }
    
    .burger.toggle .line3 {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;

document.head.appendChild(style); 