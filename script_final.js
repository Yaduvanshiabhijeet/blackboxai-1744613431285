// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    if (document.getElementById('map')) {
        const map = L.map('map').setView([20.5937, 78.9629], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }

    // Form handlers
    document.getElementById('userInfoForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        updateCallStatus();
        updateCallHistory('User information submitted');
    });

    document.getElementById('targetForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        updateCallStatus();
        updateCallHistory('Target information submitted');
    });

    // Call status functions
    function updateCallStatus() {
        const isActive = Math.random() > 0.5;
        const statusLight = document.getElementById('truecaller-status-light');
        const statusText = document.getElementById('truecaller-status-text');
        
        if (statusLight && statusText) {
            statusLight.className = isActive 
                ? 'w-4 h-4 rounded-full bg-green-500 mr-2' 
                : 'w-4 h-4 rounded-full bg-gray-300 mr-2';
            statusText.textContent = isActive 
                ? 'Active on call' 
                : 'Not active on call';
        }
    }

    // Call history tracking
    function updateCallHistory(action) {
        const historyElement = document.getElementById('callHistory') || 
            document.createElement('div');
        historyElement.id = 'callHistory';
        historyElement.className = 'mt-4 p-4 bg-white rounded-lg';
        
        const entry = document.createElement('p');
        entry.textContent = `${new Date().toLocaleTimeString()}: ${action}`;
        historyElement.prepend(entry);
        
        const resultsSection = document.querySelector('.bg-white.rounded-lg');
        if (resultsSection && !document.getElementById('callHistory')) {
            resultsSection.appendChild(historyElement);
        }
    }

    // Initialize
    updateCallStatus();
});
