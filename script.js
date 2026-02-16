document.addEventListener("DOMContentLoaded", function () {
  // Update Current Year
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Email obfuscation
  const emailLinks = document.querySelectorAll(".email-link");
  emailLinks.forEach((link) => {
    const user = link.getAttribute("data-user");
    const domain = link.getAttribute("data-domain");
    if (user && domain) {
      link.href = "mailto:" + user + "@" + domain;
    }
  });
});
