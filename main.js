// IMPORTANT: Replace this URL with your Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlNqmPcFHVebRM2SDTvY1ZxRK_g8BnPIPDWeoO1AFhtmm5_qdhHjjZP0V9Cq-FRz-e/exec';

// Show/hide business name field based on user type
document.addEventListener('DOMContentLoaded', function() {
  const userType = document.getElementById('userType');
  if (userType) {
    userType.addEventListener('change', function() {
      const businessNameGroup = document.getElementById('businessNameGroup');
      const value = this.value;
      if (value === 'business' || value === 'both') {
        businessNameGroup.classList.add('show');
      } else {
        businessNameGroup.classList.remove('show');
      }
    });
  }

  // Handle form submission
  const waitlistForm = document.getElementById('waitlistForm');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitButton = this.querySelector('button[type="submit"]');
      const formMessage = document.getElementById('formMessage');
      const originalButtonText = submitButton.textContent;

      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
      formMessage.classList.remove('show', 'success', 'error');

      // Collect form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        userType: document.getElementById('userType').value,
        businessName: document.getElementById('businessName').value,
        message: document.getElementById('message').value
      };

      try {
        // Submit to Google Apps Script
        // Use URL-encoded POST to avoid preflight and remove custom headers
        const params = new URLSearchParams();
        Object.keys(formData).forEach(k => params.append(k, formData[k] || ''));

        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: params
        });

        // If we reach here without an exception the request was sent
        formMessage.textContent = 'Thank you for joining the waitlist! We\'ll be in touch soon.';
        formMessage.classList.add('show', 'success');

        // Reset form
        this.reset();
        const businessNameGroup = document.getElementById('businessNameGroup');
        if (businessNameGroup) businessNameGroup.classList.remove('show');

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      } catch (error) {
        console.error('Error:', error);
        formMessage.textContent = 'Something went wrong. Please try again or email us at hello@vibbsy.com';
        formMessage.classList.add('show', 'error');
      } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }
});
