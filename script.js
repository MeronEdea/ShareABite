// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const menuBtn = document.querySelector('.mobile-menu-btn i');

    navLinks.classList.toggle('active');

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
    const navLinks = document.getElementById("navLinks");
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Handle all dropdowns (both desktop and mobile)
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                
                dropdown.classList.toggle('active');
            });
        }
    });

    document.addEventListener('click', function (e) {
        let clickedInsideDropdown = false;
        dropdowns.forEach(dropdown => {
            if (dropdown.contains(e.target)) {
                clickedInsideDropdown = true;
            }
        });

        if (!clickedInsideDropdown) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });

            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (menuBtn) {
                    menuBtn.classList.remove('fa-xmark');
                    menuBtn.classList.add('fa-bars');
                }
            }
        });
    });

    const regularNavLinks = document.querySelectorAll('.nav-links > a:not(.dropdown-toggle)');
    regularNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (menuBtn) {
                    menuBtn.classList.remove('fa-xmark');
                    menuBtn.classList.add('fa-bars');
                }
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (this.classList.contains('dropdown-toggle')) {
                return;
            }

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

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-links a:not(.dropdown-item)');
    allNavLinks.forEach(link => {
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

    const symbols = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'NGN': '₦',
        'GHS': '₵', 'KES': 'KSh', 'CAD': 'C$', 'ETB': 'Br'
    };
    const currencySymbol = symbols[currency] || '$';

    // Validation
    if (!donationAmount || donationAmount <= 0) {
        showErrorModal('Please enter a valid donation amount!');
        return;
    }

    if (!isAnonymous && (!donorName || !donorEmail)) {
        showErrorModal('Please fill in your name and email or choose to donate anonymously!');
        return;
    }

    if (!isAnonymous) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(donorEmail)) {
            showErrorModal('Please enter a valid email address');
            return;
        }
    }

    const donationData = {
        amount: donationAmount,
        currency: currency,
        anonymous: isAnonymous,
        name: isAnonymous ? 'Anonymous' : donorName,
        email: isAnonymous ? 'N/A' : donorEmail,
        message: donorMessage || 'No message provided',
        timestamp: new Date().toISOString()
    };

    console.log('Donation submitted:', donationData);

    if (typeof updateImpact === 'function') {
        updateImpact('totalDonations', 1, `💰 Donated ${currencySymbol}${donationAmount} ${currency}`);
    }

    const thankYouMessage = isAnonymous
        ? `Thank you for your ${currencySymbol}${donationAmount} ${currency} donation!\n\nYour generous contribution is helping build stronger communities and reduce food waste.`
        : `Thank you, ${donorName}, for your ${currencySymbol}${donationAmount} ${currency} donation!\n\nYour generous contribution is helping build stronger communities and reduce food waste.\n\nA confirmation receipt will be sent to ${donorEmail}.`;

    showSuccessModal(thankYouMessage, '✅ Donation Successful!');

    // Clear form
    document.getElementById('donationAmount').value = '';
    document.getElementById('currency').value = 'USD';
    document.getElementById('donorName').value = '';
    document.getElementById('donorEmail').value = '';
    document.getElementById('donormessage').value = '';
    document.getElementById('anonymous').checked = false;
    document.getElementById('donorDetails').style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();

    const dietaryPreferences = [];
    document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked').forEach(checkbox => {
        dietaryPreferences.push(checkbox.value);
    });

    const allergies = document.getElementById('allergies').value.trim();
    const reason = document.getElementById('reason').value.trim();

    // Validation
    if (!fullname || !email || !phone || !location) {
        showErrorModal('Please fill in all required fields (Full Name, Email, Phone Number, and Location)');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showErrorModal('Please enter a valid email address');
        return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        showErrorModal('Please enter a valid phone number');
        return;
    }

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

    console.log('Application submitted:', applicationData);

    // Update impact tracking
    if (typeof updateImpact === 'function') {
        updateImpact('peopleFed', 1, `🤝 ${fullname} submitted application to receive food`);
    }

    // Show success modal
    showSuccessModal(
        `Thank you, ${fullname}! We'll review your application and connect you with food sharers in your area within 24 hours.\n\nA confirmation email will be sent to ${email}.`,
        '✅ Application Submitted!'
    );

    // Clear form after a short delay to ensure modal is shown
    setTimeout(() => {
        // Reset form fields
        document.getElementById('fullname').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('location').value = '';
        document.getElementById('allergies').value = '';
        document.getElementById('reason').value = '';
        
        // Uncheck all dietary preference checkboxes
        document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
}

function showLoading(buttonElement, loadingText = 'Processing...') {
    buttonElement.disabled = true;
    buttonElement.dataset.originalText = buttonElement.textContent;
    buttonElement.textContent = loadingText;
}

function hideLoading(buttonElement) {
    buttonElement.disabled = false;
    buttonElement.textContent = buttonElement.dataset.originalText;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatCurrency(amount, currency) {
    const symbols = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'NGN': '₦',
        'GHS': '₵', 'KES': 'KSh', 'CAD': 'C$', 'ETB': 'Br'
    };
    const symbol = symbols[currency] || '$';
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.step, .feature, .impact-stats');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

function saveFoodDonation(donationData) {
    const donations = JSON.parse(localStorage.getItem('foodDonations') || '[]');
    donationData.id = Date.now();
    donations.push(donationData);
    localStorage.setItem('foodDonations', JSON.stringify(donations));
    console.log('Food donation saved:', donationData);
}

function getAllFoodDonations() {
    return JSON.parse(localStorage.getItem('foodDonations') || '[]');
}

const today = new Date().toISOString().split("T")[0];
document.getElementById("preparedDate")?.setAttribute("max", today);
document.getElementById("purchaseDate")?.setAttribute("max", today);

const expiryDate = document.getElementById("expiryDate");
const preparedDate = document.getElementById("preparedDate");
const purchaseDate = document.getElementById("purchaseDate");

preparedDate?.addEventListener("change", function(){
    if(this.value){
        expiryDate.setAttribute("min", this.value);
    } else{
        expiryDate.removeAttribute("min");
    }
});

purchaseDate?.addEventListener("change", function(){
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
    cooked: ['Soups', 'Fried Rice', 'Kokonte', 'Fufu'],
    raw: ['Fruits', 'Vegetables', 'Chicken', 'Fish', 'Beef', 'Beans'],
    processed: ['Canned Foods', 'Rice', 'Bottled Drinks', 'Snacks'],
    baked: ['Bread', 'Cookies', 'Buns', 'Rolls', 'Croissant']
};

document.getElementById('foodCategory')?.addEventListener("change", function(){
    console.log('foodCategory triggered0');
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

// Add this function to your script.js file

function handleFoodDonation(event) {
    event.preventDefault();

    // Get form values
    const anonymous = document.getElementById('anonymous').checked;
    const donorFullName = document.getElementById('donorFullName')?.value.trim();
    const donorEmail = document.getElementById('donorEmail')?.value.trim();
    const donorPhone = document.getElementById('donorPhone')?.value.trim();
    const donorLocation = document.getElementById('donorLocation').value.trim();
    
    const foodCategory = document.getElementById('foodCategory').value;
    const foodSubCategory = document.getElementById('foodSubCategory').value;
    const foodDescription = document.getElementById('foodDescription').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const servingSize = document.getElementById('servingSize').value;
    const preparedDate = document.getElementById('preparedDate')?.value;
    const expiryDate = document.getElementById('expiryDate').value;
    const purchaseDate = document.getElementById('purchaseDate')?.value;
    const allergens = document.getElementById('allergens').value.trim();
    const ingredients = document.getElementById('ingredients')?.value.trim();
    const agreement = document.getElementById('foodSubmitAgreement').checked;

    // Get dietary information
    const dietaryInfo = [];
    document.querySelectorAll('#dietaryInfo input[type="checkbox"]:checked').forEach(checkbox => {
        dietaryInfo.push(checkbox.value);
    });

    // Validation
    if (!anonymous && (!donorFullName || !donorEmail || !donorPhone)) {
        showErrorModal('Please fill in your contact information or choose to donate anonymously.');
        return;
    }

    if (!donorLocation) {
        showErrorModal('Please enter your location.');
        return;
    }

    if (!foodCategory || !foodSubCategory) {
        showErrorModal('Please select a food category and specific item.');
        return;
    }

    if (!quantity || !servingSize) {
        showErrorModal('Please enter quantity and serving size.');
        return;
    }

    if (!expiryDate) {
        showErrorModal('Please enter the expiry/best before date.');
        return;
    }

    if (!agreement) {
        showErrorModal('Please confirm that the food is safe for consumption.');
        return;
    }

    // Email validation if not anonymous
    if (!anonymous && donorEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(donorEmail)) {
            showErrorModal('Please enter a valid email address.');
            return;
        }
    }

    // Create donation data object
    const donationData = {
        anonymous: anonymous,
        donorName: anonymous ? 'Anonymous' : donorFullName,
        donorEmail: anonymous ? 'N/A' : donorEmail,
        donorPhone: anonymous ? 'N/A' : donorPhone,
        location: donorLocation,
        foodCategory: foodCategory,
        foodSubCategory: foodSubCategory,
        description: foodDescription || 'No additional description',
        quantity: quantity,
        servingSize: servingSize,
        preparedDate: preparedDate || 'N/A',
        expiryDate: expiryDate,
        purchaseDate: purchaseDate || 'N/A',
        dietaryInfo: dietaryInfo.length > 0 ? dietaryInfo.join(', ') : 'None specified',
        allergens: allergens || 'None',
        ingredients: ingredients || 'Not specified',
        timestamp: new Date().toISOString(),
        id: Date.now()
    };

    // Try to get user's location for better matching
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                donationData.latitude = position.coords.latitude;
                donationData.longitude = position.coords.longitude;
                saveDonation(donationData);
            },
            function(error) {
                console.log('Location not available:', error);
                saveDonation(donationData);
            }
        );
    } else {
        saveDonation(donationData);
    }
}

function saveDonation(donationData) {
    // Save to localStorage
    const donations = JSON.parse(localStorage.getItem('foodDonations') || '[]');
    donations.push(donationData);
    localStorage.setItem('foodDonations', JSON.stringify(donations));
    
    console.log('Food donation saved:', donationData);

    // Update impact tracking
    if (typeof updateImpact === 'function') {
        const servings = parseInt(donationData.servingSize.split('-')[1] || donationData.servingSize.replace('+', '')) || 1;
        updateImpact('mealsShared', servings, `🍽️ Donated ${donationData.foodSubCategory}`);
        updateImpact('co2Saved', servings * 2.5, `🌍 Saved ${(servings * 2.5).toFixed(1)}kg CO₂`);
    }

    // Show success message
    const successMessage = donationData.anonymous 
        ? `Thank you for donating ${donationData.foodSubCategory}!\n\nYour generous contribution will help feed people in your community.\n\nYou can view and manage your donation on the Browse Food page.`
        : `Thank you, ${donationData.donorName}, for donating ${donationData.foodSubCategory}!\n\nYour generous contribution will help feed people in your community.\n\nYou can view and manage your donation on the Browse Food page.\n\nA confirmation will be sent to ${donationData.donorEmail}.`;

    showSuccessModal(successMessage, '✅ Food Donation Submitted!');

    // Clear form after short delay
    setTimeout(() => {
        // Reset all form fields
        document.getElementById('anonymous').checked = false;
        document.getElementById('donorFullName').value = '';
        document.getElementById('donorEmail').value = '';
        document.getElementById('donorPhone').value = '';
        document.getElementById('donorLocation').value = '';
        document.getElementById('foodCategory').value = '';
        document.getElementById('foodSubCategory').innerHTML = '<option value="">Select Specific Item</option>';
        document.getElementById('foodDescription').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('servingSize').value = '';
        if (document.getElementById('preparedDate')) document.getElementById('preparedDate').value = '';
        document.getElementById('expiryDate').value = '';
        if (document.getElementById('purchaseDate')) document.getElementById('purchaseDate').value = '';
        document.getElementById('allergens').value = '';
        if (document.getElementById('ingredients')) document.getElementById('ingredients').value = '';
        document.getElementById('foodSubmitAgreement').checked = false;
        
        // Uncheck all dietary checkboxes
        document.querySelectorAll('#dietaryInfo input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Show donor fields again
        document.getElementById('fullName').style.display = 'block';
        document.getElementById('Email').style.display = 'block';
        document.getElementById('Phone').style.display = 'block';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
}