// ============================================
// PURCHASE PAGE - JavaScript
// ============================================

// Open Order Modal
function openOrderModal(planName, price) {
    const modal = document.getElementById('orderModal');
    document.getElementById('orderPlan').textContent = planName;
    document.getElementById('orderPrice').textContent = price + ' دج';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Order Modal
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
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

// Animate elements on load
document.addEventListener('DOMContentLoaded', () => {
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
