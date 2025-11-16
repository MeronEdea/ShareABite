// Toggle mobile menu
function toggleMenu(){
    const navLinks = document.getElementById("navLinks");
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    navLinks.classList.toggle('active');
    
    // Change icon between hamburger and X
    if (navLinks.classList.contains('active')) {
        menuBtn.classList.remove('fa-bars');
        menuBtn.classList.add('fa-xmark');
    } else {
        menuBtn.classList.remove('fa-xmark');
        menuBtn.classList.add('fa-bars');
    }
}
// Scroll to top when logo is clicked
function scrollToTop(event) {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const menuBtn = document.querySelector('.mobile-menu-btn i');

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('navLinks').classList.remove('active');
            // Change icon back to hamburger
            menuBtn.classList.remove('fa-xmark');
            menuBtn.classList.add('fa-bars');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
});

function toggleAnonymous(){
    const isAnonymous = document.getElementById('anonymous').checked;
    const donorDetails = document.getElementById('donorDetails');
    if(isAnonymous){
        donorDetails.style.display = 'none';
        document.getElementById('donorName').removeAttribute('required');
        document.getElementById('donorEmail').removeAttribute('required');
    } else{
        donorDetails.style.display = 'block';
        document.getElementById('donorName').setAttribute('required', 'required');
        document.getElementById('donorEmail').setAttribute('required', 'required');
    }
}

function handleSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    
    // Get dietary preferences
    const dietaryPreferences = [];
    document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked').forEach(checkbox => {
        dietaryPreferences.push(checkbox.value);
    });
    
    const allergies = document.getElementById('allergies').value;
    const reason = document.getElementById('reason').value;
    
    // Basic validation
    if (!fullname || !email || !phone || !location) {
        alert('Please fill in all required fields (Full Name, Email, Phone Number, and Location)');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Show success message
    alert(`✅ Application submitted successfully!\n\nThank you, ${fullname}! We'll review your application and connect you with food sharers in your area within 24 hours.\n\nA confirmation email will be sent to ${email}.`);
    
    // Clear form
    document.querySelector('.application-form').reset();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleDonation(event){
    event.preventDefault();
    
    const donationAmount = document.getElementById('donationAmount').value;
    const currency = document.getElementById('currency').value;
    const isAnonymous = document.getElementById('anonymous').checked;
    const donorName = document.getElementById('donorName').value;
    const donorEmail = document.getElementById('donorEmail').value;
    const donorMessage = document.getElementById('donormessage').value;
    
    // Get currency symbol
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'NGN': '₦',
        'GHS': '₵',
        'KES': 'KSh',
        'CAD': 'C$',
        'ETB': 'Br'
    };
    const currencySymbol = symbols[currency] || '$';

    // Validation
    if (!donationAmount || donationAmount <= 0){
        alert('Please enter a valid donation amount!');
        return;
    }
    
    if (!isAnonymous && (!donorName || !donorEmail)){
        alert('Please fill in your name and email or choose to donate anonymously!');
        return;
    }
    
    // Email validation if not anonymous
    if (!isAnonymous) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(donorEmail)) {
            alert('Please enter a valid email address');
            return;
        }
    }

    // Show success message
    const thankYouMessage = isAnonymous 
        ? `✅ Thank you for your ${currencySymbol}${donationAmount} ${currency} donation!\n\nYour generous contribution is helping build stronger communities and reduce food waste.`
        : `✅ Thank you, ${donorName}, for your ${currencySymbol}${donationAmount} ${currency} donation!\n\nYour generous contribution is helping build stronger communities and reduce food waste.\n\nA confirmation receipt will be sent to ${donorEmail}.`;
    
    alert(thankYouMessage);
    
    // Clear form
    document.getElementById('donationAmount').value = '';
    document.getElementById('currency').value = 'USD';
    document.getElementById('donorName').value = '';
    document.getElementById('donorEmail').value = '';
    document.getElementById('donormessage').value = '';
    document.getElementById('anonymous').checked = false;
    document.getElementById('donorDetails').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}