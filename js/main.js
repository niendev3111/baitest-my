// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
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

    // Active navigation item
    const currentLocation = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentLocation.split('/').pop()) {
            link.classList.add('active');
        }
    });

    // Card hover effects with parallax
    document.querySelectorAll('.card').forEach(card => {
        const cardImg = card.querySelector('.card-img-top');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            
            if (cardImg) {
                cardImg.style.transform = `scale(1.05) translateX(${rotateY * 2}px) translateY(${rotateX * 2}px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            if (cardImg) {
                cardImg.style.transform = '';
            }
        });
    });

    // Share buttons functionality with animation
    document.querySelectorAll('.share-buttons a').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl;

            if (this.classList.contains('bg-primary')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            } else if (this.classList.contains('bg-info')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            }

            if (shareUrl) {
                // Add click animation
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }, 200);
            }
        });
    });


    // Search functionality with debounce
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchInput && searchButton) {
        let searchTimeout;
        
        const performSearch = () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Add loading animation
                searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                // Simulate search delay
                setTimeout(() => {
                    console.log('Searching for:', searchTerm);
                    searchButton.innerHTML = '<i class="fas fa-search"></i>';
                }, 500);
            }
        };

        searchButton.addEventListener('click', performSearch);
        
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Newsletter form handling with validation
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Vui lòng nhập email hợp lệ', 'error');
                return;
            }
            
            // Add loading state
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                console.log('Newsletter subscription:', email);
                showNotification('Cảm ơn bạn đã đăng ký nhận tin!', 'success');
                newsletterForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1000);
        });
    }

    // Dark mode toggle with animation
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            
            // Add toggle animation
            darkModeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                darkModeToggle.style.transform = '';
            }, 300);
        });

        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // Loading animation with fade
    const loading = document.querySelector('.loading');
    if (loading) {
        window.addEventListener('load', () => {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        });
    }

    // Intersection Observer for animations with delay
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.card, .post-content, .author-info').forEach(el => {
        observer.observe(el);
    });

    // Image lazy loading with blur effect
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.filter = 'blur(10px)';
                img.src = img.dataset.src;
                
                img.onload = () => {
                    img.style.transition = 'filter 0.3s ease';
                    img.style.filter = 'blur(0)';
                };
                
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Mobile menu with smooth animation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.style.display = 'block';
            setTimeout(() => {
                navbarCollapse.classList.toggle('show');
            }, 10);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
                setTimeout(() => {
                    if (!navbarCollapse.classList.contains('show')) {
                        navbarCollapse.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    // Helper functions
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}); 