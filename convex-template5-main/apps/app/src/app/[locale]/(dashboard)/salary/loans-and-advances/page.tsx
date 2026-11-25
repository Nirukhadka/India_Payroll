"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function LoansAndAdvancesPage() {
  const { current: workspaceId } = useWorkspace();
  const scoped = workspaceId ? { workspaceId } : "skip";

  const myLoans = useQuery(api.loans.getMyLoans, scoped);
  const applyLoanMutation = useMutation(api.loans.applyForLoan);

  const [activeTab, setActiveTab] = useState<"my_loans" | "history">("my_loans");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Modal Form State
  const [loanType, setLoanType] = useState<string>("SALARY_ADVANCE");
  const [amountStr, setAmountStr] = useState<string>("");
  const [tenureStr, setTenureStr] = useState<string>("3");
  const [purpose, setPurpose] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic EMI Calculation preview
  const amount = Number.parseFloat(amountStr) || 0;
  const tenure = Number.parseInt(tenureStr, 10) || 0;
  const emiPreview = useMemo(() => {
    if (amount <= 0 || tenure <= 0) return 0;
    return Math.round(amount / tenure);
  }, [amount, tenure]);

  const activeLoans = useMemo(() => {
    if (!myLoans) return [];
    return myLoans.filter((l) => l.status === "ACTIVE" || l.status === "PENDING" || l.status === "APPROVED");
  }, [myLoans]);

  const historyLoans = useMemo(() => {
    if (!myLoans) return [];
    return myLoans.filter((l) => l.status === "CLOSED" || l.status === "REJECTED");
  }, [myLoans]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    if (amount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    if (tenure <= 0 || tenure > 36) {
      toast.error("Repayment tenure must be between 1 and 36 months");
      return;
    }
    if (!purpose.trim()) {
      toast.error("Purpose of loan or advance is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await applyLoanMutation({
        workspaceId,
        loanType,
        purpose: purpose.trim(),
        principalAmount: amount,
        tenureMonths: tenure,
        notes: notes.trim() || undefined,
      });

      toast.success("Advance application submitted successfully for review");
      setIsApplyModalOpen(false);
      // Reset form
      setAmountStr("");
      setTenureStr("3");
      setPurpose("");
      setNotes("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to apply for advance";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-col bg-[#F9FAFB] dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 bg-card px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-5 w-5 items-center justify-center">
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
              aria-hidden="true"
            >
              <path d="M0 0H16V20L8 15L0 20V0Z" fill="#F59E0B" />
            </svg>
          </div>
          <h1 className="text-base font-semibold text-primary">
            Loans and Advances
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsApplyModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#0091FF] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#0080e0] focus:outline-none"
        >
          <Plus className="h-4 w-4" />
          Apply for Advance
        </button>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-6 md:p-8 space-y-4">
        {/* Tab Row */}
        <div className="flex border-b border-gray-200 dark:border-border">
          <button
            type="button"
            onClick={() => setActiveTab("my_loans")}
            className={`relative pb-3 text-sm font-semibold transition ${
              activeTab === "my_loans"
                ? "text-[#0091FF]"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            My Loans ({activeLoans.length})
            {activeTab === "my_loans" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-[#0091FF]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`relative ml-6 pb-3 text-sm font-semibold transition ${
              activeTab === "history"
                ? "text-[#0091FF]"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Application History ({historyLoans.length})
            {activeTab === "history" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-[#0091FF]" />
            )}
          </button>
        </div>

        {/* Tab 1: Active / Pending Loans */}
        {activeTab === "my_loans" && (
          <>
            {activeLoans.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {activeLoans.map((loan) => (
                  <div
                    key={loan._id}
                    className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-2xs dark:border-border dark:bg-card"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#0091FF] uppercase dark:bg-blue-950/40">
                          {loan.loanType.replace("_", " ")}
                        </span>
                        <h3 className="mt-1.5 text-base font-bold text-gray-900 dark:text-white">
                          ₹{loan.principalAmount.toLocaleString("en-IN")}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          loan.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : loan.status === "APPROVED"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}
                      >
                        {loan.status === "ACTIVE" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {loan.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 text-xs dark:border-border/60">
                      <div>
                        <span className="text-gray-400">Monthly EMI</span>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          ₹{loan.monthlyEmiAmount.toLocaleString("en-IN")} / mo
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Tenure</span>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {loan.tenureMonths} Months
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Outstanding Balance</span>
                        <p className="font-semibold text-red-600 dark:text-red-400">
                          ₹{loan.outstandingPrincipal.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Repaid So Far</span>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ₹{loan.totalRepaid.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {loan.purpose && (
                      <p className="mt-3 text-xs text-gray-500 italic dark:text-gray-400">
                        Purpose: &ldquo;{loan.purpose}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state matching greytHR illustration */
              <div className="flex min-h-[460px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-2xs md:p-12 dark:border-border dark:bg-card">
                <div className="flex flex-col items-center justify-center text-center">
                  <svg
                    width="240"
                    height="160"
                    viewBox="0 0 240 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="select-none mb-4"
                    aria-hidden="true"
                  >
                    <g transform="translate(70, 25)">
                      <rect
                        x="0"
                        y="0"
                        width="100"
                        height="70"
                        rx="8"
                        fill="#FFFFFF"
                        stroke="#CBD5E1"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="50"
                        cy="35"
                        r="18"
                        fill="#F8FAFC"
                        stroke="#94A3B8"
                        strokeWidth="2"
                      />
                      <path
                        d="M50 24V46M44 30H56M44 40H56"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path d="M20 70V80H80V70" stroke="#CBD5E1" strokeWidth="2.5" />
                      <path
                        d="M10 80H90"
                        stroke="#CBD5E1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </g>
                    <circle cx="50" cy="85" r="5" fill="#E2E8F0" />
                    <circle cx="190" cy="45" r="4" fill="#E2E8F0" />
                    <line
                      x1="185"
                      y1="95"
                      x2="195"
                      y2="95"
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="190"
                      y1="90"
                      x2="190"
                      y2="100"
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nothing to show!
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Your loan details will show up here after approval.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="mt-4 rounded border border-[#0091FF] px-4 py-1.5 text-xs font-semibold text-[#0091FF] transition hover:bg-blue-50 dark:hover:bg-blue-950/40"
                  >
                    Apply for Advance
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab 2: Application History */}
        {activeTab === "history" && (
          <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-2xs dark:border-border dark:bg-card">
            {historyLoans.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-border/60">
                {historyLoans.map((loan) => (
                  <div key={loan._id} className="flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        ₹{loan.principalAmount.toLocaleString("en-IN")} — {loan.loanType.replace("_", " ")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {loan.purpose || "Advance application"} · Applied {new Date(loan.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span
                      className={`rounded px-2.5 py-0.5 text-xs font-semibold ${
                        loan.status === "CLOSED"
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-xs text-gray-400">
                No past loan or advance applications recorded.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Apply for Advance Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl dark:border-border dark:bg-card">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-border/80">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Apply for Salary Advance / Loan
              </h2>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleApply} className="p-6 space-y-4">
              {/* Advance Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Application Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 shadow-2xs focus:border-[#0091FF] focus:outline-none focus:ring-1 focus:ring-[#0091FF] dark:border-border dark:bg-card dark:text-gray-100"
                >
                  <option value="SALARY_ADVANCE">Salary Advance (Interest-Free)</option>
                  <option value="EMERGENCY">Emergency Advance</option>
                  <option value="PERSONAL">Personal Company Loan</option>
                </select>
              </div>

              {/* Amount & Tenure Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    placeholder="e.g. 25000"
                    required
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 shadow-2xs focus:border-[#0091FF] focus:outline-none focus:ring-1 focus:ring-[#0091FF] dark:border-border dark:bg-card dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Repayment Tenure <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={tenureStr}
                    onChange={(e) => setTenureStr(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 shadow-2xs focus:border-[#0091FF] focus:outline-none focus:ring-1 focus:ring-[#0091FF] dark:border-border dark:bg-card dark:text-gray-100"
                  >
                    <option value="1">1 Month (Next Payroll)</option>
                    <option value="2">2 Months</option>
                    <option value="3">3 Months (Recommended)</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
              </div>

              {/* Dynamic EMI Preview Box */}
              {amount > 0 && tenure > 0 && (
                <div className="rounded-md border border-blue-100 bg-[#E9F5FD] p-3 text-xs dark:border-blue-900/40 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Estimated Monthly Deduction:
                    </span>
                    <span className="font-bold text-[#0091FF]">
                      ₹{emiPreview.toLocaleString("en-IN")} / month
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    Deducted automatically from monthly salary across {tenure} installments starting next payroll cycle.
                  </p>
                </div>
              )}

              {/* Purpose */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Reason / Purpose <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical emergency / Family necessity"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 shadow-2xs focus:border-[#0091FF] focus:outline-none focus:ring-1 focus:ring-[#0091FF] dark:border-border dark:bg-card dark:text-gray-100"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any supporting context for HR..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 shadow-2xs focus:border-[#0091FF] focus:outline-none focus:ring-1 focus:ring-[#0091FF] dark:border-border dark:bg-card dark:text-gray-100"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-border/80">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsApplyModalOpen(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-border dark:bg-card dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#0091FF] px-4 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#0080e0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
