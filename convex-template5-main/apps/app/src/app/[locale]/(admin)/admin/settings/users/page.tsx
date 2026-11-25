"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Lock,
  Mail,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AdminTopbar } from "../../admin-topbar";

export default function UserAdministrationPage() {
  const user = useQuery(api.users.getUser);
  const isAdmin = (user as any)?.role === "admin";
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const mockUsers = [
    {
      id: "1",
      name: "Dev Administrator",
      email: "dev@victorchasex.com",
      role: "admin",
      status: "active",
      lastLogin: "Today, 20:45 IST",
    },
    {
      id: "2",
      name: "Javeria HR",
      email: "javeria@victorchasex.com",
      role: "hr",
      status: "active",
      lastLogin: "Today, 18:30 IST",
    },
    {
      id: "3",
      name: "Vikram Engineer",
      email: "vikram@victorchasex.com",
      role: "member",
      status: "active",
      lastLogin: "Yesterday",
    },
    {
      id: "4",
      name: "Ananya Finance",
      email: "ananya@victorchasex.com",
      role: "payroll_admin",
      status: "active",
      lastLogin: "2 days ago",
    },
    {
      id: "5",
      name: "Rahul Contractor",
      email: "rahul@victorchasex.com",
      role: "member",
      status: "inactive",
      lastLogin: "15 days ago",
    },
  ];

  const filtered = mockUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 antialiased select-none pb-20">
      <AdminTopbar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>Settings</span>
              <span>&gt;</span>
              <span className="text-slate-800">User Administration</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              User Administration
            </h1>
            <p className="text-xs text-slate-500">
              Manage organization members, assign role permissions, and control
              active portal access.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => alert("Invite Member modal")}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Invite New User</span>
            </button>
          )}
        </div>

        {!isAdmin ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center max-w-lg mx-auto">
            <ShieldAlert className="mx-auto h-10 w-10 text-amber-600 mb-3" />
            <h3 className="text-base font-bold text-amber-900 mb-1">
              Restricted Administrative Area
            </h3>
            <p className="text-xs text-amber-700">
              You do not have administrative privileges to manage user roles and
              organizational permissions. Contact your workspace administrator
              for access.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Filter Subbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user by name or email..."
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span>Filter Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                  <option value="payroll_admin">Payroll Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Last Active</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {u.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "hr"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                            u.status === "active"
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${u.status === "active" ? "bg-emerald-500" : "bg-slate-300"}`}
                          />
                          <span className="capitalize">{u.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 text-[11px]">
                        {u.lastLogin}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            alert(`Edit permissions for ${u.name}`)
                          }
                          className="font-bold text-blue-600 hover:text-blue-800 text-[11px]"
                        >
                          Edit Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
