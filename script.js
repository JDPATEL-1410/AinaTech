/* ===============================================
   AINA TECH SERVICES LLP - MAIN JAVASCRIPT
   Modern, Performance-Optimized Scripts
   =============================================== */

/* Navigation (sticky header, mobile menu toggle) */
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close menu when clicking on links (mobile)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
    
    // Sticky navbar on scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

/* Footer (dynamic year) */
document.addEventListener('DOMContentLoaded', function() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

/* AOS + Animations Init */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Counter animation for statistics
    const animateCounters = () => {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const current = parseInt(counter.textContent);
            const increment = target / 100;
            
            if (current < target) {
                counter.textContent = Math.ceil(current + increment);
                setTimeout(() => animateCounters(), 20);
            }
        });
    };
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('[data-count]').forEach(counter => {
        counterObserver.observe(counter);
    });
});

/* Contact Form Validation + WhatsApp integration */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Clear previous errors
            clearErrors();
            
            let isValid = true;
            
            // Validate name
            if (!name || name.trim().length < 2) {
                showError('name', 'Please enter a valid name');
                isValid = false;
            }
            
            // Validate email
            if (!email || !isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate phone
            if (!phone || !isValidPhone(phone)) {
                showError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Validate message
            if (!message || message.trim().length < 10) {
                showError('message', 'Please enter a message (minimum 10 characters)');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('.form-submit');
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual submission logic)
                setTimeout(() => {
                    // Show success message
                    showSuccess('Thank you! Your message has been sent successfully.');
                    this.reset();
                    
                    // WhatsApp integration
                    const whatsappMessage = `Hello! I'm ${name}. ${message}. You can reach me at ${email} or ${phone}.`;
                    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;
                    
                    // Optionally open WhatsApp (uncomment if needed)
                    // window.open(whatsappUrl, '_blank');
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
    
    function clearErrors() {
        document.querySelectorAll('.error').forEach(error => error.remove());
        document.querySelectorAll('.form-control.error').forEach(input => {
            input.classList.remove('error');
        });
    }
    
    function showError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }
    
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.style.cssText = 'padding: 1rem; background: rgba(20, 184, 166, 0.1); border: 1px solid #14B8A6; border-radius: 8px; margin-bottom: 1rem; color: #14B8A6;';
        successDiv.textContent = message;
        
        const form = document.querySelector('.contact-form');
        form.insertBefore(successDiv, form.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => successDiv.remove(), 5000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
});

/* Testimonials Slider (Swiper.js) */
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        const testimonialsSlider = new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
});

/* FAQ Accordion Toggle */
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        }
    });
});

/* Pricing Table Interactions */
document.addEventListener('DOMContentLoaded', function() {
    // Pricing toggle (monthly/yearly)
    const pricingToggle = document.querySelector('.toggle-switch');
    const monthlyPrices = {
        starter: '999',
        growth: '2499',
        pro: '4999'
    };
    const yearlyPrices = {
        starter: '9999',
        growth: '24999',
        pro: '49999'
    };
    
    if (pricingToggle) {
        pricingToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const isYearly = this.classList.contains('active');
            
            // Update prices
            const priceElements = document.querySelectorAll('.plan-price');
            priceElements.forEach(element => {
                const plan = element.closest('.pricing-card').dataset.plan;
                if (plan) {
                    const price = isYearly ? yearlyPrices[plan] : monthlyPrices[plan];
                    element.textContent = `₹${price}`;
                }
            });
            
            // Update period text
            const periodElements = document.querySelectorAll('.plan-period');
            periodElements.forEach(element => {
                element.textContent = isYearly ? '/year' : '/month';
            });
        });
    }
    
    // Highlight popular plan
    const popularCard = document.querySelector('.pricing-card.popular');
    if (popularCard) {
        popularCard.style.transform = 'scale(1.05)';
    }
});
/* Smooth Scroll + CTA Bar */
document.addEventListener('DOMContentLoaded', function() {
    const stickyCta = document.getElementById('stickyCta');
    const stickyClose = document.getElementById('stickyClose');
    
    // Show/hide sticky CTA based on scroll
    if (stickyCta) {
        let ctaShown = false;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > 30 && !ctaShown) {
                stickyCta.classList.add('show');
                ctaShown = true;
            }
        });
        
        // Close sticky CTA
        if (stickyClose) {
            stickyClose.addEventListener('click', () => {
                stickyCta.classList.remove('show');
            });
        }
    }
    
    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

/* Blog Filters */
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            blogCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

/* Portfolio Filter */
document.addEventListener('DOMContentLoaded', function() {
    const portfolioFilters = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-card');
    
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active class from all filters
            portfolioFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            filter.classList.add('active');
            
            const category = filter.dataset.filter;
            
            portfolioItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

/* Lazy Loading Images */
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

/* Performance Optimizations */
document.addEventListener('DOMContentLoaded', function() {
    // Preload critical resources
    const preloadLinks = [
        'assets/img/logo.png',
        'assets/img/crm-dashboard.png'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = href;
        document.head.appendChild(link);
    });
    
    // Service Worker registration (for PWA)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});

/* Utilities */
const utils = {
    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Format phone number
    formatPhone: (phone) => {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },
    
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
};

// Export utils for use in other scripts
window.AinaTechUtils = utils;

