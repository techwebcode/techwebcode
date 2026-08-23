/**
 * Admin Authentication Helper & Session Utilities
 * Manages admin authentication token, cookies, and environment credentials.
 */

export const ADMIN_AUTH_COOKIE = "admin_auth_token";
export const ADMIN_LOGGED_IN_KEY = "admin_logged_in";
export const ADMIN_USER_KEY = "admin_user_name";
export const ADMIN_PASSWORD_KEY = "admin_user_pass";

export function getExpectedAdminCredentials() {
  const envUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || process.env.ADMIN_USERNAME || "admin";
  const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "admin@techwebcode";

  if (typeof window !== "undefined") {
    const savedUser = localStorage.getItem(ADMIN_USER_KEY);
    const savedPass = localStorage.getItem(ADMIN_PASSWORD_KEY);
    return {
      username: savedUser || envUser,
      password: savedPass || envPass,
    };
  }

  return {
    username: envUser,
    password: envPass,
  };
}

export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function eraseCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

export function loginAdmin(username: string, password: string): { success: boolean; message: string } {
  const expected = getExpectedAdminCredentials();

  if (username.trim() !== expected.username) {
    return { success: false, message: "Invalid admin username." };
  }

  if (password !== expected.password) {
    return { success: false, message: "Invalid admin password." };
  }

  const token = btoa(`${username}:${password}:${Date.now()}`);

  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_LOGGED_IN_KEY, "true");
    localStorage.setItem(ADMIN_USER_KEY, username);
    setCookie(ADMIN_AUTH_COOKIE, token, 7);
  }

  return { success: true, message: "Authentication successful." };
}

export function logoutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_LOGGED_IN_KEY);
    eraseCookie(ADMIN_AUTH_COOKIE);
    window.location.href = "/login";
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const cookieToken = getCookie(ADMIN_AUTH_COOKIE);
  const loggedIn = localStorage.getItem(ADMIN_LOGGED_IN_KEY);
  return Boolean(cookieToken || loggedIn === "true");
}

export function updateAdminCredentials(newUsername?: string, newPassword?: string) {
  if (typeof window === "undefined") return;
  if (newUsername && newUsername.trim()) {
    localStorage.setItem(ADMIN_USER_KEY, newUsername.trim());
  }
  if (newPassword && newPassword.trim()) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
  }
}
