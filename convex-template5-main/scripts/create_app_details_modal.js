import fs from "fs";

const content = `"use client";

import { useState } from "react";
import {
  X,
  Star,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Send,
  Loader2,
  FileText,
  Lock,
  Tag,
  Building2,
  Layers,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export interface MarketplaceAppDetailsItem {
  appId: string;
  name: string;
  provider: string;
  tagline: string;
  description: string;
  category: string;
  secondaryCategory?: string;
  rating: number;
  ratingCount: number;
  offerBadge?: string;
  isFeatured: boolean;
  integrationType: "native" | "connector" | "third_party" | "demo";
  supportedFeatures: string[];
  pricingModel: string;
  dataExchanged: string[];
  securityCompliance: string[];
  docUrl?: string;
}

interface AppDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: MarketplaceAppDetailsItem | null;
  workspaceId: Id<"workspaces">;
  currentStatus: string;
  isInterested: boolean;
  onToggleInterested: (appId: string) => void;
  onRequestSubmitted?: () => void;
}

export function AppDetailsModal({
  isOpen,
  onClose,
  app,
  workspaceId,
  currentStatus,
  isInterested,
  onToggleInterested,
  onRequestSubmitted,
}: AppDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "request">("overview");
  const [reason, setReason] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const requestAccess = useMutation(api.marketplace.requestAppAccess);

  if (!isOpen || !app) return null;

  const handleModuleToggle = (mod: string) => {
    setSelectedModules((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !contactName.trim() || !contactEmail.trim()) return;

    setSubmitting(true);
    try {
      await requestAccess({
        workspaceId,
        appId: app.appId,
        requestReason: reason,
        requestedModules: selectedModules.length > 0 ? selectedModules : undefined,
        contactName,
        contactEmail,
        contactPhone: contactPhone || "+91 00000 00000",
      });
      setRequestSuccess(true);
      onRequestSubmitted?.();
    } catch (err) {
      console.error("Failed to submit app request:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (currentStatus) {
      case "active":
      case "installed":
        return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Installed & Active</span>;
      case "pending_approval":
      case "requested":
        return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Pending Approval</span>;
      case "approved":
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">Approved</span>;
      case "rejected":
        return <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800">Declined</span>;
      default:
        return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">Available to Request</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-50 via-blue-50/30 to-white border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200/80 font-black text-xl text-blue-700">
                {app.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{app.name}</h2>
                  {getStatusBadge()}
                </div>
                <p className="text-xs font-semibold text-slate-500">{app.provider} â€¢ {app.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{app.rating.toFixed(1)} / 5</span>
                  </div>
                  <span className="text-[11px] text-slate-400">({app.ratingCount} reviews)</span>
                  {app.offerBadge && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                      {app.offerBadge}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-4 mt-6 border-b border-slate-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={\`pb-2.5 transition \${
                activeTab === "overview"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }\`}
            >
              Overview & Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("request")}
              className={\`pb-2.5 transition \${
                activeTab === "request"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }\`}
            >
              Request Access
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "overview" ? (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  About Integration
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{app.description}</p>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Key Capabilities
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {app.supportedFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-100 text-xs text-slate-800"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Exchanged & Security */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <span>Data Exchanged</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {app.dataExchanged.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-slate-400" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Security & Compliance</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {app.securityCompliance.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-emerald-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pricing & Commercials */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                    Commercial Terms
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">{app.pricingModel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleInterested(app.appId)}
                  className={\`rounded-lg px-3 py-1.5 text-xs font-bold transition \${
                    isInterested
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }\`}
                >
                  {isInterested ? "★ In Interested Apps" : "☆ Save to Interested"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {requestSuccess ? (
                <div className="p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 animate-in zoom-in">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Request Submitted for Admin Review
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
                    Your request to integrate <span className="font-semibold text-blue-600">{app.name}</span> has been logged. Workspace Administrators have been notified.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRequestSuccess(false);
                      onClose();
                    }}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    Close & View in My Apps
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Justification *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Why does your team need this integration? e.g. Automated background checks for Q4 hiring batch..."
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Select Capabilities to Enable
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {app.supportedFeatures.map((feat, idx) => (
                        <label
                          key={idx}
                          className={\`flex items-center gap-2 rounded-lg border p-2 text-xs cursor-pointer transition \${
                            selectedModules.includes(feat)
                              ? "border-blue-500 bg-blue-50/50 text-blue-900"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }\`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedModules.includes(feat)}
                            onChange={() => handleModuleToggle(feat)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="truncate">{feat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Point of Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. HR Admin"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="hr@victorchasex.com"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Back to Overview
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>Submit Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {activeTab === "overview" && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Provider: <span className="font-semibold text-slate-700">{app.provider}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>
              {currentStatus === "active" || currentStatus === "installed" ? (
                <button
                  type="button"
                  disabled
                  className="rounded-lg bg-emerald-600 px-5 py-1.5 text-xs font-bold text-white opacity-90 cursor-default"
                >
                  Installed & Ready
                </button>
              ) : currentStatus === "pending_approval" ? (
                <button
                  type="button"
                  disabled
                  className="rounded-lg bg-amber-500 px-5 py-1.5 text-xs font-bold text-white opacity-90 cursor-default"
                >
                  Request Under Review
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab("request")}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  <span>Request Access</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync("C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/app-details-modal.tsx", content, "utf8");
console.log("Created app-details-modal.tsx");
