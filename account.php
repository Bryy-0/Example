<?php
session_start();
require_once 'config.php';

// --- REGISTRATION LOGIC ---
if (isset($_POST['register'])){
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $phone = mysqli_real_escape_string($conn, $_POST['phone']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Check if email already exists
    $checkEmail = $conn->query("SELECT email FROM users WHERE email = '$email'");
    
    if ($checkEmail->num_rows > 0) {
        $_SESSION['register_error'] = 'Email is already registered';
        $_SESSION['active_form'] = 'register';
        header("Location: form.php");
        exit();
    } else {
        // total_saved starts at 0 for new accounts
        $sql = "INSERT INTO users (name, email, phone_number, password, total_saved) 
                VALUES ('$name', '$email', '$phone', '$password', 0)";
                
        if ($conn->query($sql)) {
            header("Location: home.php");
            exit();
        } else {
            die("Database Error: " . $conn->error); 
        }
    }
}

// --- LOGIN LOGIC ---
if (isset($_POST['login'])) {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];

    $result = $conn->query("SELECT * FROM users WHERE email = '$email'");
    
    if ($result->num_rows > 0 ) {
        $user = $result->fetch_assoc();
        
        // Verify the hashed password from your database
        if (password_verify($password, $user['password'])) {
            // SET SESSION: Identify the user for the rest of their visit
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email']; // Added this so we have the email for Airtable later
            
            header("Location: home.php");
            exit();
        }
    }
    
    // If we reach here, login failed
    $_SESSION['login_error'] = 'Incorrect email or password';
    $_SESSION['active_form'] = 'login';
    header("Location: form.php");
    exit();
}