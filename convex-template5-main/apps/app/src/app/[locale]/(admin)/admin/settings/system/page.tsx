"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Building,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileSpreadsheet,
  Lock,
  Save,
  Settings,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { AdminTopbar } from "../../admin-topbar";

export default function SystemSettingsPage() {
  const user = useQuery(api.users.getUser);
  const isAdmin = (user as any)?.role === "admin";

  const [companyName, setCompanyName] = useState(
    "Victor Chasex Technologies Pvt. Ltd.",
  );
  const [pan, setPan] = useState("AAACV1234F");
  const [tan, setTan] = useState("BLRV12345A");
  const [pfCode, setPfCode] = useState("KN/BNG/0012345/000");
  const [esiCode, setEsiCode] = useState("53000123450001001");
  const [ptState, setPtState] = useState("Karnataka");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 antialiased select-none pb-20">
      <AdminTopbar />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Settings</span>
            <span>&gt;</span>
            <span className="text-slate-800">System Settings</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            System Settings
          </h1>
          <p className="text-xs text-slate-500">
            Configure statutory company registrations, PF/ESI establishment
            codes, and tax parameters.
          </p>
        </div>

        {!isAdmin ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center max-w-lg mx-auto">
            <Lock className="mx-auto h-10 w-10 text-rose-600 mb-3" />
            <h3 className="text-base font-bold text-rose-900 mb-1">
              Access Restricted
            </h3>
            <p className="text-xs text-rose-700">
              Only authorized Organization Administrators can modify enterprise
              statutory parameters.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {saved && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-100 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>System configuration updated successfully.</span>
              </div>
            )}

            {/* Entity Identification */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                <span>Organization Identity</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Legal business entity name and address.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Legal Entity Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Professional Tax State
                  </label>
                  <select
                    value={ptState}
                    onChange={(e) => setPtState(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Statutory Numbers */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                <span>Statutory Registrations</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Indian tax and labor welfare establishment codes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Company PAN
                  </label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tax Deduction TAN
                  </label>
                  <input
                    type="text"
                    value={tan}
                    onChange={(e) => setTan(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    EPFO Establishment Code
                  </label>
                  <input
                    type="text"
                    value={pfCode}
                    onChange={(e) => setPfCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ESIC Registration Code
                  </label>
                  <input
                    type="text"
                    value={esiCode}
                    onChange={(e) => setEsiCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
              >
                <Save className="h-4 w-4" />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
