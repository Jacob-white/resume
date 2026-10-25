const currentYearEl = document.getElementById("current-year");
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

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

// Theme management following modern-web-guidance (meta[name="color-scheme"] + system preference)
function initThemeToggle() {
  const metaScheme = document.querySelector('meta[name="color-scheme"]');
  const toggleBtn = document.getElementById("theme-toggle");
  const iconEl = toggleBtn ? toggleBtn.querySelector(".theme-icon") : null;
  const mediaQuery = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : { matches: false, addEventListener: () => {} };

  function getStoredScheme() {
    try {
      return localStorage.getItem("color-scheme");
    } catch {
      return null;
    }
  }

  function setStoredScheme(value) {
    try {
      if (value) {
        localStorage.setItem("color-scheme", value);
      } else {
        localStorage.removeItem("color-scheme");
      }
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }

  function getResolvedScheme(stored) {
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    return mediaQuery.matches ? "dark" : "light";
  }

  function applyScheme(stored) {
    const resolved = getResolvedScheme(stored);
    if (metaScheme) {
      metaScheme.content = stored === "dark" || stored === "light" ? stored : "light dark";
    }
    if (resolved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", String(resolved === "dark"));
      toggleBtn.setAttribute(
        "aria-label",
        resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
    if (iconEl) {
      iconEl.textContent = resolved === "dark" ? "☀" : "☾";
    }
  }

  applyScheme(getStoredScheme());

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentStored = getStoredScheme();
      const currentResolved = getResolvedScheme(currentStored);
      const target = currentResolved === "dark" ? "light" : "dark";
      const systemScheme = mediaQuery.matches ? "dark" : "light";

      if (target !== systemScheme) {
        setStoredScheme(target);
        applyScheme(target);
      } else {
        setStoredScheme(null);
        applyScheme(null);
      }
    });
  }

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", () => {
      applyScheme(getStoredScheme());
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key === "color-scheme") {
      applyScheme(event.newValue);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  obfuscateEmails();
  initThemeToggle();
});
