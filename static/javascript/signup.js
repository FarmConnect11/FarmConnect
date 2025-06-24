function showTab(tab) {
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
  document.querySelector(`.tab[onclick*="${tab}"]`).classList.add('active');
  document.getElementById(`${tab}Form`).classList.add('active');
}

function submitForm(e, type) {
  e.preventDefault();
  const form = e.target;

  const data = {
    role: type,
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    confirmPassword: form.confirmPassword.value
  };

  if (data.password !== data.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  fetch("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(response => {
      if (response.redirect) {
        alert(response.message);
        window.location.href = response.redirect;
      } else {
        alert(response.error || "Signup failed.");
      }
    })
    .catch(() => alert("Signup error. Please try again later."));
}
