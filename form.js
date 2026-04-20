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

// --- 📝 REGISTRATION LOGIC ---
const registerForm = document.querySelector('#register-form form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

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
        console.error("Registration failed:", error.message);
    } else {
        // Redirect directly to home after successful registration
        window.location.href = "home.html";
    }
});

// --- 🔑 LOGIN LOGIC ---
const loginForm = document.querySelector('#login-form form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const inputPassword = document.getElementById('password').value;

    // Fetch user by email
    const { data: user, error } = await supabaseClient
        .from('donors')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !user) {
        console.error("User not found or connection error");
        return;
    }

    // Compare hash
    const isPasswordCorrect = dcodeIO.bcrypt.compareSync(inputPassword, user.password);

    if (isPasswordCorrect) {
        // Store name and redirect immediately
        sessionStorage.setItem('userName', user.name);
        window.location.href = "home.html";
    } else {
        console.error("Invalid password attempt");
    }
});