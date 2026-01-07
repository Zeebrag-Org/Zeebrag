const toggleBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('nav ul');

toggleBtn && toggleBtn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    
    toggleBtn.setAttribute('aria-expanded', isOpen);
    
    toggleBtn.classList.toggle('active', isOpen);
});

/**
 * Safe grecaptcha executor — prevents "Invalid site owner" errors.
 */
const RECAPTCHA_SITE_KEY = '6LeV1kAsAAAAAM0Z72fY7GebaVe9nikB76neN1_p'; // public site key for www.zeebrag.com

function executeRecaptcha(action = 'submit') {
    return new Promise((resolve) => {
        if (RECAPTCHA_SITE_KEY && window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
            try {
                window.grecaptcha.ready(() => {
                    window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
                        .then(token => resolve(token))
                        .catch(() => resolve(null));
                });
            } catch (e) {
                resolve(null);
            }
        } else {
            resolve(null);
        }
    });
}

/**
 * Generic safe form submit handler: runs recaptcha (if configured) then continues.
 * Replace the "proceedWithForm" implementation with your real submission logic.
 */
async function safeHandleFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const action = form.getAttribute('data-recaptcha-action') || 'submit';
    const token = await executeRecaptcha(action);

    // Example: attach token to form data if present
    const fd = new FormData(form);
    if (token) fd.append('g-recaptcha-response', token);

    // TODO: replace with real submission (fetch/XHR). For now, log and simulate success.
    console.log('Submitting form:', form.id || form.name, Object.fromEntries(fd.entries()));
    form.dispatchEvent(new CustomEvent('safe-submit-complete', { bubbles: true }));
}

/* Attach handlers to known forms if they exist */
document.addEventListener('DOMContentLoaded', () => {
    const forms = [
        document.getElementById('contact-form'),
        document.getElementById('get-started-form'),
        document.getElementById('newsletter-form')
    ].filter(Boolean);

    forms.forEach(f => {
        // prevent duplicate handlers
        f.removeEventListener('submit', safeHandleFormSubmit);
        f.addEventListener('submit', safeHandleFormSubmit);
    });

    // Optional: handle safe-submit-complete to show a user-friendly message
    document.body.addEventListener('safe-submit-complete', (e) => {
        // Minimal UX: you can replace this with your toast/modal UI
        console.log('Form submission completed (simulated).');
    });
});