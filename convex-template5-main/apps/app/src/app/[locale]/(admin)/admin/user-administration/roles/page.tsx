"use client";

import { api } from "@v1/backend/convex/_generated/api";
import type { Id } from "@v1/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Check,
  Info,
  Loader2,
  Pencil,
  Plus,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PermissionMatrix = {
  payroll: { view: boolean; write: boolean; approve: boolean };
  attendance: { view: boolean; write: boolean; approve: boolean };
  employees: { view: boolean; write: boolean; approve: boolean };
  leaves: { view: boolean; write: boolean; approve: boolean };
  claims: { view: boolean; write: boolean; approve: boolean };
  reports: { view: boolean; export: boolean };
  settings: { view: boolean; write: boolean };
};

const DEFAULT_PERMS: PermissionMatrix = {
  payroll: { view: true, write: false, approve: false },
  attendance: { view: true, write: false, approve: false },
  employees: { view: true, write: false, approve: false },
  leaves: { view: true, write: false, approve: false },
  claims: { view: true, write: false, approve: false },
  reports: { view: true, export: false },
  settings: { view: false, write: false },
};

export default function UserRolesPage() {
  const roles = useQuery(api.userAdministration.getRoles);
  const addRole = useMutation(api.userAdministration.addRole);
  const editRole = useMutation(api.userAdministration.editRole);
  const deleteRole = useMutation(api.userAdministration.deleteRole);

  const [showHelp, setShowHelp] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<{
    _id: Id<"userAdminRoles">;
    roleKey: string;
    name: string;
    description?: string;
    isSystem: boolean;
    permissions: PermissionMatrix;
  } | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [perms, setPerms] = useState<PermissionMatrix>(DEFAULT_PERMS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingRole(null);
    setName("");
    setDescription("");
    setPerms(DEFAULT_PERMS);
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (role: {
    _id: Id<"userAdminRoles">;
    roleKey: string;
    name: string;
    description?: string;
    isSystem: boolean;
    permissions: PermissionMatrix;
  }) => {
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description || "");
    setPerms(role.permissions || DEFAULT_PERMS);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Role name is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (editingRole) {
        await editRole({
          roleId: editingRole._id,
          name: name.trim(),
          description: description.trim(),
          permissions: perms,
        });
      } else {
        await addRole({
          name: name.trim(),
          description: description.trim(),
          permissions: perms,
        });
      }
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role: {
    _id: Id<"userAdminRoles">;
    name: string;
    isSystem: boolean;
  }) => {
    if (role.isSystem) {
      alert(`Protected system role "${role.name}" cannot be deleted.`);
      return;
    }
    if (!confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      return;
    }

    setDeletingId(role._id);
    try {
      await deleteRole({ roleId: role._id });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete role";
      alert(msg);
    } finally {
      setDeletingId(null);
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
        <span className="text-slate-800">User Roles</span>
      </div>

      {/* Help Banner matching greytHR */}
      {showHelp && (
        <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              The User Roles page enables you to indicate the features and
              screens that a user can access. A few Roles are created by default
              and cannot be modified. Explore greytHR by watching{" "}
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

      {/* Add Role Button Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Role</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          Total Roles: {roles?.length || 0}
        </span>
      </div>

      {/* Roles List matching greytHR boxed rows */}
      <div className="space-y-3">
        {roles === undefined ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
            Loading user roles...
          </div>
        ) : roles.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
            No roles found.
          </div>
        ) : (
          roles.map((r) => (
            <div
              key={r._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900">{r.name}</h4>
                  {r.isSystem && (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                      System
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Last Updated On {r.lastUpdatedOn}
                </p>
                {r.description && (
                  <p className="text-xs text-slate-600 mt-1">{r.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(r)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition"
                  title="Edit Role"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                {!r.isSystem && (
                  <button
                    type="button"
                    disabled={deletingId === r._id}
                    onClick={() => handleDelete(r)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-40"
                    title="Delete Role"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Role Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingRole
                  ? `Edit Role: ${editingRole.name}`
                  : "Add User Role"}
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
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave & Attendance Auditor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the permissions assigned"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Granular Permissions Matrix */}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-900 mb-2">
                  Module Permissions:
                </h4>
                <div className="space-y-2 divide-y divide-slate-100">
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      Payroll Processing
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perms.payroll.view}
                          onChange={(e) =>
                            setPerms({
                              ...perms,
                              payroll: {
                                ...perms.payroll,
                                view: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>View</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perms.payroll.write}
                          onChange={(e) =>
                            setPerms({
                              ...perms,
                              payroll: {
                                ...perms.payroll,
                                write: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>Write</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perms.payroll.approve}
                          onChange={(e) =>
                            setPerms({
                              ...perms,
                              payroll: {
                                ...perms.payroll,
                                approve: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>Approve</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      Attendance & Leave
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perms.attendance.view}
                          onChange={(e) =>
                            setPerms({
                              ...perms,
                              attendance: {
                                ...perms.attendance,
                                view: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>View</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perms.attendance.write}
                          onChange={(e) =>
                            setPerms({
                              ...perms,
                              attendance: {
                                ...perms.attendance,
                                write: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>Write</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perms.attendance.approve}
                          onChange={(e) =>
                            setPerms({
                              ...perms,
                              attendance: {
                                ...perms.attendance,
                                approve: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>Approve</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      Reports & Analytics
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perms.reports.view}
                          onChange={(e) =>
                            setPerms({
                              ...perms,
                              reports: {
                                ...perms.reports,
                                view: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>View</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perms.reports.export}
                          onChange={(e) =>
                            setPerms({
                              ...perms,
                              reports: {
                                ...perms.reports,
                                export: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>Export</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
                  <span>{editingRole ? "Save Changes" : "Save Role"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
