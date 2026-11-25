"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Building,
  CheckCircle,
  ChevronRight,
  Info,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const POPULAR_BANKS = [
  "All Banks",
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
];

export default function BankBranchPage() {
  const [selectedBank, setSelectedBank] = useState("All Banks");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [bankName, setBankName] = useState("State Bank of India");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [micrCode, setMicrCode] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let branchesData: any = undefined;
  try { branchesData = useQuery(api.systemSettings.getBankBranches, selectedBank === "All Banks" ? {} : { bankName: selectedBank }); } catch (e) { branchesData = undefined; }
  const branches: any[] = branchesData || [];
  let saveBranch: any = null;
  try { saveBranch = useMutation(api.systemSettings.saveBankBranch); } catch (e) { saveBranch = null; }
  let deleteBranch: any = null;
  try { deleteBranch = useMutation(api.systemSettings.deleteBankBranch); } catch (e) { deleteBranch = null; }

  const filteredBranches = branches.filter(
    (b) =>
      b.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ifscCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.city && b.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!bankName.trim()) {
      setErrorMessage("Bank Name is required");
      return;
    }
    if (!branchName.trim()) {
      setErrorMessage("Branch Name is required");
      return;
    }
    const cleanIfsc = ifscCode.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      setErrorMessage("Invalid IFSC code format (e.g. SBIN0005383, 11 alphanumeric characters)");
      return;
    }

    try {
      setIsSaving(true);
      await saveBranch({
        bankName: bankName.trim(),
        branchName: branchName.trim(),
        ifscCode: cleanIfsc,
        micrCode: micrCode.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        address: address.trim() || undefined,
        isActive: true,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowAddModal(false);
      setBranchName("");
      setIfscCode("");
      setMicrCode("");
      setAddress("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save bank branch");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to delete this bank branch?")) return;
    try {
      await deleteBranch({ id });
    } catch (err: any) {
      alert(err.message || "Error deleting bank branch");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/admin/system-settings/general/company-info" className="hover:text-blue-600">
          Settings
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/admin/system-settings/general/company-info" className="hover:text-blue-600">
          General
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-800 font-bold">Bank Branch</span>
      </div>

      {/* greytHR Help Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start justify-between shadow-sm">
        <div className="space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-blue-950 text-sm">
            <Info className="h-4 w-4 text-blue-600" />
            Bank Branch Management
          </p>
          <p className="text-slate-600 leading-relaxed">
            The Bank Branch page enables you to set up and manage all corporate and employee bank branch information across India. Select a bank from the drop-down to view IFSC codes and branch details used for salary payouts.
          </p>
        </div>
      </div>

      {/* Container Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Bank:</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="h-9 px-3 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {POPULAR_BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search branch, IFSC, city..."
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
            <span>Add Bank Branch</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-5 w-16">#</th>
                <th className="py-3 px-5">Bank Name</th>
                <th className="py-3 px-5">Branch Name</th>
                <th className="py-3 px-5 font-mono">IFSC Code</th>
                <th className="py-3 px-5 font-mono">MICR Code</th>
                <th className="py-3 px-5">City / State</th>
                <th className="py-3 px-5 w-24">Status</th>
                <th className="py-3 px-5 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                    No branches found for the selected bank. Click &quot;Add Bank Branch&quot; to configure one.
                  </td>
                </tr>
              ) : (
                filteredBranches.map((item, idx) => (
                  <tr key={item._id || item.ifscCode} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-5 text-slate-500 font-semibold">{idx + 1}</td>
                    <td className="py-3 px-5 font-bold text-slate-900 flex items-center gap-2">
                      <Building className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>{item.bankName}</span>
                    </td>
                    <td className="py-3 px-5 font-medium text-slate-800">{item.branchName}</td>
                    <td className="py-3 px-5 font-mono font-bold text-blue-700">{item.ifscCode}</td>
                    <td className="py-3 px-5 font-mono text-slate-600">{item.micrCode || "—"}</td>
                    <td className="py-3 px-5 text-slate-600">
                      {item.city && item.state ? `${item.city}, ${item.state}` : item.city || item.state || "—"}
                    </td>
                    <td className="py-3 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      {item._id ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded transition"
                          title="Delete branch"
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
          <span>Showing {filteredBranches.length} bank branches</span>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <CheckCircle className="h-3.5 w-3.5" /> Saved successfully
            </span>
          )}
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-black text-slate-900 mb-1">Add Bank Branch</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter branch particulars and valid Indian Financial System Code (IFSC).
            </p>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bank Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. State Bank of India"
                    className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Branch Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="e.g. Koramangala 4th Block"
                    className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    IFSC Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0005383"
                    className="w-full h-9 px-3 text-xs font-mono uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    MICR Code
                  </label>
                  <input
                    type="text"
                    value={micrCode}
                    onChange={(e) => setMicrCode(e.target.value)}
                    placeholder="9-digit MICR"
                    className="w-full h-9 px-3 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 80 Feet Road, 7th Block"
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
                  <span>Save Branch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
