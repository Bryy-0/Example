// 1. Setup Connection
const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co';
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

const goal = 8000; // Matches your current goal
let currentSaved = 0;

window.addEventListener('DOMContentLoaded', async () => {
    const savedName = sessionStorage.getItem('userName');
    if (!savedName) {
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
    
    if (liquid && percentText) {
        // Calculate percentage (0 to 100)
        const percent = Math.min(Math.floor((currentSaved / goal) * 100), 100);
        
        // 1. Update the Height (Liquid)
        liquid.style.height = percent + "%";
        
        // 2. Update the Text inside the jar
        percentText.textContent = percent + "%";
        
        console.log(`Jar Updated: ${percent}%`); // Debugging line
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
    window.open(donationUrl, '_blank');
    window.location.href = "redirect.html";
}