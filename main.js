// Replace with your Apps Script deployment URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxRV51KgsW_ovSOlnTGzSbkyp1phBR350hxL-6WatCMZCGnijd1Xmd5jvdDc1YyIqQ/exec';

// Toggle business name field visibility
const userTypeSelect = document.getElementById('userType');
const businessNameGroup = document.getElementById('businessNameGroup');

userTypeSelect.addEventListener('change', function() {
  if (this.value === 'business' || this.value === 'both') {
    businessNameGroup.classList.add('show');
  } else {
    businessNameGroup.classList.remove('show');
  }
});

// Form submission handler
const form = document.getElementById('waitlistForm');
const messageDiv = document.getElementById('formMessage');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  messageDiv.classList.remove('show', 'success', 'error');
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    userType: document.getElementById('userType').value,
    businessName: document.getElementById('businessName').value,
    message: document.getElementById('message').value
  };
  
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      messageDiv.textContent = data.message;
      messageDiv.classList.add('show', 'success');
      form.reset();
      businessNameGroup.classList.remove('show');
    } else {
      throw new Error(data.message);
    }
  })
  .catch(error => {
    messageDiv.textContent = 'Something went wrong. Please try again.';
    messageDiv.classList.add('show', 'error');
    console.error('Error:', error);
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Join the Waitlist';
  });
});
