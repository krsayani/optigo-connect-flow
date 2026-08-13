const SESSION_KEY = "optigo.demo.session";

const DEMO_USER = "optigo";
const DEMO_PASSWORD = "Bismillah";

export function isDemoLoggedIn() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function demoLogin(username: string, password: string) {
  const name = String(username || "").trim().toLowerCase();
  if (name !== DEMO_USER || password !== DEMO_PASSWORD) return false;
  window.sessionStorage.setItem(SESSION_KEY, "1");
  return true;
}

export function demoLogout() {
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export const DEMO_USERNAME = "OptiGo";
