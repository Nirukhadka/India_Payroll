"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Files,
  Filter,
  HelpCircle,
  Inbox,
  Loader2,
  Printer,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ReportsHeader } from "./reports-header";
import {
  type ReportCategoryDefinition,
  type ReportItemDefinition,
  REPORTS_REGISTRY,
} from "./reports-registry";
import {
  REPORT_PARAMETER_SCHEMAS,
  type ReportParameterSchema,
} from "./report-parameter-schemas";

export default function ReportsGalleryPage() {
  const { current, workspaces } = useWorkspace();
  const effectiveWorkspaceId = current ?? workspaces[0]?._id;

  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Selected report execution modal
  const [selectedReport, setSelectedReport] = useState<ReportItemDefinition | null>(null);
  const [reportPeriodMonth, setReportPeriodMonth] = useState("2026-11");
  const [reportDepartment, setReportDepartment] = useState("Engineering");
  const [exportFormat, setExportFormat] = useState<"PDF" | "XLSX" | "CSV">("XLSX");
  const [isExporting, setIsExporting] = useState(false);

  // Dynamic parameters dictionary for selected report
  const [dynamicParamValues, setDynamicParamValues] = useState<Record<string, string>>({});

  // Help collapse state persistence
  useEffect(() => {
    const saved = localStorage.getItem("indiapay_reports_gallery_help_open");
    if (saved !== null) {
      setIsHelpOpen(saved === "true");
    }
  }, []);

  const handleToggleHelp = () => {
    setIsHelpOpen((prev) => {
      const next = !prev;
      localStorage.setItem("indiapay_reports_gallery_help_open", String(next));
      return next;
    });
  };

  // Convex Queries and Mutations (Exact functions in reports.ts)
  const favorites = useQuery(
    api.reports.listUserFavorites,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId } : "skip"
  );
  const toggleFavoriteMutation = useMutation(api.reports.toggleFavorite);
  const recordExecutionMutation = useMutation(api.reports.recordReportExecution);

  // Set of favorited report IDs for fast lookup
  const favoriteIds = new Set<string>(favorites || []);

  const handleToggleFavorite = async (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    if (!effectiveWorkspaceId) return;

    try {
      const res = await toggleFavoriteMutation({
        workspaceId: effectiveWorkspaceId,
        reportId,
      });
      setActionSuccessMsg(
        res.isFavorite
          ? "Report added to your Favorites!"
          : "Report removed from your Favorites."
      );
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err: unknown) {
      console.error("Failed to toggle report favorite:", err);
    }
  };

  // Fetch real report preview data when report modal is opened
  const reportPreviewData = useQuery(
    api.reports.generateReportData,
    effectiveWorkspaceId && selectedReport
      ? {
          workspaceId: effectiveWorkspaceId,
          reportId: selectedReport.id,
          periodMonth: dynamicParamValues.payrollMonth || reportPeriodMonth,
          department: reportDepartment,
          statutoryState: selectedState,
          fromDate: dynamicParamValues.fromDate,
          toDate: dynamicParamValues.toDate,
          financialYear: dynamicParamValues.financialYear,
        }
      : "skip"
  );

  // Reset dynamic parameter values when selected report changes
  useEffect(() => {
    if (selectedReport) {
      const schema = REPORT_PARAMETER_SCHEMAS[selectedReport.id];
      if (schema) {
        const initialVals: Record<string, string> = {};
        for (const f of schema.fields) {
          initialVals[f.name] = f.defaultValue || "";
        }
        setDynamicParamValues(initialVals);
      } else {
        setDynamicParamValues({});
      }
    }
  }, [selectedReport]);

  const handleParamChange = (fieldName: string, value: string) => {
    setDynamicParamValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSaveOptions = () => {
    if (selectedReport) {
      localStorage.setItem(
        `indiapay_report_options_${selectedReport.id}`,
        JSON.stringify(dynamicParamValues)
      );
      setActionSuccessMsg("Report parameter options saved as default!");
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  const handleResetOptions = () => {
    if (selectedReport) {
      localStorage.removeItem(`indiapay_report_options_${selectedReport.id}`);
      const schema = REPORT_PARAMETER_SCHEMAS[selectedReport.id];
      if (schema) {
        const initialVals: Record<string, string> = {};
        for (const f of schema.fields) {
          initialVals[f.name] = f.defaultValue || "";
        }
        setDynamicParamValues(initialVals);
      }
      setActionSuccessMsg("Report parameter options reset to default.");
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  // Filter Categories & Reports
  const filteredCategories: ReportCategoryDefinition[] = REPORTS_REGISTRY.map((cat) => {
    let repList = cat.reports;

    // Filter by State / Statutory Jurisdiction
    if (selectedState !== "All") {
      if (cat.category.includes("Karnataka") && selectedState !== "Karnataka") {
        repList = [];
      } else if (cat.category.includes("Tamil Nadu") && selectedState !== "Tamil Nadu") {
        repList = [];
      } else if (cat.category.includes("Maharashtra") && selectedState !== "Maharashtra") {
        repList = [];
      }
    }

    // Filter by Tab (Favorites vs All)
    if (activeTab === "favorites") {
      repList = repList.filter((r) => favoriteIds.has(r.id));
    }

    // Filter by Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      repList = repList.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          cat.category.toLowerCase().includes(q)
      );
    }

    return {
      ...cat,
      reports: repList,
    };
  }).filter((cat) => cat.reports.length > 0);

  // Export handler generating actual CSV / XLSX data
  const handleExecuteExport = async () => {
    if (!selectedReport || !reportPreviewData || reportPreviewData.length === 0) return;
    setIsExporting(true);

    try {
      const rows = reportPreviewData as Record<string, string | number>[];
      const headers = Object.keys(rows[0] || {});

      if (exportFormat === "CSV" || exportFormat === "XLSX") {
        const csvRows = [
          headers.join(","),
          ...rows.map((row) =>
            headers
              .map((h) => {
                const val = String(row[h] ?? "");
                return `"${val.replace(/"/g, '""')}"`;
              })
              .join(",")
          ),
        ];

        const csvContent = csvRows.join("\n");
        const mimeType = exportFormat === "CSV" ? "text/csv;charset=utf-8;" : "application/vnd.ms-excel";
        const extension = exportFormat === "CSV" ? "csv" : "xls";
        const blob = new Blob([csvContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${selectedReport.id}_${reportPeriodMonth}.${extension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (exportFormat === "PDF") {
        window.print();
      }

      // Record run execution persistently in Convex
      if (effectiveWorkspaceId) {
        await recordExecutionMutation({
          workspaceId: effectiveWorkspaceId,
          reportId: selectedReport.id,
          reportName: selectedReport.name,
          category: selectedReport.category,
          parameters: JSON.stringify({ periodMonth: reportPeriodMonth, department: reportDepartment, ...dynamicParamValues }),
          format: exportFormat,
          rowCount: rows.length,
          fileSizeKb: Math.max(1, Math.round((JSON.stringify(rows).length / 1024))),
        });
      }

      setActionSuccessMsg(`Export completed! ${rows.length} rows written to ${exportFormat}.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: unknown) {
      console.error("Export generation error:", err);
      setActionSuccessMsg("Export failed. Please check network logs.");
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F4F6F9] text-slate-800">
      {/* Top Header matching greytHR */}
      <ReportsHeader
        currentPageTitle="Reports Gallery"
        onHelpToggle={handleToggleHelp}
        isHelpOpen={isHelpOpen}
      />

      <div className="w-full px-6 py-4 space-y-4 pb-16">
        {/* Breadcrumb matching greytHR */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/admin" className="hover:text-sky-700 transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800">Reports Gallery</span>
        </div>

        {/* Action Success Alert */}
        {actionSuccessMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800 shadow-2xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Collapsible Help Banner */}
        {isHelpOpen && (
          <div className="rounded border border-[#BFDBFE] bg-[#EBF3FC] p-4 text-xs text-slate-700 shadow-2xs relative leading-relaxed">
            <button
              type="button"
              onClick={handleToggleHelp}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              aria-label="Close Help"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Explore the Reports Gallery
            </h3>
            <p className="text-slate-600 max-w-4xl">
              The Reports Gallery provides a comprehensive catalog of operational and statutory reports across Payroll, PF, ESI, Profession Tax, Income Tax, and Workforce Management. Click on any report row to configure parameters and export to Excel, CSV, or PDF.
            </p>
          </div>
        )}

        {/* Reports Gallery Toolbar matching reference:
            LEFT: Search input with placeholder 'Search'
            CENTER: All Reports | Favorites (star icon)
            RIGHT: Statutory state/jurisdiction selector | Settings icon
        */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded border border-[#E2E8F0] px-4 py-2.5 shadow-2xs">
          {/* LEFT: Search input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-slate-200 bg-slate-50 pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-sky-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* CENTER: All Reports & Favorites tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 text-xs font-semibold rounded transition-all ${
                activeTab === "all"
                  ? "bg-[#0284C7] text-white shadow-2xs font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              All Reports
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded transition-all ${
                activeTab === "favorites"
                  ? "bg-[#0284C7] text-white shadow-2xs font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${activeTab === "favorites" ? "fill-amber-300 text-amber-300" : "text-amber-500 fill-amber-400"}`} />
              <span>Favorites</span>
            </button>
          </div>

          {/* RIGHT: Statutory State/Jurisdiction selector & Settings Icon */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs">
              <span className="text-slate-500 font-medium">State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                aria-label="Jurisdiction State Selector"
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="All">All States</option>
              </select>
            </div>

            <button
              type="button"
              title="Reports Configuration"
              aria-label="Reports Configuration"
              className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 4-Column Compact Category Grid Matching greytHR Reference:
            - Compact, predictable multi-column layout (columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4)
            - Crisp square corners (rounded-none), light slate border (#D9E2EC)
            - Signature deep blue-gray / hound blue category header (#02588D / #13548A) with stacked document icon
            - 35px compact report rows with hairline bottom divider
            - Inline favorite star immediately adjacent to report title
        */}
        {filteredCategories.length === 0 ? (
          <div className="rounded border border-[#E2E8F0] bg-white p-12 text-center shadow-2xs">
            <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No reports found</h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === "favorites"
                ? "You haven't marked any reports as favorites yet. Click the star icon on any report in All Reports."
                : "No reports match your search query."}
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredCategories.map((catGroup) => (
              <div
                key={catGroup.category}
                className="break-inside-avoid rounded-xs border border-[#CBD5E1] bg-white shadow-2xs overflow-hidden mb-4 transition-all hover:border-[#94A3B8]"
              >
                {/* Category Card Header: Solid deep blue bar with white stacked document icon */}
                <div className="bg-[#1A568C] px-3 py-2 flex items-center justify-between text-white select-none">
                  <div className="flex items-center gap-2 min-w-0">
                    <Files className="h-3.5 w-3.5 text-white/90 shrink-0" />
                    <h3 className="font-bold text-white text-[12px] tracking-wide truncate">
                      {catGroup.category}
                    </h3>
                  </div>
                  <span className="text-[10px] bg-white/20 text-white font-semibold px-1.5 py-0.2 rounded shrink-0">
                    {catGroup.reports.length}
                  </span>
                </div>

                {/* List of Reports in Category: Compact 34px-36px rows */}
                <ul className="divide-y divide-slate-100">
                  {catGroup.reports.map((report) => {
                    const isFav = favoriteIds.has(report.id);
                    return (
                      <li
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedReport(report);
                          }
                        }}
                        className="px-3 py-2 hover:bg-[#F0F7FF] cursor-pointer transition-colors group flex items-center justify-between gap-1.5 text-[12px] min-h-[35px]"
                      >
                        <span className="font-normal text-slate-800 group-hover:text-[#1A568C] transition-colors leading-snug">
                          {report.name}
                        </span>

                        {/* Star Favorite Button immediately following text */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(e, report.id)}
                          className="text-slate-300 hover:text-amber-500 transition-colors p-0.5 shrink-0 ml-1"
                          title={isFav ? "Remove Favorite" : "Add to Favorites"}
                          aria-label={isFav ? `Remove ${report.name} from Favorites` : `Add ${report.name} to Favorites`}
                        >
                          <Star
                            className={`h-3 w-3 ${
                              isFav ? "fill-amber-400 text-amber-500" : "text-slate-300"
                            }`}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Report Execution & Preview Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs">
            <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 text-base">
                      {selectedReport.name}
                    </h3>
                    <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {selectedReport.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedReport.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Report-Specific Parameter Form */}
              <div className="px-6 py-4 border-b border-slate-200 bg-white space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Report Parameters & Filters
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveOptions}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    >
                      Save Options
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleResetOptions}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 underline cursor-pointer"
                    >
                      Reset Options
                    </button>
                  </div>
                </div>

                {/* Dynamic Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {REPORT_PARAMETER_SCHEMAS[selectedReport.id]?.fields.map((field) => (
                    <div key={field.name} className="flex flex-col gap-1">
                      <label className="text-slate-600 font-semibold text-[11px]">
                        {field.label}
                        {field.required && <span className="text-rose-500 ml-0.5">*</span>}
                      </label>
                      {field.type === "select" ? (
                        <select
                          value={dynamicParamValues[field.name] || field.defaultValue || ""}
                          onChange={(e) => handleParamChange(field.name, e.target.value)}
                          className="rounded border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-sky-500"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === "date" ? "date" : "text"}
                          value={dynamicParamValues[field.name] ?? field.defaultValue ?? ""}
                          onChange={(e) => handleParamChange(field.name, e.target.value)}
                          className="rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-sky-500"
                        />
                      )}
                    </div>
                  ))}

                  {/* Fallback standard fields if no schema */}
                  {!REPORT_PARAMETER_SCHEMAS[selectedReport.id] && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-600 font-semibold text-[11px]">
                          Payroll Period Month
                        </label>
                        <input
                          type="month"
                          value={reportPeriodMonth}
                          onChange={(e) => setReportPeriodMonth(e.target.value)}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-slate-600 font-semibold text-[11px]">
                          Department
                        </label>
                        <select
                          value={reportDepartment}
                          onChange={(e) => setReportDepartment(e.target.value)}
                          className="rounded border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-sky-500"
                        >
                          <option value="All">All Departments</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Operations">Operations</option>
                          <option value="Sales">Sales</option>
                          <option value="Human Resources">Human Resources</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Format selection and export action */}
              <div className="px-6 py-3 border-b border-slate-200 bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Export Format:</span>
                  {(["XLSX", "CSV", "PDF"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setExportFormat(fmt)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
                        exportFormat === fmt
                          ? "bg-sky-600 text-white border-sky-600 shadow-2xs"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleExecuteExport}
                  disabled={isExporting || !reportPreviewData || (reportPreviewData as unknown[]).length === 0}
                  className="inline-flex items-center gap-1.5 rounded bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-sky-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isExporting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>Export {exportFormat}</span>
                </button>
              </div>

              {/* Live Preview Table */}
              <div className="flex-1 overflow-auto p-6">
                {!reportPreviewData ? (
                  <div className="flex h-48 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                    <span className="ml-2 text-xs text-slate-500 font-medium">
                      Loading IndiaPay records...
                    </span>
                  </div>
                ) : (reportPreviewData as unknown[]).length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center text-center">
                    <Inbox className="h-8 w-8 text-slate-300 mb-1" />
                    <p className="text-xs text-slate-500">
                      No records found for the selected period ({reportPeriodMonth}).
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded border border-slate-200">
                    <table className="w-full text-left text-xs text-slate-600 border-collapse">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                        <tr>
                          {Object.keys((reportPreviewData as Record<string, unknown>[])[0] || {}).map((header) => (
                            <th key={header} className="px-3.5 py-2.5 whitespace-nowrap">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {(reportPreviewData as Record<string, unknown>[]).map((row: Record<string, unknown>, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            {Object.values(row).map((val: unknown, cellIdx: number) => (
                              <td key={cellIdx} className="px-3.5 py-2 whitespace-nowrap font-medium text-slate-800">
                                {String(val ?? "—")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
