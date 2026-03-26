// ============================================
// PURCHASE PAGE - JavaScript
// ============================================

// Store customer info
let customerInfo = {
    name: '',
    whatsapp: '',
    plan: '',
    price: ''
};

// Open Pre-Order Modal (called when clicking "اطلب الآن")
function openOrderModal(planName, price) {
    customerInfo.plan = planName;
    customerInfo.price = price;
    
    document.getElementById('selectedPlan').value = planName;
    document.getElementById('selectedPrice').value = price;
    
    const preOrderModal = document.getElementById('preOrderModal');
    preOrderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('customerName').focus();
    }, 100);
}

// Close Pre-Order Modal
function closePreOrderModal() {
    const preOrderModal = document.getElementById('preOrderModal');
    preOrderModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear form errors
    clearFormErrors();
}

// Clear form errors
function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.classList.remove('visible'));
    
    const inputs = document.querySelectorAll('#preOrderForm input');
    inputs.forEach(input => input.classList.remove('error'));
}

// Validate form
function validateForm() {
    let isValid = true;
    clearFormErrors();
    
    const nameInput = document.getElementById('customerName');
    const phoneInput = document.getElementById('whatsappNumber');
    
    // Validate name
    if (!nameInput.value.trim()) {
        document.getElementById('nameError').classList.add('visible');
        nameInput.classList.add('error');
        isValid = false;
    }
    
    // Validate phone (basic validation for Algerian numbers)
    const phoneRegex = /^(0|\+213|213)?[5-7]\d{8}$/;
    const cleanPhone = phoneInput.value.replace(/\s/g, '');
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        document.getElementById('phoneError').classList.add('visible');
        phoneInput.classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const preOrderForm = document.getElementById('preOrderForm');
    if (preOrderForm) {
        preOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                customerInfo.name = document.getElementById('customerName').value.trim();
                customerInfo.whatsapp = document.getElementById('whatsappNumber').value.trim();
                
                // Close pre-order modal
                closePreOrderModal();
                
                // Open confirmation modal with all info
                showOrderConfirmation();
            }
        });
    }
    
    // Observe animated elements
    const animateElements = document.querySelectorAll('.feature-item, .pricing-card, .contact-card, .faq-item');
    
    animateElements.forEach((el) => {
        observer.observe(el);
    });
    
    // Add section title animations
    document.querySelectorAll('.section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        titleObserver.observe(el);
    });
});

// Show order confirmation modal
function showOrderConfirmation() {
    const modal = document.getElementById('orderModal');
    
    document.getElementById('orderPlan').textContent = customerInfo.plan;
    document.getElementById('orderPrice').textContent = customerInfo.price + ' دج';
    document.getElementById('orderCustomerName').textContent = customerInfo.name;
    document.getElementById('orderWhatsapp').textContent = customerInfo.whatsapp;
    
    // Update WhatsApp link with pre-filled message
    const whatsappMessage = encodeURIComponent(
        `مرحباً، أريد شراء حساب ستيم\n` +
        `الباقة: ${customerInfo.plan}\n` +
        `السعر: ${customerInfo.price} دج\n` +
        `الاسم: ${customerInfo.name}\n` +
        `رقم الواتساب: ${customerInfo.whatsapp}`
    );
    const whatsappBtn = document.getElementById('orderWhatsappBtn');
    if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/213000000000?text=${whatsappMessage}`;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Order Modal
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    const form = document.getElementById('preOrderForm');
    if (form) form.reset();
    customerInfo = { name: '', whatsapp: '', plan: '', price: '' };
}

// Copy to Clipboard
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        const btn = element.nextElementSibling;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = 'var(--primary-color)';
        btn.style.color = 'var(--bg-dark)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeOrderModal();
        closePreOrderModal();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Animation on scroll - Enhanced
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
