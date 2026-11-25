"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Info,
  Loader2,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PayrollHeader } from "../payroll-header";

export default function ProcessPayrollPage() {
  const { current, workspaces } = useWorkspace();
  const effectiveWorkspaceId = current ?? workspaces[0]?._id;
  const periodMonth = "2026-11";

  // Dynamic real checklist from Convex
  const checklistData = useQuery(
    api.payrollLifecycle.getProcessingChecklist,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId, periodMonth } : "skip"
  );

  const calculatePreview = useQuery(
    api.payroll.calculatePreview,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId, periodMonth } : "skip"
  );

  const createRun = useMutation(api.payroll.createRun);

  const [helpOpen, setHelpOpen] = useState(true);
  const [processingState, setProcessingState] = useState<
    "ready" | "processing" | "completed" | "error"
  >("ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!effectiveWorkspaceId) return;
    if (checklistData && !checklistData.canProcess) {
      setErrorMessage("Cannot process payroll while mandatory checklist items are incomplete.");
      return;
    }

    setProcessingState("processing");
    setErrorMessage(null);
    try {
      await createRun({
        workspaceId: effectiveWorkspaceId,
        periodMonth,
      });
      setProcessingState("completed");
    } catch (err: unknown) {
      setProcessingState("error");
      setErrorMessage((err as Error)?.message || "Failed to process payroll run");
    }
  };

  const tasks = checklistData?.tasks ?? [
    {
      id: "lock_prev",
      label: "Lock Previous Payroll",
      description: "Ensure previous month period is finalized",
      completed: true,
      isBlocking: true,
    },
    {
      id: "salary_structures",
      label: "Salary Structure Assignments",
      description: "Validate employee salary structure assignments",
      completed: true,
      isBlocking: true,
    },
    {
      id: "additions",
      label: "Employee Additions",
      description: "Check new joiners for current cutoff",
      completed: true,
      isBlocking: false,
    },
    {
      id: "separations",
      label: "Employee Separations",
      description: "Check settled separation records",
      completed: true,
      isBlocking: false,
    },
    {
      id: "attendance_lop",
      label: "Attendance & LOP Verification",
      description: "Verify attendance muster and Loss of Pay days",
      completed: true,
      isBlocking: false,
    },
  ];

  const completedCount = tasks.filter((t) => t.completed).length;
  const canProcess = checklistData?.canProcess ?? true;

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F7F7F7] text-[#394657] font-sans antialiased text-[14px]">
      <PayrollHeader currentTab="process" />

      <main className="flex-1 w-full p-6 space-y-6 max-w-[1920px] mx-auto">
        {/* Help Banner Container matching greytHR */}
        {helpOpen && (
          <div className="relative rounded bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-[13px] leading-relaxed text-[#5A6A7C] shadow-2xs">
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="absolute top-4 right-4 text-xs font-semibold text-[#3E5ECC] hover:underline"
            >
              Hide Help
            </button>
            <p>
              The <strong className="text-slate-800">Payroll Process</strong>{" "}
              page helps you to process the payroll with the help of the
              provided checklist. The checklist indicates the prerequisite tasks
              that you need to complete to process the payroll for period{" "}
              <strong className="text-[#3557CA] font-semibold">{periodMonth}</strong>.
            </p>
            <p className="mt-1">
              Once mandatory verification items are marked complete, click the{" "}
              <strong className="text-slate-800">Process Payroll</strong> button
              to compute gross-to-net calculations and persist the payroll run.
            </p>
          </div>
        )}

        {/* Blocking Warnings Banner if mandatory checks fail */}
        {checklistData && !canProcess && checklistData.blockingReasons.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-red-900">
                  Payroll Processing Blocked
                </h4>
                <p className="text-xs text-red-700 mt-1">
                  The following mandatory requirements must be resolved before payroll can be calculated:
                </p>
                <ul className="mt-2 list-disc list-inside text-xs text-red-800 space-y-1">
                  {checklistData.blockingReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Checklist Container matching greytHR reference */}
        <div className="rounded-lg border border-[#E4E9F0] bg-white p-6 shadow-xs min-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Checklist / Incomplete Tasks */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#394657]">Checklist</h3>

              {checklistData === undefined ? (
                <div className="flex items-center gap-2 py-4 text-xs text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validating workspace payroll prerequisites...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks
                    .filter((t) => !t.completed)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="flex items-start gap-3 text-xs text-slate-800 select-none p-2 rounded border border-amber-200 bg-amber-50/40"
                      >
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-900">{t.label}</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">{t.description}</p>
                        </div>
                      </div>
                    ))}
                  {tasks.filter((t) => !t.completed).length === 0 && (
                    <div className="text-xs text-emerald-700 font-medium py-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>All prerequisite verification tasks completed!</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Completed Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#394657]">
                  Completed Tasks ({completedCount}/{tasks.length})
                </h3>
              </div>

              <div className="space-y-2 pt-1">
                {tasks
                  .filter((t) => t.completed)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-medium">{t.label}</span>
                          <p className="text-[10px] text-slate-400">{t.description}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600">Verified</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Process Payroll & Cancel */}
          <div className="mt-10 pt-4 border-t border-[#E4E9F0] flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!canProcess || processingState === "processing"}
              onClick={handleProcess}
              className={`rounded px-5 py-2 text-xs font-semibold text-white shadow-2xs transition inline-flex items-center gap-2 ${
                !canProcess
                  ? "bg-slate-300 cursor-not-allowed opacity-75"
                  : "bg-[#3E5ECC] hover:bg-[#344EA8] cursor-pointer"
              }`}
            >
              {processingState === "processing" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Computing Gross-to-Net...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Process Payroll
                </>
              )}
            </button>
            <Link
              href="/admin/payroll"
              className="rounded border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              Cancel
            </Link>

            {processingState === "completed" && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold pl-3">
                <CheckCircle2 className="h-4 w-4" />
                Payroll Run Saved &amp; Ready for Approval Review!
              </span>
            )}

            {errorMessage && (
              <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold pl-3">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Floating What's New Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-[#9333EA] px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-[#7E22CE] transition"
        >
          <Sparkles className="h-3.5 w-3.5" />
          What&apos;s New!
        </button>
      </div>
    </div>
  );
}
