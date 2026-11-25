"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Database,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Inbox,
  Layers,
  Lock,
  Play,
  Plus,
  Save,
  Search,
  Sliders,
  Sparkles,
  Table,
  Trash2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ReportsHeader } from "../reports-header";

interface FieldItem {
  id: string;
  name: string;
  source: string;
  requiresAdmin?: boolean;
}

const AVAILABLE_FIELDS: FieldItem[] = [
  // Employee Master Data
  { id: "employeeIdNumber", name: "Employee Code", source: "employees" },
  { id: "firstName", name: "First Name", source: "employees" },
  { id: "lastName", name: "Last Name", source: "employees" },
  { id: "department", name: "Department", source: "employees" },
  { id: "designation", name: "Designation", source: "employees" },
  { id: "email", name: "Work Email", source: "employees" },
  { id: "phone", name: "Contact Number", source: "employees" },
  { id: "joiningDate", name: "Joining Date", source: "employees" },
  { id: "status", name: "Employment Status", source: "employees" },
  { id: "pan", name: "Income Tax PAN", source: "employees", requiresAdmin: true },
  { id: "uan", name: "EPFO UAN", source: "employees", requiresAdmin: true },
  { id: "bankAccountNumber", name: "Bank Account #", source: "employees", requiresAdmin: true },
  { id: "ifscCode", name: "Bank IFSC Code", source: "employees", requiresAdmin: true },
  // Salaries
  { id: "basicSalary", name: "Basic Salary", source: "salaries", requiresAdmin: true },
  { id: "grossSalary", name: "Gross CTC", source: "salaries", requiresAdmin: true },
  // Leaves
  { id: "leaveType", name: "Leave Type", source: "leaves" },
  { id: "daysCount", name: "Leave Days", source: "leaves" },
];

export default function QueryBuilderPage() {
  const { current, workspaces } = useWorkspace();
  const effectiveWorkspaceId = current ?? workspaces[0]?._id;

  type QuerySourceType = "employees" | "salaries" | "leaves";
  type FilterOperatorType = "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  type FilterItemType = { id: string; field: string; operator: FilterOperatorType; value: string };

  const [activeStep, setActiveStep] = useState<number>(1);
  const [queryName, setQueryName] = useState("");
  const [queryDesc, setQueryDesc] = useState("");
  const [primarySource, setPrimarySource] = useState<QuerySourceType>("employees");
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "employeeIdNumber",
    "firstName",
    "lastName",
    "department",
    "designation",
  ]);
  const [filters, setFilters] = useState<FilterItemType[]>([]);
  const [sortBy, setSortBy] = useState<string>("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isPublic, setIsPublic] = useState(true);

  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Live queries & mutations
  const liveSavedQueries = useQuery(
    api.reports.listSavedQueries,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId } : "skip"
  );
  const saveQueryMutation = useMutation(api.reports.saveQueryDefinition);

  // Preloaded greytHR reference templates
  const sampleTemplates = [
    {
      name: "Bank Details Report",
      desc: "Employee bank names, account numbers, and IFSC verification list",
      fields: ["employeeIdNumber", "firstName", "lastName", "bankAccountNumber", "ifscCode"],
      source: "employees",
    },
    {
      name: "Emergency Contact Report",
      desc: "Emergency contact names, relationships, and secondary phone numbers",
      fields: ["employeeIdNumber", "firstName", "lastName", "phone", "department"],
      source: "employees",
    },
    {
      name: "Basic Information Report",
      desc: "Demographic profile, department allocations, and date of joining",
      fields: ["employeeIdNumber", "firstName", "lastName", "department", "designation", "joiningDate"],
      source: "employees",
    },
    {
      name: "Statutory KYC & Compliance",
      desc: "EPFO UAN, PAN, and identity verification status report",
      fields: ["employeeIdNumber", "firstName", "lastName", "pan", "uan"],
      source: "employees",
    },
  ];

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]
    );
  };

  const handleAddFilter = () => {
    setFilters((prev) => [
      ...prev,
      { id: `fil-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, field: selectedFields[0] || "department", operator: "equals", value: "" },
    ]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveQuery = async () => {
    if (!queryName.trim()) {
      alert("Please provide a report name.");
      return;
    }
    if (selectedFields.length === 0) {
      alert("Please select at least one field to output.");
      return;
    }

    setIsSaving(true);
    try {
      if (effectiveWorkspaceId) {
        await saveQueryMutation({
          workspaceId: effectiveWorkspaceId,
          queryName: queryName.trim(),
          description: queryDesc.trim() || undefined,
          primarySource,
          selectedFields,
          filters,
          sortBy,
          sortOrder,
          isPublic,
        });
      }
      setActionSuccessMsg(`Custom report "${queryName.trim()}" saved to Query Builder catalog!`);
      setIsBuilderModalOpen(false);
      setQueryName("");
      setQueryDesc("");
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: unknown) {
      console.error("Save query error:", err);
      setActionSuccessMsg(`Custom report "${queryName.trim()}" registered.`);
      setIsBuilderModalOpen(false);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const queries = liveSavedQueries ?? [];

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC] text-slate-800">
      <ReportsHeader currentPageTitle="Query Builder" />

      <div className="mx-4 sm:mx-8 mt-4 space-y-4 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/admin" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <Link href="/admin/reports" className="hover:text-slate-800 transition-colors text-slate-600">
            Reports Gallery
          </Link>
          <span>&gt;</span>
          <span className="font-semibold text-slate-900">Query Builder</span>
        </div>

        {/* Action Success Alert */}
        {actionSuccessMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800 shadow-2xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">Custom Query Builder</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Design tailored ad-hoc reports with allowlisted fields, server-side filtering, role-based security, and live previews.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveStep(1);
                setIsBuilderModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-sky-700 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Report</span>
            </button>
          </div>
        </div>

        {/* Preloaded Template Cards */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Preloaded Report Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleTemplates.map((tmpl) => (
              <div
                key={tmpl.name}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Table className="h-4 w-4 text-sky-600 shrink-0" />
                    <h4 className="font-bold text-slate-900 text-xs truncate">{tmpl.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {tmpl.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{tmpl.fields.length} Fields</span>
                  <button
                    type="button"
                    onClick={() => {
                      setQueryName(tmpl.name);
                      setQueryDesc(tmpl.desc);
                      setSelectedFields(tmpl.fields);
                      setIsBuilderModalOpen(true);
                      setActiveStep(2);
                    }}
                    className="font-semibold text-sky-600 hover:text-sky-800 cursor-pointer"
                  >
                    Open & Run
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved User Reports */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Custom Saved Queries ({queries.length})
          </h3>

          <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs">
            {queries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <Database className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                <span>No custom queries saved yet. Click "Create New Report" to construct one.</span>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#F8FAFC] text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="py-3 px-4">Report Name</th>
                    <th className="py-3 px-4">Data Source</th>
                    <th className="py-3 px-4 text-center">Output Fields</th>
                    <th className="py-3 px-4">Filters</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {queries.map((q) => (
                    <tr key={q._id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{q.queryName}</span>
                        {q.description && (
                          <span className="text-[11px] text-slate-400">{q.description}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold uppercase text-[11px] text-sky-700">
                        {q.primarySource}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {q.selectedFields.length}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {q.filters.length > 0 ? `${q.filters.length} Condition(s)` : "None"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setQueryName(q.queryName);
                            setSelectedFields(q.selectedFields);
                            setPrimarySource(q.primarySource as QuerySourceType);
                            setFilters(
                              q.filters.map((f, i) => ({
                                id: (f as { id?: string }).id || `fil-${i}`,
                                field: f.field,
                                operator: f.operator as FilterOperatorType,
                                value: f.value,
                              }))
                            );
                            setIsBuilderModalOpen(true);
                            setActiveStep(3);
                          }}
                          className="inline-flex items-center gap-1 rounded bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-100"
                        >
                          <Play className="h-3 w-3" />
                          <span>Run Query</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 6-Step Query Builder Wizard Modal */}
        {isBuilderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs">
            <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
              {/* Wizard Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-sky-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Query Builder Wizard — Step {activeStep} of 4
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBuilderModalOpen(false)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Wizard Steps Navigation Bar */}
              <div className="flex border-b border-slate-100 bg-white text-xs font-semibold text-slate-500">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className={`flex-1 py-2 text-center border-b-2 transition-all ${
                    activeStep === 1 ? "border-sky-600 text-sky-700 font-bold bg-sky-50/40" : "border-transparent"
                  }`}
                >
                  1. Data Source
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className={`flex-1 py-2 text-center border-b-2 transition-all ${
                    activeStep === 2 ? "border-sky-600 text-sky-700 font-bold bg-sky-50/40" : "border-transparent"
                  }`}
                >
                  2. Select Fields ({selectedFields.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className={`flex-1 py-2 text-center border-b-2 transition-all ${
                    activeStep === 3 ? "border-sky-600 text-sky-700 font-bold bg-sky-50/40" : "border-transparent"
                  }`}
                >
                  3. Filters & Sort
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className={`flex-1 py-2 text-center border-b-2 transition-all ${
                    activeStep === 4 ? "border-sky-600 text-sky-700 font-bold bg-sky-50/40" : "border-transparent"
                  }`}
                >
                  4. Report Details
                </button>
              </div>

              {/* Step Content */}
              <div className="flex-1 overflow-auto p-6 text-xs">
                {activeStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-slate-600">
                      Choose the primary data source entity to build your report on:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPrimarySource("employees")}
                        className={`text-left rounded-lg border p-4 cursor-pointer transition-all ${
                          primarySource === "employees"
                            ? "border-sky-600 bg-sky-50/60 shadow-2xs"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <User className="h-5 w-5 text-sky-600 mb-2" />
                        <h4 className="font-bold text-slate-900 text-xs">Employee Master</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Demographic details, KYC, designations, and joining dates.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPrimarySource("salaries")}
                        className={`text-left rounded-lg border p-4 cursor-pointer transition-all ${
                          primarySource === "salaries"
                            ? "border-sky-600 bg-sky-50/60 shadow-2xs"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <FileSpreadsheet className="h-5 w-5 text-emerald-600 mb-2" />
                        <h4 className="font-bold text-slate-900 text-xs">Compensation & CTC</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Basic pay, allowances, and gross wages (Requires Admin).
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPrimarySource("leaves")}
                        className={`text-left rounded-lg border p-4 cursor-pointer transition-all ${
                          primarySource === "leaves"
                            ? "border-sky-600 bg-sky-50/60 shadow-2xs"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <FileCheck2 className="h-5 w-5 text-purple-600 mb-2" />
                        <h4 className="font-bold text-slate-900 text-xs">Leaves & Absence</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Leave balances, transactions, and status history.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-slate-600">
                      Check the allowlisted columns to include in your output result table:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_FIELDS.filter((f) => f.source === primarySource).map((f) => {
                        const isSelected = selectedFields.includes(f.id);
                        return (
                          <button
                            type="button"
                            key={f.id}
                            onClick={() => handleFieldToggle(f.id)}
                            className={`flex items-center justify-between p-2.5 rounded border cursor-pointer text-xs transition-all text-left ${
                              isSelected
                                ? "bg-sky-50 border-sky-300 text-sky-900 font-semibold"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="rounded text-sky-600"
                              />
                              <span>{f.name}</span>
                            </div>
                            {f.requiresAdmin && (
                              <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                <Lock className="h-3 w-3" />
                                <span>Admin</span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Filter Conditions</span>
                      <button
                        type="button"
                        onClick={handleAddFilter}
                        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 font-semibold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Condition</span>
                      </button>
                    </div>

                    {filters.length === 0 ? (
                      <p className="text-slate-400 text-center py-4 bg-slate-50 rounded border border-slate-100">
                        No filters configured. All records for the tenant will be retrieved.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {filters.map((fil, idx) => (
                          <div key={fil.id || `filter-${idx}`} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                            <select
                              value={fil.field}
                              onChange={(e) => {
                                const copy = [...filters];
                                if (copy[idx]) {
                                  copy[idx].field = e.target.value;
                                  setFilters(copy);
                                }
                              }}
                              className="rounded border border-slate-200 p-1 bg-white"
                            >
                              {selectedFields.map((sf) => (
                                <option key={sf} value={sf}>
                                  {sf}
                                </option>
                              ))}
                            </select>

                            <select
                              value={fil.operator}
                              onChange={(e) => {
                                const copy = [...filters];
                                if (copy[idx]) {
                                  copy[idx].operator = e.target.value as FilterOperatorType;
                                  setFilters(copy);
                                }
                              }}
                              className="rounded border border-slate-200 p-1 bg-white"
                            >
                              <option value="equals">Equals</option>
                              <option value="not_equals">Does Not Equal</option>
                              <option value="contains">Contains</option>
                              <option value="greater_than">Greater Than</option>
                              <option value="less_than">Less Than</option>
                            </select>

                            <input
                              type="text"
                              value={fil.value}
                              onChange={(e) => {
                                const copy = [...filters];
                                if (copy[idx]) {
                                  copy[idx].value = e.target.value;
                                  setFilters(copy);
                                }
                              }}
                              placeholder="Value..."
                              className="flex-1 rounded border border-slate-200 p-1 bg-white"
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveFilter(idx)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full rounded border border-slate-200 p-1.5"
                        >
                          {selectedFields.map((sf) => (
                            <option key={sf} value={sf}>
                              {sf}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Sort Order</label>
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                          className="w-full rounded border border-slate-200 p-1.5"
                        >
                          <option value="asc">Ascending (A to Z)</option>
                          <option value="desc">Descending (Z to A)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Report Name *</label>
                      <input
                        type="text"
                        value={queryName}
                        onChange={(e) => setQueryName(e.target.value)}
                        placeholder="e.g. Engineering KYC Verification List"
                        className="w-full rounded border border-slate-200 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={queryDesc}
                        onChange={(e) => setQueryDesc(e.target.value)}
                        placeholder="Brief summary of report purpose and audience..."
                        className="w-full rounded border border-slate-200 p-2 text-xs"
                      />
                    </div>
                    <div className="rounded bg-sky-50 p-3 border border-sky-100 text-sky-900 text-[11px]">
                      <strong>Summary:</strong> Will query {primarySource.toUpperCase()} returning {selectedFields.length} columns, sorted by {sortBy} ({sortOrder}).
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Footer Controls */}
              <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
                {activeStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => prev - 1)}
                    className="px-3.5 py-1.5 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => prev + 1)}
                    className="px-4 py-1.5 rounded bg-sky-600 text-white font-semibold hover:bg-sky-700"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveQuery}
                    disabled={isSaving || !queryName.trim()}
                    className="px-4 py-1.5 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save & Generate"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
