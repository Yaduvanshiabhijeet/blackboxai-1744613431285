// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map if element exists
    if (document.getElementById('map')) {
        const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Mock data generators
        function getRandomStatus() {
            return Math.random() > 0.5;
        }

        function getRandomLocation() {
            const lat = 20.0 + (Math.random() - 0.5) * 10;
            const lng = 78.0 + (Math.random() - 0.5) * 10;
            return [lat, lng];
        }

        // Update status display
        function updateStatuses() {
            const isActiveOnCall = getRandomStatus();
            const truecallerStatusLight = document.getElementById('truecaller-status-light');
            const truecallerStatusText = document.getElementById('truecaller-status-text');

            if (truecallerStatusLight && truecallerStatusText) {
                if (isActiveOnCall) {
                    truecallerStatusLight.className = 'w-4 h-4 rounded-full bg-green-500 mr-2';
                    truecallerStatusText.textContent = 'Active on call';
                } else {
                    truecallerStatusLight.className = 'w-4 h-4 rounded-full bg-gray-300 mr-2';
                    truecallerStatusText.textContent = 'Not active on call';
                }
            }
        }

        // Initial load
        updateStatuses();
    }
});
