function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(form => {
        form.classList.remove("active");
    });
    document.getElementById(formId).classList.add("active");
}

// 1. Setup Connection
const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co';
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs';

const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

// Toggle Form Visibility
function showForm(formId) {
    document.querySelectorAll('.form-box').forEach(box => box.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
}

// --- 📝 UPDATED REGISTRATION LOGIC ---
const registerForm = document.querySelector('#register-form form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email-reg').value;
    const phone = document.getElementById('phone').value;
    const plainPassword = document.getElementById('password-reg').value;

    // 1. Generate a "Salt" and Hash the password
    // The number 10 is the "cost factor" (standard security level)
    const salt = dcodeIO.bcrypt.genSaltSync(10);
    const hashedPassword = dcodeIO.bcrypt.hashSync(plainPassword, salt);

    // 2. Insert into Supabase using the hashed password
    const { data, error } = await supabaseClient
        .from('donors')
        .insert([
            { 
                name: name, 
                email: email, 
                phone_number: phone, 
                password: hashedPassword, // Send the scrambled version!
                total_saved: 0 
            }
        ]);

    if (error) {
        alert("Registration failed: " + error.message);
    } else {
        alert("Success! Password has been hashed and stored.");
        showForm('login-form');
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
        .eq('password', password)
        .single();

    if (error || !data) {
        alert("Login failed! Check your email or password.");
    } else {
        alert("Welcome, " + data.name);
        // Save the user's name so we can show it on home.html
        sessionStorage.setItem('userName', data.name);
        window.location.href = "home.html";
    }
});