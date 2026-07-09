/* --- Donation Method Switcher --- */
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

/* --- Preset Donation Amount Handler --- */
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
(function() {
    document.addEventListener('DOMContentLoaded', () => {
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
    });
})();

/* --- Copy to Clipboard Utility --- */
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

/* --- Razorpay Integration Prototype --- */
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
                "image": "assets/images/sega-ngo-logo.png",
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
