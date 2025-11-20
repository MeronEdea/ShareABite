// Achievement definitions
const achievements = [
    {
        id: 'first_share',
        title: 'First Share',
        description: 'Share your first meal',
        icon: '🌟',
        requirement: { type: 'mealsShared', value: 1 }
    },
    {
        id: 'eco_warrior',
        title: 'Eco Warrior',
        description: 'Save 10kg of CO₂',
        icon: '🌍',
        requirement: { type: 'co2Saved', value: 10 }
    },
    {
        id: 'community_hero',
        title: 'Community Hero',
        description: 'Feed 10 people',
        icon: '🦸',
        requirement: { type: 'peopleFed', value: 10 }
    },
    {
        id: 'generous_giver',
        title: 'Generous Giver',
        description: 'Make 5 donations',
        icon: '💝',
        requirement: { type: 'totalDonations', value: 5 }
    },
    {
        id: 'meal_master',
        title: 'Meal Master',
        description: 'Share 25 meals',
        icon: '👨‍🍳',
        requirement: { type: 'mealsShared', value: 25 }
    },
    {
        id: 'planet_protector',
        title: 'Planet Protector',
        description: 'Save 50kg of CO₂',
        icon: '🌿',
        requirement: { type: 'co2Saved', value: 50 }
    }
];

// Initialize impact data from localStorage
function getImpactData() {
    const defaultData = {
        mealsShared: 0,
        co2Saved: 0,
        peopleFed: 0,
        totalDonations: 0,
        activities: [],
        unlockedAchievements: []
    };

    const stored = localStorage.getItem('shareABiteImpact');
    return stored ? JSON.parse(stored) : defaultData;
}

// Save impact data to localStorage
function saveImpactData(data) {
    localStorage.setItem('shareABiteImpact', JSON.stringify(data));
}

// Update impact statistics
function updateImpact(type, value, description) {
    const data = getImpactData();
    
    // Update the stat
    data[type] = (data[type] || 0) + value;
    
    // Add to activity log
    const activity = {
        date: new Date().toISOString(),
        text: description
    };
    data.activities.unshift(activity); // Add to beginning of array
    
    // Keep only last 10 activities
    if (data.activities.length > 10) {
        data.activities = data.activities.slice(0, 10);
    }
    
    // Check for new achievements
    checkAchievements(data);
    
    // Save data
    saveImpactData(data);
    
    // Refresh display
    displayImpact();
}

// Check if any achievements should be unlocked
function checkAchievements(data) {
    achievements.forEach(achievement => {
        // Skip if already unlocked
        if (data.unlockedAchievements.includes(achievement.id)) {
            return;
        }
        
        // Check if requirement is met
        const currentValue = data[achievement.requirement.type] || 0;
        if (currentValue >= achievement.requirement.value) {
            data.unlockedAchievements.push(achievement.id);
            
            // Show achievement notification
            showAchievementNotification(achievement);
        }
    });
}

// Show achievement notification
function showAchievementNotification(achievement) {
    alert(`🎉 Achievement Unlocked!\n\n${achievement.icon} ${achievement.title}\n${achievement.description}`);
}

// Display impact data on the page
function displayImpact() {
    const data = getImpactData();

    const mealsSharedEl = document.getElementById('mealsShared');
    const co2SavedEl = document.getElementById('co2Saved');
    const peopleFedEl = document.getElementById('peopleFed');
    const totalDonationsEl = document.getElementById('totalDonations');

    if (mealsSharedEl) mealsSharedEl.textContent = data.mealsShared || 0;
    if (co2SavedEl) co2SavedEl.textContent = (data.co2Saved || 0).toFixed(1);
    if (peopleFedEl) peopleFedEl.textContent = data.peopleFed || 0;
    if (totalDonationsEl) totalDonationsEl.textContent = data.totalDonations || 0;

    // These should also be guarded because the elements may not exist
    if (document.getElementById('achievementsGrid')) {
        displayAchievements(data);
    }

    if (document.getElementById('activityList')) {
        displayActivity(data);
    }
}


// Display achievements
function displayAchievements(data) {
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const isUnlocked = data.unlockedAchievements.includes(achievement.id);
        
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.description}</div>
        `;
        
        grid.appendChild(card);
    });
}

// Display recent activity
function displayActivity(data) {
    const list = document.getElementById('activityList');
    list.innerHTML = '';
    
    if (!data.activities || data.activities.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-inbox"></i>
                <p>No activity yet. Start sharing food to see your impact!</p>
                <a href="food_donation.html" class="btn btn-primary">Donate Food Now</a>
            </div>
        `;
        return;
    }
    
    data.activities.forEach(activity => {
        const item = document.createElement('li');
        item.className = 'activity-item';
        
        const date = new Date(activity.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        item.innerHTML = `
            <div class="activity-date">${formattedDate}</div>
            <div class="activity-text">${activity.text}</div>
        `;
        
        list.appendChild(item);
    });
}

// Reset all impact data
function resetImpact() {
    if (confirm('Are you sure you want to reset all your impact data? This cannot be undone.')) {
        localStorage.removeItem('shareABiteImpact');
        displayImpact();
        alert('✅ All impact data has been reset!');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only run if we're on the impact page
    if (document.getElementById('mealsShared')) {
        displayImpact();
    }
});

// Export functions for use in other files
window.updateImpact = updateImpact;
window.resetImpact = resetImpact;