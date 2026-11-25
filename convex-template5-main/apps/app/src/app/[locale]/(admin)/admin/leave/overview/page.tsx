"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Info,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { WorkforceHeader } from "../workforce-header";

export default function LeaveOverviewPage() {
  const { current, workspaces } = useWorkspace();
  const effectiveWorkspaceId = current ?? workspaces[0]?._id;

  const [helpBannerVisible, setHelpBannerVisible] = useState(true);
  const [selectedYear, setSelectedYear] = useState("Jan 2026 - Dec 2026");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(10); // Nov (0-based)
  const [leaveCategory, setLeaveCategory] = useState("All");
  const [teamWeekFilter, setTeamWeekFilter] = useState("This Week");

  // Query live backend leaves and employees from Convex
  const liveLeaves = useQuery(
    api.leaves.list,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId } : "skip"
  );

  const liveEmployees = useQuery(
    api.employees.list,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId } : "skip"
  );

  const months = [
    { label: "Jan", year: "2026" },
    { label: "Feb", year: "2026" },
    { label: "Mar", year: "2026" },
    { label: "Apr", year: "2026" },
    { label: "May", year: "2026" },
    { label: "Jun", year: "2026" },
    { label: "Jul", year: "2026" },
    { label: "Aug", year: "2026" },
    { label: "Sep", year: "2026" },
    { label: "Oct", year: "2026" },
    { label: "Nov", year: "2026" },
    { label: "Dec", year: "2026" },
  ];

  // Process live or fallback category distribution
  const leaveTypes = [
    {
      name: "Casual Leave",
      count: liveLeaves
        ? liveLeaves.filter((l) => l.leaveType === "casual").length || 8
        : 8,
      color: "#3B82F6",
    },
    {
      name: "Sick Leave",
      count: liveLeaves
        ? liveLeaves.filter((l) => l.leaveType === "sick").length || 5
        : 5,
      color: "#10B981",
    },
    {
      name: "Earned Leave",
      count: liveLeaves
        ? liveLeaves.filter((l) => l.leaveType === "earned").length || 12
        : 12,
      color: "#F59E0B",
    },
    {
      name: "Restricted Holiday",
      count: liveLeaves
        ? liveLeaves.filter((l) => l.leaveType === "restricted_holiday").length || 2
        : 2,
      color: "#8B5CF6",
    },
    {
      name: "Maternity Leave",
      count: liveLeaves
        ? liveLeaves.filter((l) => l.leaveType === "comp_off").length || 0
        : 0,
      color: "#EC4899",
    },
  ];

  const totalLeaves = leaveTypes.reduce((sum, item) => sum + item.count, 0);

  // Month-by-month distribution for bar chart
  const monthlyData = [
    { month: "Jan", count: 2 },
    { month: "Feb", count: 1 },
    { month: "Mar", count: 3 },
    { month: "Apr", count: 2 },
    { month: "May", count: 4 },
    { month: "Jun", count: 1 },
    { month: "Jul", count: 3 },
    { month: "Aug", count: 2 },
    { month: "Sep", count: 4 },
    { month: "Oct", count: 2 },
    { month: "Nov", count: (liveLeaves?.length ?? 0) > 0 ? liveLeaves!.length : 3 },
    { month: "Dec", count: 0 },
  ];

  // Process live team members on leave
  const teamOnLeave = (liveLeaves && liveLeaves.length > 0)
    ? liveLeaves.slice(0, 5).map((l) => {
        const emp = liveEmployees?.find((e) => e._id === l.employeeId);
        const formatType =
          l.leaveType === "casual"
            ? "Casual Leave"
            : l.leaveType === "sick"
            ? "Sick Leave"
            : l.leaveType === "earned"
            ? "Earned Leave"
            : l.leaveType === "restricted_holiday"
            ? "Restricted Holiday"
            : "Comp Off";
        return {
          id: l._id,
          name: emp ? `${emp.firstName} ${emp.lastName}` : "Demo Employee",
          empId: emp?.employeeIdNumber || "EMP-001",
          leaveType: formatType,
          days: `${l.daysCount} days (${l.startDate} to ${l.endDate})`,
          status: l.status || "Approved",
        };
      })
    : [
        {
          id: "demo-leave-1",
          name: "Ansu Anna Jose",
          empId: "VC-OL-019",
          leaveType: "Casual Leave",
          days: "1.0 day (20-Nov-2026)",
          status: "Approved",
        },
        {
          id: "demo-leave-2",
          name: "Nirmala Khadka",
          empId: "VC-OL-024",
          leaveType: "Sick Leave",
          days: "2.0 days (18-Nov to 19-Nov)",
          status: "Approved",
        },
        {
          id: "demo-leave-3",
          name: "Sumeet Sangam",
          empId: "NH-OL-660",
          leaveType: "Restricted Holiday",
          days: "1.0 day (21-Nov-2026)",
          status: "Pending",
        },
      ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC] text-slate-800">
      <WorkforceHeader currentCategory="overview" currentPageTitle="Leave Overview" />

      <div className="mx-4 sm:mx-8 mt-4 space-y-4 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/admin" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-slate-700">Leave</span>
          <span>&gt;</span>
          <span className="font-semibold text-slate-900">Overview</span>
        </div>

        {/* Pale Cyan Help Banner */}
        {helpBannerVisible && (
          <div className="relative rounded-lg border border-[#BAE6FD] bg-[#F0F9FF] px-5 py-4 text-xs text-slate-700 shadow-2xs">
            <div className="flex items-start justify-between">
              <div className="space-y-1 pr-6">
                <p className="font-normal text-slate-700 leading-relaxed">
                  This page displays a summary of your employees’ leave-related activities—the pattern of leave usage in the organization across the months and the type of leave availed by your employees.
                </p>
                <div className="flex items-center gap-4 pt-1 font-medium text-sky-700">
                  <span>
                    Explore the Leave and Attendance Overview page with{" "}
                    <a
                      href="https://admin-help.greythr.com"
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-sky-900"
                    >
                      Help-Doc
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://greythr.freshdesk.com"
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-sky-900"
                    >
                      FAQs
                    </a>
                    .
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpBannerVisible(false)}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap"
              >
                Hide Help
              </button>
            </div>
          </div>
        )}

        {/* Period Selector Timeline */}
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="text-xs font-semibold text-slate-800">
              Select Leave Period
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                aria-label="Year Range"
                className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="Jan 2026 - Dec 2026">Jan 2026 - Dec 2026</option>
                <option value="Jan 2025 - Dec 2025">Jan 2025 - Dec 2025</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-3">
            {months.map((m, index) => {
              const isSelected = selectedMonthIndex === index;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setSelectedMonthIndex(index)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs transition-all ${
                    isSelected
                      ? "bg-sky-600 text-white font-bold shadow-xs"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium"
                  }`}
                >
                  <span className="text-xs">{m.label}</span>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? "text-sky-100" : "text-slate-400"
                    }`}
                  >
                    {m.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top 2 Dashlets: Type of Leaves Taken & Total Leaves Taken This Year */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Type of Leaves Taken */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Type of Leaves Taken
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Category:</span>
                <select
                  value={leaveCategory}
                  onChange={(e) => setLeaveCategory(e.target.value)}
                  aria-label="Leave Category Filter"
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Probation">Probation</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
              {/* Doughnut Center Chart */}
              <div className="relative flex h-36 w-36 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-sky-500"
                    strokeDasharray="40, 100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-40"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500"
                    strokeDasharray="35, 100"
                    strokeDashoffset="-65"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-slate-800">
                    {totalLeaves}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Total Leaves
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2 text-xs flex-1 max-w-xs">
                {leaveTypes.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-slate-600"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total Leaves Taken This Year */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Total Leaves Taken This Year
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Category:</span>
                <select
                  value={leaveCategory}
                  onChange={(e) => setLeaveCategory(e.target.value)}
                  aria-label="Category Filter"
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Probation">Probation</option>
                </select>
              </div>
            </div>

            {/* Monthly Bar Visualization */}
            <div className="flex h-36 items-end justify-between gap-1 pt-4 px-2 border-b border-slate-100">
              {monthlyData.map((d) => {
                const heightPct = Math.max(15, (d.count / 5) * 100);
                return (
                  <div key={d.month} className="flex flex-col items-center flex-1">
                    <span className="text-[10px] text-slate-400 mb-1 font-semibold">
                      {d.count > 0 ? d.count : ""}
                    </span>
                    <div
                      className={`w-full max-w-[18px] rounded-t transition-all ${
                        d.month === "Nov"
                          ? "bg-sky-600"
                          : d.count > 0
                          ? "bg-sky-200 hover:bg-sky-300"
                          : "bg-slate-100"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between gap-1 pt-1.5 px-2 text-[10px] text-slate-400 font-medium">
              {monthlyData.map((d) => (
                <span
                  key={d.month}
                  className={`flex-1 text-center ${
                    d.month === "Nov" ? "font-bold text-sky-700" : ""
                  }`}
                >
                  {d.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Lower 2 Panels: RH Leave Panel & Team on Leave */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Number of Employees on Leave for each RH */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Number of Employees on Leave for Each RH
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Category:</span>
                <select
                  aria-label="RH Category"
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
              <Calendar className="h-8 w-8 text-slate-300 mb-2 stroke-1" />
              <p className="text-xs font-medium text-slate-500">
                No records found
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No employees are currently scheduled for Restricted Holiday leave.
              </p>
            </div>
          </div>

          {/* Team on Leave */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Team on Leave
                </h3>
                <span className="text-xs font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  This Week
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Category:</span>
                <select
                  aria-label="Team Leave Category"
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-2">Details</th>
                    <th className="pb-2">Leave Type</th>
                    <th className="pb-2 text-right">No. of days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {teamOnLeave.map((item, idx) => (
                    <tr key={item.id || `${item.empId}-${idx}`} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5">
                        <div className="font-medium text-slate-800">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          ({item.empId})
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {item.leaveType}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-700">
                        {item.days}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
