# IndiaPay — Authentication and Routing Architecture Audit (P0)

**Date & Time**: 2026-11-20 17:05:00 IST  
**Audit Purpose**: Deep root-cause inspection of the Administrator vs. Employee routing collision and formulation of a deterministic, server-side routing proposal.  
**Mode**: READ-ONLY Audit. No code modified, no databases altered.  

---

## 1. Authentication & Session Architecture (The 10 Audit Items)

### 1. How Users Authenticate
- **Library**: `@convex-dev/auth` (Convex Auth Next.js server/client packages).
- **Providers Configured**:
  1. `Password` (`passwordProviders.ts`) with custom bcrypt salt hashing.
  2. `ResendOTP` (`ResendOTP.ts`) for passwordless email OTP codes.
  3. `Google OAuth` via OpenID Connect.
- **Client Forms**: Located in `apps/app/src/components/auth-form.tsx` and `email-otp-signin.tsx`.

### 2. Where Session Information is Stored
- **Client/Browser Storage**:
  - Encrypted JWT stored in secure HTTP cookies:
    - On HTTPS/Production: `__Host-__convexAuthJWT`, `__Host-__convexAuthRefreshToken`.
    - On localhost: `__convexAuthJWT`, `__convexAuthRefreshToken`.
  - Workspace selector preference stored in `localStorage` under key `"ws"`.
- **Server/Convex Storage**:
  - `authSessions` table in Convex stores issued session tokens and expiry timestamps.

### 3. How Workspace Membership is Resolved
- In the backend (`packages/backend/convex/orgs.ts`), membership is queried from the `members` table indexed by `by_user_workspace`:
  ```ts
  ctx.db.query("members")
    .withIndex("by_user_workspace", q => q.eq("userId", userId).eq("workspaceId", workspaceId))
    .unique();
  ```
- The client-side `WorkspaceProvider` (`apps/app/src/lib/workspace-provider.tsx`) runs `api.orgs.myWorkspaces` on mount, matching against `localStorage.getItem("ws")` or defaulting to `workspaces[0]._id`.

### 4. Which Roles Exist
- In schema and orgs logic: **`"admin"`** and **`"member"`**.
- Legacy compatibility: `"owner"` is treated as `"admin"` via `effectiveRole = m.role === "owner" ? "admin" : m.role`.

### 5. Are Roles Global or Workspace-Specific?
- **Strictly Workspace-Specific**: Roles are stored per-row in the `members` table (`{ workspaceId, userId, role }`). A user can be an `admin` in Organization A and a `member` in Organization B.
- There is **no global `role` field** on the `users` table.

### 6. How Account Owners and Administrators are Distinguished
- The `workspaces` table records `ownerId: v.id("users")`.
- The workspace creator is the immutable owner who cannot be removed or demoted from the workspace.
- The `members` table contains `role: "admin"` for both workspace owners and co-administrators.

### 7. How Server-Side Components Obtain Authenticated Identity
- Next.js Server Components call `await convexAuthNextjsToken()` from `@convex-dev/auth/nextjs/server`.
- This token is passed to `fetchQuery(api.users.getUser, {}, { token })` or `fetchQuery(api.orgs.myWorkspaces, {}, { token })` to validate the session server-side before HTML streaming.

### 8. How Convex Validates Workspace Membership
- Convex backend queries and mutations require `await requireMember(ctx, userId, workspaceId)` or `await requireRole(ctx, userId, workspaceId, ["admin"])`.
- Any operation executed with a workspace ID where the user lacks a `members` record throws `ConvexError("Forbidden")`.

### 9. How Middleware Handles Authentication
- Located at `apps/app/src/middleware.ts` using `convexAuthNextjsMiddleware`.
- **Current Behavior**:
  - If unauthenticated and accessing a private route $\rightarrow$ Redirects to `/login`.
  - If authenticated and on `/login` $\rightarrow$ Unconditionally redirects to **`/`**.

### 10. How Direct Navigation and Session Restoration Work
- On browser refresh or direct URL navigation (e.g. entering `/admin` or `/` in the address bar):
  1. Next.js middleware reads cookies and verifies JWT.
  2. Server layout runs `getUser`.
  3. Client mounts `WorkspaceProvider`, fetches `api.orgs.myWorkspaces` asynchronously.
  4. While `myWorkspaces` is in-flight, client state has `workspaces: []` and `role: undefined`.

---

## 2. Root Cause of the Administrator/Employee Routing Collision

The audit reveals **three exact architectural flaws** causing the collision:

### Root Cause A: Unconditional Redirect to `/` in Middleware and Login Form
1. In `apps/app/src/middleware.ts` (line 54):
   ```ts
   if (isSignIn && isAuthenticated) {
     return applySecurityHeaders(nextjsMiddlewareRedirect(request, "/"));
   }
   ```
2. In `auth-form.tsx` (line 104) and `email-otp-signin.tsx` (line 80):
   ```ts
   window.location.href = "/";
   ```
   Both the middleware and login forms unconditionally force every authenticated user—regardless of whether they are an Admin or an Employee—to the root path **`/`**.

### Root Cause B: Root Path `/` Belongs Exclusively to the Employee Dashboard Layout
1. Route group hierarchy:
   - Root `/` is rendered by `src/app/[locale]/(dashboard)/page.tsx`.
   - The outer shell `(dashboard)/layout.tsx` wraps `/` with the Employee Sidebar (`<Sidebar />`) and Topbar (`<Topbar />`).
2. Inside `page.tsx`:
   - It performs a **client-side** role check:
     ```ts
     const role = currentWorkspace?.role;
     if (role === "member") {
       return <MemberDashboard />;
     }
     return <AdminDashboard />;
     ```
   - Because `(dashboard)/layout.tsx` surrounds this, an Administrator landing on `/` momentarily renders the Employee layout wrapper. Then, `Sidebar.tsx` executes:
     ```ts
     if (isHR) return null; // Hides itself after mounting!
     ```
     This causes visual flickering, delayed layout shifts, and accidental employee shell exposure.

### Root Cause C: Inverted Fallback in `admin/page.tsx`
In `src/app/[locale]/(admin)/admin/page.tsx`:
```ts
useEffect(() => {
  if (!isLoading && workspaces.length > 0 && !isAuthorizedAdmin) {
    router.replace("/");
  }
}, [isLoading, workspaces, isAuthorizedAdmin, router]);
```
If an Administrator is on `/admin`, a workspace switch or transient loading state can cause `isAuthorizedAdmin` to be momentarily false, kicking the Administrator back to `/`.

---

## 3. Proposed Deterministic Routing Architecture

To completely eliminate the collision, IndiaPay must enforce **deterministic, server-side route separation**:

```
                         ┌─────────────┐
                         │   /login    │
                         └──────┬──────┘
                                │ Authenticated
                                ▼
                   ┌─────────────────────────┐
                   │   Server-Side Router    │
                   │        at "/"           │
                   └────────────┬────────────┘
                                │
          ┌─────────────────────┴─────────────────────┐
          │                                           │
          ▼                                           ▼
   Role: Admin / Owner                         Role: Member
┌─────────────────────┐                     ┌─────────────────────┐
│  Redirect to /admin │                     │Redirect to /my-portal│
└──────────┬──────────┘                     └──────────┬──────────┘
           ▼                                           ▼
┌─────────────────────┐                     ┌─────────────────────┐
│ (admin) Route Group │                     │(dashboard) Group    │
│  - /admin           │                     │  - /my-portal       │
│  - /admin/payroll   │                     │  - /salary          │
│  - /admin/reports   │                     │  - /leave/apply     │
│  - /admin/settings  │                     │  - /documents       │
└─────────────────────┘                     └─────────────────────┘
```

### Key Architectural Fixes:

1. **Move Root `/` Out of `(dashboard)` Route Group**:
   - Extract `page.tsx` from `(dashboard)/page.tsx` to `src/app/[locale]/page.tsx` (a lightweight Server Component router).
   - In `src/app/[locale]/page.tsx`:
     ```ts
     const token = await convexAuthNextjsToken();
     const workspaces = await fetchQuery(api.orgs.myWorkspaces, {}, { token });
     const activeWs = workspaces[0]; // or cookie-stored ws
     if (!activeWs) return redirect("/onboarding");
     if (activeWs.role === "admin" || activeWs.role === "owner") {
       return redirect("/admin");
     }
     return redirect("/my-portal");
     ```
   - **Zero client-side flash**: Administrators are routed directly to `/admin` before any HTML shell is mounted.

2. **Server-Side Route Guard for `(admin)/layout.tsx`**:
   - Add server-side role validation directly in `src/app/[locale]/(admin)/layout.tsx`:
     ```ts
     const workspaces = await fetchQuery(api.orgs.myWorkspaces, {}, { token });
     const isAdmin = workspaces.some(w => w.role === "admin" || w.role === "owner");
     if (!isAdmin) {
       return redirect("/my-portal");
     }
     ```
   - An employee directly typing `/admin` in the browser URL bar is caught on the server and redirected to `/my-portal` without ever seeing administrative widgets.

3. **Strict Shell Boundary**:
   - `(admin)` layout renders the standalone greytHR Admin Shell (`AdminTopbar`, full-width canvas, 9-dot quick launcher).
   - `(dashboard)` layout renders the Employee Self-Service Shell (`Sidebar`, personal employee menu, `/my-portal`).
   - Neither layout imports or renders components of the other.

---

## 4. Required Test Matrix & Expected Outcomes

| Scenario | Input / Action | Current Behavior (Defect) | Proposed Deterministic Destination |
| :--- | :--- | :--- | :--- |
| **1. Admin Login** | Submits credentials on `/login` | Lands on `/` (flickers ESS sidebar $\rightarrow$ renders Welcome) | Immediate 307 $\rightarrow$ `/admin` (Admin Shell) |
| **2. Employee Login** | Submits credentials on `/login` | Lands on `/` (Member Dashboard) | Immediate 307 $\rightarrow$ `/my-portal` (ESS Shell) |
| **3. Owner Login** | Submits credentials on `/login` | Lands on `/` | Immediate 307 $\rightarrow$ `/admin` (Admin Shell) |
| **4. Direct `/admin` (Admin)** | Enters `/admin` in URL bar | Renders Admin Dashboard | Allowed $\rightarrow$ `/admin` (Admin Shell) |
| **5. Direct `/admin` (Employee)** | Enters `/admin` in URL bar | Client-side flash $\rightarrow$ replace `/` | Server redirect $\rightarrow$ `/my-portal` |
| **6. Direct `/my-portal` (Employee)** | Enters `/my-portal` in URL bar | Allowed $\rightarrow$ `/my-portal` | Allowed $\rightarrow$ `/my-portal` (ESS Shell) |
| **7. Browser Refresh on `/admin`** | F5 while on `/admin` | Can transiently redirect to `/` | Stays on `/admin` |
| **8. Expired Session on `/admin`** | Cookie expires | Unhandled error or partial render | Redirect $\rightarrow$ `/login?expired=1` |
| **9. No Workspace Membership** | User with 0 memberships | Stuck on loading spinner | Redirect $\rightarrow$ `/onboarding` |
| **10. Browser Back from `/admin`** | Presses Back button | History navigates cleanly | Retains session; does not bounce to ESS |
| **11. Logout & Relogin** | Logs out from Admin $\rightarrow$ logs in as Employee | Cookies stripped cleanly | Lands cleanly on `/my-portal` |

---

## Conclusion & Status

- **AUDIT STATUS**: COMPLETED (Read-Only).
- **ROOT CAUSE**: Pinpointed to middleware redirecting to `/`, root `/` residing inside the employee `(dashboard)` layout group, and missing server-side role resolution before layout mounting.
- **RESTRICTION COMPLIANCE**: Zero code modified. No database records changed. Awaiting explicit approval to implement Phase 2 routing separation.
