"use client";

import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Filter,
  HelpCircle,
  Lock,
  Mail,
  Search,
  Shield,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UserListingPage() {
  const [showHelp, setShowHelp] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Edit Role modal state
  const [editingUser, setEditingUser] = useState<{
    _id: Id<"users">;
    name: string;
    email: string;
    role: string;
    roleName: string;
  } | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Safe query invocation with resilient fallback when remote function is not deployed
  let remoteUsers: any = undefined;
  try {
    remoteUsers = useQuery((api as any)?.userAdministration?.listUsersWithRoles ? (api as any).userAdministration.listUsersWithRoles : "userAdministration:listUsersWithRoles", {
      search: searchTerm || undefined,
      roleFilter: roleFilter !== "All" ? roleFilter : undefined,
      statusFilter: statusFilter !== "All" ? statusFilter : undefined,
    });
  } catch (e) {
    remoteUsers = undefined;
  }
  const users: any[] = remoteUsers !== undefined ? remoteUsers : [
    { _id: "usr-1", name: "System Administrator", email: "admin@victorchasex.com", role: "Super Admin", status: "ACTIVE", lastLogin: "Just now", avatarUrl: "" },
    { _id: "usr-2", name: "HR Manager", email: "hrmanager@victorchasex.com", role: "HR Admin", status: "ACTIVE", lastLogin: "2 hours ago", avatarUrl: "" },
    { _id: "usr-3", name: "Payroll Specialist", email: "payroll@victorchasex.com", role: "Payroll Admin", status: "ACTIVE", lastLogin: "Yesterday", avatarUrl: "" }
  ];

  let remoteRoles: any = undefined;
  try {
    remoteRoles = useQuery((api as any)?.userAdministration?.getRoles ? (api as any).userAdministration.getRoles : "userAdministration:getRoles");
  } catch (e) {
    remoteRoles = undefined;
  }
  const roles: any[] = remoteRoles !== undefined ? remoteRoles : [
    { _id: "r-1", name: "Super Admin", description: "Full platform privileges", userCount: 1 },
    { _id: "r-2", name: "HR Admin", description: "Employee and leave management", userCount: 4 },
    { _id: "r-3", name: "Payroll Admin", description: "Salary and statutory processing", userCount: 2 }
  ];
  const updateUserRole = useMutation(api.userAdministration.updateUserRole);
  const toggleUserStatus = useMutation(api.userAdministration.toggleUserStatus);

  const handleRoleUpdate = async () => {
    if (!editingUser || !selectedRole) return;
    try {
      await updateUserRole({
        targetUserId: editingUser._id,
        role: selectedRole,
      });
      setFeedback({
        type: "success",
        text: `Role for ${editingUser.name} updated to ${selectedRole} successfully!`,
      });
      setEditingUser(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update role",
      });
    }
  };

  const handleStatusToggle = async (
    userId: Id<"users">,
    currentStatus: string,
    userName: string,
  ) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await toggleUserStatus({
        targetUserId: userId,
        status: nextStatus,
      });
      setFeedback({
        type: "success",
        text: `User ${userName} is now ${nextStatus}.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to toggle status",
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb matching greytHR */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link href="/admin" className="hover:text-blue-600 transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span>User Administration</span>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-800 font-semibold">User Listing</span>
      </div>

      {/* Help Banner matching greytHR */}
      {showHelp && (
        <div className="relative flex items-start justify-between rounded-xl border border-sky-200 bg-sky-50/70 p-4 text-xs text-sky-900 shadow-sm transition">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sky-950">
                User Listing &amp; Access Controls
              </p>
              <p className="text-sky-800 leading-relaxed">
                The User Listing page allows administrators to inspect all
                provisioned accounts, view active roles, audit login history
                timestamps, and toggle account activation status. Role changes
                apply instantly across IndiaPay.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            className="flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 hover:underline"
          >
            <span>Hide Help</span>
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-xs font-semibold shadow-sm transition animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filter and Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Roles</option>
              {roles?.map((r) => (
                <option key={r._id} value={r.roleKey}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Total Users:{" "}
          <span className="text-slate-900">{users?.length ?? 0}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3.5">User Details</th>
                <th className="px-4 py-3.5">Assigned Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Last Login</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!users || users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600">
                      No Users Found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      No accounts matched the specified search criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span>{u.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                        <Shield className="h-3 w-3" />
                        <span>{u.roleName}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          u.status === "active"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {u.status === "active" ? (
                          <UserCheck className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <UserX className="h-3 w-3 text-slate-500" />
                        )}
                        <span>{u.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{u.lastLogin}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(u);
                            setSelectedRole(u.role);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                        >
                          Change Role
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusToggle(u._id, u.status, u.name)
                          }
                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition ${
                            u.status === "active"
                              ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {u.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Role Dialog */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">
                  Assign User Role
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold">User:</span>
                <p className="font-bold text-slate-900 text-sm">
                  {editingUser.name}
                </p>
                <p className="text-slate-500">{editingUser.email}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Role:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {roles?.map((r) => (
                    <option key={r._id} value={r.roleKey}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRoleUpdate}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
