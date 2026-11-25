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
import { AdminTopbar } from "../admin-topbar";

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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<
    "main" | "information" | "admin" | "setup" | null
  >(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
        setHoveredCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4 Top Categories & Exact Submenus matching greytHR screenshots
  const categories = {
    main: {
      label: "Main",
      items: [
        { label: "Overview", href: "/admin/employee/main/overview" },
        { label: "Analytics Hub", href: "/admin/employee/main/analytics" },
        { label: "Employee Directory", href: "/admin/employee/main/directory" },
        { label: "Organization Chart", href: "/admin/employee/main/org-chart" },
      ],
    },
    information: {
      label: "Information",
      items: [
        {
          label: "Employee Profile",
          href: "/admin/employee/information/profile",
        },
        {
          label: "Bank/PF/ESI",
          href: "/admin/employee/information/bank-pf-esi",
        },
        {
          label: "Card Details",
          href: "/admin/employee/information/card-details",
        },
        {
          label: "Passport & Visa",
          href: "/admin/employee/information/passport-visa",
        },
        {
          label: "Registration Details",
          href: "/admin/employee/information/registration",
        },
        {
          label: "Position History",
          href: "/admin/employee/information/position-history",
        },
        {
          label: "Previous Employment",
          href: "/admin/employee/information/previous-employment",
        },
        { label: "Separation", href: "/admin/employee/information/separation" },
        {
          label: "Employee Documents",
          href: "/admin/employee/information/documents",
        },
      ],
    },
    admin: {
      label: "Admin",
      items: [
        {
          label: "Excel Import",
          href: "/admin/employee/admin-ops/excel-import",
        },
        {
          label: "Bulk Photo Upload",
          href: "/admin/employee/admin-ops/bulk-photo-upload",
        },
        {
          label: "Bulk Document Upload",
          href: "/admin/employee/admin-ops/bulk-document-upload",
        },
        {
          label: "Bulletin Board",
          href: "/admin/employee/admin-ops/bulletin-board",
        },
        {
          label: "Mass Communication",
          href: "/admin/employee/admin-ops/mass-communication",
        },
        {
          label: "Identity Verification",
          href: "/admin/employee/admin-ops/identity-verification",
        },
        {
          label: "Contract Details",
          href: "/admin/employee/admin-ops/contract-details",
        },
        { label: "Data Drive", href: "/admin/employee/admin-ops/data-drive" },
        {
          label: "Off-boarding",
          href: "/admin/employee/admin-ops/offboarding",
        },
      ],
    },
    setup: {
      label: "Setup",
      items: [
        {
          label: "Company Policies & Forms",
          href: "/admin/employee/setup/company-policies",
        },
        { label: "Employee Segment", href: "/admin/employee/setup/segments" },
        { label: "Employee Filter", href: "/admin/employee/setup/filters" },
      ],
    },
  };

  return (
    <>
      {/* ── Level 1 Header: Isolated greytHR Admin Topbar ── */}
      <AdminTopbar activeView="welcome" />

      {/* ── Level 2 Module Header: Secondary Navigation & Module Selectors ── */}
      <div className="border-b border-[#E2E8F0] bg-white px-4 py-2 sm:px-8 select-none z-20 relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Breadcrumbs & Secondary Nav Tabs */}
          <div className="flex items-center gap-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Link
                href="/admin"
                className="text-[#0d6efd] hover:underline font-normal"
              >
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <Link
                href="/admin/employees"
                className="text-[#0d6efd] hover:underline font-normal"
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

            {/* Sub Nav Items */}
            <div
              className="hidden md:flex items-center gap-1 text-xs"
              ref={menuRef}
            >
              <Link
                href="/admin/employee/main/overview"
                className={`rounded-full px-3 py-1 font-semibold transition shadow-2xs ${
                  currentCategory === "overview"
                    ? "bg-[#E0F2FE] text-[#0284C7]"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Employee
              </Link>

              {/* Direct Categories */}
              {(["main", "information", "admin", "setup"] as const).map(
                (cat) => {
                  const isActive = currentCategory === cat;
                  return (
                    <div
                      key={cat}
                      className="relative"
                      onMouseEnter={() => {
                        setHoveredCategory(cat);
                        setMoreDropdownOpen(true);
                      }}
                    >
                      <button
                        type="button"
                        className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-normal transition ${
                          isActive
                            ? "font-semibold text-[#0284C7] bg-[#E0F2FE]"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {categories[cat].label}
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </button>
                    </div>
                  );
                },
              )}

              {/* Flyout Submenu Dropdown */}
              {moreDropdownOpen && hoveredCategory && (
                <div
                  className="absolute left-32 top-full mt-1 z-50 w-56 rounded-md border border-[#E2E8F0] bg-white py-1.5 shadow-lg max-h-[360px] overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-100"
                  onMouseEnter={() => setMoreDropdownOpen(true)}
                  onMouseLeave={() => {
                    setMoreDropdownOpen(false);
                    setHoveredCategory(null);
                  }}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {categories[hoveredCategory].label}
                  </div>
                  {categories[hoveredCategory].items.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMoreDropdownOpen(false)}
                      className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-[#F0F9FF] hover:text-[#0284C7] transition"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Selectors & Recents */}
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

            {/* History icon */}
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
