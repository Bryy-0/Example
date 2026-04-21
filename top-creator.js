const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co';
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

window.addEventListener('DOMContentLoaded', async () => {
    const savedName = sessionStorage.getItem('userName');
    if (!savedName) {
        window.location.href = "form.html";
        return;
    }

    // Update Footer Name immediately
    document.getElementById('current-user-name').textContent = savedName.toUpperCase();

    // 1. Fetch all donors sorted by total_saved
    const { data: donors, error } = await supabaseClient
        .from('donors')
        .select('name, total_saved')
        .order('total_saved', { ascending: false });

    if (error) {
        console.error("Error fetching leaderboard:", error);
        return;
    }

    // 2. Calculate Community Stats
    const totalCollection = donors.reduce((acc, user) => acc + (user.total_saved || 0), 0);
    const totalUsers = donors.length;

    // Update Headers
    document.getElementById('total-collection').innerHTML = `Total Community Collection: <br>₱${totalCollection.toLocaleString()}.00`;
    document.getElementById('user-count').innerHTML = `No. of Users: <br>${totalUsers}`;

    // 3. Populate Table Rows (Top 10)
    const tableBody = document.getElementById('leaderboard-body');
    tableBody.innerHTML = ''; // Clear static placeholder rows

    donors.slice(0, 10).forEach((donor, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${donor.name}</td>
        `;
        // Highlight current user in the list if they are in the top 10
        if (donor.name === savedName) row.style.backgroundColor = "#fff3cd";
        tableBody.appendChild(row);
    });

    // 4. Determine Current User Ranking
    const myIndex = donors.findIndex(d => d.name === savedName);
    const myRank = myIndex !== -1 ? myIndex + 1 : "N/A";
    document.getElementById('user-rank').textContent = `YOUR RANKING: ${myRank}`;
});