function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(form => {
        form.classList.remove("active");
    });
    document.getElementById(formId).classList.add("active");
}

// Load the Supabase Client
const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co'
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs' // Update this!
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey)

// Function to switch between Login and Register views
function showForm(formId) {
    document.querySelectorAll('.form-box').forEach(box => box.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
}

// --- REGISTRATION LOGIC ---
const registerForm = document.querySelector('#register-form form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page from reloading

    const name = document.getElementById('name').value;
    const email = document.getElementById('email-reg').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password-reg').value;

    const { data, error } = await supabaseClient
        .from('donors')
        .insert([
            { name: name, email: email, phone_number: phone, password: password, total_saved: 0 }
        ]);

    if (error) {
        alert("Error registering: " + error.message);
    } else {
        alert("Account created successfully!");
        window.location.href = "home.html"; // Redirect to home
    }
});

// --- LOGIN LOGIC ---
const loginForm = document.querySelector('#login-form form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Check if a donor exists with this email AND password
    const { data, error } = await supabaseClient
        .from('donors')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single(); // Get only one result

    if (error || !data) {
        alert("Invalid email or password");
    } else {
        alert("Welcome back, " + data.name + "!");
        window.location.href = "home.html";
    }
});