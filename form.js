function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(form => {
        form.classList.remove("active");
    });
    document.getElementById(formId).classList.add("active");
}

// 1. Initialize Connection
const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co'; // From your screenshot
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs'; // Replace this!
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

// Toggle between Login and Register
function showForm(formId) {
    document.querySelectorAll('.form-box').forEach(box => box.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
}

// --- 📝 REGISTRATION LOGIC ---
const registerForm = document.querySelector('#register-form form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page refresh

    const fullName = document.getElementById('name').value;
    const email = document.getElementById('email-reg').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password-reg').value;

    const { data, error } = await supabaseClient
        .from('donors')
        .insert([
            { 
                name: fullName, 
                email: email, 
                phone_number: phone, 
                password: password, // Note: In real apps, passwords should be encrypted!
                total_saved: 0 
            }
        ]);

    if (error) {
        console.error("Registration Error:", error);
        alert("Failed to register: " + error.message);
    } else {
        alert("Registration Successful!");
        showForm('login-form'); // Send them to login after registering
    }
});

// --- 🔑 LOGIN LOGIC ---
const loginForm = document.querySelector('#login-form form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabaseClient
        .from('donors')
        .select('*')
        .eq('email', email)
        .eq('password', password) // Check if email and password match a row
        .single(); // We only expect one user

    if (error || !data) {
        alert("Invalid email or password!");
    } else {
        alert("Welcome back, " + data.name + "!");
        // Store user info in session storage to use on the home page
        sessionStorage.setItem('userName', data.name);
        window.location.href = "home.html";
    }
});