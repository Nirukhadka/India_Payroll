"use client";

import { cleanClientSessionStorage, performLogout } from "@/lib/logout";
import { useWorkspace } from "@/lib/useWorkspace";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Power,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NotificationsBell } from "./notifications-bell";
import { QuickLauncherModal } from "./quick-launcher-modal";

const TITLES: Record<string, string> = {
  "/": "Home",
  "/engage": "Engage",
  "/worklife": "My Worklife",
  "/todo": "To Do",
  "/salary": "Salary",
  "/leave": "Leave Apply",
  "/leave/apply": "Leave Apply",
  "/leave/balances": "Leave Balances",
  "/leave/calendar": "Leave Calendar",
  "/leave/holiday-calendar": "Holiday Calendar",
  "/documents": "Document Center",
  "/people": "People",
  "/helpdesk": "Helpdesk",
  "/delegates": "Workflow Delegates",
  "/my-portal": "My Info",
  "/employees": "Employees",
  "/salaries": "Salaries",
  "/payroll": "Payroll",
  "/attendance": "Attendance",
  "/compliance": "Compliance",
  "/reports": "Reports",
  "/settings": "Settings",
};

// Exact greytHR 9-dot SVG
export function GreytHRNineDotIcon({
  className = "h-5 w-5 text-[#5A6A7C]",
}: { className?: string }) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 256 256"
      aria-hidden="true"
      focusable="false"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M76,60A16,16,0,1,1,60,44,16,16,0,0,1,76,60Zm52-16a16,16,0,1,0,16,16A16,16,0,0,0,128,44Zm68,32a16,16,0,1,0-16-16A16,16,0,0,0,196,76ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112ZM60,180a16,16,0,1,0,16,16A16,16,0,0,0,60,180Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,128,180Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,196,180Z" />
    </svg>
  );
}

export function Topbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Home";
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.getUser);
  const { workspaces, current } = useWorkspace();

  const currentRole = workspaces.find((w) => w._id === current)?.role;
  const isHR = currentRole === "owner" || currentRole === "admin";

  const handleLogout = async () => {
    try {
      await performLogout({
        signOut,
        timeoutMs: 3500,
        redirectTo: "/login",
      });
    } catch {
      cleanClientSessionStorage();
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
  };

  // If user is Admin / HR, render the Exact greytHR Admin Top Header
  if (isHR) {
    return (
      <>
        <header className="flex h-[56px] w-full shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 sm:px-6 z-30 select-none">
          {/* 1. Nine-dot application launcher & 2. VICTOR CHASEX brand/logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLauncherOpen((prev) => !prev)}
              title="Apps"
              aria-label="Apps"
              className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#CBD5E1] bg-white text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
            >
              <GreytHRNineDotIcon className="h-5 w-5 text-slate-600" />
            </button>

            <Link href="/" className="flex items-center">
              <img
                src="/victor-chasex-logo.jpg"
                alt="VICTOR CHASEX"
                className="h-[28px] w-auto object-contain rounded"
                style={{ aspectRatio: "661 / 211" }}
              />
            </Link>
          </div>

          {/* 3. Flexible empty space (flex-1) */}
          <div className="flex-1" />

          {/* Right Controls: 4. Search Anything, 5. AI Assistant, 6. Settings gear with dropdown arrow, 7. Power/logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 4. Search Anything input with Ctrl + K shortcut */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
                );
              }}
              className="flex items-center gap-3 rounded-full border border-[#CBD5E1] bg-white px-3.5 py-1.5 text-xs text-[#94A3B8] hover:border-slate-400 transition w-48 sm:w-64 justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-[#94A3B8]" />
                <span className="text-[#94A3B8] text-[13px]">
                  Search Anything
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8] font-normal">
                Ctrl + K
              </span>
            </button>

            {/* 5. AI assistant button */}
            <button
              type="button"
              title="AI Assistant"
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
                );
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CBD5E1] bg-white text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#F59E0B]" />
            </button>

            {/* 6. Settings gear with dropdown arrow */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen(!settingsOpen)}
                title="Settings"
                aria-label="Settings"
                className="flex h-9 items-center gap-1 rounded-full border border-[#CBD5E1] bg-white px-2.5 text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
              >
                <Settings className="h-4 w-4 text-slate-600" />
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {settingsOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-50"
                  onMouseLeave={() => setSettingsOpen(false)}
                >
                  <Link
                    href="/settings"
                    onClick={() => setSettingsOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    System Settings
                  </Link>
                  <Link
                    href="/compliance"
                    onClick={() => setSettingsOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Statutory &amp; Compliance
                  </Link>
                  <Link
                    href="/settings#payroll"
                    onClick={() => setSettingsOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Payroll Configuration
                  </Link>
                </div>
              )}
            </div>

            {/* 7. Power/logout button */}
            <button
              type="button"
              onClick={handleLogout}
              title="Log Out"
              aria-label="Log Out"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CBD5E1] bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition active:scale-95 cursor-pointer"
            >
              <Power className="h-4 w-4 text-slate-600 hover:text-red-600" />
            </button>
          </div>
        </header>

        {/* greytHR Quick Apps Launcher Popover / Modal */}
        <QuickLauncherModal
          open={launcherOpen}
          onOpenChange={setLauncherOpen}
        />
      </>
    );
  }

  // Regular Employee Dashboard view (ESS) — Nine-dot launcher is strictly omitted per specification
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-[#F8FAFC] px-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Left Side: Page Title with greytHR Folded Ribbon Icon (Nine-dot launcher removed from ESS) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center text-blue-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-blue-400/80 stroke-blue-500"
            >
              <path
                d="M4 4 L14 4 L18 8 L18 20 L4 20 Z"
                fill="currentColor"
                fillOpacity="0.3"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M14 4 L14 8 L18 8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Side: Quick Links Dropdown, Notification Bell, and Power Button */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Quick Links Menu */}
        <div className="relative">
          <button type="button"
            onClick={() => setQuickLinksOpen(!quickLinksOpen)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition"
          >
            <span>Quick Links</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {quickLinksOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 z-50"
              onMouseLeave={() => setQuickLinksOpen(false)}
            >
              <Link
                href="/salary"
                onClick={() => setQuickLinksOpen(false)}
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Payslip &amp; Salary
              </Link>
              <Link
                href="/leave/apply"
                onClick={() => setQuickLinksOpen(false)}
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Apply Leave
              </Link>
              <Link
                href="/attendance"
                onClick={() => setQuickLinksOpen(false)}
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Attendance Swipes
              </Link>
              <Link
                href="/documents"
                onClick={() => setQuickLinksOpen(false)}
                className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Document Center
              </Link>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <NotificationsBell />

        {/* Power / Logout Control */}
        <button type="button"
          onClick={handleLogout}
          title="Sign out"
          className="text-slate-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition"
        >
          <Power className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
