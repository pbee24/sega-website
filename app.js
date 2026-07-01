/* ==========================================================================
   SEGA NGO WEBSITE - INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initStatsCounter();
    initProjectTabs();
    initRazorpay();
});

/* --- 1. Sticky Header Logic --- */
function initHeader() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* --- 2. Mobile Navigation Toggle --- */
function initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link, .nav-btn');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        });
    }
}

/* --- 3. Dynamic Stats Counter --- */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower

    const startCounting = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;

                const updateCount = () => {
                    const inc = target / speed;
                    if (count < target) {
                        count += inc;
                        if (target === 2017) {
                            counter.innerText = Math.floor(count);
                        } else if (target === 500 || target === 100) {
                            counter.innerText = `~${Math.floor(count)}`;
                        } else {
                            counter.innerText = Math.floor(count);
                        }
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target === 2017 ? target : (target === 500 || target === 100 ? `~${target}` : target);
                    }
                };

                updateCount();
                observer.unobserve(counter); // Stop observing once animated
            }
        });
    };

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(startCounting, observerOptions);
    stats.forEach(stat => observer.observe(stat));
}

/* --- 4. Project Tabs --- */
function initProjectTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to current button and content
            btn.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/* --- 5. Project Image Gallery Switcher --- */
function switchProjectImage(mainImgId, thumbnailElement) {
    const mainImg = document.getElementById(mainImgId);
    if (!mainImg) return;

    // Change main image source
    mainImg.src = thumbnailElement.src;
    mainImg.alt = thumbnailElement.alt;

    // Update active thumbnail styling
    const thumbnailsContainer = thumbnailElement.parentElement;
    const thumbnails = thumbnailsContainer.querySelectorAll('.thumb');
    thumbnails.forEach(t => t.classList.remove('active'));
    thumbnailElement.classList.add('active');
}

/* --- 6. Donation Method Switcher --- */
function switchDonateMethod(methodId, buttonElement) {
    // Hide all method contents
    const contents = document.querySelectorAll('.donate-method-content');
    contents.forEach(c => c.classList.remove('active'));

    // Deactivate all buttons
    const buttons = document.querySelectorAll('.donate-method-btn');
    buttons.forEach(b => b.classList.remove('active'));

    // Activate selected content and button
    document.getElementById(methodId).classList.add('active');
    buttonElement.classList.add('active');
}

/* --- 7. Preset Donation Amount Handler --- */
function setDonateAmount(amount) {
    const customInput = document.getElementById('customAmountInput');
    if (customInput) {
        customInput.value = amount;
    }

    // Update active preset button styling
    const presetButtons = document.querySelectorAll('.amount-preset-btn');
    presetButtons.forEach(btn => {
        if (btn.innerText.includes(amount.toLocaleString('en-IN'))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Update preset active class when typing custom amount
const customAmountInput = document.getElementById('customAmountInput');
if (customAmountInput) {
    customAmountInput.addEventListener('input', () => {
        const val = +customAmountInput.value;
        const presetButtons = document.querySelectorAll('.amount-preset-btn');
        presetButtons.forEach(btn => {
            const btnVal = parseInt(btn.innerText.replace(/[^0-9]/g, ''));
            if (btnVal === val) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });
}

/* --- 8. Copy to Clipboard Utility --- */
function copyText(elementId, btnElement) {
    const textElement = document.getElementById(elementId);
    if (!textElement) return;

    const textToCopy = textElement.innerText;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Change icon to checkmark for success feedback
        const icon = btnElement.querySelector('i');
        icon.className = 'fa-solid fa-circle-check';
        icon.style.color = '#2d8a5c';

        // Revert back after 2 seconds
        setTimeout(() => {
            icon.className = 'fa-regular fa-copy';
            icon.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

/* --- 9. Razorpay Integration Prototype --- */
function initRazorpay() {
    const payBtn = document.getElementById('razorpayPayBtn');
    if (!payBtn) return;

    payBtn.addEventListener('click', () => {
        const amountInput = document.getElementById('customAmountInput');
        const amountVal = amountInput ? +amountInput.value : 5000;

        if (amountVal < 100) {
            alert('Minimum donation amount is ₹100.');
            return;
        }

        // Check if Razorpay is loaded (from the CDN script in HTML)
        if (typeof Razorpay !== 'undefined') {
            const options = {
                "key": "rzp_test_segaDemoKey", // Place your Razorpay Live/Test Key ID here
                "amount": amountVal * 100,     // Razorpay takes amount in paise (1 INR = 100 Paise)
                "currency": "INR",
                "name": "SEGA India",
                "description": "Donation for Cattle Welfare & Rural Livelihoods",
                "image": "images/logo.png.png",
                "handler": function (response) {
                    alert(`Thank you for your generous donation!\nPayment ID: ${response.razorpay_payment_id}\nWe will send a tax exemption receipt to your email shortly.`);
                },
                "prefill": {
                    "name": "",
                    "email": "",
                    "contact": ""
                },
                "theme": {
                    "color": "#113824" // Matches SEGA's secondary green
                },
                "modal": {
                    "ondismiss": function() {
                        console.log('Payment modal closed.');
                    }
                }
            };
            
            try {
                const rzp = new Razorpay(options);
                rzp.open();
            } catch (err) {
                console.error("Razorpay open error: ", err);
                triggerFallbackPayment(amountVal);
            }
        } else {
            // Fallback if script didn't load or is blocked (e.g. ad blockers)
            triggerFallbackPayment(amountVal);
        }
    });
}

function triggerFallbackPayment(amount) {
    // If Razorpay SDK fails to load, simulate a beautiful success dialog or redirect
    alert(`[PROTOTYPE SIMULATION]\nConnecting to Razorpay Secure Gateway...\nAmount: ₹${amount.toLocaleString('en-IN')}\n\nTo make this button work in production:\n1. Open your Razorpay Dashboard.\n2. Create a "Payment Page" or "Payment Button".\n3. Replace this script with your Razorpay link, or insert your live API Key ID in app.js.`);
}

/* --- 10. Contact Form Submission Handler --- */
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const feedback = document.getElementById('formFeedback');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const phone = document.getElementById('formPhone').value;
    const message = document.getElementById('formMessage').value;

    // Show sending state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Message... <i class="fa-solid fa-spinner fa-spin"></i>';
    feedback.className = 'form-feedback';
    feedback.innerText = '';

    // Simulate form submission to backend (e.g. Formspree or EmailJS)
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your message has been sent successfully. We will get back to you at ${email} shortly.`;
        
        // Reset form
        form.reset();
        
        // Remove feedback after 5 seconds
        setTimeout(() => {
            feedback.innerHTML = '';
            feedback.className = 'form-feedback';
        }, 6000);
    }, 1500);
}
