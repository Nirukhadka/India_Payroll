import fs from "fs";

const content = `"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Percent,
} from "lucide-react";

interface PromoSlide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  highlight: string;
  description: string;
  actionText: string;
  secondaryTag: string;
  gradient: string;
  icon: React.ReactNode;
}

interface PromotionalCarouselProps {
  onExploreClick: () => void;
}

export function PromotionalCarousel({ onExploreClick }: PromotionalCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: PromoSlide[] = [
    {
      id: "slide_1",
      badge: "FEATURED PARTNER OFFER",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      title: "Automate Employee Background Screening with",
      highlight: "SpringVerify & Instaveritas",
      description:
        "Accelerate candidate onboarding by up to 70%. Enjoy instant Aadhaar, PAN, court record and previous employer verification with exclusive 20% discount credits.",
      actionText: "Explore Background Verification",
      secondaryTag: "CERT-In Audited • 24hr Turnaround",
      gradient: "from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6]",
      icon: <ShieldCheck className="h-24 w-24 text-white/20" />,
    },
    {
      id: "slide_2",
      badge: "EMPLOYEE FINANCIAL WELLNESS",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      title: "Zero-Cost On-Demand Salary Advances with",
      highlight: "FatakPay & KarmaLife",
      description:
        "Provide emergency financial liquidity to your workforce without impacting employer cash flow. Fully automated payroll deductions integrated with IndiaPay pay runs.",
      actionText: "Explore Advance Salary",
      secondaryTag: "RBI Regulated NBFC • Zero Employer Cost",
      gradient: "from-[#065F46] via-[#047857] to-[#10B981]",
      icon: <Zap className="h-24 w-24 text-white/20" />,
    },
    {
      id: "slide_3",
      badge: "TAX SAVINGS & REIMBURSEMENTS",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      title: "Help Employees Save up to ₹50,000 in Taxes with",
      highlight: "Zaggle SAVE Smart Benefits",
      description:
        "Deliver meal cards, fuel allowances, and gadget flexi-benefits on a unified smart card. Seamlessly reconciles with IndiaPay Form 12BB and monthly TDS computations.",
      actionText: "Explore Flexible Benefits",
      secondaryTag: "PCI-DSS Level 1 • Tax Optimizer",
      gradient: "from-[#4338CA] via-[#4F46E5] to-[#818CF8]",
      icon: <Percent className="h-24 w-24 text-white/20" />,
    },
    {
      id: "slide_4",
      badge: "ERP & GL CONNECTORS",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      title: "Instant One-Click Journal Sync with",
      highlight: "Tally, Zoho Books & Dynamics 365",
      description:
        "Eliminate manual accounting spreadsheets. Direct ledger mapping, cost center allocations, and automatic salary journal voucher creation directly into your ERP.",
      actionText: "Explore Accounting Connectors",
      secondaryTag: "Native Direct APIs • Zero Reconciliation Errors",
      gradient: "from-[#581C87] via-[#6B21A8] to-[#A855F7]",
      icon: <TrendingUp className="h-24 w-24 text-white/20" />,
    },
  ];

  const slide = slides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg select-none mb-8">
      {/* Background with dynamic gradient */}
      <div className={\`w-full bg-gradient-to-r \${slide.gradient} text-white p-8 md:p-10 transition-all duration-500 relative min-h-[220px] flex items-center\`}>
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-12 bottom-6 pointer-events-none hidden md:block">
          {slide.icon}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className={\`rounded-full border px-3 py-0.5 text-[10px] font-black tracking-wider uppercase \${slide.badgeColor}\`}>
              {slide.badge}
            </span>
            <span className="text-xs font-medium text-white/80">
              {slide.secondaryTag}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black tracking-tight leading-snug mb-2">
            {slide.title}{" "}
            <span className="text-amber-300 underline decoration-amber-300/60 underline-offset-4">
              {slide.highlight}
            </span>
          </h2>

          <p className="text-xs md:text-sm text-white/90 leading-relaxed mb-6 max-w-xl">
            {slide.description}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onExploreClick}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow-md hover:bg-slate-100 active:scale-95 transition"
            >
              <span>{slide.actionText}</span>
              <ArrowRight className="h-3.5 w-3.5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Arrow Navigation */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 transition active:scale-90"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 transition active:scale-90"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {slides.map((_, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={\`Go to slide \${idx + 1}\`}
            className={\`h-1.5 rounded-full transition-all \${
              idx === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }\`}
          />
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync("C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/promotional-carousel.tsx", content, "utf8");
console.log("Created promotional-carousel.tsx");
