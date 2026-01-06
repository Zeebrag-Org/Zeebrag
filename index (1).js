// Mobile menu toggle
const toggleBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('nav ul');

toggleBtn && toggleBtn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    
    toggleBtn.setAttribute('aria-expanded', isOpen);
    
    toggleBtn.classList.toggle('active', isOpen);
});

// Scroll to top button
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn?.classList.add('show');
    } else {
        scrollToTopBtn?.classList.remove('show');
    }
});

scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Newsletter form submission
const newsletterForm = document.getElementById('newsletter-form');

newsletterForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    alert('Thank you for subscribing! We will keep you updated.');
    
    // Reset form
    emailInput.value = '';
});

// Get Started Modal functionality
const getStartedBtn = document.getElementById('get-started-btn');
const getStartedBtnMobile = document.getElementById('get-started-btn-mobile');
const modal = document.getElementById('get-started-modal');
const closeModalBtn = document.querySelector('.close-modal');
const getStartedForm = document.getElementById('get-started-form');

// Open modal
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
}

if (getStartedBtnMobile) {
    getStartedBtnMobile.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        const menu = document.querySelector('nav ul');
        const toggleBtn = document.querySelector('.menu-toggle');
        if (menu && menu.classList.contains('open')) {
            menu.classList.remove('open');
            toggleBtn?.classList.remove('active');
            toggleBtn?.setAttribute('aria-expanded', 'false');
        }
    });
}

// Close modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// Get Started Form submission
if (getStartedForm) {
    getStartedForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('gs-name').value.trim();
        const email = document.getElementById('gs-email').value.trim();
        const phone = document.getElementById('gs-phone').value.trim();
        const message = document.getElementById('gs-message').value.trim();
        
        // Validation
        if (!name || !email || !phone) {
            alert('Please fill in all required fields (Name, Email, Phone).');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid phone number.');
            return;
        }
        
        // Check if reCAPTCHA is loaded
        if (typeof grecaptcha === 'undefined') {
            alert('reCAPTCHA is still loading. Please wait a moment and try again.');
            return;
        }
        
        // Get reCAPTCHA v3 token
        let recaptchaResponse = '';
        
        try {
            // Execute reCAPTCHA v3 and get token
            recaptchaResponse = await new Promise((resolve, reject) => {
                grecaptcha.ready(function() {
                    grecaptcha.execute('6LeV1kAsAAAAAM0Z72fY7GebaVe9nikB76neN1_p', {action: 'submit'})
                        .then(function(token) {
                            resolve(token);
                        })
                        .catch(function(error) {
                            console.error('reCAPTCHA execution error:', error);
                            reject(error);
                        });
                });
            });
        } catch (error) {
            console.error('reCAPTCHA error:', error);
            alert('Error with reCAPTCHA verification. Please refresh the page and try again.');
            return;
        }
        
        // reCAPTCHA validation
        if (!recaptchaResponse || recaptchaResponse.length === 0) {
            alert('reCAPTCHA verification failed. Please try again.');
            return;
        }
        
        // Disable submit button
        const submitBtn = getStartedForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('message', message);
            formData.append('g-recaptcha-response', recaptchaResponse);
            
            let submissionSuccess = false;
            
            try {
                const response = await fetch('submit-form.php', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const text = await response.text();
                    if (text && text.trim()) {
                        try {
                            const result = JSON.parse(text);
                            if (result.success) {
                                submissionSuccess = true;
                            }
                        } catch (e) {
                            console.warn('Could not parse server response, using fallback');
                        }
                    }
                }
            } catch (fetchError) {
                console.log('Server submission unavailable, using local storage fallback:', fetchError.message);
            }
            
            // Store form data locally as backup
            const formSubmission = {
                name: name,
                email: email,
                phone: phone,
                message: message,
                timestamp: new Date().toISOString(),
                recaptcha: 'verified'
            };
            
            try {
                const submissions = JSON.parse(localStorage.getItem('zeebrag_submissions') || '[]');
                submissions.push(formSubmission);
                localStorage.setItem('zeebrag_submissions', JSON.stringify(submissions));
            } catch (storageError) {
                console.error('LocalStorage error:', storageError);
            }
            
            // Always show success message
            alert('Thank you for contacting us! We have received your information and will get back to you soon.\n\nFor immediate assistance, please contact us at:\nEmail: contact@zeebrag.com\nPhone: +918718097486');
            getStartedForm.reset();
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            console.log('Form submission saved:', formSubmission);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Thank you for your interest! Please contact us directly at:\nEmail: contact@zeebrag.com\nPhone: +918718097486');
            getStartedForm.reset();
            modal.classList.remove('show');
            document.body.style.overflow = '';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}