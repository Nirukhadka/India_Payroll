"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  Filter,
  Info,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PayrollHeader } from "../payroll-header";

export default function ReimbursementsManagementPage() {
  const { current, workspaces } = useWorkspace();
  const effectiveWorkspaceId = current ?? workspaces[0]?._id;

  // Tabs: pending, approved, settled, all
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "settled" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  // Modals
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewType, setReviewType] = useState<"MANAGER" | "FINANCE">("FINANCE");
  const [reviewAction, setReviewAction] = useState<"APPROVE" | "REJECT" | "RETURN" | "HOLD">("APPROVE");
  const [reviewComments, setReviewComments] = useState("");
  const [approvedAmount, setApprovedAmount] = useState<number>(0);

  // Form State for Admin New Claim Creation
  const [empId, setEmpId] = useState("");
  const [categoryCode, setCategoryCode] = useState("TRAVEL");
  const [claimAmount, setClaimAmount] = useState<number>(1000);
  const [expenseDate, setExpenseDate] = useState("2026-11-20");
  const [purpose, setPurpose] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("https://storage.indiapay.internal/receipts/rec-default.pdf");

  // Queries
  const claims = useQuery(
    api.reimbursements.listWorkspaceClaims,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId as any } : "skip"
  );
  const categories = useQuery(
    api.reimbursements.listCategories,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId as any } : "skip"
  );
  const metrics = useQuery(
    api.reimbursements.getReimbursementMetrics,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId as any } : "skip"
  );
  const employees = useQuery(
    api.employees.list,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId as any } : "skip"
  );

  // Mutations
  const saveClaim = useMutation(api.reimbursements.saveClaim);
  const managerReview = useMutation(api.reimbursements.managerReviewClaim);
  const financeReview = useMutation(api.reimbursements.financeReviewClaim);
  const seedCategories = useMutation(api.reimbursements.seedDefaultCategories);

  // Filtered claims
  const filteredClaims = useMemo(() => {
    if (!claims) return [];
    return claims.filter((c: any) => {
      // Tab filter
      if (activeTab === "pending") {
        if (!["SUBMITTED", "MANAGER_REVIEW", "FINANCE_REVIEW", "ON_HOLD", "RETURNED_FOR_CORRECTION"].includes(c.status)) {
          return false;
        }
      } else if (activeTab === "approved") {
        if (!["APPROVED", "PROCESSING"].includes(c.status)) return false;
      } else if (activeTab === "settled") {
        if (c.status !== "SETTLED") return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (c.employeeName || "").toLowerCase().includes(q);
        const matchesNum = (c.claimNumber || "").toLowerCase().includes(q);
        const matchesCat = (c.categoryName || "").toLowerCase().includes(q);
        const matchesPurpose = (c.businessPurpose || "").toLowerCase().includes(q);
        return matchesName || matchesNum || matchesCat || matchesPurpose;
      }
      return true;
    });
  }, [claims, activeTab, searchQuery]);

  // Selected claim for detail drawer or review
  const activeClaim = useMemo(() => {
    if (!claims || !selectedClaimId) return null;
    return claims.find((c: any) => c._id === selectedClaimId) || null;
  }, [claims, selectedClaimId]);

  // Submit new claim
  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveWorkspaceId || !empId) return;
    try {
      await saveClaim({
        workspaceId: effectiveWorkspaceId as any,
        employeeId: empId as any,
        categoryCode,
        claimAmount,
        expenseDate,
        businessPurpose: purpose || "Business expense claim",
        description: purpose || "Business expense claim",
        submitNow: true,
      });
      setIsNewClaimOpen(false);
      setPurpose("");
    } catch (err: any) {
      alert("Error submitting claim: " + err.message);
    }
  };

  // Execute review
  const handleExecuteReview = async () => {
    if (!activeClaim || !effectiveWorkspaceId) return;
    try {
      if (reviewType === "MANAGER") {
        if (reviewAction === "APPROVE") {
          await managerReview({
            workspaceId: effectiveWorkspaceId as any,
            claimId: activeClaim._id,
            action: "APPROVE",
            comments: reviewComments,
          });
        } else if (reviewAction === "REJECT") {
          await managerReview({
            workspaceId: effectiveWorkspaceId as any,
            claimId: activeClaim._id,
            action: "REJECT",
            comments: reviewComments || "Manager rejection",
          });
        } else if (reviewAction === "RETURN") {
          await managerReview({
            workspaceId: effectiveWorkspaceId as any,
            claimId: activeClaim._id,
            action: "RETURN",
            comments: reviewComments || "Please provide updated receipt",
          });
        }
      } else {
        // FINANCE
        if (reviewAction === "APPROVE") {
          await financeReview({
            workspaceId: effectiveWorkspaceId as any,
            claimId: activeClaim._id,
            action: "APPROVE",
            approvedAmount: approvedAmount > 0 ? approvedAmount : activeClaim.claimAmount,
            comments: reviewComments,
          });
        } else if (reviewAction === "REJECT") {
          await financeReview({
            workspaceId: effectiveWorkspaceId as any,
            claimId: activeClaim._id,
            action: "REJECT",
            reason: reviewComments || "Finance rejection",
          });
        } else if (reviewAction === "RETURN") {
          await financeReview({
            workspaceId: effectiveWorkspaceId as any,
            claimId: activeClaim._id,
            action: "HOLD",
            comments: reviewComments || "Holding for documentation verification",
          });
        }
      }
      setIsReviewOpen(false);
      setReviewComments("");
    } catch (err: any) {
      alert("Review action failed: " + err.message);
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

  const getTaxBadge = (taxTreatment: string) => {
    switch (taxTreatment) {
      case "NON_TAXABLE_BUSINESS":
        return <span className="rounded bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">Non-Taxable</span>;
      case "POTENTIALLY_EXEMPT":
        return <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">Potentially Exempt</span>;
      case "TAXABLE":
        return <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">Taxable Addition</span>;
      default:
        return <span className="rounded bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">Under Review</span>;
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F8F9FA] dark:bg-background">
      <PayrollHeader currentTab="inputs" currentSubTitle="Employee Reimbursement Claims" />

      <main className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Title Bar with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Reimbursements Management
              </h1>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Phase 24 — P1.2
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Multi-stage review lifecycle, statutory tax classifications, receipt validation, and automatic payroll payout reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (effectiveWorkspaceId) {
                  seedCategories({ workspaceId: effectiveWorkspaceId as any })
                    .then(() => alert("Default reimbursement categories verified/seeded successfully!"))
                    .catch((err) => alert(err.message));
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-accent shadow-sm transition"
            >
              <Settings className="h-3.5 w-3.5" />
              Categories Policy
            </button>
            <button
              onClick={() => setIsNewClaimOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              New Claim
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Claims</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <FileText className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {metrics ? metrics.totalClaims : "..."}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                (₹{(metrics ? (metrics.totalClaimedAmount / 100).toLocaleString("en-IN") : 0)})
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Review</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Clock className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {metrics ? metrics.pendingReview : "..."}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                ₹{(metrics ? metrics.totalPendingPayout.toLocaleString("en-IN") : 0)}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approved (Payroll Input)</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <FileCheck className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {metrics ? metrics.approved : "..."}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                ₹{(metrics ? metrics.totalApprovedAmount.toLocaleString("en-IN") : 0)}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settled & Paid</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {metrics ? metrics.settled : "..."}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {metrics ? metrics.settled : 0} claims
              </span>
            </div>
          </div>
        </div>

        {/* Tab & Search Control Bar */}
        <div className="rounded-xl border border-border/80 bg-card p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "pending"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Pending Approval ({metrics?.pendingReview ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "approved"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Approved for Payroll ({metrics?.approved ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("settled")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "settled"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Settled ({metrics?.settled ?? 0})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Claims ({metrics?.totalClaims ?? 0})
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search employee, claim #, purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Claims Table */}
        <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Claim # & Date</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Category & Tax Treatment</th>
                  <th className="px-4 py-3 text-right">Claimed Amt</th>
                  <th className="px-4 py-3 text-right">Approved Amt</th>
                  <th className="px-4 py-3">Receipts</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No reimbursement claims found matching this criteria.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim: any) => (
                    <tr key={claim._id} className="hover:bg-muted/30 transition">
                      <td className="px-4 py-3 font-medium">
                        <div className="font-semibold text-foreground">{claim.claimNumber}</div>
                        <div className="text-[11px] text-muted-foreground">{claim.expenseDate}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{claim.employeeName}</div>
                        <div className="text-[11px] text-muted-foreground">{claim.employeeCode}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{claim.categoryName}</div>
                        <div className="mt-0.5">{getTaxBadge(claim.taxTreatment)}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        ₹{(claim.claimedAmount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {claim.approvedAmount !== undefined ? `₹${(claim.approvedAmount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {claim.receiptUrls && claim.receiptUrls.length > 0 ? (
                          <a
                            href={claim.receiptUrls[0]}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
                          >
                            <FileText className="h-3 w-3" />
                            {claim.receiptUrls.length} File(s)
                          </a>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(claim.status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {claim.status === "MANAGER_REVIEW" && (
                            <button
                              onClick={() => {
                                setSelectedClaimId(claim._id);
                                setReviewType("MANAGER");
                                setReviewAction("APPROVE");
                                setIsReviewOpen(true);
                              }}
                              className="rounded bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
                            >
                              Manager Review
                            </button>
                          )}
                          {claim.status === "FINANCE_REVIEW" && (
                            <button
                              onClick={() => {
                                setSelectedClaimId(claim._id);
                                setReviewType("FINANCE");
                                setReviewAction("APPROVE");
                                setApprovedAmount(claim.claimedAmount / 100);
                                setIsReviewOpen(true);
                              }}
                              className="rounded bg-purple-500/10 px-2 py-1 text-[11px] font-semibold text-purple-600 hover:bg-purple-500/20 dark:text-purple-400"
                            >
                              Finance Review
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedClaimId(claim._id)}
                            className="rounded border border-border px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claim Details Drawer / Modal */}
        {activeClaim && !isReviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-card border border-border p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Claim Details — {activeClaim.claimNumber}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Submitted on {new Date((activeClaim as any).submittedAt || activeClaim.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedClaimId(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Employee:</span>
                  <div className="font-semibold text-foreground text-sm">{activeClaim.employeeName} ({activeClaim.employeeCode})</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Status:</span>
                  <div className="mt-0.5">{getStatusBadge(activeClaim.status)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Expense Category:</span>
                  <div className="font-semibold text-foreground">{activeClaim.categoryCode}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Tax Treatment:</span>
                  <div className="mt-0.5">{getTaxBadge(activeClaim.taxTreatment)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Claimed Amount:</span>
                  <div className="font-bold text-foreground text-sm">₹{(activeClaim.claimAmount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Approved Amount:</span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {activeClaim.approvedAmount !== undefined ? `₹${(activeClaim.approvedAmount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "Under Review"}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Business Purpose:</span>
                  <div className="mt-1 rounded-lg bg-muted/40 p-2 text-foreground font-medium">
                    {activeClaim.businessPurpose || "No purpose specified"}
                  </div>
                </div>
                {activeClaim.managerComments && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Manager Comments:</span>
                    <div className="mt-1 rounded-lg bg-amber-50/50 p-2 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                      {activeClaim.managerComments}
                    </div>
                  </div>
                )}
                {activeClaim.financeComments && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Finance Comments:</span>
                    <div className="mt-1 rounded-lg bg-purple-50/50 p-2 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300">
                      {activeClaim.financeComments}
                    </div>
                  </div>
                )}
                {activeClaim.settledInPayrollRunId && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Payroll Settlement:</span>
                    <div className="mt-1 rounded-lg bg-emerald-50/50 p-2 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 font-semibold">
                      Paid out in Payroll Run ID: {activeClaim.settledInPayrollRunId}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t border-border">
                <button
                  onClick={() => setSelectedClaimId(null)}
                  className="rounded-lg bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Action Dialog */}
        {isReviewOpen && activeClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">
                  {reviewType === "MANAGER" ? "Manager Approval Workflow" : "Finance Verification & Approval"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Reviewing {activeClaim.claimNumber} for {activeClaim.employeeName}
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Decision Action</label>
                  <select
                    value={reviewAction}
                    onChange={(e: any) => setReviewAction(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="APPROVE">Approve Claim</option>
                    <option value="REJECT">Reject Claim</option>
                    {reviewType === "MANAGER" ? (
                      <option value="RETURN">Return for Correction</option>
                    ) : (
                      <option value="HOLD">Place On Hold</option>
                    )}
                  </select>
                </div>

                {reviewType === "FINANCE" && reviewAction === "APPROVE" && (
                  <div>
                    <label className="font-semibold text-foreground block mb-1">
                      Approved Payout Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-[11px] text-muted-foreground mt-0.5 block">
                      Original claimed: ₹{(activeClaim.claimAmount / 100).toFixed(2)}
                    </span>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-foreground block mb-1">Audit Comments / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter review explanation or instructions..."
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReview}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Confirm Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Claim Modal */}
        {isNewClaimOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form onSubmit={handleCreateClaim} className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-xl space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">Submit Reimbursement Claim</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Record an employee expense claim for validation and payroll reimbursement.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Select Employee *</label>
                  <select
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees?.map((e: any) => (
                      <option key={e._id} value={e._id}>
                        {e.personalDetails?.firstName} {e.personalDetails?.lastName} ({e.workDetails?.employeeNumber || e._id.slice(0, 6)})
                      </option>
                    ))}
                  </select>
                </div>

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
                          <option value="TRAVEL">Travel Expenses (Business Non-Taxable)</option>
                          <option value="MEALS">Client Entertainment / Meals</option>
                          <option value="TELECOM">Mobile & Internet Reimbursement</option>
                          <option value="FUEL">Fuel & Conveyance</option>
                          <option value="MEDICAL">Medical Expense Reimbursement</option>
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
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Receipt URL / Attachment</label>
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
                  <label className="font-semibold text-foreground block mb-1">Business Purpose *</label>
                  <textarea
                    rows={2}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    placeholder="Describe business reason for expense..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewClaimOpen(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
