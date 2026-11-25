"use client";

import {
  BarChart3,
  Calendar,
  ChevronDown,
  Clock,
  Compass,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  History,
  Layers,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminTopbar } from "../../(admin)/admin/admin-topbar";

export interface ReportsHeaderProps {
  currentPageTitle?: string;
  onHelpToggle?: () => void;
  isHelpOpen?: boolean;
}

export function ReportsHeader({
  currentPageTitle = "Reports Gallery",
  onHelpToggle,
  isHelpOpen = true,
}: ReportsHeaderProps) {
  const pathname = usePathname();
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-white border-b border-[#E2E8F0] shadow-xs sticky top-0 z-40 select-none">
      {/* Topbar: Module launcher, IndiaPay organization identity, Global Search, Profile/Settings */}
      <AdminTopbar />

      {/* Reports Secondary Navigation Subbar matching greytHR */}
      <div className="flex h-11 items-center justify-between px-6 border-t border-slate-100 bg-[#FAFAFA]">
        {/* Left: Compact navigation tabs */}
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-1">
          {/* Reports Gallery Tab */}
          <Link
            href="/admin/reports"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors shrink-0 ${
              pathname === "/admin/reports" || pathname === "/admin/reports/gallery"
                ? "bg-white text-sky-700 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Reports Gallery</span>
          </Link>

          {/* Reports Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setReportsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <span>Reports</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            {reportsDropdownOpen && (
              <div
                className="absolute left-0 mt-1 w-48 rounded-md bg-white border border-slate-200 shadow-lg py-1 z-50 text-xs"
                onMouseLeave={() => setReportsDropdownOpen(false)}
              >
                <Link
                  href="/admin/reports/recent"
                  onClick={() => setReportsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                >
                  <History className="h-3.5 w-3.5 text-slate-400" />
                  <span>Recent Reports</span>
                </Link>
                <Link
                  href="/reports/payroll-history"
                  onClick={() => setReportsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                >
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Payroll History</span>
                </Link>
              </div>
            )}
          </div>

          {/* Query Builder */}
          <Link
            href="/admin/reports/querybuilder"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors shrink-0 ${
              pathname?.startsWith("/admin/reports/querybuilder")
                ? "bg-white text-sky-700 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Query Builder</span>
          </Link>

          {/* Advanced Analytics Hub with Status Badge */}
          <Link
            href="/admin/reports/analytics"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors shrink-0 ${
              pathname?.startsWith("/admin/reports/analytics")
                ? "bg-white text-sky-700 shadow-2xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Advanced Analytics Hub</span>
            <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-1.5 py-0.2 rounded-full border border-sky-200">
              Live
            </span>
          </Link>
        </div>

        {/* Right: Help Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {onHelpToggle && (
            <button
              type="button"
              onClick={onHelpToggle}
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800 cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{isHelpOpen ? "Hide Help" : "Show Help"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
