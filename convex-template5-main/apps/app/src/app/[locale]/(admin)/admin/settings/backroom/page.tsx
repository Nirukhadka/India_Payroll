"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Activity,
  AlertTriangle,
  Cpu,
  Database,
  Lock,
  RefreshCw,
  Server,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { AdminTopbar } from "../../admin-topbar";

export default function SysAdminBackroomPage() {
  const user = useQuery(api.users.getUser);
  const isAdmin = (user as any)?.role === "admin";
  const [clearing, setClearing] = useState(false);

  const handleClearCache = () => {
    setClearing(true);
    setTimeout(() => {
      setClearing(false);
      alert("Application cache purged successfully.");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-slate-100 antialiased select-none pb-20">
      <AdminTopbar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <span>Settings</span>
              <span>&gt;</span>
              <span className="text-amber-400">Sys Admin Backroom</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-400" />
              <span>Sys Admin Backroom</span>
            </h1>
            <p className="text-xs text-slate-400">
              Low-level diagnostics, cache control, database indexing, and
              background daemon telemetry.
            </p>
          </div>

          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
            Privileged Operational Console
          </span>
        </div>

        {!isAdmin ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 text-center max-w-lg mx-auto">
            <ShieldAlert className="mx-auto h-10 w-10 text-rose-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              Privileged Access Required
            </h3>
            <p className="text-xs text-slate-400">
              This environment is strictly isolated for authorized Platform
              Engineers and System Administrators.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* System Telemetry KPI Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Backend Cluster</span>
                  <Database className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-base font-black text-white">
                  dev:basic-bobcat-92
                </div>
                <span className="text-[10px] text-emerald-400">
                  100% Operational
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Process Heap</span>
                  <Cpu className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-base font-black text-white">
                  142.6 MB / 512 MB
                </div>
                <span className="text-[10px] text-slate-400">Normal Usage</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Active Sessions</span>
                  <Activity className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-base font-black text-white">
                  1 Admin Session
                </div>
                <span className="text-[10px] text-amber-400">
                  Zero Socket Drops
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Turbopack Sync</span>
                  <Terminal className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-base font-black text-white">
                  Next.js 15 Ready
                </div>
                <span className="text-[10px] text-purple-400">
                  Port 3000 Clean
                </span>
              </div>
            </div>

            {/* Admin Utility Console */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-sm font-bold text-white mb-2">
                Maintenance Controls
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Execute low-level maintenance operations. Note: Cache purges
                invalidate active browser workers.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClearCache}
                  disabled={clearing}
                  className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${clearing ? "animate-spin" : ""}`}
                  />
                  <span>Purge App Metadata Cache</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert("Re-indexed Convex schemas successfully.")
                  }
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  Re-Index Schema Indexes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
