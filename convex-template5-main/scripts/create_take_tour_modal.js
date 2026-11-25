import fs from "fs";

const content = `"use client";

import { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
  CheckCircle2,
  Grid,
  Bell,
  SlidersHorizontal,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TakeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: Id<"workspaces">;
}

interface TourStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
}

export function TakeTourModal({
  isOpen,
  onClose,
  workspaceId,
}: TakeTourModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const setTourCompleted = useMutation(api.marketplace.setTourCompleted);

  const steps: TourStep[] = [
    {
      title: "Welcome to Unite Marketplace",
      subtitle: "Curated Third-Party Products & Enterprise Integrations",
      description:
        "Unite by IndiaPay connects your HRMS with best-of-breed enterprise apps for Background Verification, Advance Salary, Tax filing, Health Insurance, and Accounting connectors. Discover everything your workforce needs in one secure place.",
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      badge: "Overview",
    },
    {
      title: "15 Industry Categories",
      subtitle: "Effortlessly Navigate by Service Domain",
      description:
        "Filter through 15 tailored domains including Background Verification (SpringVerify, Instaveritas), Flexible Benefits (Zaggle SAVE), Connectors (Tally, Zoho Books, Microsoft Dynamics), and Corporate Gifting. Switch tags with instant UI synchronization.",
      icon: <SlidersHorizontal className="h-6 w-6 text-indigo-600" />,
      badge: "Category Chips",
    },
    {
      title: "Deep Search & Live Sorting",
      subtitle: "Instant Multi-Attribute Discovery",
      description:
        "Search by provider name, feature, or keyword (e.g. 'Aadhaar', 'Claims', 'Payroll Journal'). Sort from A-Z, Z-A, or by popularity and ratings to find verified apps instantly.",
      icon: <Search className="h-6 w-6 text-emerald-600" />,
      badge: "Search & Sort",
    },
    {
      title: "Interactive Application Cards",
      subtitle: "Rich Details, Ratings & Exclusive Offers",
      description:
        "Every application card displays verified partner ratings, discount promotions (like 20% off on Background Checks or free credits), and direct access to full technical specs, compliance certifications, and pricing models.",
      icon: <Grid className="h-6 w-6 text-amber-600" />,
      badge: "App Cards",
    },
    {
      title: "Enterprise Request & Approval Flow",
      subtitle: "Multi-Step Governance & Safe Integration",
      description:
        "Employees and team leads can request application access with business justifications. Organization Administrators review, approve or decline requests, configure environment parameters, and activate integrations with full audit history.",
      icon: <CheckCircle2 className="h-6 w-6 text-purple-600" />,
      badge: "Request Workflow",
    },
    {
      title: "My Apps & Notification Center",
      subtitle: "Track Activated Integrations & Real-Time Alerts",
      description:
        "View all active, pending, or approved integrations under the 'My Apps' tab. Receive real-time notification alerts whenever access is granted or an integration status changes.",
      icon: <Bell className="h-6 w-6 text-rose-600" />,
      badge: "My Apps & Alerts",
    },
  ];

  if (!isOpen) return null;

  const step = steps[currentStep];

  const handleFinish = async () => {
    try {
      await setTourCompleted({ workspaceId });
    } catch (err) {
      console.error("Failed to persist tour completion:", err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: \`\${((currentStep + 1) / steps.length) * 100}%\` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
              Step {currentStep + 1} of {steps.length}: {step.badge}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
              {step.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">
                {step.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">{step.subtitle}</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100 text-xs text-slate-700 leading-relaxed min-h-[96px]">
            {step.description}
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6 mb-2">
            {steps.map((_, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={\`h-2 rounded-full transition-all \${
                  idx === currentStep ? "w-6 bg-blue-600" : "w-2 bg-slate-200 hover:bg-slate-300"
                }\`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <span>Finish Tour</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync("C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/take-tour-modal.tsx", content, "utf8");
console.log("Created take-tour-modal.tsx");
