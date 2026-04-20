// --- Navigation & Menu ---
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const icon = document.getElementById('hamburger-icon');
    menu.classList.toggle('active');
    icon.classList.toggle('open');
}

// --- Jar Logic ---
const goal = 1000;
let currentSaved = 0;

/**
 * We use DOMContentLoaded because it fires as soon as the HTML is ready.
 * This reads the value PHP fetched from the MySQL database and 
 * triggers the jar animation.
 */
window.addEventListener('DOMContentLoaded', () => {
    const valElement = document.getElementById('current-val');
    
    if (valElement) {
        // 1. Get the number currently displayed in the <span> (from PHP)
        currentSaved = parseInt(valElement.innerText) || 0;
        
        // 2. Trigger the visual animation for the jar liquid
        updateJar();
    }
});

function updateJar() {
    const liquid = document.getElementById('liquid-fill');
    if (liquid) {
        // Calculate percentage based on the goal
        const percent = (currentSaved / goal) * 100;
        
        // Apply the height. CSS transition in home.css makes this smooth.
        const visualHeight = percent > 100 ? 100 : percent;
        liquid.style.height = visualHeight + "%";
    }
}

/**
 * Redirects the user to the processing script.
 * The 'amount' is passed in the URL to update_savings.php.
 */
function addDonation() {
    const donationUrl = "https://paymongo.page/l/projectclimb";
    const amount = 150; // You can make this dynamic if needed

    // 1. Open the payment page in a new tab
    window.open(donationUrl, '_blank');

    // 2. Redirect the current tab to your PHP script to log the savings
    // This ensures that when the user looks back at your site, the jar updates.
    window.location.href = "redirect.html";
}