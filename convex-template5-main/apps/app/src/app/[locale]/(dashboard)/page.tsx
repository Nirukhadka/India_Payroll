"use client";

import { PayslipModal } from "@/components/payslip-modal";
import { downloadPayslipPdf } from "@/lib/payslip-pdf";
import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { Button } from "@v1/ui/button";
import { useMutation, useQuery } from "convex/react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  Calendar,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileText,
  Gift,
  GitFork,
  HelpCircle,
  Layers,
  Loader2,
  Moon,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GreytHRAdminDashboard } from "./_components/greyt-admin-dashboard";

// ── Shared Stat Card ─────────────────────────────────────────────────────────

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        highlight
          ? "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10"
          : "border-border bg-card"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary/60">
          <Icon className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wide font-medium">
            {label}
          </span>
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-primary">
        {value ?? "—"}
      </p>
      {sub && <p className="mt-1 text-xs text-primary/50">{sub}</p>}
    </div>
  );
}

// ── Role 2: Admin Dashboard (Full Access) ────────────────────────────────────

function AdminDashboard({ workspaceId }: { workspaceId: Id<"workspaces"> }) {
  return <GreytHRAdminDashboard workspaceId={workspaceId} />;
}

// ── greytHR Visual Reference Vector Illustrations ───────────────────────────

function WelcomeScenicIllustration({
  className = "w-72 h-32",
}: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="295" cy="70" r="30" fill="#F87171" fillOpacity="0.85" />
      <line
        x1="295"
        y1="28"
        x2="295"
        y2="18"
        stroke="#F87171"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="327"
        y1="38"
        x2="335"
        y2="30"
        stroke="#F87171"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="339"
        y1="70"
        x2="349"
        y2="70"
        stroke="#F87171"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="263"
        y1="38"
        x2="255"
        y2="30"
        stroke="#F87171"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="251"
        y1="70"
        x2="241"
        y2="70"
        stroke="#F87171"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M120 120 L180 85 L230 110 L280 80 L350 125 L390 105 L400 115"
        stroke="#334155"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M160 120 L210 95 L250 115 L320 85 L380 120"
        stroke="#64748B"
        strokeWidth="1"
        strokeDasharray="3 3"
        fill="none"
      />
      <path
        d="M280 80 Q340 50 395 35 L400 125 L350 125 Z"
        fill="#FCA5A5"
        fillOpacity="0.4"
        stroke="#DC2626"
        strokeWidth="1.5"
      />
      <path
        d="M100 145 C180 140 240 125 310 108 C350 98 380 92 400 90"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M110 158 C190 152 260 138 320 120 C360 110 390 102 400 100"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M160 148 C180 146 200 142 220 138"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M250 132 C265 128 280 125 295 121"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M315 117 C330 114 345 111 355 108"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g transform="translate(325, 68) scale(0.65)">
        <rect
          x="0"
          y="10"
          width="55"
          height="40"
          rx="6"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="2.5"
        />
        <rect
          x="4"
          y="14"
          width="22"
          height="14"
          rx="2"
          fill="#E2E8F0"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <rect
          x="29"
          y="14"
          width="22"
          height="14"
          rx="2"
          fill="#E2E8F0"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <path d="M0 32 L55 32" stroke="#EF4444" strokeWidth="3" />
        <circle cx="12" cy="50" r="7" fill="#1E293B" />
        <circle cx="12" cy="50" r="3" fill="#94A3B8" />
        <circle cx="43" cy="50" r="7" fill="#1E293B" />
        <circle cx="43" cy="50" r="3" fill="#94A3B8" />
        <path
          d="M-2 36 L2 36"
          stroke="#F59E0B"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M190 40 Q195 35 200 40 Q205 35 210 40"
        stroke="#475569"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M225 30 Q228 26 232 30 Q235 26 238 30"
        stroke="#475569"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M170 55 Q173 52 176 55 Q179 52 182 55"
        stroke="#475569"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReviewClipboardIllustration() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-16 h-16 mx-auto">
      <rect
        x="25"
        y="20"
        width="50"
        height="65"
        rx="5"
        fill="#F8FAFC"
        stroke="#64748B"
        strokeWidth="2"
      />
      <path
        d="M38 18 H62 V24 H38 Z"
        fill="#94A3B8"
        stroke="#475569"
        strokeWidth="2"
      />
      <rect
        x="42"
        y="14"
        width="16"
        height="7"
        rx="3.5"
        fill="#CBD5E1"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <line
        x1="34"
        y1="36"
        x2="66"
        y2="36"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="34"
        y1="48"
        x2="66"
        y2="48"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="34"
        y1="60"
        x2="66"
        y2="60"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 36 L33 39 L38 33"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 48 L33 51 L38 45"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 60 L33 63 L38 57"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="translate(68, 50) rotate(-35)">
        <polygon
          points="0,0 8,0 4,8"
          fill="#F59E0B"
          stroke="#B45309"
          strokeWidth="1"
        />
        <rect
          x="0"
          y="-30"
          width="8"
          height="30"
          fill="#EF4444"
          stroke="#B91C1C"
          strokeWidth="1"
        />
        <rect
          x="0"
          y="-36"
          width="8"
          height="6"
          rx="1"
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

function PayslipEmptyIllustration() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-20 h-20 mx-auto">
      <rect
        x="35"
        y="20"
        width="45"
        height="65"
        rx="6"
        fill="#F8FAFC"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <rect
        x="41"
        y="26"
        width="33"
        height="14"
        rx="2"
        fill="#2DD4BF"
        stroke="#0F172A"
        strokeWidth="1.5"
      />
      <circle cx="46" cy="48" r="2.5" fill="#94A3B8" />
      <circle cx="57.5" cy="48" r="2.5" fill="#94A3B8" />
      <circle cx="69" cy="48" r="2.5" fill="#94A3B8" />
      <circle cx="46" cy="58" r="2.5" fill="#94A3B8" />
      <circle cx="57.5" cy="58" r="2.5" fill="#94A3B8" />
      <circle cx="69" cy="58" r="2.5" fill="#94A3B8" />
      <circle cx="46" cy="68" r="2.5" fill="#94A3B8" />
      <circle cx="57.5" cy="68" r="2.5" fill="#94A3B8" />
      <circle cx="69" cy="68" r="2.5" fill="#94A3B8" />
      <circle
        cx="60"
        cy="78"
        r="18"
        fill="#F87171"
        stroke="#0F172A"
        strokeWidth="2"
      />
      <line
        x1="48"
        y1="91"
        x2="32"
        y2="107"
        stroke="#0F172A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle
        cx="90"
        cy="88"
        r="8"
        fill="#F8FAFC"
        stroke="#0F172A"
        strokeWidth="1.5"
      />
      <text
        x="90"
        y="92"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fill="#0F172A"
      >
        ₹
      </text>
    </svg>
  );
}

function TrackEmptyIllustration() {
  return (
    <svg viewBox="0 0 120 70" fill="none" className="w-20 h-12 mx-auto">
      <path
        d="M10 52 C30 50 60 54 110 50"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <circle
        cx="38"
        cy="22"
        r="5"
        fill="#FCA5A5"
        stroke="#DC2626"
        strokeWidth="1.5"
      />
      <line
        x1="38"
        y1="27"
        x2="38"
        y2="42"
        stroke="#DC2626"
        strokeWidth="1.5"
      />
      <line
        x1="38"
        y1="42"
        x2="32"
        y2="52"
        stroke="#DC2626"
        strokeWidth="1.5"
      />
      <line
        x1="38"
        y1="42"
        x2="44"
        y2="52"
        stroke="#DC2626"
        strokeWidth="1.5"
      />
      <line
        x1="38"
        y1="33"
        x2="28"
        y2="28"
        stroke="#DC2626"
        strokeWidth="1.5"
      />
      <circle cx="26" cy="26" r="4" fill="#F87171" />
      <circle
        cx="75"
        cy="18"
        r="5"
        fill="#93C5FD"
        stroke="#2563EB"
        strokeWidth="1.5"
      />
      <path
        d="M75 23 L73 38 L65 50"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M73 38 L83 48"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M74 30 L88 24"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M60 22 L95 16"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ITDeclarationIllustration() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="w-9 h-9 shrink-0">
      <rect
        x="4"
        y="8"
        width="36"
        height="30"
        rx="4"
        fill="#3B82F6"
        stroke="#1D4ED8"
        strokeWidth="1.5"
      />
      <path d="M4 14 H40" stroke="#1D4ED8" strokeWidth="1.5" />
      <rect
        x="10"
        y="5"
        width="14"
        height="6"
        rx="2"
        fill="#60A5FA"
        stroke="#1D4ED8"
        strokeWidth="1.5"
      />
      <rect x="12" y="20" width="20" height="12" rx="1.5" fill="#FFFFFF" />
      <line
        x1="16"
        y1="24"
        x2="28"
        y2="24"
        stroke="#93C5FD"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="28"
        x2="24"
        y2="28"
        stroke="#93C5FD"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function POIIllustration() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="w-9 h-9 shrink-0">
      <rect
        x="6"
        y="6"
        width="32"
        height="34"
        rx="4"
        fill="#F8FAFC"
        stroke="#64748B"
        strokeWidth="1.5"
      />
      <rect
        x="11"
        y="12"
        width="10"
        height="10"
        rx="2"
        fill="#E2E8F0"
        stroke="#94A3B8"
        strokeWidth="1"
      />
      <line
        x1="24"
        y1="14"
        x2="33"
        y2="14"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="19"
        x2="31"
        y2="19"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="28"
        x2="33"
        y2="28"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="11"
        y1="33"
        x2="26"
        y2="33"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <g transform="translate(28, 26) rotate(-45)">
        <polygon points="0,0 4,0 2,5" fill="#3B82F6" />
        <rect x="0" y="-12" width="4" height="12" fill="#60A5FA" />
      </g>
    </svg>
  );
}

function formatHolidayDate(dateStr: string) {
  try {
    const parts = dateStr.split("-").map(Number);
    const y = parts[0] ?? 2026;
    const m = parts[1] ?? 1;
    const d = parts[2] ?? 1;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  } catch {
    return dateStr;
  }
}

function formatHolidayDay(dateStr: string) {
  try {
    const parts = dateStr.split("-").map(Number);
    const y = parts[0] ?? 2026;
    const m = parts[1] ?? 1;
    const d = parts[2] ?? 1;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-IN", { weekday: "long" });
  } catch {
    return "";
  }
}

function formatMonthYear(periodMonth?: string) {
  if (!periodMonth) return "";
  const parts = periodMonth.split("-");
  if (parts.length === 2) {
    const y = parts[0];
    const m = Number.parseInt(parts[1] ?? "1", 10);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = months[m - 1] ?? "";
    return `${monthName} ${y}`;
  }
  return periodMonth;
}

function SalaryDonutChart({
  grossSalary,
  totalDeductions,
  netSalary,
  className = "w-20 h-20",
}: {
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  className?: string;
}) {
  const size = 80;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const total = grossSalary > 0 ? grossSalary : netSalary + totalDeductions;
  const safeTotal = total > 0 ? total : 100;
  const netRatio = total > 0 ? Math.max(0, netSalary / safeTotal) : 0.88;
  const dedRatio = total > 0 ? Math.max(0, totalDeductions / safeTotal) : 0.12;

  const netLength = netRatio * circumference;
  const dedLength = dedRatio * circumference;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Outer outline ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2 - 0.5}
          fill="none"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        {/* Inner outline ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2 + 0.5}
          fill="none"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        {/* Net Pay Arc (Dark Petrol / Teal Blue) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#08546A"
          strokeWidth={strokeWidth - 1}
          strokeDasharray={`${netLength} ${circumference}`}
          strokeDashoffset="0"
        />
        {/* Deduction Arc (Pale Mint Green) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#A7E2CD"
          strokeWidth={strokeWidth - 1}
          strokeDasharray={`${dedLength} ${circumference}`}
          strokeDashoffset={`${-netLength}`}
        />
      </svg>
    </div>
  );
}

// ── Role 2: Member Dashboard (Exact greytHR Reference Layout) ────────────────

function MemberDashboard({ workspaceId }: { workspaceId: Id<"workspaces"> }) {
  const memberData = useQuery(api.dashboard.memberSummary, { workspaceId });
  const user = useQuery(api.users.getUser);
  const linkMyAccount = useMutation(api.employees.linkMyAccount);

  const [linkState, setLinkState] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [linkError, setLinkError] = useState("");
  const [selectedPayslipRunId, setSelectedPayslipRunId] = useState<
    string | null
  >(null);
  const [showSalary, setShowSalary] = useState(false);
  const [isDownloadingPayslip, setIsDownloadingPayslip] = useState(false);

  const targetRunId =
    selectedPayslipRunId || memberData?.latestPayslip?.payrollRunId;
  const payslipData = useQuery(
    api.payroll.getPayslip,
    workspaceId && targetRunId && memberData?.employee
      ? {
          workspaceId,
          payrollRunId: targetRunId as Id<"payrollRuns">,
          employeeId: memberData.employee._id,
        }
      : "skip",
  );

  const isLinked = Boolean(memberData?.isLinked && memberData?.employee);
  const holidays = useQuery(
    api.leaves.getHolidays,
    workspaceId ? { workspaceId } : "skip",
  );

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const hour = now.getHours();
  const timeGreeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const upcomingHolidays = (holidays ?? [])
    .filter((h) => h.date >= todayStr)
    .slice(0, 4);

  const displayHolidays =
    upcomingHolidays.length >= 4
      ? upcomingHolidays
      : (holidays ?? []).slice(0, 4);

  const handleLink = async () => {
    setLinkState("loading");
    setLinkError("");
    try {
      await linkMyAccount({ workspaceId });
      setLinkState("success");
    } catch (e) {
      setLinkState("error");
      setLinkError((e as Error).message || "Failed to link account");
    }
  };

  if (!memberData) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-primary/40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const data = memberData;
  const employee = data.employee;

  // State A: Account Not Linked
  if (!data.isLinked || !employee) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Employee Self-Service Portal
          </h1>
          <p className="text-sm text-primary/60">
            Personal portal for payslips, leaves, and attendance.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 text-center max-w-lg mx-auto">
          <UserCircle className="mx-auto h-12 w-12 text-primary/30 mb-4" />
          <h2 className="text-lg font-semibold text-primary mb-2">
            Account Not Linked
          </h2>
          <p className="text-sm text-primary/60 mb-6">
            Your login account ({user?.email ?? "current user"}) is not yet
            linked to an employee profile in this workspace. Link your account
            to securely view your salary slips, request leaves, and review
            attendance records.
          </p>

          {linkState === "error" && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive text-left space-y-1">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{linkError.replace("ConvexError: ", "")}</span>
              </div>
              {linkError.includes("No employee record found") && (
                <p className="pl-6 text-xs text-destructive/80">
                  Please ask your workspace administrator to add or update your
                  employee profile with email: {user?.email}
                </p>
              )}
            </div>
          )}

          {linkState === "success" ? (
            <div className="mb-4 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-500 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Successfully linked!
              Refreshing your portal...
            </div>
          ) : (
            <Button onClick={handleLink} disabled={linkState === "loading"}>
              {linkState === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Link My Account
            </Button>
          )}
        </div>
      </div>
    );
  }

  const { latestPayslip } = data;

  const pendingLeavesCount = data.recentLeaves.filter(
    (l) => l.status === "pending",
  ).length;

  // State B: Linked Account with greytHR Parity Home Dashboard
  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb: Home */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
        <svg
          className="h-3.5 w-3.5 text-blue-500 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
        </svg>
        <span>Home</span>
      </div>

      {/* 2. Welcome Section */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-border dark:bg-card">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2 z-10 max-w-lg">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {timeGreeting}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Don&apos;t worry about failures, worry about the chances you miss
              when you don&apos;t even try.
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
              - Jack Canfield
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center md:justify-end">
            <WelcomeScenicIllustration className="w-64 sm:w-80 h-28 sm:h-36" />
          </div>
        </div>
      </div>

      {/* 3. Reference-Style Promotional Banner */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white px-6 py-3.5 shadow-sm sm:flex-row dark:border-border dark:bg-card">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              IndiaPay
            </span>{" "}
            Services
          </span>
        </div>

        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 sm:flex dark:bg-amber-950/40 dark:text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Your Gateway to Possibilities
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Loans, Taxes, Salary Advances,{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                All within IndiaPay!
              </span>
            </p>
          </div>
        </div>

        <Link href="/salary/loans-and-advances" className="shrink-0">
          <Button
            size="sm"
            className="bg-[#4361ee] hover:bg-[#3b53cc] text-white text-xs font-semibold px-5 rounded-md shadow-sm"
          >
            Explore
          </Button>
        </Link>
      </div>

      {/* 4. Main Dashboard Cards Grid (Exact 7 greytHR Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {/* Card 1: Review */}
        <Link
          href="/todo"
          className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-border dark:bg-card min-h-[260px]"
        >
          <div>
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Review
            </h3>
            <div className="pt-6 pb-4 flex flex-col items-center justify-center text-center">
              <ReviewClipboardIllustration />
              <p className="mt-4 text-xs font-normal text-slate-500 dark:text-slate-400">
                {pendingLeavesCount > 0
                  ? `${pendingLeavesCount} pending leave request(s) to review`
                  : "Hurrah! You've nothing to review."}
              </p>
            </div>
          </div>
        </Link>

        {/* Card 2: Upcoming Holidays */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-border dark:bg-card min-h-[260px]">
          <div>
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Upcoming Holidays
              </h3>
              <Link
                href="/leave"
                className="text-slate-400 hover:text-slate-600 transition"
                title="Holiday Calendar"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-2 divide-y divide-slate-100 dark:divide-border/40">
              {displayHolidays.map((h) => (
                <div
                  key={`${h.name}-${h.date}`}
                  className="py-2 first:pt-1 last:pb-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {formatHolidayDate(h.date)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatHolidayDay(h.date)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                    {h.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Payslip (greytHR Parity) */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-border dark:bg-card min-h-[260px]">
          <div>
            <div className="flex items-center justify-between pb-3">
              <Link
                href="/salary"
                className="text-xs font-semibold text-slate-700 hover:text-[#0091FF] transition dark:text-slate-200"
              >
                Payslip
              </Link>
              <Link
                href="/salary"
                className="text-slate-400 hover:text-slate-600 transition"
                title="View Payslips"
                aria-label="View Payslips page"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {latestPayslip ? (
              <div className="space-y-4">
                {/* Top Half: Donut Chart + Period & Paid Days */}
                <div className="flex items-center justify-between gap-3 px-1">
                  <SalaryDonutChart
                    grossSalary={
                      payslipData?.grossSalary ?? latestPayslip.grossSalary
                    }
                    totalDeductions={
                      payslipData?.totalDeductions ??
                      latestPayslip.totalDeductions
                    }
                    netSalary={
                      payslipData?.netSalary ?? latestPayslip.netSalary
                    }
                  />

                  <div className="text-right space-y-1.5">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                      {formatMonthYear(latestPayslip.periodMonth)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">
                        {payslipData?.effectiveWorkDays ?? 30}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        Paid Days
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend Breakdown */}
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-600 dark:text-slate-400 font-medium">
                      <span className="inline-block w-[3px] h-3 rounded-full bg-slate-900 dark:bg-slate-100 mr-2 shrink-0" />
                      <span>Gross Pay</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {showSalary
                        ? `₹${(payslipData?.grossSalary ?? latestPayslip.grossSalary).toLocaleString("en-IN")}`
                        : "*****"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-600 dark:text-slate-400 font-medium">
                      <span className="inline-block w-[3px] h-3 rounded-full bg-[#A7E2CD] mr-2 shrink-0" />
                      <span>Deduction</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {showSalary
                        ? `₹${(payslipData?.totalDeductions ?? latestPayslip.totalDeductions).toLocaleString("en-IN")}`
                        : "*****"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-600 dark:text-slate-400 font-medium">
                      <span className="inline-block w-[3px] h-3 rounded-full bg-[#08546A] mr-2 shrink-0" />
                      <span>Net Pay</span>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {showSalary
                        ? `₹${(payslipData?.netSalary ?? latestPayslip.netSalary).toLocaleString("en-IN")}`
                        : "*****"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 flex flex-col items-center justify-center text-center">
                <PayslipEmptyIllustration />
                <p className="mt-3 text-xs font-normal text-slate-500 dark:text-slate-400 leading-relaxed px-1">
                  Uh oh! Your Payslip will show up here after the release of
                  Payroll.
                </p>
              </div>
            )}
          </div>

          {latestPayslip && (
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-border/60">
              <button
                type="button"
                onClick={() => {
                  if (payslipData) {
                    setIsDownloadingPayslip(true);
                    try {
                      downloadPayslipPdf(payslipData);
                    } catch (e) {
                      console.error("Download failed:", e);
                    } finally {
                      setTimeout(() => setIsDownloadingPayslip(false), 500);
                    }
                  } else {
                    setSelectedPayslipRunId(latestPayslip.payrollRunId);
                  }
                }}
                disabled={isDownloadingPayslip}
                className="text-xs font-semibold text-[#0091FF] hover:underline cursor-pointer disabled:opacity-50 transition"
              >
                {isDownloadingPayslip ? "Downloading…" : "Download"}
              </button>
              <button
                type="button"
                onClick={() => setShowSalary((prev) => !prev)}
                aria-label={
                  showSalary ? "Hide Salary Amounts" : "Show Salary Amounts"
                }
                className="text-xs font-semibold text-[#0091FF] hover:underline cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0091FF] rounded px-1 transition"
              >
                {showSalary ? "Hide Salary" : "Show Salary"}
              </button>
            </div>
          )}
        </div>

        {/* Col 4: Quick Access & Track */}
        <div className="flex flex-col gap-4">
          {/* Card 4: Quick Access */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-border dark:bg-card">
            <div>
              <div className="flex items-start justify-between pb-1">
                <div>
                  <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Quick Access
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    Use quick access to view important salary details
                  </p>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <Link
                  href="/salary/reimbursement"
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-blue-600 py-1 transition group dark:text-slate-400"
                >
                  <span>Reimbursement Payslip</span>
                  <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-blue-600 transition" />
                </Link>
                <Link
                  href="/salary/it-statement"
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-blue-600 py-1 transition group dark:text-slate-400"
                >
                  <span>IT Statement</span>
                  <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-blue-600 transition" />
                </Link>
                <Link
                  href="/salary/ytd-reports"
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-blue-600 py-1 transition group dark:text-slate-400"
                >
                  <span>YTD Reports</span>
                  <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-blue-600 transition" />
                </Link>
                <Link
                  href="/salary/loans-and-advances"
                  className="flex items-center justify-between text-xs text-slate-600 hover:text-blue-600 py-1 transition group dark:text-slate-400"
                >
                  <span>Loan Statement</span>
                  <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-blue-600 transition" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 5: Track */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-border dark:bg-card">
            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Track
              </h3>
              <div className="py-1.5 flex flex-col items-center justify-center text-center">
                <TrackEmptyIllustration />
                <p className="mt-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                  All good! You&apos;ve nothing new to track.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Col 5: IT Declaration & POI */}
        <div className="flex flex-col gap-4">
          {/* Card 6: IT Declaration */}
          <Link
            href="/salary/it-declaration"
            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-slate-300 dark:border-border dark:bg-card"
          >
            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                IT Declaration
              </h3>
              <div className="flex items-start gap-2.5 py-0.5">
                <ITDeclarationIllustration />
                <p className="text-[11px] text-slate-500 leading-relaxed dark:text-slate-400">
                  Hold on! You can submit your Income Tax (IT) declaration once
                  released.
                </p>
              </div>
            </div>
          </Link>

          {/* Card 7: POI */}
          <Link
            href="/salary/proof-of-investment"
            className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-slate-300 dark:border-border dark:bg-card"
          >
            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                POI
              </h3>
              <div className="flex items-start gap-2.5 py-0.5">
                <POIIllustration />
                <p className="text-[11px] text-slate-500 leading-relaxed dark:text-slate-400">
                  Hold on! You can submit your Proof of Investments (POI) once
                  released.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Payslip Modal for PDF view & download */}
      <PayslipModal
        open={Boolean(selectedPayslipRunId)}
        onOpenChange={(open) => !open && setSelectedPayslipRunId(null)}
        payslip={payslipData}
        isLoading={selectedPayslipRunId !== null && !payslipData}
      />
    </div>
  );
}

// ── Main Dashboard Router Component ──────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const { current, workspaces, isLoading: wsLoading } = useWorkspace();
  const effectiveWorkspaceId = current ?? workspaces[0]?._id;
  const currentWorkspace = workspaces.find(
    (w) => w._id === effectiveWorkspaceId,
  );
  const role = currentWorkspace?.role;

  // Immediate deterministic redirect for admin and owner roles to dedicated /admin route
  useEffect(() => {
    if (!wsLoading && workspaces.length > 0 && role && role !== "member") {
      router.replace("/admin");
    }
  }, [wsLoading, workspaces.length, role, router]);

  if (wsLoading && workspaces.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12 text-primary/40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!effectiveWorkspaceId) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12 text-sm text-primary/50">
        Please select a workspace from the sidebar.
      </div>
    );
  }

  // If role is admin or owner, display clean spinner while instant redirect executes
  if (role && role !== "member") {
    return (
      <div className="flex h-screen w-full items-center justify-center p-12 text-primary/40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Employee/Member renders ESS dashboard
  return (
    <div className="flex h-full w-full bg-[#f8fafc] px-6 py-6 dark:bg-black">
      <div className="mx-auto w-full max-w-7xl">
        <MemberDashboard workspaceId={effectiveWorkspaceId} />
      </div>
    </div>
  );
}
