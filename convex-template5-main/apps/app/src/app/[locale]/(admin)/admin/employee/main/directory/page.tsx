"use client";

import { useWorkspace } from "@/lib/useWorkspace";
import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Download,
  Filter,
  Info,
  Loader2,
  Mail,
  MoreVertical,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmployeeHeader } from "../../employee-header";

export default function EmployeeDirectoryPage() {
  const { current, workspaces } = useWorkspace();
  const effectiveWorkspaceId = current ?? workspaces[0]?._id;

  const employees = useQuery(
    api.employees.list,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId } : "skip",
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = (employees ?? []).filter((e) => {
    const nameMatch = `${e.firstName} ${e.lastName || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const idMatch = (e.employeeIdNumber || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const deptMatch =
      departmentFilter === "all" ||
      (e.department || "").toLowerCase() === departmentFilter.toLowerCase();
    const statMatch = statusFilter === "all" || e.status === statusFilter;
    return (nameMatch || idMatch) && deptMatch && statMatch;
  });

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F8FAFC] text-slate-800">
      <EmployeeHeader
        currentCategory="main"
        currentPageTitle="Employee Directory"
      />

      {/* Directory Content */}
      <div className="mx-4 sm:mx-8 mt-4 space-y-4 pb-12">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Employee Directory
            </h2>
            <p className="text-xs text-slate-500">
              Manage employee records, roles, and profiles
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/employees"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              Export
            </Link>
            <Link
              href="/admin/employee/admin-ops/add-employee"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0284C7] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0369A1] transition shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Employee
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-2xs">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or Employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-sky-500"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-sky-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Directory Table */}
        <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-slate-50/75 text-slate-600 font-semibold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-4">Department &amp; Designation</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No matching employees found.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold text-xs shrink-0">
                          {emp.firstName.charAt(0)}
                          {emp.lastName ? emp.lastName.charAt(0) : ""}
                        </div>
                        <div>
                          <Link
                            href={`/admin/employee/information/profile?id=${emp._id}`}
                            className="font-semibold text-slate-900 hover:text-sky-600 transition"
                          >
                            {emp.firstName} {emp.lastName || ""}
                          </Link>
                          <p className="text-[11px] text-slate-400">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {emp.employeeIdNumber ? (
                        emp.employeeIdNumber
                      ) : (
                        <span className="italic text-slate-400">Not assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">
                        {emp.department || "General"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {emp.designation || "Staff"}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {emp.joiningDate ? (
                        emp.joiningDate
                      ) : (
                        <span className="italic text-slate-400">Not available</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          emp.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/employee/information/profile?id=${emp._id}`}
                        className="text-xs font-medium text-sky-600 hover:underline mr-3"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/employee/information/bank-pf-esi?id=${emp._id}`}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        Statutory
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
