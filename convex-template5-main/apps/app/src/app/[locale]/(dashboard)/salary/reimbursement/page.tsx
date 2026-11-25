"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  Plus,
  RefreshCw,
  Search,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function ReimbursementPage() {
  const { current: workspaceId, workspaces } = useWorkspace();
  const effectiveWorkspaceId = workspaceId ?? workspaces[0]?._id;

  const [financialYear, setFinancialYear] = useState("Apr 2026 - Mar 2027");
  const [activeTab, setActiveTab] = useState<"overview" | "claims">("overview");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form State
  const [categoryCode, setCategoryCode] = useState("TRAVEL");
  const [amount, setAmount] = useState<number>(1200);
  const [expenseDate, setExpenseDate] = useState("2026-11-20");
  const [businessPurpose, setBusinessPurpose] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("https://storage.indiapay.internal/receipts/taxi-bill-nov26.pdf");

  // Queries
  const claims = useQuery(
    api.reimbursements.listWorkspaceClaims,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId as any } : "skip"
  );
  const categories = useQuery(
    api.reimbursements.listCategories,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId as any } : "skip"
  );
  const employees = useQuery(
    api.employees.list,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId as any } : "skip"
  );

  // Default to first employee in workspace for self-service representation
  const selfEmployee = employees && employees.length > 0 ? employees[0] : null;

  // Mutations
  const saveClaim = useMutation(api.reimbursements.saveClaim);
  const cancelClaim = useMutation(api.reimbursements.cancelClaim);

  // Claims for self
  const myClaims = useMemo(() => {
    if (!claims) return [];
    if (!selfEmployee) return claims;
    return claims.filter((c: any) => c.employeeId === selfEmployee._id);
  }, [claims, selfEmployee]);

  const totalClaimed = useMemo(() => {
    return myClaims.reduce((acc: number, c: any) => acc + (c.claimAmount || c.claimedAmount || 0), 0);
  }, [myClaims]);

  const totalApproved = useMemo(() => {
    return myClaims
      .filter((c: any) => ["APPROVED", "PROCESSING", "SETTLED"].includes(c.status))
      .reduce((acc: number, c: any) => acc + (c.approvedAmount || c.claimAmount || c.claimedAmount || 0), 0);
  }, [myClaims]);

  const totalSettled = useMemo(() => {
    return myClaims
      .filter((c: any) => c.status === "SETTLED")
      .reduce((acc: number, c: any) => acc + (c.approvedAmount || c.claimAmount || c.claimedAmount || 0), 0);
  }, [myClaims]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveWorkspaceId || !selfEmployee) return;
    try {
      await saveClaim({
        workspaceId: effectiveWorkspaceId as any,
        employeeId: selfEmployee._id as any,
        categoryCode,
        claimAmount: amount,
        expenseDate,
        businessPurpose,
        description: businessPurpose,
        submitNow: true,
      });
      setIsSubmitModalOpen(false);
      setBusinessPurpose("");
    } catch (err: any) {
      alert("Error submitting claim: " + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SETTLED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Settled</span>;
      case "APPROVED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"><FileCheck className="h-3 w-3" /> Approved for Payroll</span>;
      case "MANAGER_REVIEW":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"><Clock className="h-3 w-3" /> Manager Review</span>;
      case "FINANCE_REVIEW":
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"><Clock className="h-3 w-3" /> Finance Review</span>;
      case "ON_HOLD":
        return <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"><AlertCircle className="h-3 w-3" /> On Hold</span>;
      case "REJECTED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"><XCircle className="h-3 w-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">{status}</span>;
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F9FAFB] dark:bg-black">
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
            Reimbursement
          </h1>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm transition"
        >
          <Plus className="h-3.5 w-3.5" />
          Apply Reimbursement
        </button>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-6 md:p-8 space-y-4">
        {/* Controls row: Tab on left, Financial Year selector on right */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-border">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`relative pb-3 text-sm font-semibold transition ${
                activeTab === "overview" ? "text-[#0091FF]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
              {activeTab === "overview" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-[#0091FF]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("claims")}
              className={`relative pb-3 text-sm font-semibold transition ${
                activeTab === "claims" ? "text-[#0091FF]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Claims ({myClaims.length})
              {activeTab === "claims" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-sm bg-[#0091FF]" />
              )}
            </button>
          </div>

          <div className="pb-2">
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#0091FF] dark:border-border dark:bg-card dark:text-gray-200"
            >
              <option value="Apr 2026 - Mar 2027">Apr 2026 - Mar 2027</option>
              <option value="Apr 2025 - Mar 2026">Apr 2025 - Mar 2026</option>
            </select>
          </div>
        </div>

        {/* Overview Tab Cards */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border/80 bg-white dark:bg-card p-5 shadow-2xs">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Total Claimed</span>
                <div className="mt-2 text-2xl font-bold text-foreground">
                  ₹{(totalClaimed / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Across all expense categories this FY</p>
              </div>

              <div className="rounded-xl border border-border/80 bg-white dark:bg-card p-5 shadow-2xs">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Approved by Finance</span>
                <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{(totalApproved / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Queued for monthly payroll payout</p>
              </div>

              <div className="rounded-xl border border-border/80 bg-white dark:bg-card p-5 shadow-2xs">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Settled in Payroll</span>
                <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{(totalSettled / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">Disbursed with finalized salary runs</p>
              </div>
            </div>

            {myClaims.length === 0 ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-2xs md:p-12 dark:border-border dark:bg-card">
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
                    <g transform="translate(75, 25)">
                      <rect
                        x="0"
                        y="0"
                        width="90"
                        height="75"
                        rx="6"
                        fill="#FFFFFF"
                        stroke="#CBD5E1"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M15 15H75M15 28H60M15 41H45M15 54H75"
                        stroke="#CBD5E1"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="70"
                        cy="40"
                        r="12"
                        fill="#F8FAFC"
                        stroke="#94A3B8"
                        strokeWidth="2"
                      />
                      <path
                        d="M70 33V47M64 40H76"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </g>
                    <circle cx="50" cy="85" r="5" fill="#E2E8F0" />
                    <circle cx="190" cy="45" r="4" fill="#E2E8F0" />
                  </svg>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nothing to show!
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    No reimbursement claims submitted yet for {financialYear}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border/80 bg-white dark:bg-card shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-border font-semibold text-sm text-foreground">
                  Recent Reimbursement Submissions
                </div>
                <div className="divide-y divide-border text-xs">
                  {myClaims.slice(0, 5).map((claim: any) => (
                    <div key={claim._id} className="p-4 flex items-center justify-between hover:bg-muted/20">
                      <div>
                        <div className="font-semibold text-foreground">{claim.claimNumber} • {claim.categoryName}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{claim.businessPurpose}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground">₹{((claim.claimAmount || claim.claimedAmount || 0) / 100).toFixed(2)}</div>
                        <div className="mt-1">{getStatusBadge(claim.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Claims Tab Table */}
        {activeTab === "claims" && (
          <div className="rounded-xl border border-border/80 bg-white dark:bg-card shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Claim # & Date</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3 text-right">Claimed Amt</th>
                    <th className="px-4 py-3 text-right">Approved Amt</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myClaims.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No claims submitted. Click "Apply Reimbursement" above to submit one.
                      </td>
                    </tr>
                  ) : (
                    myClaims.map((claim: any) => (
                      <tr key={claim._id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {claim.claimNumber}
                          <div className="text-[11px] font-normal text-muted-foreground">{claim.expenseDate}</div>
                        </td>
                        <td className="px-4 py-3 text-foreground">{claim.categoryName}</td>
                        <td className="px-4 py-3 text-foreground max-w-xs truncate">{claim.businessPurpose}</td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">
                          ₹{((claim.claimAmount || claim.claimedAmount || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                          {claim.approvedAmount !== undefined ? `₹${(claim.approvedAmount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(claim.status)}</td>
                        <td className="px-4 py-3 text-right">
                          {claim.status === "SUBMITTED" && (
                            <button
                              onClick={async () => {
                                if (confirm("Cancel this claim?")) {
                                  await cancelClaim({
                                    workspaceId: effectiveWorkspaceId as any,
                                    claimId: claim._id,
                                  });
                                }
                              }}
                              className="rounded border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Submit Claim */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">Apply for Reimbursement</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Submit business expenses for approval and inclusion in your monthly salary run.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Expense Category *</label>
                    <select
                      value={categoryCode}
                      onChange={(e) => setCategoryCode(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {categories && categories.length > 0 ? (
                        categories.map((c: any) => (
                          <option key={c.categoryCode} value={c.categoryCode}>
                            {c.categoryName} ({c.taxTreatment})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="TRAVEL">Travel Expenses</option>
                          <option value="MEALS">Meals & Entertainment</option>
                          <option value="TELECOM">Mobile / Internet Bill</option>
                          <option value="FUEL">Fuel & Conveyance</option>
                          <option value="MEDICAL">Medical Expenses</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Expense Date *</label>
                    <input
                      type="date"
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      required
                      className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Claim Amount (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Receipt URL / Document</label>
                    <input
                      type="text"
                      value={receiptUrl}
                      onChange={(e) => setReceiptUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Business Purpose / Description *</label>
                  <textarea
                    rows={2}
                    value={businessPurpose}
                    onChange={(e) => setBusinessPurpose(e.target.value)}
                    required
                    placeholder="Provide details about the business necessity..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
