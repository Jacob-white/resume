document.getElementById("current-year").textContent = new Date().getFullYear();

// Email obfuscation
function obfuscateEmails() {
  const emailLinks = document.querySelectorAll(".email-link");
  emailLinks.forEach((link) => {
    const user = link.getAttribute("data-user");
    const domain = link.getAttribute("data-domain");

    if (user && domain) {
      link.href = "mailto:" + user + "@" + domain;
    } else {
      console.error("Missing data-user or data-domain attributes for email link", link);
    }
  });
}

document.addEventListener("DOMContentLoaded", obfuscateEmails);
