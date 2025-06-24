document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.querySelector('input[name="role"]:checked')?.value || "buyer"; // Dynamically fetch role

  if (!email || !password) {
    alert("Please fill out both fields.");
    return;
  }

  // ✅ Demo login shortcut
  if (email === "farmer@demo.com" && password === "1234") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
    const redirectPath = role === "farmer" ? "farmerdash.html" : "buyerdash.html";
    window.location.href = redirectPath;
    return;
  }

  // 🔐 Real backend authentication
  fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.redirect) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", role);
        alert(data.message);
        window.location.href = data.redirect;
      } else {
        alert(data.error || "Login failed.");
      }
    })
    .catch(() => alert("Login error. Please try again later."));
});
