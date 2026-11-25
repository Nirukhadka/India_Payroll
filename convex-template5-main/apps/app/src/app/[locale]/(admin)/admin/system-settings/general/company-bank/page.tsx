"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Building,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  Lock,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CompanyBankPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [unmaskedRows, setUnmaskedRows] = useState<Record<string, boolean>>({});

  // Form State
  const [bankName, setBankName] = useState("HDFC Bank");
  const [branchName, setBranchName] = useState("Koramangala 4th Block");
  const [ifscCode, setIfscCode] = useState("HDFC0000053");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("Current");
  const [iban, setIban] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let banksData: any = undefined;
  try { banksData = useQuery(api.systemSettings.getCompanyBanks); } catch (e) { banksData = undefined; }
  const banks: any[] = banksData || [];
  let saveCompanyBank: any = null;
  try { saveCompanyBank = useMutation(api.systemSettings.saveCompanyBank); } catch (e) { saveCompanyBank = null; }
  let deleteCompanyBank: any = null;
  try { deleteCompanyBank = useMutation(api.systemSettings.deleteCompanyBank); } catch (e) { deleteCompanyBank = null; }

  const toggleMask = (key: string) => {
    setUnmaskedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const maskAccount = (acc: string, unmasked: boolean) => {
    if (unmasked || acc.length <= 4) return acc;
    return "X".repeat(acc.length - 4) + acc.slice(-4);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!bankName.trim() || !branchName.trim()) {
      setErrorMessage("Bank and Branch name are required");
      return;
    }
    const cleanIfsc = ifscCode.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      setErrorMessage("Invalid IFSC code format");
      return;
    }
    const cleanAcc = accountNumber.trim();
    if (cleanAcc.length < 8 || cleanAcc.length > 25) {
      setErrorMessage("Account number must be between 8 and 25 digits");
      return;
    }
    if (cleanAcc !== confirmAccountNumber.trim()) {
      setErrorMessage("Account numbers do not match");
      return;
    }

    try {
      setIsSaving(true);
      await saveCompanyBank({
        bankName: bankName.trim(),
        branchName: branchName.trim(),
        ifscCode: cleanIfsc,
        accountNumber: cleanAcc,
        accountType,
        iban: iban.trim() || undefined,
        isPrimary,
        status: "Active",
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowAddModal(false);
      setAccountNumber("");
      setConfirmAccountNumber("");
      setIban("");
      setIsPrimary(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save corporate bank account");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: any, isPrim: boolean) => {
    if (isPrim) {
      alert("Cannot delete the primary disbursement account. Assign another primary bank first.");
      return;
    }
    if (!confirm("Are you sure you want to remove this corporate bank account?")) return;
    try {
      await deleteCompanyBank({ id });
    } catch (err: any) {
      alert(err.message || "Error deleting bank account");
    }
  };

  const filteredBanks = banks.filter(
    (b) =>
      b.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ifscCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.accountNumber.includes(searchTerm)
  );

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
        <span className="text-slate-800 font-bold">Company Bank Details</span>
      </div>

      {/* greytHR Help Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 flex items-start justify-between shadow-sm">
        <div className="space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-blue-950 text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Corporate Bank Accounts & Salary Disbursement
          </p>
          <p className="text-slate-600 leading-relaxed">
            The Company Bank Details page allows you to configure corporate bank accounts used for salary batch disbursals, statutory transfers (PF/ESI/TDS challans), and bank advice file generation. Sensitive account numbers are securely masked.
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
                placeholder="Search bank, account number..."
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
            <span>Add Bank Account</span>
          </button>
        </div>

        {/* Table matching greytHR Company Bank view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/75 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-5 w-16">#</th>
                <th className="py-3 px-5">Bank Name</th>
                <th className="py-3 px-5">Bank Branch</th>
                <th className="py-3 px-5 font-mono">IFSC Code</th>
                <th className="py-3 px-5 font-mono">Account Number</th>
                <th className="py-3 px-5">Account Type</th>
                <th className="py-3 px-5 font-mono">IBAN</th>
                <th className="py-3 px-5 w-28">Disbursement</th>
                <th className="py-3 px-5 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBanks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 font-medium">
                    No corporate bank accounts configured. Click &quot;Add Bank Account&quot; to configure one.
                  </td>
                </tr>
              ) : (
                filteredBanks.map((item, idx) => {
                  const rowKey = item._id || item.accountNumber;
                  const isUnmasked = !!unmaskedRows[rowKey];
                  return (
                    <tr key={rowKey} className="hover:bg-slate-50/75 transition">
                      <td className="py-3 px-5 text-slate-500 font-semibold">{idx + 1}</td>
                      <td className="py-3 px-5 font-bold text-slate-900 flex items-center gap-2">
                        <Building className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>{item.bankName}</span>
                      </td>
                      <td className="py-3 px-5 font-medium text-slate-800">{item.branchName}</td>
                      <td className="py-3 px-5 font-mono font-bold text-blue-700">{item.ifscCode}</td>
                      <td className="py-3 px-5 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{maskAccount(item.accountNumber, isUnmasked)}</span>
                          <button
                            type="button"
                            onClick={() => toggleMask(rowKey)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
                            title={isUnmasked ? "Mask account number" : "Reveal account number"}
                          >
                            {isUnmasked ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-slate-600">{item.accountType}</td>
                      <td className="py-3 px-5 font-mono text-slate-500">{item.iban || "—"}</td>
                      <td className="py-3 px-5">
                        {item.isPrimary ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Primary
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">Secondary</span>
                        )}
                      </td>
                      <td className="py-3 px-5 text-right">
                        {item._id ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id, item.isPrimary)}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded transition"
                            title="Delete corporate bank"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold italic">Standard</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            Bank details encrypted and workspace isolated
          </span>
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
            <h3 className="text-sm font-black text-slate-900 mb-1">Add Corporate Bank Account</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter authorized company banking credentials for disbursement files.
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
                    placeholder="e.g. HDFC Bank"
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
                    placeholder="e.g. HDFC0000053"
                    className="w-full h-9 px-3 text-xs font-mono uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Type</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Current">Current Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="OD">Overdraft (OD) Account</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full h-9 px-3 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Account Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                    placeholder="Re-enter account number"
                    className="w-full h-9 px-3 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">IBAN (Optional)</label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="e.g. IN53HDFC000005350200088991122"
                  className="w-full h-9 px-3 text-xs font-mono uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryCheck"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="primaryCheck" className="text-xs font-bold text-slate-700">
                  Set as Primary Disbursement Account
                </label>
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
                  <span>Save Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
