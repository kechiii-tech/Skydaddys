// ===== CONTACT FORM WHATSAPP INTEGRATION =====
// All form submissions go to WhatsApp: +254117702463

document.addEventListener('DOMContentLoaded', function() {
    // Set current year for footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize contact form
    initContactForm();
    initPhoneInputFormatting();
    initCharacterCounter();
});

// WhatsApp number - ALL MESSAGES GO HERE
const WHATSAPP_NUMBER = '254117702463';

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.error('Contact form not found!');
        return;
    }
    
    console.log('Contact form initialized. All submissions will go to WhatsApp: ' + WHATSAPP_NUMBER);
    
    // Remove existing submit handler
    contactForm.removeEventListener('submit', contactForm._submitHandler);
    
    // Add new submit handler
    contactForm._submitHandler = function(e) {
        e.preventDefault();
        
        if (validateContactForm(contactForm)) {
            sendFormToWhatsApp(contactForm);
        }
        
        return false;
    };
    
    contactForm.addEventListener('submit', contactForm._submitHandler);
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
}

// Phone input formatting
function initPhoneInputFormatting() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format as Kenyan phone number
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.replace(/(\d{3})(\d{0,3})/, '$1 $2');
            } else if (value.length <= 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1 $2 $3');
            } else {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3 $4');
            }
            
            e.target.value = value;
        });
    }
}

// Character counter for textarea
function initCharacterCounter() {
    const messageTextarea = document.getElementById('message');
    
    if (messageTextarea) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: #95a5a6;
            margin-top: 0.25rem;
            padding-right: 5px;
        `;
        counter.textContent = '0/500';
        
        messageTextarea.parentNode.appendChild(counter);
        
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/500`;
            
            if (length > 500) {
                counter.style.color = '#e74c3c';
                this.value = this.value.substring(0, 500);
                counter.textContent = '500/500 (max)';
            } else if (length > 450) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = '#95a5a6';
            }
        });
    }
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearError(field);
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.id === 'phone' && value) {
        const cleanPhone = value.replace(/\D/g, '');
        if (cleanPhone.length < 9 || cleanPhone.length > 12) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number (9-12 digits)';
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        showError(field, errorMessage);
    }
    
    return isValid;
}

// Show error message
function showError(field, message) {
    // Remove existing error
    clearError(field);
    
    // Add error class
    field.classList.add('error');
    field.style.borderColor = '#e74c3c';
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        padding-left: 5px;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear error
function clearError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validate entire form
function validateContactForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Clear all errors first
    requiredFields.forEach(field => clearError(field));
    
    // Validate each required field
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
            // Focus on first invalid field
            if (isValid === false) {
                field.focus();
            }
        }
    });
    
    return isValid;
}

// ===== MAIN FUNCTION: SEND FORM TO WHATSAPP =====
function sendFormToWhatsApp(form) {
    console.log('Sending form data to WhatsApp...');
    
    // Get form data
    const formData = new FormData(form);
    const formValues = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formValues[key] = value;
    }
    
    console.log('Form data:', formValues);
    
    // Create WhatsApp message
    let message = `*📱 NEW CONTACT FORM SUBMISSION*%0A%0A`;
    
    // Add all form fields to the message
    if (formValues.name) {
        message += `*👤 Name:* ${formValues.name}%0A`;
    }
    
    if (formValues.email) {
        message += `*📧 Email:* ${formValues.email}%0A`;
    }
    
    if (formValues.phone) {
        message += `*📞 Phone:* ${formValues.phone}%0A`;
    }
    
    if (formValues.subject) {
        const subjectNames = {
            'web-development': 'Web Development',
            'mobile-app': 'Mobile App Development',
            'management-system': 'Management System',
            'ecommerce': 'E-commerce Solution',
            'consultation': 'Free Consultation',
            'other': 'Other'
        };
        message += `*🎯 Subject:* ${subjectNames[formValues.subject] || formValues.subject}%0A`;
    }
    
    if (formValues.message) {
        message += `%0A*📝 Message:*%0A${formValues.message}%0A`;
    }
    
    if (formValues.newsletter) {
        message += `*📬 Newsletter:* Subscribed ✅%0A`;
    } else {
        message += `*📬 Newsletter:* Not Subscribed%0A`;
    }
    
    // Add timestamp and source
    message += `%0A---%0A`;
    message += `*📅 Date:* ${new Date().toLocaleDateString('en-KE')}%0A`;
    message += `*🕒 Time:* ${new Date().toLocaleTimeString('en-KE')}%0A`;
    message += `*🌐 Source:* Skydaddy Website Contact Form%0A`;
    message += `%0A_This message was sent automatically from your website contact form_`;
    
    console.log('WhatsApp message prepared');
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    console.log('Opening WhatsApp...');
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
    submitBtn.disabled = true;
    
    // Open WhatsApp in new tab
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        
        // Show success overlay
        showWhatsAppSuccessOverlay();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reset form after a delay
        setTimeout(() => {
            form.reset();
            
            // Reset character counter
            const counter = document.querySelector('.char-counter');
            if (counter) {
                counter.textContent = '0/500';
                counter.style.color = '#95a5a6';
            }
        }, 1000);
        
    }, 1000);
    
    return false;
}

// Show success overlay
function showWhatsAppSuccessOverlay() {
    // Remove any existing overlay
    const existing = document.querySelector('.whatsapp-success-overlay');
    if (existing) existing.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'whatsapp-success-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease-in-out;
    `;
    
    // Create success message box
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.5s ease-out;
    `;
    
    messageBox.innerHTML = `
        <div style="font-size: 60px; color: #25D366; margin-bottom: 20px;">
            <i class="fab fa-whatsapp"></i>
        </div>
        <h2 style="color: #333; margin-bottom: 15px; font-size: 24px;">
            Redirecting to WhatsApp!
        </h2>
        <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
            ✅ Your form has been submitted successfully<br>
            ✅ All your information has been captured<br>
            ✅ Opening WhatsApp to send your message
        </p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #333; margin: 0; font-weight: 600;">
                <i class="fas fa-phone-alt" style="color: #25D366;"></i>
                Messages are sent to: +${WHATSAPP_NUMBER}
            </p>
        </div>
        <p style="color: #777; font-size: 14px; margin-bottom: 25px;">
            If WhatsApp doesn't open automatically, 
            <a href="https://wa.me/${WHATSAPP_NUMBER}" 
               style="color: #25D366; font-weight: 600; text-decoration: none;"
               target="_blank">
               click here to open WhatsApp
            </a>
        </p>
        <button id="closeWhatsAppOverlay" 
                style="background: #25D366; color: white; border: none; 
                       padding: 12px 25px; border-radius: 5px; 
                       font-size: 16px; cursor: pointer; 
                       font-weight: 600; margin-top: 10px;">
            <i class="fas fa-check"></i> OK, Got It!
        </button>
    `;
    
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { 
                opacity: 0;
                transform: translateY(-30px) scale(0.9);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Close button functionality
    const closeBtn = document.getElementById('closeWhatsAppOverlay');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            overlay.style.animation = 'fadeOut 0.3s ease-in-out';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                    document.body.style.overflow = 'auto';
                }
            }, 300);
        });
    }
    
    // Auto-close after 8 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.style.animation = 'fadeOut 0.3s ease-in-out';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                    document.body.style.overflow = 'auto';
                }
            }, 300);
        }
    }, 8000);
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-in-out';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                    document.body.style.overflow = 'auto';
                }
            }, 300);
        }
    });
}

// Handle URL parameters for pre-filling subject
const urlParams = new URLSearchParams(window.location.search);
const subjectFromURL = urlParams.get('subject');
const serviceFromURL = urlParams.get('service');

document.addEventListener('DOMContentLoaded', function() {
    // Pre-fill subject if provided in URL
    if (subjectFromURL || serviceFromURL) {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            const valueToUse = subjectFromURL || serviceFromURL;
            subjectSelect.value = valueToUse;
            
            // Update message placeholder
            const messageTextarea = document.getElementById('message');
            if (messageTextarea) {
                const subjectText = subjectSelect.options[subjectSelect.selectedIndex]?.text || valueToUse;
                messageTextarea.placeholder = `I'm interested in ${subjectText}. Please provide more details about this service.`;
            }
        }
    }
    
    // Add some CSS for error styling
    const errorStyles = document.createElement('style');
    errorStyles.textContent = `
        .error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1) !important;
        }
        .error-message {
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            padding-left: 5px;
        }
        .char-counter {
            text-align: right;
            font-size: 0.8rem;
            color: #95a5a6;
            margin-top: 0.25rem;
            padding-right: 5px;
        }
    `;
    document.head.appendChild(errorStyles);
});

console.log('Skydaddy Contact Form WhatsApp Integration Loaded');
console.log('All form submissions will be sent to WhatsApp: +' + WHATSAPP_NUMBER);