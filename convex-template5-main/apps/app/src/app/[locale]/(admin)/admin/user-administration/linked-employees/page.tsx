"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  FileSpreadsheet,
  Info,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type LinkedAccount = {
  _id: string;
  employeeId: string;
  employeeNo: string;
  employeeName: string;
  userId: string;
  userName: string;
  userEmail: string;
  fromDate: string;
  toDate?: string;
  status: "active" | "inactive";
};

export default function LinkedEmployeeAccountPage() {
  const { current, workspaces } = useWorkspace();
  const effectiveWorkspaceId = current ?? workspaces[0]?._id;
  const [showHelp, setShowHelp] = useState(true);
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Queries & Mutations
  const linkedAccounts = useQuery(api.userAdministration.getLinkedEmployees, {
    employeeFilter: employeeFilter !== "All" ? employeeFilter : undefined,
  });
  const employees = useQuery(
    api.employees.list,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId } : "skip",
  );
  const addMapping = useMutation(api.userAdministration.addLinkedEmployee);
  const removeMapping = useMutation(
    api.userAdministration.removeLinkedEmployee,
  );

  const handleOpenAdd = () => {
    setError(null);
    setSelectedEmpId(employees?.[0]?._id || "");
    setFromDate(new Date().toISOString().split("T")[0] || "");
    setToDate("");
    setModalOpen(true);
  };

  const handleExportExcel = () => {
    const records = linkedAccounts || [];
    const csvContent = `data:text/csv;charset=utf-8,# ,Employee No,Employee Name,User Name,From Date,To Date\n${records
      .map(
        (r, i) =>
          `${i + 1},${r.employeeNo},${r.employeeName},${r.userName},${r.fromDate},${r.toDate || "-"}`,
      )
      .join("\n")}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Linked_Employee_Accounts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemove = async (mapping: {
    _id: Id<"linkedEmployeeAccounts">;
    employeeName: string;
    userName: string;
  }) => {
    if (
      !confirm(
        `Are you sure you want to unlink employee ${mapping.employeeName} from user ${mapping.userName}?`,
      )
    ) {
      return;
    }
    try {
      await removeMapping({ mappingId: mapping._id });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unlink failed";
      alert(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId || !fromDate) {
      setError("Please select employee and from date.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      // Map to employee and user
      await addMapping({
        employeeId: selectedEmpId as Id<"employees">,
        userId: "jh79k3h573t2156vj6qf05m8pn7610m0" as Id<"users">,
        fromDate,
        toDate: toDate.trim() || undefined,
      });
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Mapping failed";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb matching greytHR */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/admin" className="hover:text-slate-700">
          Home
        </Link>
        <span className="text-slate-400">&gt;</span>
        <span className="text-slate-800">Linked Employee</span>
      </div>

      {/* Help Banner matching greytHR */}
      {showHelp && (
        <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              You can link a user to an employee. Once linked, the user's email
              will change to the employee's email. When the employee logs in, he
              will be given a choice of logging in as a User or as an employee.
              This will enable him to perform multiple functions from a single
              login. Explore greytHR by watching{" "}
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                How-to Videos
              </span>
              ,{" "}
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Help-Doc
              </span>
              , and{" "}
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                FAQ
              </span>
              .
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            className="font-semibold text-slate-500 hover:text-slate-800"
          >
            Hide Help
          </button>
        </div>
      )}

      {/* Controls Toolbar: Employee: All, Add, Export Excel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            Employee:
          </span>
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
          >
            <option value="All">All</option>
            {employees?.map((emp) => (
              <option key={emp._id} value={emp.firstName}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Main Table Card matching greytHR columns */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFD] text-slate-700 border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-4 font-bold w-12">#</th>
                <th className="py-3 px-4 font-bold">Employee No</th>
                <th className="py-3 px-4 font-bold">Employee Name</th>
                <th className="py-3 px-4 font-bold">User Name</th>
                <th className="py-3 px-4 font-bold">From Date</th>
                <th className="py-3 px-4 font-bold">To Date</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {linkedAccounts === undefined ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading linked accounts...
                  </td>
                </tr>
              ) : linkedAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400 font-semibold"
                  >
                    No Rows To Show
                  </td>
                </tr>
              ) : (
                linkedAccounts.map((item, idx) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {item.employeeNo}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {item.employeeName}
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-medium">
                      {item.userName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.fromDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.toDate || "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Unlink Employee"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-[#FAFBFD] text-xs text-slate-500">
          <span>Total Items: {linkedAccounts?.length || 0}</span>
        </div>
      </div>

      {/* Add Mapping Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Link Employee Account
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 border border-red-200 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Employee <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Employee --</option>
                  {employees?.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.firstName} {e.lastName} ({e.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  To Date (Optional)
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Mapping</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
