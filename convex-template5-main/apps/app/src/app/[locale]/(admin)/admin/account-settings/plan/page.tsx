"use client";

import { api } from "@v1/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  Check,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Info,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    key: "essential" as const,
    name: "ESSENTIAL",
    price: "₹3,495",
    numericPrice: 3495,
    allowance: "Includes 50 employees",
    addRate: "₹35/month per additional employee",
    features: [
      "Core Payroll & Statutory Deductions",
      "PF, ESI, PT & TDS Computations",
      "Employee Self-Service (ESS) Portal",
      "Standard Salary Slips & Form 16",
      "Email & Chat Support (9AM - 6PM)",
    ],
  },
  {
    key: "growth" as const,
    name: "GROWTH",
    price: "₹5,495",
    numericPrice: 5495,
    allowance: "Includes 50 employees",
    addRate: "₹65/month per additional employee",
    bestValue: true,
    features: [
      "Everything in Essential, plus:",
      "Complete Workforce & Leave Management",
      "Multi-Tier Approval Workflows",
      "Attendance Muster & Shift Rosters",
      "Statutory ECR, Form 5 & Form 10 Reports",
      "Reports Gallery & Ad-hoc Query Builder",
      "Priority SLA Support",
    ],
  },
  {
    key: "enterprise" as const,
    name: "ENTERPRISE",
    price: "₹7,495",
    numericPrice: 7495,
    allowance: "Includes 50 employees",
    addRate: "₹105/month per additional employee",
    features: [
      "Everything in Growth, plus:",
      "Dedicated CSM & Implementation Engineer",
      "Custom REST API & Webhooks Access",
      "Advanced Enterprise App Integrations",
      "Custom Statutory Policy Rules Engine",
      "Multi-Entity Global Payroll Consolidation",
      "24/7 Phone & Critical Escalation Support",
    ],
  },
];

export default function PlanSettingsPage() {
  const subscription = useQuery(api.accountSettings.getSubscriptionInfo);
  const requestChange = useMutation(api.accountSettings.requestPlanChange);

  const [showHelp, setShowHelp] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<
    (typeof PLANS)[number] | null
  >(null);
  const [confirming, setConfirming] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentPlanKey = subscription?.planKey || "growth";

  const handleSelect = (plan: (typeof PLANS)[number]) => {
    if (plan.key === currentPlanKey) return;
    setSelectedPlan(plan);
  };

  const handleConfirmChange = async () => {
    if (!selectedPlan) return;
    setConfirming(true);
    try {
      await requestChange({ planKey: selectedPlan.key });
      setSuccessMsg(
        `Successfully switched subscription to ${selectedPlan.name} Plan!`,
      );
      setSelectedPlan(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Plan change failed:", err);
    } finally {
      setConfirming(false);
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
        <span className="text-slate-800">Plan</span>
      </div>

      {/* Help Banner with Hide Help matching greytHR */}
      {showHelp && (
        <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              Explore greytHR by{" "}
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Help-Doc
              </span>
              , watching{" "}
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                How-to Videos
              </span>{" "}
              and{" "}
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

      {/* Demo Pricing Notice */}
      <div className="rounded-lg bg-amber-50/80 border border-amber-200 px-4 py-2.5 text-[11.5px] text-amber-800 font-medium">
        Reference / Demo Pricing: Plan selections demonstrate subscription
        workflow contracts. No live credit card charge is incurred.
      </div>

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <span>{successMsg}</span>
          <button type="button" onClick={() => setSuccessMsg(null)}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Three Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {PLANS.map((plan) => {
          const isCurrent = plan.key === currentPlanKey;
          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl bg-white border p-6 flex flex-col justify-between transition-all duration-200 shadow-sm ${
                isCurrent
                  ? "border-blue-600 ring-2 ring-blue-600/20"
                  : plan.bestValue
                    ? "border-blue-300"
                    : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {plan.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10.5px] font-black uppercase tracking-wider text-white shadow-sm">
                  Best Value
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black tracking-wide text-slate-900">
                    {plan.name}
                  </h3>
                  {isCurrent && (
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10.5px] font-bold text-blue-700">
                      Current Plan
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      /month
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    {plan.allowance}
                  </p>
                  <p className="text-[11px] text-slate-400">{plan.addRate}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 mb-6">
                  <h4 className="text-xs font-bold text-slate-800 mb-3">
                    Features:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                disabled={isCurrent}
                onClick={() => handleSelect(plan)}
                className={`w-full rounded-xl py-2.5 text-xs font-bold transition shadow-sm ${
                  isCurrent
                    ? "bg-slate-100 text-slate-400 cursor-default"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99]"
                }`}
              >
                {isCurrent ? "Active Plan" : "Select Plan"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Confirm Subscription Change
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to switch your IndiaPay HRMS plan to{" "}
              <strong className="text-slate-900">{selectedPlan.name}</strong> at{" "}
              <strong>{selectedPlan.price}/month</strong>?
            </p>
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1 mb-6">
              <div className="flex justify-between">
                <span>Employee Allowance:</span>
                <span className="font-semibold text-slate-900">
                  50 employees
                </span>
              </div>
              <div className="flex justify-between">
                <span>Additional Employee Rate:</span>
                <span className="font-semibold text-slate-900">
                  {selectedPlan.addRate}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                disabled={confirming}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmChange}
                disabled={confirming}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                {confirming ? "Switching..." : "Confirm Switch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
