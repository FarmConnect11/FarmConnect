function toggleDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

window.onclick = function(event) {
  const icon = document.querySelector(".profile-icon");
  const dropdown = document.getElementById("dropdown");

  if (!icon.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.display = "none";
  }
};
