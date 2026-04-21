// 1. Setup Connection
const _supabaseUrl = 'https://ijzaiwjztqyigsorzstu.supabase.co';
const _supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqemFpd2p6dHF5aWdzb3J6c3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMDc1MzIsImV4cCI6MjA5MTg4MzUzMn0.7Vyln1RMOX-mwkRa_3CRm136yK3uMYvD1JgVs9X-Lqs';

const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseAnonKey);

// Toggle Form Visibility
function showForm(formId) {
    document.querySelectorAll('.form-box').forEach(box => box.classList.remove('active'));
    document.getElementById(formId).classList.add('active');

    const loginErr = document.getElementById('login-error');
    const regErr = document.getElementById('register-error');
    if (loginErr) loginErr.style.display = 'none';
    if (regErr) regErr.style.display = 'none';
}

// --- 📝 REGISTRATION LOGIC ---
const registerForm = document.querySelector('#register-form form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorBox = document.getElementById('register-error');
        errorBox.style.display = 'none';

        const name = document.getElementById('name').value.trim(); // Trimmed
        const email = document.getElementById('email-reg').value;
        const phone = document.getElementById('phone').value;
        const plainPassword = document.getElementById('password-reg').value;

        try {
            const salt = dcodeIO.bcrypt.genSaltSync(10);
            const hashedPassword = dcodeIO.bcrypt.hashSync(plainPassword, salt);

            const { error } = await supabaseClient
                .from('donors')
                .insert([{
                    name: name,
                    email: email,
                    phone_number: phone,
                    password: hashedPassword,
                    total_saved: 0
                }]);

            if (error) {
                errorBox.style.display = 'block';
                errorBox.textContent = (error.code === "23505") ? "This email is already registered." : error.message;
            } else {
                // Success: This name is what home.html will pull
                sessionStorage.setItem('userName', name);
                window.location.href = "home.html";
            }
        } catch (err) {
            errorBox.style.display = 'block';
            errorBox.textContent = "Something went wrong. Please try again.";
        }
    });
}

// --- 🔑 LOGIN LOGIC ---
const loginForm = document.querySelector('#login-form form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorBox = document.getElementById('login-error');
        errorBox.style.display = 'none';

        const email = document.getElementById('email').value;
        const inputPassword = document.getElementById('password').value;

        const { data: user, error } = await supabaseClient
            .from('donors')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            errorBox.style.display = 'block';
            errorBox.textContent = "No account found with this email.";
            return;
        }

        try {
            if (dcodeIO.bcrypt.compareSync(inputPassword, user.password)) {
                // Save name for the "Welcome" display
                sessionStorage.setItem('userName', user.name);
                window.location.href = "home.html";
            } else {
                errorBox.style.display = 'block';
                errorBox.textContent = "Incorrect password. Please try again.";
            }
        } catch (err) {
            errorBox.style.display = 'block';
            errorBox.textContent = "Login failed. Check your password format.";
        }
    });
}