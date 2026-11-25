"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Hash,
  Info,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EmployeeNoSeriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [seriesName, setSeriesName] = useState("");
  const [prefix, setPrefix] = useState("EMP-");
  const [startingNumber, setStartingNumber] = useState<number>(1);
  const [digitCount, setDigitCount] = useState<number>(4);
  const [isDefault, setIsDefault] = useState(false);
  const [isManualEntryAllowed, setIsManualEntryAllowed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let seriesData: any = undefined;
  try { seriesData = useQuery(api.systemSettings.getEmployeeNoSeries); } catch (e) { seriesData = undefined; }
  const seriesList: any[] = seriesData || [];
  let saveSeries: any = null;
  try { saveSeries = useMutation(api.systemSettings.saveEmployeeNoSeries); } catch (e) { saveSeries = null; }
  let deleteSeries: any = null;
  try { deleteSeries = useMutation(api.systemSettings.deleteEmployeeNoSeries); } catch (e) { deleteSeries = null; }

  const previewFormat = `${prefix}${String(startingNumber).padStart(digitCount, "0")}`;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!seriesName.trim()) {
      setErrorMessage("Series Name is required");
      return;
    }
    if (startingNumber < 0) {
      setErrorMessage("Starting number must be 0 or greater");
      return;
    }
    if (digitCount < 1 || digitCount > 10) {
      setErrorMessage("Digit count must be between 1 and 10");
      return;
    }

    try {
      setIsSaving(true);
      await saveSeries({
        seriesName: seriesName.trim(),
        prefix: prefix.trim(),
        startingNumber: Number(startingNumber),
        digitCount: Number(digitCount),
        isDefault,
        isManualEntryAllowed,
        isDisabled: false,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowAddModal(false);
      setSeriesName("");
      setPrefix("EMP-");
      setStartingNumber(1);
      setDigitCount(4);
      setIsDefault(false);
      setIsManualEntryAllowed(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save series");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: any, isDef: boolean) => {
    if (isDef) {
      alert("Cannot delete the default active employee number series. Assign another default series first.");
      return;
    }
    if (!confirm("Are you sure you want to delete this employee number series? Existing employees with numbers generated from this series will remain unaffected.")) return;
    try {
      await deleteSeries({ id });
    } catch (err: any) {
      alert(err.message || "Error deleting series");
    }
  };

  const filteredList = seriesList.filter(
    (s) =>
      s.seriesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.prefix.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.format.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/admin/system-settings/general/company-info" className="hover:text-blue-600">
          Settings
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/admin/system-settings/employee/preferences" className="hover:text-blue-600">
          Employee
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-800 font-bold">Employee No Series</span>
      </div>

      {/* greytHR Help Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start justify-between shadow-sm">
        <div className="space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-blue-950 text-sm">
            <Info className="h-4 w-4 text-blue-600" />
            Employee Number Series Management
          </p>
          <p className="text-slate-600 leading-relaxed">
            The Employee No Series page enables you to set up and manage the sequential numbering schemes used to auto-generate employee IDs during onboarding. When a new hire is added to IndiaPay, an employee number is assigned based on the active series.
          </p>
        </div>
      </div>

      {/* Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search series name, format..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 pr-3 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Series</span>
          </button>
        </div>

        {/* Table matching greytHR Emp No Series */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-5 w-16">#</th>
                <th className="py-3 px-5">Series Name</th>
                <th className="py-3 px-5 font-mono w-28">Current Serial</th>
                <th className="py-3 px-5 font-mono w-32">Format</th>
                <th className="py-3 px-5 w-32">Type</th>
                <th className="py-3 px-5 w-36">Manual Override</th>
                <th className="py-3 px-5 w-24">Status</th>
                <th className="py-3 px-5 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                    No series configured. Click &quot;Add New Series&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item._id || item.seriesName} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-5 text-slate-500 font-semibold">{idx + 1}</td>
                    <td className="py-3 px-5 font-bold text-slate-900 flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>{item.seriesName}</span>
                    </td>
                    <td className="py-3 px-5 font-mono font-bold text-slate-700">{item.currentSerial || item.startingNumber}</td>
                    <td className="py-3 px-5 font-mono font-bold text-blue-700 bg-blue-50/30 px-2 rounded">
                      {item.format}
                    </td>
                    <td className="py-3 px-5">
                      {item.isDefault ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Star className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" /> Default Series
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium text-[10px]">Alternative</span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-slate-600">
                      {item.isManualEntryAllowed ? (
                        <span className="text-blue-600 font-semibold text-[10px]">Permitted</span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">System Generated Only</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {item.isDisabled ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          Disabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-right">
                      {item._id ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.isDefault)}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded transition"
                          title="Delete series"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold italic">Standard</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs text-slate-500">
          <span>Configured series: {filteredList.length}</span>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <CheckCircle className="h-3.5 w-3.5" /> Series configuration saved successfully
            </span>
          )}
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-black text-slate-900 mb-1">Add Employee No Series</h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure prefix, starting serial index, and zero padding for employee ID generation.
            </p>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Series Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={seriesName}
                  onChange={(e) => setSeriesName(e.target.value)}
                  placeholder="e.g. Contractors & Interns"
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prefix</label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="e.g. EMP-, T, INT-"
                    className="w-full h-9 px-3 text-xs font-mono uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Starting Number</label>
                  <input
                    type="number"
                    min="1"
                    value={startingNumber}
                    onChange={(e) => setStartingNumber(Number(e.target.value))}
                    className="w-full h-9 px-3 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Digit Padding</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={digitCount}
                    onChange={(e) => setDigitCount(Number(e.target.value))}
                    className="w-full h-9 px-3 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Format Preview */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-900">Format Preview:</span>
                <span className="font-mono font-black text-sm text-blue-700">{previewFormat}</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="defSeriesCheck"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="defSeriesCheck" className="text-xs font-bold text-slate-700">
                    Set as Default Active Series
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="manualCheck"
                    checked={isManualEntryAllowed}
                    onChange={(e) => setIsManualEntryAllowed(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="manualCheck" className="text-xs font-bold text-slate-700">
                    Allow Manual Employee ID Entry Override
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Save Series</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
