/* --- Contact Form Submission Handler --- */
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
