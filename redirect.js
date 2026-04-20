        // Redirect logic: waits 3 seconds then goes home
        window.onload = function() {
            setTimeout(() => {
                window.location.href ='home.php'; 
            }, 3000); // 3000ms = 3 seconds
        };