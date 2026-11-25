"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Bell,
  CheckCircle2,
  Globe,
  KeyRound,
  Lock,
  Shield,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { AdminTopbar } from "../../admin-topbar";

export default function AccountSettingsPage() {
  const user = useQuery(api.users.getUser);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [payrollAlerts, setPayrollAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setter((prev) => !prev);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 antialiased select-none pb-20">
      <AdminTopbar />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Settings</span>
            <span>&gt;</span>
            <span className="text-slate-800">Account Settings</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs text-slate-500">
            Manage your account credentials, multi-factor security, and in-app
            communication preferences.
          </p>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-100 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Preferences updated.</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Security & Authentication */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-blue-600" />
              <span>Authentication & Security</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Control password policies, active browser sessions, and login
              verification.
            </p>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Require OTP verification upon signing in.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(setTwoFactor)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    twoFactor ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      twoFactor ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Password Reset</h4>
                  <p className="text-slate-500 text-[11px]">
                    Change your primary master account password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      `Password reset link dispatched to ${user?.email || "dev@victorchasex.com"}`,
                    )
                  }
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <span>Notification Preferences</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select which system events trigger email and push notifications.
            </p>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">
                    Email Notifications
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Receive monthly payroll slips and workflow approval emails.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(setEmailAlerts)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    emailAlerts ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      emailAlerts ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">
                    Statutory & Compliance Alerts
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Reminders for PF/ESI challans, TDS returns, and Form 16
                    batches.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(setPayrollAlerts)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    payrollAlerts ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      payrollAlerts ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
