import { WorkspaceProvider } from "@/lib/workspace-provider";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@v1/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { CommandPalette } from "../(dashboard)/_components/command-palette";

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  let user = null;
  let token: string | undefined = undefined;
  try {
    token = await convexAuthNextjsToken();
    if (!token) {
      return redirect("/login");
    }
    user = await fetchQuery(api.users.getUser, {}, { token });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return redirect("/login?expired=1");
  }

  if (!user) {
    return redirect("/login");
  }
  if (!user.username) {
    return redirect("/onboarding");
  }

  // Server-side Role-Based Access Control for all /admin routes
  try {
    interface WorkspaceMembership {
      _id: string;
      name: string;
      role: string;
      status?: "active" | "suspended" | "pending";
    }

    const workspaces = (await fetchQuery(
      api.orgs.myWorkspaces,
      {},
      { token },
    )) as WorkspaceMembership[];
    if (!workspaces || workspaces.length === 0) {
      console.log("[AdminLayout] User has no workspaces. Access denied.");
      return redirect("/");
    }

    // Determine the active workspace from server cookie ("ws" or "indiapay_active_ws")
    // or fallback to the user's default (first) workspace
    const cookieStore = await cookies();
    const activeWsCookie =
      cookieStore.get("ws")?.value ||
      cookieStore.get("indiapay_active_ws")?.value;

    let activeWorkspace = workspaces.find((w) => w._id === activeWsCookie);
    if (!activeWorkspace) {
      activeWorkspace = workspaces[0];
    }

    if (!activeWorkspace) {
      console.log("[AdminLayout] No active workspace could be resolved. Access denied.");
      return redirect("/");
    }

    // Verify membership status and role in that exact active workspace
    const isSuspended = activeWorkspace.status === "suspended";
    const activeRole = activeWorkspace.role;
    const isAuthorized = !isSuspended && (activeRole === "admin" || activeRole === "owner");

    console.log("[AdminLayout] Active workspace check:", {
      user: user.email,
      activeWorkspaceId: activeWorkspace._id,
      role: activeRole,
      status: activeWorkspace.status ?? "active",
      isAuthorized,
    });

    if (!isAuthorized) {
      console.log("[AdminLayout] Access denied for active workspace. Redirecting to /");
      return redirect("/");
    }
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("[AdminLayout] RBAC fetchQuery error:", error);
    return redirect("/");
  }

  return (
    <WorkspaceProvider>
      <div className="min-h-screen w-full bg-white dark:bg-black">
        {children}
      </div>
      <Toaster richColors position="top-right" />
      <CommandPalette />
    </WorkspaceProvider>
  );
}
