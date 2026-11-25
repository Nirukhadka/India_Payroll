"use client";

import { cleanClientSessionStorage, performLogout } from "@/lib/logout";
import { useWorkspace } from "@/lib/useWorkspace";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  FileText,
  KeyRound,
  Lock,
  LogOut,
  Search,
  Server,
  Settings,
  ShieldAlert,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QuickLauncherModal } from "../../(dashboard)/_components/quick-launcher-modal";

export interface NavSubmenuItem {
  label: string;
  href: string;
  badge?: string;
}

export interface NavCategory {
  label: string;
  items: NavSubmenuItem[];
}

export const MORE_CATEGORIES: Record<string, NavCategory> = {
  main: {
    label: "Main",
    items: [
      { label: "Analytics Hub", href: "/admin/employee/main/analytics" },
      { label: "Employee Directory", href: "/admin/employee/main/directory" },
      { label: "Organization Chart", href: "/admin/employee/main/org-chart" },
    ],
  },
  information: {
    label: "Information",
    items: [
      { label: "Employee Profile", href: "/admin/employee/information/profile" },
      { label: "Bank/PF/ESI", href: "/admin/employee/information/bank-pf-esi" },
      { label: "Card Details", href: "/admin/employee/information/card-details" },
      { label: "Passport & Visa", href: "/admin/employee/information/passport-visa" },
      { label: "Registration Details", href: "/admin/employee/information/registration" },
      { label: "Position History", href: "/admin/employee/information/position-history" },
      { label: "Previous Employment", href: "/admin/employee/information/previous-employment" },
      { label: "Separation", href: "/admin/employee/information/separation" },
      { label: "Employee Documents", href: "/admin/employee/information/documents" },
      { label: "Employee Salary", href: "/admin/payroll/information" },
    ],
  },
  admin: {
    label: "Admin",
    items: [
      { label: "Excel Import", href: "/admin/employee/admin-ops/excel-import" },
      { label: "Bulk Photo Upload", href: "/admin/employee/admin-ops/bulk-photo-upload" },
      { label: "Bulk Document Upload", href: "/admin/employee/admin-ops/bulk-document-upload" },
      { label: "Bulletin Board", href: "/admin/employee/admin-ops/bulletin-board" },
      { label: "Mass Communication", href: "/admin/employee/admin-ops/mass-communication" },
      { label: "Identity Verification", href: "/admin/employee/admin-ops/identity-verification" },
      { label: "Contract Details", href: "/admin/employee/admin-ops/contract-details" },
      { label: "Data Drive", href: "/admin/employee/admin-ops/data-drive" },
      { label: "Off-boarding", href: "/admin/employee/admin-ops/offboarding" },
    ],
  },
  setup: {
    label: "Setup",
    items: [
      { label: "Company Policies & Forms", href: "/admin/employee/setup/company-policies" },
      { label: "Employee Segment", href: "/admin/employee/setup/segments" },
      { label: "Employee Filter", href: "/admin/employee/setup/filters" },
    ],
  },
};

interface AdminTopbarProps {
  activeView?: "welcome" | "dashboard";
  onViewChange?: (view: "welcome" | "dashboard") => void;
  currentModule?: "employee" | "payroll" | "leave" | "attendance" | "reports" | "workflow";
  activeCategory?: string;
}

export function AdminTopbar({
  activeView = "welcome",
  onViewChange,
  currentModule = "employee",
  activeCategory,
}: AdminTopbarProps) {
  const pathname = usePathname();
  // The Welcome dashboard specifically (/admin or /admin/) does not render Employee or More
  const isWelcomePage = pathname === "/admin" || pathname?.endsWith("/admin");

  const [launcherOpen, setLauncherOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>("main");

  const settingsRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuthActions();

  const { workspaces, current, select } = useWorkspace();
  const effectiveWsId = current ?? workspaces[0]?._id;
  const currentWs = workspaces.find((w) => w._id === effectiveWsId);
  const activeRole = currentWs?.role;
  const isAdmin = activeRole === "admin" || activeRole === "owner";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="relative flex h-[68px] w-full shrink-0 items-center justify-between bg-white px-4 lg:px-6 z-40 select-none border-b border-[#E2E8F0]">
        {/* Left: 9-Dot App Launcher + Company Identity Pill + Module Selector + More Navigation */}
        <div className="flex items-center gap-3.5">
          {/* 9-Dot App Launcher Button */}
          <button
            type="button"
            onClick={() => setLauncherOpen((prev) => !prev)}
            title="Apps"
            aria-label="Apps"
            className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[#4A5568] hover:bg-[#F7FAFC] transition active:scale-95"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 256 256"
              aria-hidden="true"
              className="h-6 w-6 text-[#4A5568]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M76,60A16,16,0,1,1,60,44,16,16,0,0,1,76,60Zm52-16a16,16,0,1,0,16,16A16,16,0,0,0,128,44Zm68,32a16,16,0,1,0-16-16A16,16,0,0,0,196,76ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112ZM60,180a16,16,0,1,0,16,16A16,16,0,0,0,60,180Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,128,180Zm68,0a16,16,0,1,0,16,16A16,16,0,0,0,196,180Z" />
            </svg>
          </button>

          {/* Company Identity Area with Multi-Workspace Switching */}
          {workspaces.length > 1 ? (
            <div className="relative flex items-center">
              <select
                value={effectiveWsId ?? ""}
                onChange={(e) => {
                  const targetId = e.target.value as any;
                  select(targetId);
                  window.location.reload();
                }}
                className="appearance-none cursor-pointer rounded-full bg-[#FFDF00] pl-3.5 pr-7 py-1.5 text-xs font-black tracking-wide text-black hover:opacity-95 shadow-xs border-0 outline-none"
              >
                {workspaces.map((w) => (
                  <option key={w._id} value={w._id} className="bg-white text-slate-800 font-medium">
                    {w.name} ({w.role})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-black" />
            </div>
          ) : (
            <Link
              href="/admin"
              className="flex items-center rounded-full bg-[#FFDF00] px-3.5 py-1.5 text-xs font-black tracking-wide text-black hover:opacity-95 shadow-xs"
            >
              {currentWs?.name || "VICTOR CHASEX"}
            </Link>
          )}

          {/* Current Module Badge - Hidden on Welcome Dashboard per greytHR reference */}
          {!isWelcomePage && (
            <Link
              href={currentModule === "payroll" ? "/admin/payroll" : "/admin/employee/main/overview"}
              className={`hidden sm:inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold border transition ${
                currentModule === "payroll"
                  ? "bg-[#FFF5F5] border-[#FEB2B2] text-[#E53E3E]"
                  : "bg-[#E6FFFA] border-[#38B2AC] text-[#0D9488]"
              }`}
            >
              {currentModule === "payroll" ? "Payroll" : "Employee"}
            </Link>
          )}

          {/* More Multi-Level Navigation Dropdown Trigger - Hidden on Welcome Dashboard per greytHR reference */}
          {!isWelcomePage && (
            <div
              className="relative"
              ref={moreMenuRef}
              onMouseEnter={() => setMoreMenuOpen(true)}
              onMouseLeave={() => setMoreMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                aria-expanded={moreMenuOpen}
                className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[14px] font-medium transition ${
                  moreMenuOpen
                    ? "bg-[#EDF2F7] text-[#1A202C]"
                    : "text-[#4A5568] hover:bg-[#F7FAFC] hover:text-[#1A202C]"
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#718096] transition-transform duration-150 ${
                    moreMenuOpen ? "rotate-180 text-[#1A202C]" : ""
                  }`}
                />
              </button>

              {/* Multi-Level Flyout Navigation Popover */}
              {moreMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-1.5 z-50 flex rounded-[8px] border border-[#E2E8F0] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                  style={{ minHeight: "220px" }}
                >
                  {/* Level 1: Categories Menu (Main, Information, Admin, Setup) */}
                  <div className="w-[170px] border-r border-[#E2E8F0] py-2 bg-white rounded-l-[8px]">
                    {Object.entries(MORE_CATEGORIES).map(([catKey, cat]) => {
                      const isSelected = hoveredCategory === catKey;
                      return (
                        <div
                          key={catKey}
                          onMouseEnter={() => setHoveredCategory(catKey)}
                          className={`group flex items-center justify-between px-3.5 py-2 cursor-pointer transition select-none ${
                            isSelected
                              ? "bg-[#F7FAFC] text-[#1A202C] font-semibold"
                              : "text-[#4A5568] hover:bg-[#F7FAFC] hover:text-[#1A202C]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {/* Active Indicator Bar */}
                            <div
                              className={`w-1 h-3.5 rounded-full transition-all ${
                                isSelected ? "bg-[#00A389]" : "bg-transparent"
                              }`}
                            />
                            <span className="text-[14px]">{cat.label}</span>
                          </div>
                          <ChevronRight
                            className={`h-3.5 w-3.5 text-[#A0AEC0] group-hover:text-[#4A5568] group-hover:translate-x-0.5 transition-all ${
                              isSelected ? "text-[#4A5568] translate-x-0.5" : ""
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Level 2: Submenu Flyout (Items for Selected Category) */}
                  <div
                    className="w-[220px] py-2 bg-white rounded-r-[8px] max-h-[380px] overflow-y-auto"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#CBD5E0 #F7FAFC",
                    }}
                  >
                    {hoveredCategory && MORE_CATEGORIES[hoveredCategory] ? (
                      <div className="space-y-0.5">
                        {MORE_CATEGORIES[hoveredCategory].items.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMoreMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-[14px] text-[#4A5568] hover:bg-[#F7FAFC] hover:text-[#1A202C] transition select-none group"
                          >
                            {/* Bullet Dot */}
                            <div className="w-1 h-1 rounded-full bg-[#00A389] shrink-0 group-hover:scale-125 transition-transform" />
                            <span className="truncate group-hover:translate-x-0.5 transition-transform">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Global Search Anything + Keyboard Indicator + AI Quick Action + Settings Dropdown + Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global Search Bar */}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
              );
            }}
            className="flex items-center gap-2.5 rounded-full border border-[#CBD5E0] bg-white px-3.5 py-1.5 text-xs text-[#A0AEC0] hover:border-slate-400 transition w-48 sm:w-60 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[#A0AEC0]" />
              <span className="text-[#A0AEC0] text-[13px]">
                Search Anything
              </span>
            </div>
            <div className="rounded bg-[#EDF2F7] px-1.5 py-0.5 text-[11px] font-medium text-[#718096]">
              Ctrl + K
            </div>
          </button>

          {/* AI Quick Action Button */}
          <button
            type="button"
            title="AI Assistant"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
              );
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white hover:bg-slate-50 transition active:scale-95 shadow-xs"
          >
            <Sparkles className="h-4 w-4 text-[#F59E0B]" />
          </button>

          {/* Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setSettingsOpen((prev) => !prev)}
              title="Settings"
              aria-label="Settings"
              aria-expanded={settingsOpen}
              className={`flex h-9 items-center gap-1 rounded-full border px-2.5 transition active:scale-95 ${
                settingsOpen
                  ? "border-blue-600 bg-blue-50/60 text-blue-600 shadow-sm"
                  : "border-[#CBD5E0] bg-white text-[#4A5568] hover:bg-[#F7FAFC]"
              }`}
            >
              <Settings
                className={`h-4 w-4 ${settingsOpen ? "text-blue-600" : "text-[#4A5568]"}`}
              />
              {settingsOpen ? (
                <ChevronUp className="h-3 w-3 text-blue-600" />
              ) : (
                <ChevronDown className="h-3 w-3 text-[#A0AEC0]" />
              )}
            </button>

            {/* "Go to" Dropdown Menu */}
            {settingsOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200/90 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Go to
                </div>

                <div className="space-y-0.5">
                  <Link
                    href="/admin/settings/profile"
                    onClick={() => setSettingsOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/admin/account-settings/plan"
                    onClick={() => setSettingsOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <KeyRound className="h-4 w-4 text-slate-400" />
                    <span>Account Settings</span>
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <Link
                    href="/admin/user-administration/roles"
                    onClick={() => setSettingsOpen(false)}
                    role="menuitem"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>User Administration</span>
                    </div>
                    {!isAdmin && (
                      <span title="Admin only">
                        <Lock className="h-3 w-3 text-slate-400" />
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/admin/system-settings/general/company-info"
                    onClick={() => setSettingsOpen(false)}
                    role="menuitem"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>System Settings</span>
                    </div>
                    {!isAdmin && (
                      <span title="Admin only">
                        <Lock className="h-3 w-3 text-slate-400" />
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/admin/settings/backroom"
                    onClick={() => setSettingsOpen(false)}
                    role="menuitem"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Server className="h-4 w-4 text-slate-400" />
                      <span>Sys Admin Backroom</span>
                    </div>
                    {!isAdmin && (
                      <span title="Privileged access only">
                        <ShieldAlert className="h-3 w-3 text-amber-500" />
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Logout / Power Control */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign Out"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CBD5E0] bg-white text-[#4A5568] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition active:scale-95"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 9-Dot Quick Launcher Modal */}
      <QuickLauncherModal
        open={launcherOpen}
        isOpen={launcherOpen}
        onOpenChange={setLauncherOpen}
        onClose={() => setLauncherOpen(false)}
      />
    </>
  );
}
