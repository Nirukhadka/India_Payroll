"use client";

import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdminTopbar, MORE_CATEGORIES } from "../admin-topbar";

export interface EmployeeHeaderProps {
  currentCategory?: "main" | "information" | "admin" | "setup" | "overview";
  currentPageTitle?: string;
}

export function EmployeeHeader({
  currentCategory = "overview",
  currentPageTitle = "Overview",
}: EmployeeHeaderProps) {
  const [payrollMonth, setPayrollMonth] = useState("Nov'26");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
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
      {/* ── Level 1 Header: Isolated greytHR Admin Topbar with More Multi-Level Menu ── */}
      <AdminTopbar activeView="welcome" currentModule="employee" activeCategory={currentCategory} />

      {/* ── Level 2 Module Header: Secondary Navigation & Module Selectors ── */}
      <div className="border-b border-[#E2E8F0] bg-white px-4 py-2 sm:px-6 select-none z-30 relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Breadcrumbs & Secondary Nav Tabs */}
          <div className="flex items-center gap-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Link
                href="/admin"
                className="text-[#0284C7] hover:underline font-normal flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A389]" />
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <Link
                href="/admin/employee/main/overview"
                className="text-[#0284C7] hover:underline font-normal"
              >
                Employee
              </Link>
              {currentPageTitle && currentPageTitle !== "Overview" && (
                <>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {currentPageTitle}
                  </span>
                </>
              )}
            </div>

            {/* Direct Category Dropdowns (Main, Information, Admin, Setup) */}
            <div
              className="hidden md:flex items-center gap-1 text-xs relative"
              ref={menuRef}
            >
              <Link
                href="/admin/employee/main/overview"
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  currentCategory === "overview"
                    ? "bg-[#E6FFFA] text-[#0D9488] border border-[#38B2AC]"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Employee
              </Link>

              {(["main", "information", "admin", "setup"] as const).map((cat) => {
                const categoryDef = MORE_CATEGORIES[cat];
                if (!categoryDef) return null;
                const isActive = currentCategory === cat;
                const isOpen = activeDropdown === cat;
                return (
                  <div
                    key={cat}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(cat)}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDropdown((prev) => (prev === cat ? null : cat))}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition ${
                        isOpen || isActive
                          ? "font-semibold text-[#0D9488] bg-[#E6FFFA]"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {categoryDef.label}
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-150 ${
                          isOpen ? "rotate-180 text-[#0D9488]" : "text-slate-400"
                        }`}
                      />
                    </button>

                    {/* Popover Submenu */}
                    {isOpen && (
                      <div
                        className="absolute left-0 top-full mt-1.5 z-50 w-56 rounded-md border border-[#E2E8F0] bg-white py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-h-[380px] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-100"
                        onMouseEnter={() => setActiveDropdown(cat)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1 mb-1">
                          {categoryDef.label}
                        </div>
                        {categoryDef.items.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-[#F0FDF4] hover:text-[#0D9488] transition group"
                          >
                            <div className="w-1 h-1 rounded-full bg-[#00A389] shrink-0 group-hover:scale-125 transition-transform" />
                            <span className="truncate group-hover:translate-x-0.5 transition-transform">
                              {sub.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selectors & History */}
          <div className="flex items-center gap-3 text-xs">
            {/* Payroll Month Picker */}
            <div className="flex items-center gap-1.5 rounded border border-[#CBD5E1] bg-white px-2.5 py-1 text-slate-700 shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Payroll Month:</span>
              <span className="font-semibold text-slate-900">
                {payrollMonth}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
            </div>

            {/* Employee Picker */}
            <div className="flex items-center gap-1.5 rounded border border-[#CBD5E1] bg-white px-2.5 py-1 text-slate-700 shadow-2xs">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">
                {employeeFilter}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
            </div>

            {/* History Clock */}
            <button
              title="Recent History"
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded border border-[#CBD5E1] bg-white text-slate-600 hover:bg-slate-50 shadow-2xs"
            >
              <Clock className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
