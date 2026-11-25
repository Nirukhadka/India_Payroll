"use client";

import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { createContext, useContext, useEffect, useState } from "react";

type WS = { _id: Id<"workspaces">; name: string; role: string; status?: string };
type Ctx = {
  workspaces: WS[];
  current: Id<"workspaces"> | null;
  select: (id: Id<"workspaces">) => void;
  isLoading: boolean;
};

const WorkspaceCtx = createContext<Ctx>({
  workspaces: [],
  current: null,
  select: () => {},
  isLoading: true,
});
export const useWorkspace = () => useContext(WorkspaceCtx);

/**
 * Holds the current workspace in React context (persisted to localStorage) so the sidebar
 * switcher and every page share it reactively — switching updates all consumers at once.
 */
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const workspaces = useQuery(
    api.orgs.myWorkspaces,
    isAuthenticated ? {} : "skip",
  ) as WS[] | undefined;
  const ensure = useMutation(api.orgs.ensureWorkspace);
  const [current, setCurrent] = useState<Id<"workspaces"> | null>(null);
  const [ensuring, setEnsuring] = useState(false);

  useEffect(() => {
    // If not authenticated, ensure state is cleanly cleared and no mutations are invoked
    if (!isAuthenticated) {
      setCurrent(null);
      setEnsuring(false);
      return;
    }

    if (workspaces === undefined) return;

    if (workspaces.length === 0) {
      if (!ensuring) {
        setEnsuring(true);
        void ensure({})
          .catch((err) => {
            console.warn("Could not ensure workspace:", err);
          })
          .finally(() => setEnsuring(false));
      }
      return;
    }

    setCurrent((prev) => {
      if (prev && workspaces.some((w) => w._id === prev)) return prev;
      const saved =
        typeof window !== "undefined"
          ? window.localStorage.getItem("ws")
          : null;
      const match = workspaces.find((w) => w._id === saved);
      const chosen = match?._id ?? workspaces[0]?._id ?? prev;
      if (chosen && typeof window !== "undefined") {
        document.cookie = `ws=${chosen}; path=/; max-age=31536000; SameSite=Lax`;
      }
      return chosen;
    });
  }, [isAuthenticated, workspaces, ensure, ensuring]);

  const select = (id: Id<"workspaces">) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ws", id);
      document.cookie = `ws=${id}; path=/; max-age=31536000; SameSite=Lax`;
    }
    setCurrent(id);
  };

  const effectiveCurrent =
    current ??
    (workspaces && workspaces.length > 0
      ? typeof window !== "undefined" && window.localStorage.getItem("ws")
        ? workspaces.find((w) => w._id === window.localStorage.getItem("ws"))
            ?._id ??
          workspaces[0]?._id ??
          null
        : workspaces[0]?._id ?? null
      : null);

  return (
    <WorkspaceCtx.Provider
      value={{
        workspaces: isAuthenticated ? workspaces ?? [] : [],
        current: effectiveCurrent,
        select,
        isLoading: authLoading || (isAuthenticated && workspaces === undefined),
      }}
    >
      {children}
    </WorkspaceCtx.Provider>
  );
}
