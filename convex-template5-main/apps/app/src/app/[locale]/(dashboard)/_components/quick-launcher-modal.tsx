"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Home,
  Users,
  CreditCard,
  CalendarCheck,
  GitPullRequest,
  BarChart3,
  HeartHandshake,
} from "lucide-react";

export interface LauncherAppItem {
  id: string;
  name: string;
  sublabel?: string;
  href: string;
  isComingSoon?: boolean;
  borderColor: string;
  iconColor: string;
  svg: React.ReactNode;
}

const APPS: LauncherAppItem[] = [
  {
    id: "homepage",
    name: "Homepage",
    href: "/",
    borderColor: "rgb(252, 230, 255)",
    iconColor: "rgb(170, 0, 234)",
    svg: <Home className="h-4 w-4" />,
  },
  {
    id: "employee",
    name: "Employee",
    href: "/admin/employee/main/overview",
    borderColor: "rgb(213, 245, 239)",
    iconColor: "rgb(26, 184, 155)",
    svg: <Users className="h-4 w-4" />,
  },
  {
    id: "payroll",
    name: "Payroll",
    href: "/admin/payroll",
    borderColor: "rgb(255, 230, 238)",
    iconColor: "rgb(240, 110, 153)",
    svg: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "workforce",
    name: "Workforce Management",
    sublabel: "Formerly Leave & Attendance",
    href: "/admin/leave/overview",
    borderColor: "rgb(245, 227, 250)",
    iconColor: "rgb(151, 85, 171)",
    svg: <CalendarCheck className="h-4 w-4" />,
  },
  {
    id: "workflow",
    name: "Workflow",
    href: "/admin/workflow/leave",
    borderColor: "rgb(252, 233, 230)",
    iconColor: "rgb(245, 135, 115)",
    svg: <GitPullRequest className="h-4 w-4" />,
  },
  {
    id: "reports",
    name: "Reports",
    href: "/reports",
    borderColor: "rgb(230, 251, 252)",
    iconColor: "rgb(5, 162, 173)",
    svg: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: "engage",
    name: "Engage",
    href: "/engage",
    borderColor: "rgb(252, 233, 230)",
    iconColor: "rgb(245, 135, 115)",
    svg: <HeartHandshake className="h-4 w-4" />,
  },
];

export interface QuickLauncherModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export function QuickLauncherModal({
  open,
  isOpen,
  onOpenChange,
  onClose,
}: QuickLauncherModalProps) {
  const isVisible = open ?? isOpen ?? false;

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking the launcher toggle button itself
      const target = e.target as HTMLElement;
      if (target.closest('button[title="Apps"], button[aria-label="Apps"]')) {
        return;
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Slight delay to prevent immediate dismissal from the trigger click event
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute left-6 top-[62px] z-50 w-[240px] rounded-[8px] border border-[#E4E9F0] bg-white p-[4px] shadow-[0_4px_12px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.08)] animate-in fade-in-80 zoom-in-95 duration-100 select-none"
      style={{
        transformOrigin: "top left",
      }}
    >
      <div className="px-3 pt-2 pb-1.5 border-b border-slate-100 mb-1">
        <p className="text-[13px] font-bold text-[#5A6A7C] leading-none">
          Your Apps
        </p>
      </div>

      <div className="flex flex-col space-y-[2px]">
        {APPS.map((app) => (
          <Link
            key={app.id}
            href={app.href}
            onClick={handleClose}
            className="group flex min-h-[46px] items-center gap-3 rounded-[8px] px-2 py-1.5 transition-colors hover:bg-[#F8FAFC] text-[#394657]"
          >
            {/* Outlined Icon Container with exact border and color matching greytHR */}
            <div
              className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] transition-transform group-hover:scale-105"
              style={{
                border: `1px solid ${app.borderColor}`,
                color: app.iconColor,
                backgroundColor: "white",
              }}
            >
              {app.svg}
            </div>

            {/* Labels */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold text-[#394657] leading-tight truncate">
                  {app.name}
                </span>
                {app.isComingSoon && (
                  <span className="rounded bg-slate-100 px-1 py-0.5 text-[9px] font-medium text-slate-500">
                    Soon
                  </span>
                )}
              </div>
              {app.sublabel && (
                <p className="text-[11px] font-normal text-[#8A9BA8] leading-tight mt-0.5">
                  {app.sublabel}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
