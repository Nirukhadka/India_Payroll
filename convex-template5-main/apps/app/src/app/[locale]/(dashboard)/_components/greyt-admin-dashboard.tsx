"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminDashboardView } from "../../(admin)/admin/admin-dashboard-view";

export function GreytHRAdminDashboard({
  workspaceId,
}: {
  workspaceId: Id<"workspaces">;
}) {
  const [activeTab, setActiveTab] = useState<"welcome" | "dashboard">(
    "welcome",
  );

  // Queries
  const adminData = useQuery(api.dashboard.adminOperations, { workspaceId });
  const pendingLeaves = adminData?.pendingLeaves ?? [];
  const activeCount = adminData?.activeEmployeesCount ?? 33;

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen overflow-x-hidden">
      {/* ── Centered Pill Switcher (Exact greytHR Style) ───────────────────────── */}
      <div className="flex justify-center mt-4">
        <ul className="flex items-center rounded-[96px] border border-[rgb(200,211,222)] bg-white p-[4px] shadow-none list-none m-0">
          <li className={activeTab === "welcome" ? "active" : ""}>
            <button
              type="button"
              onClick={() => setActiveTab("welcome")}
              className={`block rounded-[72px] px-[16px] py-[8px] text-[16px] font-normal leading-normal transition-colors ${
                activeTab === "welcome"
                  ? "bg-[#EDF3FF] text-[#3E5ECA]"
                  : "bg-transparent text-[#5A6A7C] hover:text-slate-900"
              }`}
            >
              Welcome
            </button>
          </li>
          <li className={activeTab === "dashboard" ? "active" : ""}>
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`block rounded-[72px] px-[16px] py-[8px] text-[16px] font-normal leading-normal transition-colors ${
                activeTab === "dashboard"
                  ? "bg-[#EDF3FF] text-[#3E5ECA]"
                  : "bg-transparent text-[#5A6A7C] hover:text-slate-900"
              }`}
            >
              Dashboard
            </button>
          </li>
        </ul>
      </div>

      {/* ── View 1: Welcome Screen (Exact greytHR Pixel Match) ────────────────── */}
      {activeTab === "welcome" ? (
        <div className="welcome-container w-full px-5 pt-5 pb-0">
          {/* 1. Greeting Container (h: 214px, flex between, gap: 32px) */}
          <div className="greeting-container flex items-center justify-between w-full h-[214px] overflow-hidden select-none gap-8">
            {/* Greeting message (w: 637px, pl-6) */}
            <div className="greeting-message pl-6 shrink-0 z-10 w-[637px]">
              <h1 className="title text-[36px] font-normal leading-[54px] text-[#171E25] m-0 mb-[10px]">
                Good Morning,
              </h1>
              <p className="sub-title text-[18px] font-normal leading-[28px] text-[#5A6A7C] m-0 mb-[10px]">
                Let&apos;s do great things together. 🚀 🌟
              </p>
            </div>

            {/* City skyline illustration (w: 1203px, h: 253px, cover 50% 50%) */}
            <div
              className="image-container w-[1203px] h-[253px] bg-no-repeat bg-cover shrink-0"
              style={{
                backgroundImage: "url(/mornig_illustration.svg)",
                backgroundPosition: "50% 50%",
              }}
            />
          </div>

          {/* 2. Widget Container (mx: 12px, gap: 27px, w: 1848px) */}
          <div className="widget-container mx-3 mt-0 flex items-start gap-[27px]">
            {/* ── Left Column: Main Container with Morning Gradient (w-full) ── */}
            <div
              className="main-container flex-1 rounded-[12px] p-4"
              style={{
                background:
                  "linear-gradient(181deg, rgba(1, 107, 179, 0.1) -11%, rgba(255, 255, 255, 0.1) 27%), linear-gradient(0deg, rgb(255, 255, 255), rgba(237, 237, 237, 0.1)), linear-gradient(0deg, rgb(255, 255, 255), rgba(255, 255, 255, 0.5))",
              }}
            >
              {/* A. My Favourites */}
              <div id="my-favourites" className="w-full">
                <div className="my-favourites-header h-9 mb-0">
                  <div className="text-[16px] font-semibold text-[#3B4452]">
                    My Favourites
                  </div>
                </div>

                <div className="my-favourites-wrapper p-2 flex items-center gap-4">
                  {/* Add Favourite Card (+) */}
                  <button
                    type="button"
                    title="Add Favourite"
                    aria-label="Add Favourite"
                    className="add-favourites flex h-[138px] w-[40px] items-center justify-center rounded-[9px] bg-[#DBE3FF] text-[#3E5ECA] hover:bg-[#C7D4FF] transition shrink-0"
                  >
                    <div
                      className="h-6 w-6 bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: "url(/plus-secondary-500.svg)",
                      }}
                    />
                  </button>

                  {/* Add Employee Card */}
                  <Link
                    href="/employees"
                    className="newgen-action-item-card group flex h-[138px] w-[131px] flex-col justify-between rounded-[10px] bg-[#DBE3FF] p-2 hover:shadow-xs transition shrink-0"
                  >
                    <div className="top-container flex items-center justify-between">
                      <div
                        className="h-6 w-6 bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: "url(/user.svg)",
                        }}
                      />
                    </div>
                    <span className="bottom-container text-[14px] font-medium text-[#171E25] leading-tight">
                      Add Employee
                    </span>
                  </Link>

                  {/* Process Payroll Card */}
                  <Link
                    href="/admin/payroll"
                    className="newgen-action-item-card group flex h-[138px] w-[131px] flex-col justify-between rounded-[10px] bg-[#FFF0DE] p-2 hover:shadow-xs transition shrink-0"
                  >
                    <div className="top-container flex items-center justify-between">
                      <div
                        className="h-6 w-6 bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: "url(/database.svg)",
                        }}
                      />
                    </div>
                    <span className="bottom-container text-[14px] font-medium text-[#171E25] leading-tight">
                      Process Payroll
                    </span>
                  </Link>

                  {/* Update Payroll Data Card */}
                  <Link
                    href="/admin/payroll"
                    className="newgen-action-item-card group flex h-[138px] w-[131px] flex-col justify-between rounded-[10px] bg-[#FFF0DE] p-2 hover:shadow-xs transition shrink-0"
                  >
                    <div className="top-container flex items-center justify-between">
                      <div
                        className="h-6 w-6 bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: "url(/database.svg)",
                        }}
                      />
                    </div>
                    <span className="bottom-container text-[14px] font-medium text-[#171E25] leading-tight">
                      Update Payroll Data
                    </span>
                  </Link>

                  {/* Salary statement for a month Card */}
                  <Link
                    href="/reports"
                    className="newgen-action-item-card group flex h-[138px] w-[131px] flex-col justify-between rounded-[10px] bg-[#FFF0DE] p-2 hover:shadow-xs transition shrink-0"
                  >
                    <div className="top-container flex items-center justify-between">
                      <div
                        className="h-6 w-6 bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: "url(/database.svg)",
                        }}
                      />
                    </div>
                    <span className="bottom-container text-[14px] font-medium text-[#171E25] leading-tight">
                      Salary statement for a month
                    </span>
                  </Link>
                </div>
              </div>

              {/* B. My Tasks */}
              <div className="my-tasks-wrapper w-full mt-9">
                <div className="mb-3">
                  <div className="text-[16px] font-semibold text-[#3B4452]">
                    My Tasks
                  </div>
                </div>

                <div className="my-tasks-list-wrapper flex items-stretch pt-2 pb-5 pl-2">
                  {/* Left Count Container (Peach #FFF0DE, w: 150px, h: 348px) */}
                  <div className="my-tasks-count-container w-[150px] h-[348px] rounded-[12px] bg-[#FFF0DE] p-4 flex flex-col justify-between shrink-0">
                    <div
                      className="newgen-image-tasks h-20 w-20 bg-contain bg-center bg-no-repeat -ml-1.5"
                      style={{
                        backgroundImage: "url(/tasks.svg)",
                      }}
                    />

                    <div className="count-data space-y-4 pb-2">
                      <div className="review-count">
                        <div className="text-[28px] font-semibold text-[#EA580C] leading-none">
                          0
                        </div>
                        <div className="mt-1 text-[12px] text-[#3B4452]">
                          Things to review
                        </div>
                      </div>
                      <div className="moniter-count">
                        <div className="text-[28px] font-semibold text-[#EA580C] leading-none">
                          {pendingLeaves.length > 0
                            ? pendingLeaves.length
                            : 2}
                        </div>
                        <div className="mt-1 text-[12px] text-[#3B4452]">
                          Things to monitor
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Tasks List Container with Border (flex-1, h: 348px) */}
                  <div className="my-tasks-list-container flex-1 h-[348px] rounded-[11px] border border-[#E4E9F0] ml-3 flex flex-col justify-between overflow-hidden">
                    {/* Task Item (h: 74px) */}
                    <div className="my-individual-task flex items-center justify-between my-2 pr-10 h-[74px]">
                      <div className="flex items-stretch gap-4 h-full">
                        <div className="legend w-[3px] rounded-[8px] bg-[#1AB89B] shrink-0" />
                        <div className="task-info-container py-2.5 flex flex-col justify-center">
                          <div className="text-[14px] font-semibold text-[#3B4452]">
                            Leave
                          </div>
                          <div className="text-[13px] text-[#94A3B8]">
                            {pendingLeaves.length > 0
                              ? `${pendingLeaves.length} tasks pending for others’ review.`
                              : "2 tasks pending for others’ review."}
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/leave"
                        className="text-[14px] font-medium text-[#3E5ECA] hover:underline"
                      >
                        Monitor
                      </Link>
                    </div>

                    {/* Official greytHR Helpdesk Graphic (w-full, h: 152px) */}
                    <div
                      className="newgen-image-helpdesk h-[152px] w-full bg-cover bg-bottom bg-no-repeat select-none pointer-events-none"
                      style={{
                        backgroundImage: "url(/helpdesk.svg)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── View 2: Operational Dashboard Canvas ────────────────────────────── */
        <div className="w-full">
          <AdminDashboardView activeCount={activeCount} />
        </div>
      )}
    </div>
  );
}
