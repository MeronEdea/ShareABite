// Toggle mobile menu
function toggleMenu() {
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

document.addEventListener('DOMContentLoaded', function () {

    // Close mobile menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    const dropdown = document.querySelector('.dropdown');

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            const navLinks = document.getElementById('navLinks');

            // Only close if it's not the dropdown toggle
            if (!link.classList.contains('dropdown-toggle')) {
                navLinks.classList.remove('active');

                // Change icon back to hamburger
                if (menuBtn) {
                    menuBtn.classList.remove('fa-xmark');
                    menuBtn.classList.add('fa-bars');
                }

                // Close dropdown if open
                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Don't prevent default for dropdown toggle
            if (this.classList.contains('dropdown-toggle')) {
                return;
            }

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Toggle dropdown in mobile menu
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', function (e) {
            // Only work on mobile (768px and below)
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    }

    // Toggle dropdown in mobile menu
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function (e) {
                // Only work on mobile (768px and below)
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    document.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        const navLinks = document.getElementById('navLinks');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

        // Check if click is outside nav and menu is open
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');

                if (menuBtn) {
                    menuBtn.classList.remove('fa-xmark');
                    menuBtn.classList.add('fa-bars');
                }

                if (dropdown) {
                    dropdown.classList.remove('active');
                }
            }
        }
    });

    // Add active state to current page nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinksItems.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active-page');
        }
    });
});

// Toggle anonymous donation
function toggleAnonymous() {
    const isAnonymous = document.getElementById('anonymous').checked;
    const donorDetails = document.getElementById('donorDetails');

    if (isAnonymous) {
        donorDetails.style.display = 'none';
        document.getElementById('donorName').removeAttribute('required');
        document.getElementById('donorEmail').removeAttribute('required');
    } else {
        donorDetails.style.display = 'block';
        document.getElementById('donorName').setAttribute('required', 'required');
        document.getElementById('donorEmail').setAttribute('required', 'required');
    }
}

// Handle donation form submission
function handleDonation(event) {
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
    if (!donationAmount || donationAmount <= 0) {
        alert('Please enter a valid donation amount!');
        return;
    }

    if (!isAnonymous && (!donorName || !donorEmail)) {
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

    // Create donation data object
    const donationData = {
        amount: donationAmount,
        currency: currency,
        anonymous: isAnonymous,
        name: isAnonymous ? 'Anonymous' : donorName,
        email: isAnonymous ? 'N/A' : donorEmail,
        message: donorMessage || 'No message provided',
        timestamp: new Date().toISOString()
    };

    // Log donation data (in production, send to server)
    console.log('Donation submitted:', donationData);

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

// Handle application form submission
function handleSubmit(event) {
    event.preventDefault();

    // Get form values
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();

    // Get dietary preferences
    const dietaryPreferences = [];
    document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked').forEach(checkbox => {
        dietaryPreferences.push(checkbox.value);
    });

    const allergies = document.getElementById('allergies').value.trim();
    const reason = document.getElementById('reason').value.trim();

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

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number');
        return;
    }

    // Create application data object
    const applicationData = {
        fullname: fullname,
        email: email,
        phone: phone,
        location: location,
        dietaryPreferences: dietaryPreferences.length > 0 ? dietaryPreferences.join(', ') : 'None specified',
        allergies: allergies || 'None',
        reason: reason || 'Not provided',
        timestamp: new Date().toISOString()
    };

    // Log application data (in production, send to server)
    console.log('Application submitted:', applicationData);

    // Show success message
    alert(`✅ Application submitted successfully!\n\nThank you, ${fullname}! We'll review your application and connect you with food sharers in your area within 24 hours.\n\nA confirmation email will be sent to ${email}.`);

    // Clear form
    document.querySelector('.application-form').reset();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show loading state for buttons
function showLoading(buttonElement, loadingText = 'Processing...') {
    buttonElement.disabled = true;
    buttonElement.dataset.originalText = buttonElement.textContent;
    buttonElement.textContent = loadingText;
}

// Hide loading state for buttons
function hideLoading(buttonElement) {
    buttonElement.disabled = false;
    buttonElement.textContent = buttonElement.dataset.originalText;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Format currency display
function formatCurrency(amount, currency) {
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

    const symbol = symbols[currency] || '$';
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
}

// Handle desktop dropdown for Donate button
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    
    // Desktop dropdown handling for Donate button
    const donateDropdown = document.querySelectorAll('.nav-links > .dropdown');
    
    donateDropdown.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (window.innerWidth > 768) {
            // Desktop behavior - hover
            dropdown.addEventListener('mouseenter', function() {
                menu.style.display = 'flex';
            });
            
            dropdown.addEventListener('mouseleave', function() {
                menu.style.display = 'none';
            });
        } else {
            // Mobile behavior - click
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }
        }
    });
});

function animateOnScroll() {
    const elements = document.querySelectorAll('.step, .feature, .impact-stats');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Call animation function when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

function handleFoodDonation(event) {
    console.log('handleFoodDonation triggered');
    const anonymous = document.getElementById('anonymous').checked;
    const donorFullName = document.getElementById('donorFullName').value;
    const donorEmail = document.getElementById('donorEmail').value;
    const donorPhone = document.getElementById('donorPhone').value;
    if (!anonymous && donorFullName === "" && donorEmail === "" && donorPhone === "") {
        alert('Please enter your name, email, and phone or donate anonymously!')
    }

    const preparedDate = new Date (document.getElementById('preparedDate').value);
    const expiryDate = new Date (document.getElementById('expiryDate').value);
    const purchaseDate = new Date (document.getElementById('purchaseDate').value);
    const today = new Date(); 
}

const today = new Date().toISOString().split("T")[0];
document.getElementById("preparedDate").setAttribute("max", today);
document.getElementById("purchaseDate").setAttribute("max", today);

const expiryDate = document.getElementById("expiryDate");
const preparedDate = document.getElementById("preparedDate");
const purchaseDate = document.getElementById("purchaseDate");

preparedDate.addEventListener("change", function(){
    if(this.value){
        expiryDate.setAttribute("min", this.value);
    } else{
        expiryDate.removeAttribute("min");
    }
});

purchaseDate.addEventListener("change", function(){
    if(this.value){
        expiryDate.setAttribute("min", this.value);
    } else{
        expiryDate.removeAttribute("min");
    }
});

function toggleFoodDonationAnonymous() {
    const anonymous = document.getElementById('anonymous').checked;
    const donorFullName = document.getElementById('fullName');
    const donorEmail = document.getElementById('Email');
    const donorPhone = document.getElementById('Phone');

    if (anonymous) {
        donorFullName.style.display = 'none';
        donorEmail.style.display = 'none';
        donorPhone.style.display = 'none';
    } else {
        donorFullName.style.display = 'block';
        donorEmail.style.display = 'block';
        donorPhone.style.display = 'block';
    }
}

const subCategories = {
    cooked: [
        'Soups',
        'Fried Rice',
        'Kokonte',
        'Fufu',
    ],
    raw: [
        'Fruits',
        'Vegetables',
        'Chicken',
        'Fish',
        'Beef',
        'Beans'
    ],
    processed: [
        'Canned Foods',
        'Rice',
        'Bottled Drinks',
        'Snacks'
    ],
    baked: [
        'Bread',
        'Cookies',
        'Buns',
        'Rolls',
        'Croissant'
    ]
};


document.getElementById('foodCategory').addEventListener("change", function(){
    const category = this.value;
    const subCategory = document.getElementById("foodSubCategory");

    subCategory.innerHTML = "<option value=''>Select Specific Item</option>"

    if(subCategories[category]){
        subCategories[category].forEach(item => {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            subCategory.appendChild(option);
        });
    }
});