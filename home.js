// 1. Setup Connection
const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co';
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

// --- Jar & Data Constants ---
const goal = 8000;
let currentSaved = 0;

// --- Initialize Page ---
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Check who is logged in
    const savedName = sessionStorage.getItem('userName');

    if (!savedName) {
        // Redirect to login if no session found
        window.location.href = "form.html";
        return;
    }

    // 2. Update Greeting
    const nameDisplay = document.getElementById('user-display-name');
    if (nameDisplay) nameDisplay.textContent = savedName;

    // 3. Fetch User Data from Supabase
    const { data, error } = await supabaseClient
        .from('donors')
        .select('total_saved')
        .eq('name', savedName)
        .single();

    if (error) {
        console.error("Error fetching balance:", error.message);
    } else if (data) {
        currentSaved = data.total_saved;
        
        // 4. Update the text display and the Jar animation
        const valElement = document.getElementById('current-val');
        if (valElement) {
            valElement.innerText = currentSaved;
        }
        updateJar();
    }
});

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
    window.open(donationUrl, '_blank');
    window.location.href = "redirect.html";
}