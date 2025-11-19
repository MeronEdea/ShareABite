// User's current location
let userLocation = null;

// Sample food donations (in production, this would come from a database)
let foodDonations = [];

// Initialize location features
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the browse page
    if (document.getElementById('foodGrid')) {
        loadSampleDonations();
        checkSavedLocation();
    }
});

// Check if user has previously shared location
function checkSavedLocation() {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
        userLocation = JSON.parse(saved);
        showFoodDonations();
    }
}

// Request user's location
function requestLocation() {
    const prompt = document.getElementById('locationPrompt');
    const loading = document.getElementById('loadingState');
    
    // Show loading state
    prompt.style.display = 'none';
    loading.style.display = 'block';
    
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Success - got location
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                // Save location to localStorage
                localStorage.setItem('userLocation', JSON.stringify(userLocation));
                
                // Hide loading, show food donations
                loading.style.display = 'none';
                showFoodDonations();
            },
            function(error) {
                // Error getting location
                loading.style.display = 'none';
                prompt.style.display = 'block';
                
                let errorMessage = 'Unable to get your location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please enable location permissions in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                }
                
                alert(errorMessage);
            }
        );
    } else {
        loading.style.display = 'none';
        prompt.style.display = 'block';
        alert('Geolocation is not supported by your browser. Please use a modern browser like Chrome, Firefox, or Safari.');
    }
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Format distance for display
function formatDistance(km) {
    if (km < 1) {
        return Math.round(km * 1000) + ' m away';
    } else {
        return km.toFixed(1) + ' km away';
    }
}

// Load food donations (combines sample + real user donations)
function loadSampleDonations() {
    // Get real donations from localStorage
    const realDonations = JSON.parse(localStorage.getItem('foodDonations') || '[]');
    
    // Convert real donations to display format
    const convertedRealDonations = realDonations
        .filter(d => d.latitude && d.longitude) // Only show donations with location
        .map(d => ({
            id: d.id,
            title: d.foodSubCategory || d.foodCategory,
            category: d.foodCategory,
            description: `${d.quantity} servings available. ${d.expiryDate ? 'Best before: ' + new Date(d.expiryDate).toLocaleDateString() : ''}`,
            quantity: parseInt(d.quantity) || 1,
            latitude: d.latitude,
            longitude: d.longitude,
            donorName: d.donorName || 'Anonymous',
            emoji: getCategoryEmoji(d.foodCategory),
            timestamp: new Date(d.timestamp)
        }));
    
    // Sample donations for demonstration
    const sampleDonations = [
        {
            id: 1,
            title: 'Fresh Jollof Rice',
            category: 'cooked',
            description: 'Made too much jollof rice for dinner. Freshly cooked today, enough for 4 servings.',
            quantity: 4,
            latitude: 6.5244 + (Math.random() - 0.5) * 0.1, // Lagos + random offset
            longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
            donorName: 'Amina K.',
            emoji: '🍛',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
            id: 2,
            title: 'Banku with Tilapia',
            category: 'cooked',
            description: 'Traditional Ghanaian meal with grilled tilapia. Perfect for 3 people.',
            quantity: 3,
            latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
            longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
            donorName: 'Kwame A.',
            emoji: '🐟',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        },
        {
            id: 3,
            title: 'Fresh Vegetables',
            category: 'raw',
            description: 'Garden fresh tomatoes, peppers, and onions. Great for cooking.',
            quantity: 5,
            latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
            longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
            donorName: 'Grace O.',
            emoji: '🥬',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
        },
        {
            id: 4,
            title: 'Homemade Bread',
            category: 'baked',
            description: 'Freshly baked this morning. 2 loaves available.',
            quantity: 2,
            latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
            longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
            donorName: 'David M.',
            emoji: '🍞',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
        },
        {
            id: 5,
            title: 'Canned Foods Variety',
            category: 'processed',
            description: 'Canned beans, corn, and tomatoes. All unopened and well within expiry date.',
            quantity: 8,
            latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
            longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
            donorName: 'Sarah L.',
            emoji: '🥫',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        },
        {
            id: 6,
            title: 'Fried Rice & Chicken',
            category: 'cooked',
            description: 'Party leftovers! Delicious fried rice with grilled chicken for 5 people.',
            quantity: 5,
            latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
            longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
            donorName: 'Michael B.',
            emoji: '🍗',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        }
    ];
    
    // Combine real donations with sample donations
    foodDonations = [...convertedRealDonations, ...sampleDonations];
}

// Get emoji based on food category
function getCategoryEmoji(category) {
    const emojiMap = {
        'cooked': '🍛',
        'raw': '🥬',
        'processed': '🥫',
        'baked': '🍞'
    };
    return emojiMap[category] || '🍽️';
}

// Show food donations with location
function showFoodDonations() {
    document.getElementById('locationPrompt').style.display = 'none';
    document.getElementById('filtersContainer').style.display = 'block';
    
    // Calculate distances for all donations
    foodDonations = foodDonations.map(donation => {
        donation.distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            donation.latitude,
            donation.longitude
        );
        return donation;
    });
    
    // Apply filters and display
    applyFilters();
}

// Apply filters to food donations
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const distanceFilter = parseFloat(document.getElementById('distanceFilter').value);
    const sortFilter = document.getElementById('sortFilter').value;
    
    let filtered = [...foodDonations];
    
    // Filter by category
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(d => d.category === categoryFilter);
    }
    
    // Filter by distance
    if (!isNaN(distanceFilter)) {
        filtered = filtered.filter(d => d.distance <= distanceFilter);
    }
    
    // Sort
    switch(sortFilter) {
        case 'distance':
            filtered.sort((a, b) => a.distance - b.distance);
            break;
        case 'recent':
            filtered.sort((a, b) => b.timestamp - a.timestamp);
            break;
        case 'quantity':
            filtered.sort((a, b) => b.quantity - a.quantity);
            break;
    }
    
    // Display
    displayFoodDonations(filtered);
}

// Display food donations with contact buttons
function displayFoodDonations(donations) {
    const grid = document.getElementById('foodGrid');
    
    if (donations.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-plate-wheat"></i>
                <h3>No Food Donations Found</h3>
                <p>Try adjusting your filters or check back later for new donations.</p>
                <a href="food_donation.html" class="btn btn-primary">Donate Food</a>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = donations.map(donation => `
        <div class="food-card">
            <div class="food-image">
                ${donation.emoji}
            </div>
            <div class="food-content">
                <div class="food-header">
                    <div>
                        <div class="food-title">${donation.title}</div>
                        <span class="food-category">${donation.category}</span>
                    </div>
                    <div class="distance-badge">${formatDistance(donation.distance)}</div>
                </div>
                
                <div class="food-info">
                    <div class="info-row">
                        <i class="fa-solid fa-utensils"></i>
                        <span>${donation.quantity} servings available</span>
                    </div>
                    <div class="info-row">
                        <i class="fa-solid fa-clock"></i>
                        <span>${getTimeAgo(donation.timestamp)}</span>
                    </div>
                    <div class="info-row">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${formatDistance(donation.distance)}</span>
                    </div>
                </div>
                
                <div class="food-description">
                    ${donation.description}
                </div>
                
                <div class="donor-info">
                    <div class="donor-avatar">${donation.donorName.charAt(0)}</div>
                    <div class="donor-name">${donation.donorName}</div>
                </div>
                
                <div class="food-actions">
                    <button class="claim-btn" onclick="claimFood(${donation.id})">
                        <i class="fa-solid fa-hand-holding-heart"></i> Request Food
                    </button>
                    <button class="contact-btn" onclick="contactDonor(${donation.id})">
                        <i class="fa-solid fa-message"></i> Chat with Donor
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get time ago format
function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    }
}

// Claim food donation
function claimFood(donationId) {
    const donation = foodDonations.find(d => d.id === donationId);
    
    if (!donation) return;
    
    const message = `You're requesting: ${donation.title}\n\nDistance: ${formatDistance(donation.distance)}\nDonor: ${donation.donorName}\n\nWe'll connect you with the donor via email/SMS to arrange pickup!`;
    
    if (confirm(message)) {
        alert('✅ Request sent successfully!\n\nThe donor will be notified and will contact you shortly to arrange pickup.');
        
        // Update impact tracking
        if (typeof updateImpact === 'function') {
            updateImpact('peopleFed', 1, `🤝 Requested ${donation.title} from ${donation.donorName}`);
        }
    }
}

// Export functions
window.requestLocation = requestLocation;
window.applyFilters = applyFilters;
window.claimFood = claimFood;

// Contact donor directly via chat
function contactDonor(donationId) {
    const donation = foodDonations.find(d => d.id === donationId);
    
    if (!donation) return;
    
    console.log('Opening chat for donation:', donation);
    
    // Make sure chat widget is visible and initialized
    const chatWidget = document.getElementById('chatWidget');
    if (!chatWidget) {
        console.error('Chat widget not found! Make sure it\'s included in location.html');
        alert('Chat feature not available on this page.');
        return;
    }
    
    // Ensure chat is expanded and visible
    chatWidget.style.display = 'block';
    chatWidget.classList.remove('collapsed');
    
    // Update chat header with food context
    const chatHeader = chatWidget.querySelector('.chat-header h3');
    if (chatHeader) {
        chatHeader.textContent = `Chat: ${donation.title}`;
    }
    
    // Add context message about the food
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        // Clear existing messages and add context
        chatMessages.innerHTML = '';
        
        const systemMessage = document.createElement('div');
        systemMessage.classList.add('message', 'system-message');
        systemMessage.innerHTML = `
            <p><strong>Chatting about ${donation.title}</strong></p>
            <p>Donor: ${donation.donorName}</p>
            <p>Distance: ${formatDistance(donation.distance)}</p>
            <p>Quantity: ${donation.quantity} servings</p>
            <small>Use this chat to coordinate pickup details!</small>
        `;
        chatMessages.appendChild(systemMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Focus on chat input with helpful placeholder
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.placeholder = `Message about ${donation.title}...`;
        chatInput.focus();
    }
    
    // Scroll to chat widget smoothly
    setTimeout(() => {
        chatWidget.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    
    console.log(`Chat opened for: ${donation.title} from ${donation.donorName}`);
}