"use client";

import { GreytHRIcon } from "@/components/greythr-icon";
import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Info,
  Loader2,
  Paperclip,
  Plus,
  Trash2,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type TabType = "apply" | "pending" | "history";
type SubMenu = "leave" | "restricted" | "cancel" | "compoff";

export default function LeaveApplyPage() {
  const { current: workspaceId } = useWorkspace();
  const scoped = workspaceId ? { workspaceId } : "skip";

  const me = useQuery(api.employees.getMyProfile, scoped);
  const balances = useQuery(api.leaves.getLeaveBalances, scoped);
  const myLeaves = useQuery(api.leaves.getMyLeaves, scoped);
  const employees = useQuery(api.employees.list, scoped);

  const submitMyLeave = useMutation(api.leaves.submitMyLeave);
  const cancelMyLeave = useMutation(api.leaves.cancelMyLeave);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const submitCompOff = useMutation(api.leaves.submitCompOffRequest);
  const myCompOffRequests = useQuery(api.leaves.listMyCompOffRequests, scoped);

  // Navigation state
  const [activeTab, setActiveTab] = useState<TabType>("apply");
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenu>("leave");
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  // Form State
  const [leaveType, setLeaveType] = useState<
    "sick" | "casual" | "unpaid" | "restricted_holiday" | "comp_off"
  >("sick");
  const [fromDate, setFromDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [fromSession, setFromSession] = useState<
    "full_day" | "session_1" | "session_2"
  >("session_1");
  const [toDate, setToDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [toSession, setToSession] = useState<
    "full_day" | "session_1" | "session_2"
  >("session_2");
  const [contactDetails, setContactDetails] = useState("");
  const [reason, setReason] = useState("");
  const [selectedApprover, setSelectedApprover] = useState<string>("");
  const [ccList, setCcList] = useState<string[]>([]);
  const [showCcInput, setShowCcInput] = useState(false);
  const [ccInput, setCcInput] = useState("");

  // Attachment State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadedStorageId, setUploadedStorageId] =
    useState<Id<"_storage"> | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Comp-off Form State
  const [compOffDate, setCompOffDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [compOffDays, setCompOffDays] = useState<number>(1);
  const [compOffReason, setCompOffReason] = useState("");
  const [compOffSuccess, setCompOffSuccess] = useState<string | null>(null);
  const [compOffError, setCompOffError] = useState<string | null>(null);
  const [isSubmittingCompOff, setIsSubmittingCompOff] = useState(false);

  // File Upload Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileUploadError("File size exceeds 5MB limit.");
      return;
    }

    const allowed = [
      "pdf",
      "xls",
      "xlsx",
      "doc",
      "docx",
      "txt",
      "ppt",
      "pptx",
      "gif",
      "jpg",
      "jpeg",
      "png",
    ];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!allowed.includes(ext)) {
      setFileUploadError(
        `Invalid format .${ext}. Allowed: ${allowed.join(", ")}`,
      );
      return;
    }

    setFileUploadError(null);
    setSelectedFile(file);
    setIsUploadingFile(true);
    try {
      const uploadUrl = await generateUploadUrl({ workspaceId: workspaceId! });
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      setUploadedStorageId(storageId as Id<"_storage">);
    } catch {
      setFileUploadError("Failed to upload file. Please try again.");
      setSelectedFile(null);
      setUploadedStorageId(null);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Days Calculation
  const calculatedDays = useMemo(() => {
    if (!fromDate || !toDate) return 0;
    if (fromDate > toDate) return 0;
    if (fromDate === toDate) {
      if (fromSession === "session_1" || fromSession === "session_2") {
        return 0.5;
      }
      return 1;
    }
    const d1 = new Date(fromDate);
    const d2 = new Date(toDate);
    const diff =
      Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0.5, diff);
  }, [fromDate, toDate, fromSession]);

  const currentAvailableBalance = useMemo(() => {
    if (!balances) return 0;
    if (leaveType === "casual") return balances.casual?.balance ?? 0;
    if (leaveType === "sick") return balances.sick?.balance ?? 0;
    if (leaveType === "unpaid") return 999;
    if (leaveType === "restricted_holiday")
      return balances.restricted_holiday?.balance ?? 2;
    if (leaveType === "comp_off") return balances.comp_off?.balance ?? 0;
    return 0;
  }, [balances, leaveType]);

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;
    setSubmitError(null);
    setSubmitSuccess(null);

    if (fromDate > toDate) {
      setSubmitError("From date cannot be after To date.");
      return;
    }

    if (!reason.trim()) {
      setSubmitError("Please enter a reason for your leave.");
      return;
    }

    if (leaveType !== "unpaid" && calculatedDays > currentAvailableBalance) {
      setSubmitError(
        `Insufficient leave balance. You are applying for ${calculatedDays} day(s), but have only ${currentAvailableBalance} remaining.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await submitMyLeave({
        workspaceId,
        leaveType,
        startDate: fromDate,
        endDate: toDate,
        session: fromDate === toDate ? fromSession : "full_day",
        contactDetails: contactDetails.trim() || undefined,
        reason: reason.trim(),
        fileAttachment: selectedFile?.name,
        storageId: uploadedStorageId ?? undefined,
      });
      setSubmitSuccess("Leave request submitted successfully for approval.");
      setReason("");
      setContactDetails("");
      setSelectedFile(null);
      setUploadedStorageId(null);
    } catch (err) {
      setSubmitError(
        (err as Error).message || "Failed to submit leave request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelLeave = async (requestId: Id<"leaveRequests">) => {
    if (!workspaceId) return;
    if (!confirm("Are you sure you want to cancel this leave request?")) return;
    setCancellingId(requestId);
    try {
      await cancelMyLeave({ workspaceId, requestId });
    } catch (err) {
      alert((err as Error).message || "Failed to cancel leave request.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleSubmitCompOff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;
    setCompOffError(null);
    setCompOffSuccess(null);
    if (!compOffReason.trim()) {
      setCompOffError("Please enter a reason for your Comp-Off grant request.");
      return;
    }
    setIsSubmittingCompOff(true);
    try {
      await submitCompOff({
        workspaceId,
        workDate: compOffDate,
        daysCount: compOffDays,
        reason: compOffReason.trim(),
      });
      setCompOffSuccess("Comp-Off grant request submitted successfully.");
      setCompOffReason("");
    } catch (err) {
      setCompOffError(
        (err as Error).message || "Failed to submit Comp-Off request.",
      );
    } finally {
      setIsSubmittingCompOff(false);
    }
  };

  const pendingLeaves = useMemo(() => {
    return myLeaves?.filter((l) => l.status === "pending") ?? [];
  }, [myLeaves]);

  const historyLeaves = useMemo(() => {
    return (
      myLeaves?.filter(
        (l) =>
          l.status === "approved" ||
          l.status === "rejected" ||
          l.status === "cancelled",
      ) ?? []
    );
  }, [myLeaves]);

  const approverOptions = useMemo(() => {
    return employees?.filter((e) => e._id !== me?._id) ?? [];
  }, [employees, me]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F17] px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Top Header & greytHR Segmented Pill Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <GreytHRIcon />
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Leave Apply
            </h1>
          </div>

          {/* Segmented control matching greytHR Screenshot 1 */}
          <div className="flex items-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("apply")}
              className={`rounded-full px-5 py-1 text-xs font-medium transition ${
                activeTab === "apply"
                  ? "bg-[#0091FF] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`rounded-full px-5 py-1 text-xs font-medium transition ${
                activeTab === "pending"
                  ? "bg-[#0091FF] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Pending ({pendingLeaves.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`rounded-full px-5 py-1 text-xs font-medium transition ${
                activeTab === "history"
                  ? "bg-[#0091FF] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* ── TAB 1: APPLY (TWO-COLUMN GREYTHR REFERENCE) ──────────────────── */}
        {activeTab === "apply" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Sub-Menu Column */}
            <div className="md:col-span-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => setActiveSubMenu("leave")}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded transition flex items-center justify-between ${
                  activeSubMenu === "leave"
                    ? "border-l-4 border-[#0091FF] text-[#0091FF] bg-blue-50/50 dark:bg-blue-950/20 font-semibold pl-2"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span>Leave</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubMenu("restricted")}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded transition flex items-center justify-between ${
                  activeSubMenu === "restricted"
                    ? "border-l-4 border-[#0091FF] text-[#0091FF] bg-blue-50/50 dark:bg-blue-950/20 font-semibold pl-2"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span>Restricted Holiday</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubMenu("cancel")}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded transition flex items-center justify-between ${
                  activeSubMenu === "cancel"
                    ? "border-l-4 border-[#0091FF] text-[#0091FF] bg-blue-50/50 dark:bg-blue-950/20 font-semibold pl-2"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span>Leave Cancel</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSubMenu("compoff")}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded transition flex items-center justify-between ${
                  activeSubMenu === "compoff"
                    ? "border-l-4 border-[#0091FF] text-[#0091FF] bg-blue-50/50 dark:bg-blue-950/20 font-semibold pl-2"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span>Comp Off Grant</span>
              </button>
            </div>

            {/* Right Main Form Area */}
            <div className="md:col-span-9 space-y-4">
              {/* Yellow Policy Banner */}
              {showInfoBanner && (
                <div className="rounded-md border border-amber-200 bg-amber-50/80 dark:border-amber-900/30 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Leave is earned by an employee and granted by the employer
                      to take time off work. The employee is free to avail this
                      leave in accordance with the company policy.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInfoBanner(false)}
                    className="text-[#0091FF] hover:underline font-medium shrink-0 cursor-pointer text-xs"
                  >
                    Hide
                  </button>
                </div>
              )}

              {/* Sub-menu View 1: Applying for Leave */}
              {activeSubMenu === "leave" && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-5">
                    Applying for Leave
                  </h2>

                  {submitSuccess && (
                    <div className="mb-4 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}

                  {submitError && (
                    <div className="mb-4 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 p-3 text-xs text-red-800 dark:text-red-200 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitLeave} className="space-y-4">
                    {/* Leave Type */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Leave type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) =>
                          setLeaveType(
                            e.target.value as
                              | "sick"
                              | "casual"
                              | "unpaid"
                              | "restricted_holiday"
                              | "comp_off",
                          )
                        }
                        className="w-full max-w-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0091FF]"
                      >
                        <option value="sick">
                          Sick Leave (Balance: {balances?.sick?.balance ?? 0})
                        </option>
                        <option value="unpaid">
                          Loss Of Pay (Unpaid Leave)
                        </option>
                        <option value="restricted_holiday">
                          Restricted Holiday (RH - Balance: {balances?.restricted_holiday?.balance ?? 2})
                        </option>
                        <option value="comp_off">
                          Compensatory Off (Comp-Off - Balance: {balances?.comp_off?.balance ?? 0})
                        </option>
                        <option value="casual" disabled>
                          Casual Leave (Disabled by policy)
                        </option>
                      </select>
                    </div>

                    {/* From Date & Session */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          From date <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0091FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Session <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={fromSession}
                          onChange={(e) =>
                            setFromSession(
                              e.target.value as
                                | "full_day"
                                | "session_1"
                                | "session_2",
                            )
                          }
                          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0091FF]"
                        >
                          <option value="session_1">Session 1</option>
                          <option value="session_2">Session 2</option>
                          <option value="full_day">Full Day</option>
                        </select>
                      </div>
                    </div>

                    {/* To Date & Session with Balance Breakdown on Right */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            To date <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0091FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Session <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={toSession}
                            onChange={(e) =>
                              setToSession(
                                e.target.value as
                                  | "full_day"
                                  | "session_1"
                                  | "session_2",
                              )
                            }
                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0091FF]"
                          >
                            <option value="session_2">Session 2</option>
                            <option value="session_1">Session 1</option>
                            <option value="full_day">Full Day</option>
                          </select>
                        </div>
                      </div>

                      {/* Right Balance Summary (from greytHR screenshot) */}
                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 self-start pr-12">
                        <div>
                          Leave Balance:{" "}
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {currentAvailableBalance}
                          </span>
                        </div>
                        <div>
                          Applying For:{" "}
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {calculatedDays}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Applying to */}
                    <div className="pt-2">
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Applying to
                      </label>
                      <div className="flex items-center gap-2 max-w-sm">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          <User className="h-4 w-4" />
                        </div>
                        <select
                          value={selectedApprover}
                          onChange={(e) => setSelectedApprover(e.target.value)}
                          className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0091FF]"
                        >
                          <option value="">Reporting Manager / HR Admin</option>
                          {approverOptions.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.firstName} {emp.lastName} (
                              {emp.designation || "Manager"})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* CC to */}
                    <div className="pt-1">
                      <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span>CC to</span>
                        <button
                          type="button"
                          onClick={() => setShowCcInput((prev) => !prev)}
                          className="inline-flex items-center gap-1 text-[#0091FF] hover:underline font-medium"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                      {showCcInput && (
                        <div className="mt-2 flex items-center gap-2 max-w-sm">
                          <input
                            type="email"
                            placeholder="colleague@indiapay.local"
                            value={ccInput}
                            onChange={(e) => setCcInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (ccInput.trim()) {
                                  setCcList((prev) => [
                                    ...prev,
                                    ccInput.trim(),
                                  ]);
                                  setCcInput("");
                                }
                              }
                            }}
                            className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (ccInput.trim()) {
                                setCcList((prev) => [...prev, ccInput.trim()]);
                                setCcInput("");
                              }
                            }}
                            className="rounded bg-[#0091FF] text-white px-2.5 py-1.5 text-xs font-medium"
                          >
                            Add
                          </button>
                        </div>
                      )}
                      {ccList.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {ccList.map((email, idx) => (
                            <span
                              key={email}
                              className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-300"
                            >
                              <span>{email}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setCcList((prev) =>
                                    prev.filter((_, i) => i !== idx),
                                  )
                                }
                                className="text-slate-400 hover:text-rose-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact details */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Contact details
                      </label>
                      <input
                        type="text"
                        placeholder="Emergency contact or phone number"
                        value={contactDetails}
                        onChange={(e) => setContactDetails(e.target.value)}
                        className="w-full max-w-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0091FF]"
                      />
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Reason <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Enter a reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0091FF]"
                      />
                    </div>

                    {/* Attach File */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#0091FF]">
                          <Paperclip className="h-3.5 w-3.5" />
                          <span>Attach File</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".pdf,.xls,.xlsx,.doc,.docx,.txt,.ppt,.pptx,.gif,.jpg,.jpeg,.png"
                          />
                        </label>
                        <span className="text-[11px] text-slate-400">
                          File Types: pdf , xls , xlsx , doc , docx , txt , ppt
                          , pptx , gif , jpg , jpeg , png
                        </span>
                      </div>

                      {isUploadingFile && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0091FF]" />
                          <span>Uploading attachment...</span>
                        </div>
                      )}

                      {selectedFile && !isUploadingFile && (
                        <div className="flex items-center gap-2 rounded bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 max-w-sm">
                          <Paperclip className="h-3.5 w-3.5 text-cyan-500" />
                          <span className="truncate flex-1 font-mono">
                            {selectedFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setUploadedStorageId(null);
                            }}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {fileUploadError && (
                        <p className="text-xs text-rose-500">
                          {fileUploadError}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons matching greytHR screenshot */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-[#0091FF] hover:bg-[#007EE5] text-white px-6 py-2 text-xs font-medium transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isSubmitting && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        <span>Submit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReason("");
                          setContactDetails("");
                          setSelectedFile(null);
                        }}
                        className="rounded-md border border-[#0091FF] text-[#0091FF] hover:bg-blue-50 dark:hover:bg-blue-950/20 px-6 py-2 text-xs font-medium transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Sub-menu View 2: Restricted Holiday */}
              {activeSubMenu === "restricted" && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Restricted Holiday (RH)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Employees are entitled to up to 2 Restricted Holidays per
                    calendar year.
                  </p>
                  <div className="rounded border border-blue-100 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-950/20 p-4 text-xs mb-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Available RH Balance:{" "}
                      {balances?.restricted_holiday?.balance ?? 2} of 2 days
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLeaveType("restricted_holiday");
                      setActiveSubMenu("leave");
                    }}
                    className="rounded-md bg-[#0091FF] text-white px-4 py-2 text-xs font-medium hover:bg-[#007EE5]"
                  >
                    Apply for Restricted Holiday
                  </button>
                </div>
              )}

              {/* Sub-menu View 3: Leave Cancel */}
              {activeSubMenu === "cancel" && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    Cancel Pending Leave Requests
                  </h2>
                  {pendingLeaves.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4">
                      No pending leave requests to cancel.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {pendingLeaves.map((req) => (
                        <div
                          key={req._id}
                          className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        >
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200 uppercase">
                              {req.leaveType} Leave ({req.daysCount} day
                              {req.daysCount > 1 ? "s" : ""})
                            </p>
                            <p className="text-slate-500">
                              {req.startDate} to {req.endDate} • Reason:{" "}
                              {req.reason}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCancelLeave(req._id)}
                            disabled={cancellingId === req._id}
                            className="text-rose-600 hover:text-rose-700 font-medium border border-rose-200 rounded px-3 py-1 text-xs"
                          >
                            {cancellingId === req._id
                              ? "Cancelling..."
                              : "Cancel Request"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-menu View 4: Comp Off Grant */}
              {activeSubMenu === "compoff" && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    Comp-Off Grant Request
                  </h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Worked on a weekend or public holiday? Request compensatory
                    off credit from management.
                  </p>

                  {compOffSuccess && (
                    <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                      {compOffSuccess}
                    </div>
                  )}
                  {compOffError && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-xs text-red-800">
                      {compOffError}
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmitCompOff}
                    className="space-y-4 max-w-md"
                  >
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Work Date Worked{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={compOffDate}
                        onChange={(e) => setCompOffDate(e.target.value)}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Days Requested
                      </label>
                      <select
                        value={compOffDays}
                        onChange={(e) => setCompOffDays(Number(e.target.value))}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
                      >
                        <option value={0.5}>0.5 Day (Half Day)</option>
                        <option value={1}>1.0 Day (Full Day)</option>
                        <option value={2}>2.0 Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Work Done / Justification{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detail the work completed on the holiday..."
                        value={compOffReason}
                        onChange={(e) => setCompOffReason(e.target.value)}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingCompOff}
                      className="rounded-md bg-[#0091FF] text-white px-5 py-2 text-xs font-medium hover:bg-[#007EE5]"
                    >
                      {isSubmittingCompOff
                        ? "Submitting..."
                        : "Submit Comp-Off Request"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: PENDING REQUESTS ──────────────────────────────────────── */}
        {activeTab === "pending" && (
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Pending Leave Applications ({pendingLeaves.length})
            </h2>
            {pendingLeaves.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                You have no pending leave applications awaiting approval.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingLeaves.map((l) => (
                  <div
                    key={l._id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-xs text-slate-800 dark:text-slate-200 capitalize">
                        {l.leaveType} Leave • {l.daysCount} Day(s)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {l.startDate} to {l.endDate} ({l.session || "full day"})
                        • Reason: {l.reason}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCancelLeave(l._id)}
                      disabled={cancellingId === l._id}
                      className="rounded border border-rose-300 text-rose-600 hover:bg-rose-50 px-3 py-1 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: LEAVE HISTORY ─────────────────────────────────────────── */}
        {activeTab === "history" && (
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Leave History
            </h2>
            {historyLeaves.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No past leave records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                    <tr>
                      <th className="pb-2">Leave Type</th>
                      <th className="pb-2">Duration</th>
                      <th className="pb-2">Days</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {historyLeaves.map((l) => (
                      <tr key={l._id}>
                        <td className="py-3 font-medium capitalize text-slate-800 dark:text-slate-200">
                          {l.leaveType}
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">
                          {l.startDate} to {l.endDate}
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-400">
                          {l.daysCount}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              l.status === "approved"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : l.status === "rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 max-w-xs truncate">
                          {l.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
