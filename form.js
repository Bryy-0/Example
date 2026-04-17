function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(form => {
        form.classList.remove("active");
    });
    document.getElementById(formId).classList.add("active");
}

function handleAuth() {
    // You can add logic here later to check if inputs are empty
    window.location.href = "home.html";
}