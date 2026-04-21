import { ADMIN_CREDENTIALS, ADMIN_SESSION_KEY } from "./admin-config.js";
import { initCursor } from "./cursor.js";

export function initLoginPage() {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const errorEl = document.getElementById("loginError");

  if (!form || !emailInput || !passwordInput || !errorEl) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    errorEl.hidden = true;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const session = {
        email,
        loggedInAt: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      window.location.href = "admin.html";
      return;
    }

    errorEl.textContent = "Invalid email or password.";
    errorEl.hidden = false;
    passwordInput.value = "";
    passwordInput.focus();
  });
}

export function requireSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      redirectToLogin();
      return null;
    }

    const session = JSON.parse(raw);
    const age = Date.now() - new Date(session.loggedInAt).getTime();
    if (age > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      redirectToLogin();
      return null;
    }

    return session;
  } catch {
    redirectToLogin();
    return null;
  }
}

export function logout() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.href = "admin-login.html";
}

function redirectToLogin() {
  window.location.href = "admin-login.html";
}

if (document.getElementById("loginForm")) {
  initCursor();
  initLoginPage();
}
