let generatedCode = "";

        function sendCode() {
            const email = document.getElementById('verify-email').value;
            if (email === "") {
                alert("Please enter a valid email.");
                return;
            }
            generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            alert("Verification code sent to " + email + "\n\nYOUR CODE IS: " + generatedCode);
            document.getElementById('step-1').style.display = 'none';
            document.getElementById('step-2').style.display = 'block';
        }

        function verifyUser() {
            const inputCode = document.getElementById('digit-code').value;
            const error = document.getElementById('error-msg');
            if (inputCode === generatedCode) {
                alert("Account Verified Successfully!");
                window.location.href = "home.html";
            } else {
                error.style.display = "block";
            }
        }