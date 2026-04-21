// 1. Setup Connection
const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co';
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

const goal = 8000; // Matches your current goal
let currentSaved = 0;

window.addEventListener('DOMContentLoaded', async () => {
    const savedName = sessionStorage.getItem('userName');

    if (savedName) {
        // Update the Sidebar Name
        const menuName = document.getElementById('menu-user-name');
        if (menuName) menuName.textContent = savedName;

        // Update the Main Welcome Heading
        const headingName = document.getElementById('user-display-name');
        if (headingName) headingName.textContent = savedName;
        
        console.log("Both name displays updated!");
    } else {
        window.location.href = "form.html";
        return;
    }

    // Update greeting
    const nameDisplay = document.getElementById('user-display-name');
    if (nameDisplay) nameDisplay.textContent = savedName;

    // Fetch User Data
    const { data, error } = await supabaseClient
        .from('donors')
        .select('total_saved')
        .eq('name', savedName)
        .single();

    if (error) {
        console.error("Error:", error.message);
    } else if (data) {
        currentSaved = data.total_saved;
        
        // Update numerical text
        const valElement = document.getElementById('current-val');
        if (valElement) {
            valElement.innerText = currentSaved.toLocaleString();
        }

        // Trigger visual update with a tiny delay to ensure DOM is ready
        setTimeout(updateJar, 100);
    }
});

function updateJar() {
    const liquid = document.getElementById('liquid-fill');
    const percentText = document.getElementById('percent-text');
    
    // Check if both elements exist in your home.html
    if (liquid && percentText) {
        // 1. Calculate the percentage based on your 8,000 goal
        const percent = Math.min(Math.floor((currentSaved / goal) * 100), 100);
        
        // 2. Update the CSS height of the liquid
        liquid.style.height = percent + "%";
        
        // 3. Overwrite the hard-coded "0%" with the dynamic calculation
        percentText.innerText = percent + "%";
        
        // Debugging: check your browser console (F12) to see this log
        console.log("Visuals updated to:", percent + "%");
    } else {
        console.error("Could not find liquid-fill or percent-text IDs in HTML");
    }
}

// --- Jar Visual Logic ---
function updateJar() {
    const liquid = document.getElementById('liquid-fill');
    if (liquid) {
        const percent = (currentSaved / goal) * 100;
        const visualHeight = percent > 100 ? 100 : percent;
        liquid.style.height = visualHeight + "%";
    }
}

// --- Navigation & Menu ---
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    const icon = document.getElementById('hamburger-icon');
    if (menu && icon) {
        menu.classList.toggle('active');
        icon.classList.toggle('open');
    }
}

// --- Donation Logic ---
function addDonation() {
    const donationUrl = "https://paymongo.page/l/projectclimb";
    
    // 1. Open the payment page in a new tab so the user doesn't leave your app
    window.open(donationUrl, '_blank');

    // 2. DO NOT redirect here. 
    // Instead, you could show a "Confirming Payment..." message 
    // or simply let the user stay on the dashboard until they are done.
    console.log("Payment window opened. Redirection paused until confirmation.");
}

/**
 * Optional: Call this function only AFTER a successful database 
 * update or via a "Check Transaction" button.
 */
function confirmAndRedirect() {
    // Only trigger this once you have verified the data in Supabase
    window.location.href = "redirect.html";
}