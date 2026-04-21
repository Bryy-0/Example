// 1. Setup Connection
const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co';
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs';

const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

// Toggle Form Visibility
function showForm(formId) {
    document.querySelectorAll('.form-box').forEach(box => box.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
    
    // Clear any existing error messages when switching forms
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('register-error').style.display = 'none';
}

// --- 📝 REGISTRATION LOGIC ---
const registerForm = document.querySelector('#register-form form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('register-error');
    errorBox.style.display = 'none'; // Reset error box

    const name = document.getElementById('name').value;
    const email = document.getElementById('email-reg').value;
    const phone = document.getElementById('phone').value;
    const plainPassword = document.getElementById('password-reg').value;

    // Hash the password
    const salt = dcodeIO.bcrypt.genSaltSync(10);
    const hashedPassword = dcodeIO.bcrypt.hashSync(plainPassword, salt);

    const { error } = await supabaseClient
        .from('donors')
        .insert([
            { 
                name: name, 
                email: email, 
                phone_number: phone, 
                password: hashedPassword, 
                total_saved: 0 
            }
        ]);

    if (error) {
        errorBox.style.display = 'block';
        // Handle specific Supabase/PostgreSQL error codes
        if (error.message.includes("unique_violation") || error.code === "23505") {
            errorBox.textContent = "This email is already registered.";
        } else {
            errorBox.textContent = "Registration failed. Please check your connection.";
        }
    } else {
        sessionStorage.setItem('userName', name);
        window.location.href = "home.html";
    }
});

// --- 🔑 LOGIN LOGIC ---
const loginForm = document.querySelector('#login-form form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('login-error');
    errorBox.style.display = 'none'; // Reset error box

    const email = document.getElementById('email').value;
    const inputPassword = document.getElementById('password').value;

    // Fetch user by email
    const { data: user, error } = await supabaseClient
        .from('donors')
        .select('*')
        .eq('email', email)
        .single();

    // Check if user exists
    if (error || !user) {
        errorBox.style.display = 'block';
        errorBox.textContent = "No account found with this email.";
        return;
    }

    // Compare hash
    const isPasswordCorrect = dcodeIO.bcrypt.compareSync(inputPassword, user.password);

    if (isPasswordCorrect) {
        sessionStorage.setItem('userName', user.name);
        window.location.href = "home.html";
    } else {
        // Wrong password
        errorBox.style.display = 'block';
        errorBox.textContent = "Incorrect password. Please try again.";
    }
});