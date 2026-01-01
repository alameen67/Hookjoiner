document.addEventListener('DOMContentLoaded', function() {
    const jobIdInput = document.getElementById('jobIdInput');
    const joinBtn = document.getElementById('joinBtn');
    const copyBtn = document.getElementById('copyBtn');
    const resultDiv = document.getElementById('result');
    const directUrlElement = document.getElementById('directUrl');

    // Check for job ID in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const jobFromUrl = urlParams.get('job');
    if (jobFromUrl) {
        jobIdInput.value = jobFromUrl;
        updateDirectUrl(jobFromUrl);
    }

    // Update direct URL display
    function updateDirectUrl(jobId) {
        const currentUrl = window.location.origin + window.location.pathname;
        directUrlElement.textContent = `${currentUrl}?job=${jobId}`;
    }

    // Handle input change
    jobIdInput.addEventListener('input', function() {
        updateDirectUrl(this.value);
    });

    // Join button click
    joinBtn.addEventListener('click', function() {
        const jobId = jobIdInput.value.trim();
        
        if (!jobId) {
            showResult('Please enter a Job ID', 'error');
            return;
        }

        // Clean the job ID (remove any extra characters)
        const cleanJobId = jobId.replace(/[^a-zA-Z0-9\-]/g, '');
        
        if (cleanJobId.length < 5) {
            showResult('Invalid Job ID format', 'error');
            return;
        }

        // Update the URL without reloading
        const newUrl = `${window.location.pathname}?job=${cleanJobId}`;
        window.history.pushState({}, '', newUrl);

        // Create Roblox protocol URL
        const robloxUrl = `roblox://placeId=0&gameInstanceId=${cleanJobId}`;
        
        // Try to launch Roblox
        window.location.href = robloxUrl;
        
        // Fallback message
        setTimeout(() => {
            showResult(`Joining server... If Roblox doesn't open, click <a href="${robloxUrl}" style="color: #00a2ff; text-decoration: underline;">here</a>`, 'success');
        }, 1000);
    });

    // Copy button click
    copyBtn.addEventListener('click', function() {
        const jobId = jobIdInput.value.trim();
        
        if (!jobId) {
            showResult('No Job ID to copy', 'error');
            return;
        }

        const joinUrl = `${window.location.origin}${window.location.pathname}?job=${jobId}`;
        
        navigator.clipboard.writeText(joinUrl).then(() => {
            showResult('Join link copied to clipboard!', 'success');
        }).catch(err => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = joinUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showResult('Join link copied to clipboard!', 'success');
        });
    });

    // Show result message
    function showResult(message, type) {
        resultDiv.innerHTML = `<div class="${type}">${message}</div>`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            resultDiv.innerHTML = '';
        }, 5000);
    }

    // Add example Job IDs for testing
    const exampleIds = [
        'abc123def-4567-8901-ghij',
        'xyz789-1234-5678-abcd',
        'test-job-id-12345'
    ];

    // Random example button (optional)
    const exampleBtn = document.createElement('button');
    exampleBtn.innerHTML = '<i class="fas fa-random"></i> Try Example';
    exampleBtn.className = 'btn-secondary';
    exampleBtn.style.marginTop = '10px';
    exampleBtn.style.width = '100%';
    
    exampleBtn.addEventListener('click', function() {
        const randomId = exampleIds[Math.floor(Math.random() * exampleIds.length)];
        jobIdInput.value = randomId;
        updateDirectUrl(randomId);
        showResult(`Example Job ID loaded: ${randomId}`, 'success');
    });

    // Add example button after the input section
    document.querySelector('.input-section').appendChild(exampleBtn);
});
