"use client";

import {
  cleanClientSessionStorage,
  performLogout,
  setupBfcacheLogoutProtection,
} from "@/lib/logout";
import { useWorkspace } from "@/lib/useWorkspace";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { Logo } from "@v1/ui/logo";
import { useQuery } from "convex/react";
import {
  Banknote,
  Briefcase,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  FileText,
  GitFork,
  HelpCircle,
  Home,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getUser);
  const { workspaces, current, select, isLoading: wsLoading } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [expandedNav, setExpandedNav] = useState<Record<string, boolean>>({
    "/worklife/kudos": true,
    "/todo": true,
    "/salary": false,
    "/leave/apply": true,
  });

  useEffect(() => {
    return setupBfcacheLogoutProtection();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await performLogout({
        signOut,
        timeoutMs: 3500,
        redirectTo: "/login",
        onError: () => {
          setLogoutError("Sign out error, redirecting...");
        },
        onTimeout: () => {
          setLogoutError("Sign out timed out, redirecting...");
        },
      });
    } catch {
      cleanClientSessionStorage();
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleForceLogout = () => {
    cleanClientSessionStorage();
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  };

  const currentRole = workspaces.find((w) => w._id === current)?.role;
  const isHR = currentRole === "owner" || currentRole === "admin";
  const myProfile = useQuery(
    api.employees.getMyProfile,
    current ? { workspaceId: current } : "skip",
  );

  const NAV = useMemo(() => {
    if (isHR) {
      return [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        {
          href: "/employees",
          label: "Employees",
          icon: Users,
          subItems: [
            { href: "/employees", label: "Directory & Profiles" },
            { href: "/employees?action=add", label: "Onboard Employee" },
            { href: "/people", label: "Organization Tree" },
          ],
        },
        {
          href: "/payroll",
          label: "Payroll",
          icon: Banknote,
          subItems: [
            { href: "/payroll", label: "Payroll Processing" },
            { href: "/salaries", label: "Salary Structures" },
            { href: "/salary", label: "Payslip Viewer" },
          ],
        },
        {
          href: "/attendance",
          label: "Attendance & Leaves",
          icon: CalendarClock,
          subItems: [
            { href: "/attendance", label: "Attendance Muster" },
            { href: "/attendance?tab=leaves", label: "Leave Approvals" },
            { href: "/leave/holiday-calendar", label: "Holiday Calendar" },
          ],
        },
        {
          href: "/compliance",
          label: "Statutory & Tax",
          icon: ShieldCheck,
          subItems: [
            { href: "/compliance", label: "PF / ESI / PT / LWF" },
            { href: "/compliance#tax-regime", label: "Form 138 TDS" },
          ],
        },
        {
          href: "/reports",
          label: "Reports Gallery",
          icon: FileText,
          subItems: [
            { href: "/reports", label: "Statutory & Bank MIS" },
            { href: "/documents", label: "Document Repository" },
          ],
        },
        { href: "/engage", label: "Engage", icon: Sparkles },
        { href: "/settings", label: "Settings", icon: Settings },
      ];
    }
    return [
      { href: "/", label: "Home", icon: Home },
      { href: "/engage", label: "Engage", icon: Sparkles },
      {
        href: "/worklife/kudos",
        label: "My Worklife",
        icon: LayoutGrid,
        subItems: [
          { href: "/worklife/kudos", label: "Kudos" },
          { href: "/worklife/feedback", label: "Feedback" },
        ],
      },
      {
        href: "/todo",
        label: "To do",
        icon: ClipboardCheck,
        subItems: [{ href: "/todo", label: "Review" }],
      },
      {
        href: "/salary",
        label: "Salary",
        icon: Wallet,
        subItems: [
          { href: "/salary", label: "Payslips" },
          { href: "/salary/ytd-reports", label: "YTD Reports" },
          { href: "/salary/it-statement", label: "IT Statement" },
          { href: "/salary/it-declaration", label: "IT Declaration" },
          { href: "/salary/loans-and-advances", label: "Loans and Advances" },
          { href: "/salary/reimbursement", label: "Reimbursement" },
          { href: "/salary/proof-of-investment", label: "Proof Of Investment" },
          { href: "/salary/salary-revision", label: "Salary Revision" },
        ],
      },
      {
        href: "/leave/apply",
        label: "Leave",
        icon: CalendarDays,
        subItems: [
          { href: "/leave/apply", label: "Leave Apply" },
          { href: "/leave/balances", label: "Leave Balances" },
          { href: "/leave/calendar", label: "Leave Calendar" },
          { href: "/leave/holiday-calendar", label: "Holiday Calendar" },
        ],
      },
      { href: "/documents", label: "Document Center", icon: FileText },
      { href: "/people", label: "People", icon: Users },
      { href: "/helpdesk", label: "Helpdesk", icon: HelpCircle },
    ];
  }, [isHR]);

  const Body = (
    <div className="flex h-full w-60 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Link href="/" className="flex items-center">
          <img
            src="/victor-chasex-logo.jpg"
            alt="VICTOR CHASEX"
            className="h-8 max-h-8 w-auto object-contain rounded"
            style={{ aspectRatio: "661 / 211" }}
          />
        </Link>
      </div>

      {/* greytHR Profile & Info Section (Matching exact screenshot) */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-zinc-800">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-200">
              Hi {myProfile?.firstName || user?.name || "Nirmala"}
            </p>
            <Link
              href="/my-portal"
              onClick={() => setOpen(false)}
              className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400 block"
            >
              View My Info
            </Link>
          </div>
        </div>

        {/* Small settings icon as seen in screenshot */}
        <Link
          href="/settings"
          title="Profile Settings"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-1">
        {NAV.map((item) => {
          const hasSub = "subItems" in item && Array.isArray(item.subItems);
          const Icon = item.icon;

          if (hasSub) {
            const isExpanded = expandedNav[item.href] ?? true;
            const isParentActive =
              (item.href === "/worklife/kudos" &&
                pathname.includes("/worklife")) ||
              (item.href === "/todo" && pathname.includes("/todo")) ||
              (item.href === "/salary" && pathname.includes("/salary")) ||
              (item.href.startsWith("/leave") && pathname.includes("/leave")) ||
              pathname.startsWith(item.href);
            return (
              <div key={item.href} className="space-y-0.5">
                <div
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition select-none ${
                    isParentActive
                      ? "font-semibold text-primary"
                      : "text-primary/70 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      setExpandedNav((prev) => ({
                        ...prev,
                        [item.href]: true,
                      }));
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label={`Toggle ${item.label} submenu`}
                    className="p-1 text-primary/50 hover:text-primary transition rounded"
                    onClick={() =>
                      setExpandedNav((prev) => ({
                        ...prev,
                        [item.href]: !isExpanded,
                      }))
                    }
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-0.5 pl-7">
                    {item.subItems?.map((sub) => {
                      const isSubActive =
                        sub.href === "/worklife/kudos"
                          ? pathname.includes("/worklife/kudos") ||
                            pathname === "/worklife" ||
                            pathname.endsWith("/worklife")
                          : sub.href === "/worklife/feedback"
                            ? pathname.includes("/worklife/feedback")
                            : sub.href === "/todo"
                              ? pathname === "/todo" ||
                                pathname.startsWith("/todo")
                              : sub.href === "/salary"
                                ? pathname === "/salary" ||
                                  pathname === "/salary/payslip"
                                : sub.href === "/leave/apply"
                                  ? pathname === "/leave" ||
                                    pathname === "/leave/apply"
                                  : pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setOpen(false)}
                          className={`block rounded-md px-3 py-1.5 text-xs transition ${
                            isSubActive
                              ? "bg-[#E8F3FC] dark:bg-blue-950/40 text-[#0091FF] dark:text-blue-400 font-semibold"
                              : "text-primary/70 hover:bg-primary/5 hover:text-primary"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-primary/70 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-lime-400 via-cyan-300 to-blue-500" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-primary/80">
              {user?.name || "—"}
            </p>
            <p className="truncate text-xs text-primary/50">{user?.email}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {logoutError && (
            <div className="flex items-center justify-between gap-1 rounded bg-destructive/10 px-2 py-1 text-[11px] text-destructive">
              <span>{logoutError}</span>
              <button
                type="button"
                onClick={handleForceLogout}
                className="underline font-medium hover:text-destructive/80"
              >
                Force
              </button>
            </div>
          )}
          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={isLoggingOut}
              aria-busy={isLoggingOut}
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-primary/60 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
            >
              <LogOut
                className={`h-4 w-4 ${isLoggingOut ? "animate-spin" : ""}`}
              />
              {isLoggingOut ? "Logging out…" : "Log out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // In greytHR Admin Shell, there is NO permanent left sidebar for HR/Admin users
  if (isHR) {
    return null;
  }

  return (
    <>
      <div className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center">
          <img
            src="/victor-chasex-logo.jpg"
            alt="VICTOR CHASEX"
            className="h-7 max-h-7 w-auto object-contain rounded"
            style={{ aspectRatio: "661 / 211" }}
          />
        </Link>
      </div>

      <aside className="sticky top-0 hidden h-screen shrink-0 md:block">
        {Body}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 cursor-default bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full shadow-xl">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute -right-9 top-3 text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            {Body}
          </div>
        </div>
      )}
    </>
  );
}
