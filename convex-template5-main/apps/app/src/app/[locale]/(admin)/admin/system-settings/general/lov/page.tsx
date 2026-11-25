"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Info,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CATEGORY_OPTIONS = [
  { value: "G_EMPLOYEE_BLOODGROUP", label: "Blood Group" },
  { value: "G_EMPLOYEE_FEEDBACK", label: "Leaving Feedback" },
  { value: "G_EMPLOYEE_PFLEAVINGREASON", label: "PF Leaving Reason" },
  { value: "G_EMPLOYEE_PFSCHEME", label: "PF Scheme" },
  { value: "G_EMPLOYEE_RELATION", label: "Family Relationship" },
  { value: "G_EMPLOYEE_NATIONALITY", label: "Nationality" },
  { value: "G_EMPLOYEE_MARITAL_STATUS", label: "Marital Status" },
];

export default function ListOfValuesPage() {
  const [selectedCategory, setSelectedCategory] = useState("G_EMPLOYEE_BLOODGROUP");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSortOrder, setNewSortOrder] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let itemsData: any = undefined;
  try { itemsData = useQuery(api.systemSettings.getListOfValues, { category: selectedCategory }); } catch (e) { itemsData = undefined; }
  const items: any[] = itemsData || [];
  let saveLov: any = null;
  try { saveLov = useMutation(api.systemSettings.saveListOfValue); } catch (e) { saveLov = null; }
  let deleteLov: any = null;
  try { deleteLov = useMutation(api.systemSettings.deleteListOfValue); } catch (e) { deleteLov = null; }

  const filteredItems = items.filter(
    (i) =>
      i.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!newCode.trim()) {
      setErrorMessage("Code is required");
      return;
    }
    if (!newDesc.trim()) {
      setErrorMessage("Description is required");
      return;
    }

    try {
      setIsSaving(true);
      await saveLov({
        category: selectedCategory,
        code: newCode.trim(),
        description: newDesc.trim(),
        sortOrder: Number(newSortOrder) || 1,
        isActive: true,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowAddModal(false);
      setNewCode("");
      setNewDesc("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: any, isSystem?: boolean) => {
    if (isSystem) {
      alert("Built-in system values cannot be deleted.");
      return;
    }
    if (!confirm("Are you sure you want to delete this value?")) return;
    try {
      await deleteLov({ id });
    } catch (err: any) {
      alert(err.message || "Error deleting value");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb matching greytHR */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/admin/system-settings/general/company-info" className="hover:text-blue-600">
          Settings
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/admin/system-settings/general/company-info" className="hover:text-blue-600">
          General
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-800 font-bold">List of Values</span>
      </div>

      {/* greytHR Help Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start justify-between shadow-sm">
        <div className="space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-blue-950 text-sm">
            <Info className="h-4 w-4 text-blue-600" />
            List of Values Setup
          </p>
          <p className="text-slate-600 leading-relaxed">
            The List of Values page enables you to configure standard system lookup lists (such as Blood Groups, Leaving Feedback, and PF Schemes). Values defined here appear across all employee forms and reports.
          </p>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 px-3 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search values..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 pr-3 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 shadow-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Value</span>
          </button>
        </div>

        {/* Table matching greytHR Lov view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-5 w-16">#</th>
                <th className="py-3 px-5">Code</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5 w-28">Order</th>
                <th className="py-3 px-5 w-28">Status</th>
                <th className="py-3 px-5 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                    No values configured for this category yet. Click &quot;Add New Value&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item._id || item.code} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-5 text-slate-500 font-semibold">{idx + 1}</td>
                    <td className="py-3 px-5 font-bold text-slate-900">{item.code}</td>
                    <td className="py-3 px-5 text-slate-700 font-medium">{item.description}</td>
                    <td className="py-3 px-5 text-slate-600">{item.sortOrder || idx + 1}</td>
                    <td className="py-3 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      {item.isSystem ? (
                        <span className="text-[10px] text-slate-400 font-semibold italic">System</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.isSystem)}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded transition"
                          title="Delete value"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredItems.length} records</span>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <CheckCircle className="h-3.5 w-3.5" /> Saved successfully
            </span>
          )}
        </div>
      </div>

      {/* Modal for adding value */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-black text-slate-900 mb-1">Add List of Value Item</h3>
            <p className="text-xs text-slate-500 mb-4">
              Adding to category: <span className="font-bold text-blue-600">{CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.label}</span>
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
                  Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. O_POS, RELOCATION"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. O Positive, Relocation for family reasons"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={newSortOrder}
                  onChange={(e) => setNewSortOrder(Number(e.target.value))}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  <span>Save Value</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
