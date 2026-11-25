"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Globe,
  Info,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const COUNTRY_OPTIONS = [
  "India",
  "United Arab Emirates",
  "Singapore",
  "United Kingdom",
];

export default function StateSettingsPage() {
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PT" | "LWF">("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [stateCode, setStateCode] = useState("");
  const [stateName, setStateName] = useState("");
  const [tinCode, setTinCode] = useState("");
  const [isUT, setIsUT] = useState(false);
  const [isPT, setIsPT] = useState(false);
  const [isLWF, setIsLWF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let statesData: any = undefined;
  try { statesData = useQuery(api.systemSettings.getStates, { country: selectedCountry }); } catch (e) { statesData = undefined; }
  const states: any[] = statesData || [];
  let saveState: any = null;
  try { saveState = useMutation(api.systemSettings.saveStateConfig); } catch (e) { saveState = null; }

  const filteredStates = states.filter((s) => {
    const matchesSearch =
      s.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.stateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.tinCode && s.tinCode.includes(searchTerm));
    if (!matchesSearch) return false;
    if (filterType === "PT") return s.ptApplicable;
    if (filterType === "LWF") return s.lwfApplicable;
    return true;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!stateCode.trim()) {
      setErrorMessage("State code is required (e.g. KA, MH)");
      return;
    }
    if (!stateName.trim()) {
      setErrorMessage("State name is required");
      return;
    }

    try {
      setIsSaving(true);
      await saveState({
        country: selectedCountry,
        stateCode: stateCode.trim().toUpperCase(),
        stateName: stateName.trim(),
        unionTerritory: isUT,
        tinCode: tinCode.trim() || undefined,
        ptApplicable: isPT,
        lwfApplicable: isLWF,
        isActive: true,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowAddModal(false);
      setStateCode("");
      setStateName("");
      setTinCode("");
      setIsUT(false);
      setIsPT(false);
      setIsLWF(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save state configuration");
    } finally {
      setIsSaving(false);
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
        <span className="text-slate-800 font-bold">States</span>
      </div>

      {/* greytHR Help Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start justify-between shadow-sm">
        <div className="space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-blue-950 text-sm">
            <Info className="h-4 w-4 text-blue-600" />
            State & Statutory Jurisdiction Setup
          </p>
          <p className="text-slate-600 leading-relaxed">
            The States page enables you to manage the list of all states and union territories of India, configuring statutory jurisdictions for Professional Tax (PT), Labour Welfare Fund (LWF), and GST TIN state codes.
          </p>
        </div>
      </div>

      {/* Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Country:</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="h-9 px-3 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Filter:</label>
              <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterType("ALL")}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    filterType === "ALL" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All States
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("PT")}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    filterType === "PT" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  PT Applicable
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("LWF")}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    filterType === "LWF" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  LWF Applicable
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search state name, code, TIN..."
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
            <span>Add State</span>
          </button>
        </div>

        {/* Table matching greytHR State View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-5 w-16">#</th>
                <th className="py-3 px-5">State Name</th>
                <th className="py-3 px-5 font-mono w-28">State Code</th>
                <th className="py-3 px-5 font-mono w-24">GST TIN</th>
                <th className="py-3 px-5 w-28">Territory</th>
                <th className="py-3 px-5 w-32">Professional Tax</th>
                <th className="py-3 px-5 w-32">Labour Welfare</th>
                <th className="py-3 px-5 w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                    No states found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStates.map((item, idx) => (
                  <tr key={item._id || item.stateCode} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-5 text-slate-500 font-semibold">{idx + 1}</td>
                    <td className="py-3 px-5 font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>{item.stateName}</span>
                    </td>
                    <td className="py-3 px-5 font-mono font-bold text-blue-700">{item.stateCode}</td>
                    <td className="py-3 px-5 font-mono text-slate-700">{item.tinCode || "—"}</td>
                    <td className="py-3 px-5 text-slate-600">
                      {item.unionTerritory ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          Union Territory
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">State</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {item.ptApplicable ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Applicable
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold">Exempt</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      {item.lwfApplicable ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Applicable
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold">Exempt</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredStates.length} Indian states and union territories</span>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <CheckCircle className="h-3.5 w-3.5" /> Configuration updated successfully
            </span>
          )}
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-black text-slate-900 mb-1">Add State / Union Territory</h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure jurisdiction for {selectedCountry} payroll and statutory deduction rules.
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
                    State Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                    placeholder="e.g. KA, MH"
                    className="w-full h-9 px-3 text-xs font-mono uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GST TIN Code</label>
                  <input
                    type="text"
                    value={tinCode}
                    onChange={(e) => setTinCode(e.target.value)}
                    placeholder="e.g. 29, 27"
                    className="w-full h-9 px-3 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="utCheck"
                    checked={isUT}
                    onChange={(e) => setIsUT(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="utCheck" className="text-xs font-bold text-slate-700">
                    Is Union Territory
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ptCheck"
                    checked={isPT}
                    onChange={(e) => setIsPT(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="ptCheck" className="text-xs font-bold text-slate-700">
                    Professional Tax (PT) Applicable
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lwfCheck"
                    checked={isLWF}
                    onChange={(e) => setIsLWF(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="lwfCheck" className="text-xs font-bold text-slate-700">
                    Labour Welfare Fund (LWF) Applicable
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
                  <span>Save State</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
