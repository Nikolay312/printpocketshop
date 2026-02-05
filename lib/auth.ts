// lib/auth.ts

export type User = {
  id: string;
  name: string | null;
  email: string;
};

async function getCsrfToken(): Promise<string> {
  await fetch("/api/auth/csrf", { method: "GET" });

  const match = document.cookie.match(/pps_csrf=([^;]+)/);
  if (!match) throw new Error("Missing CSRF token");

  return match[1];
}

/**
 * Login via server (CSRF protected)
 */
export async function loginUser(email: string, password: string): Promise<void> {
  const csrf = await getCsrfToken();

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrf,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Login failed");
  }
}

/**
 * Logout via server (CSRF protected)
 */
export async function logoutUser(): Promise<void> {
  const csrf = await getCsrfToken();

  await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "x-csrf-token": csrf,
    },
  });
}

/**
 * Get current logged-in user
 */
export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user ?? null;
}

/**
 * Check authentication status
 */
export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getCurrentUser());
}