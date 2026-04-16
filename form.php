<?php
session_start();
include 'config.php';

// If user is already logged in, send them to home directly
if (isset($_SESSION['user_id'])) {
    header("Location: home.php");
    exit();
}

$errors = [
    'login' => $_SESSION['login_error'] ?? '',
    'register' => $_SESSION['register_error'] ?? ''
];

$activeForm = $_SESSION['active_form'] ?? 'login';

// Only clear the error messages so they don't show up after a refresh
unset($_SESSION['login_error']);
unset($_SESSION['register_error']);
unset($_SESSION['active_form']);

function showError($error) {
    return !empty($error) ? "<p class='error-message' style='color:red; font-size:0.8rem; margin-bottom:10px;'>$error</p>" : '';
}

function isActiveForm($formName, $activeForm) {
    return $formName === $activeForm ? 'active' : '';
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Alkansiya - Registration Form</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <div class="container">
        <div class="form-box <?= isActiveForm('login', $activeForm); ?>" id="login-form">
            <h2>Login</h2>
            <?= showError($errors['login']); ?>
            <form action="account.php" method="post">

                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="example@mail.com" required>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" minlength="8" required>

                <button type="submit" name="login">Login</button>
                <p style="text-align: center; margin-top: 15px; font-size: 0.8rem;">
                    Don't have an account? <a href="#" onclick="showForm('register-form')">Register</a>
                </p>
            </form>
        </div>
        <div class="form-box <?= isActiveForm('register', $activeForm); ?>" id="register-form">
            <h2>Create Account</h2>
            <?= showError($errors['register']); ?>
            <form action="account.php" method="post">

                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="John Doe" required>

                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="example@mail.com" required>
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="123-456-7890" required>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" minlength="8" required>

                <button type="submit" name="register">Register</button>

                <p style="text-align: center; margin-top: 15px; font-size: 0.8rem;">
                    Already have an account? <a href="#" onclick="showForm('login-form')">Login</a>
                </p>
            </form>
        </div>

        <script src="form.js"></script>

</body>

</html>