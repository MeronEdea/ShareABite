// Show success modal
function showSuccessModal(message, title = 'Success!') {
    const modal = document.getElementById('successModal');
    if (!modal) {
        console.error('Success modal not found');
        alert(message); // Fallback to alert
        return;
    }
    document.getElementById('successModalTitle').textContent = title;
    document.getElementById('successModalMessage').textContent = message;
    modal.classList.add('show');
}

// Show error modal
function showErrorModal(message, title = 'Error') {
    const modal = document.getElementById('errorModal');
    if (!modal) {
        console.error('Error modal not found');
        alert(message); // Fallback to alert
        return;
    }
    document.getElementById('errorModalTitle').textContent = title;
    document.getElementById('errorModalMessage').textContent = message;
    modal.classList.add('show');
}

// Show info modal
function showInfoModal(message, title = 'Information') {
    const modal = document.getElementById('infoModal');
    if (!modal) {
        console.error('Info modal not found');
        alert(message); // Fallback to alert
        return;
    }
    document.getElementById('infoModalTitle').textContent = title;
    document.getElementById('infoModalMessage').textContent = message;
    modal.classList.add('show');
}

// Show confirm modal with callback
function showConfirmModal(message, onConfirm, title = 'Confirm Action') {
    const modal = document.getElementById('confirmModal');
    if (!modal) {
        console.error('Confirm modal not found');
        if (confirm(message)) { // Fallback to confirm
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        }
        return;
    }
    
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').textContent = message;
    
    const confirmBtn = document.getElementById('confirmModalBtn');
    
    // Remove old event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', function() {
        closeModal('confirmModal');
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    });
    
    modal.classList.add('show');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

// Export functions to window object
window.showSuccessModal = showSuccessModal;
window.showErrorModal = showErrorModal;
window.showInfoModal = showInfoModal;
window.showConfirmModal = showConfirmModal;
window.closeModal = closeModal;