const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co';
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

window.addEventListener('DOMContentLoaded', async () => {
    const savedName = sessionStorage.getItem('userName');
    const tableBody = document.getElementById('transaction-list');
    const nameHeader = document.getElementById('user-name-display');

    if (!savedName) {
        window.location.href = "form.html";
        return;
    }

    nameHeader.textContent = savedName;

    // 1. Get User ID first
    const { data: user, error: userError } = await supabaseClient
        .from('donors')
        .select('id')
        .eq('name', savedName)
        .single();

    if (userError || !user) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">User records not found.</td></tr>`;
        return;
    }

    // 2. Fetch Transactions linked to that User ID
    // Note: This assumes you have a table named 'transactions' with a 'donor_id' column
    const { data: transactions, error: transError } = await supabaseClient
        .from('transactions')
        .select('*')
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });

    if (transError || !transactions || transactions.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px;">No transactions found yet. Start donating!</td></tr>`;
        return;
    }

    // 3. Render Table Rows
    tableBody.innerHTML = ''; // Clear loading text
    transactions.forEach(item => {
        const date = new Date(item.created_at).toLocaleDateString();
        const row = `
            <tr>
                <td>${date}</td>
                <td style="font-family: monospace; color: #888;">#${item.id.substring(0,8)}</td>
                <td>Donation to Project Climb</td>
                <td class="amount-text">₱${item.amount.toLocaleString()}.00</td>
                <td><span class="status-pill">Completed</span></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
});