// lib/auth.ts

export type User = {
  id: string;
  name: string | null;
  email: string;
  country?: string | null;
};

const AUTH_CHANGED_EVENT = "auth-changed";

function emitAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

async function safeFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    return await fetch(input, init);
  } catch {
    return null;
  }
}

async function getCsrfToken(): Promise<string> {
  const res = await safeFetch("/api/auth/csrf", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!res) throw new Error("Failed to fetch CSRF token");

  const match = document.cookie.match(/pps_csrf=([^;]+)/);
  if (!match) throw new Error("Missing CSRF token");

  return match[1];
}

/**
 * Login via server (CSRF protected)
 */
export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<{ ok: true; emailVerified: boolean }> {
  const csrf = await getCsrfToken();

  const res = await safeFetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrf,
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({ email, password, rememberMe }),
  });

  if (!res || !res.ok) {
    const data = res ? await res.json().catch(() => ({})) : {};
    throw new Error(data?.error || "Login failed");
  }

  const data = await res.json();

  emitAuthChanged();

  return data;
}

/**
 * Logout via server (CSRF protected)
 */
export async function logoutUser(): Promise<void> {
  try {
    const csrf = await getCsrfToken();

    await safeFetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "x-csrf-token": csrf,
      },
      credentials: "include",
      cache: "no-store",
    });
  } finally {
    emitAuthChanged();
  }
}

/**
 * Get current logged-in user (NO CACHE)
 */
export async function getCurrentUser(): Promise<User | null> {
  const res = await safeFetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res || !res.ok) return null;

  try {
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

/**
 * Check authentication status (STRICT)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return Boolean(user && user.id);
}

export { AUTH_CHANGED_EVENT };