/**
 * IndiaPay Secure Client-Side Logout & Session Cleanup Utility
 *
 * Provides a resilient logout process that:
 * 1. Invokes the server-side signOut action with a bounded timeout (prevents hanging indefinitely).
 * 2. Cleans up all client-side session tokens, workspace keys, and cached state.
 * 3. Prevents concurrent / duplicate sign-out execution.
 * 4. Safely redirects to /login even if the server-side action or server cache invalidation takes too long.
 * 5. Handles browser back-button (bfcache) navigation to prevent unauthenticated access to cached pages.
 */

export interface LogoutOptions {
  signOut: () => Promise<void>;
  timeoutMs?: number;
  redirectTo?: string;
  onError?: (err: unknown) => void;
  onTimeout?: () => void;
  navigate?: (url: string) => void;
}

export interface LogoutResult {
  success: boolean;
  timedOut: boolean;
  error: unknown | null;
}

let logoutInProgress = false;

/**
 * Checks if a logout operation is currently running.
 */
export function isLogoutInProgress(): boolean {
  return logoutInProgress;
}

/**
 * Resets the in-progress flag (primarily for testing).
 */
export function resetLogoutFlag(): void {
  logoutInProgress = false;
}

/**
 * Thoroughly clears client-side authentication and session storage.
 */
export function cleanClientSessionStorage(): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Clear workspace selection
    window.localStorage.removeItem("ws");
    document.cookie = "ws=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "indiapay_active_ws=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // 2. Clear known Convex Auth tokens
    window.localStorage.removeItem("__convexAuthJWT");
    window.localStorage.removeItem("__convexAuthRefreshToken");

    // 3. Clear any namespaced or versioned Convex auth keys in localStorage
    const localKeysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (key.includes("convexAuth") || key.includes("convex_auth"))) {
        localKeysToRemove.push(key);
      }
    }
    for (const key of localKeysToRemove) {
      window.localStorage.removeItem(key);
    }

    // 4. Clear any sessionStorage tokens
    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key && (key.includes("convexAuth") || key.includes("convex_auth"))) {
        sessionKeysToRemove.push(key);
      }
    }
    for (const key of sessionKeysToRemove) {
      window.sessionStorage.removeItem(key);
    }
  } catch (err) {
    console.warn("Error during client session storage cleanup:", err);
  }
}

/**
 * Safely executes the sign-out process with bounded timeout, robust state cleanup,
 * and reliable redirection.
 */
export async function performLogout(
  options: LogoutOptions,
): Promise<LogoutResult> {
  const {
    signOut,
    timeoutMs = 3500,
    redirectTo = "/login",
    onError,
    onTimeout,
    navigate = (url: string) => {
      if (typeof window !== "undefined") {
        window.location.replace(url);
      }
    },
  } = options;

  if (logoutInProgress) {
    return {
      success: false,
      timedOut: false,
      error: new Error("Logout already in progress"),
    };
  }

  logoutInProgress = true;
  let timedOut = false;
  let caughtError: unknown = null;

  try {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => {
        timedOut = true;
        reject(new Error(`Sign out timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      await Promise.race([signOut(), timeoutPromise]);
    } finally {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
    }
  } catch (err) {
    caughtError = err;
    if (timedOut) {
      console.warn(
        `[IndiaPay Logout] Server-side sign-out timed out after ${timeoutMs}ms. Proceeding with client-side cleanup.`,
      );
      onTimeout?.();
    } else {
      console.error(
        "[IndiaPay Logout] Server-side sign-out encountered an error:",
        err,
      );
      onError?.(err);
    }
  } finally {
    // ALWAYS clean client session tokens and workspace state
    cleanClientSessionStorage();

    // ALWAYS navigate to login to ensure client router cache and memory state are cleared
    try {
      navigate(redirectTo);
    } catch (navErr) {
      console.error("[IndiaPay Logout] Navigation failed:", navErr);
    }

    logoutInProgress = false;
  }

  return {
    success: caughtError === null,
    timedOut,
    error: caughtError,
  };
}

/**
 * Registers a bfcache protection handler to prevent browser back-button
 * from rendering stale/cached authenticated views after logout.
 */
export function setupBfcacheLogoutProtection(
  reloadFn: () => void = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  },
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: PageTransitionEvent) => {
    // If the page was restored from the Back-Forward Cache (bfcache),
    // trigger a reload to force the server/middleware to re-verify authentication.
    if (event.persisted) {
      reloadFn();
    }
  };

  window.addEventListener("pageshow", handler);
  return () => {
    window.removeEventListener("pageshow", handler);
  };
}
