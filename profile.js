const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co';
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

window.addEventListener('DOMContentLoaded', async () => {
    const savedName = sessionStorage.getItem('userName');

    if (!savedName) {
        window.location.href = "form.html";
        return;
    }

    // Fetch all columns for the logged-in user
    const { data: user, error } = await supabaseClient
        .from('donors')
        .select('*')
        .eq('name', savedName)
        .single();

    if (error) {
        console.error("Error fetching profile:", error.message);
        return;
    }

    if (user) {
        // 1. Update the Sidebar/Header Name
        document.getElementById('profile-user-name').textContent = user.name;
        
        // 2. Update the "User Information" section
        document.getElementById('display-full-name').textContent = user.name;
        document.getElementById('display-email').textContent = user.email;
        document.getElementById('display-phone').textContent = user.phone_number;
        
        // 3. Update the Savings Progress
        const savedSpan = document.getElementById('display-total-saved');
        if (savedSpan) {
            savedSpan.textContent = user.total_saved.toLocaleString();
        }

        // 4. Update Account ID (using the first 4 characters of their UUID)
        const accId = document.getElementById('profile-acc-id');
        if (accId) {
            accId.textContent = "#" + user.id.substring(0, 4).toUpperCase();
        }
    }
});