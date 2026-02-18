document.getElementById("current-year").textContent = new Date().getFullYear();

// Email obfuscation
document.addEventListener("DOMContentLoaded", function () {
  const emailLinks = document.querySelectorAll(".email-link");
  emailLinks.forEach((link) => {
    const user = link.getAttribute("data-user");
    const domain = link.getAttribute("data-domain");
    link.href = "mailto:" + user + "@" + domain;
  });
});
