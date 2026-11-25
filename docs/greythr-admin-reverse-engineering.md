# greytHR Admin Portal — Complete Reverse Engineering & Implementation Specification

## 1. Executive Summary & Objective

This document serves as the master reverse-engineering specification for reconstructing the **greytHR Enterprise Admin Portal** inside **IndiaPay** (`apps/app`).

* **Reference Application**: `https://victorchasex.greythr.com/home#/`
* **Target System**: IndiaPay Enterprise HRMS & Payroll Monorepo (`apps/app`)
* **Primary Methodology**: Reverse Engineer Anything (REA) via Chrome DevTools Protocol (CDP port 9222).

---

## 2. Architectural Boundary & Separation Policy

IndiaPay contains two distinct products within the same SaaS application:
1. **Employee Self-Service (ESS) Portal (`MemberDashboard`)**: **FROZEN & PROTECTED**. Completed product area. Must remain completely untouched.
2. **Admin & HR Operations Portal (`GreytHRAdminDashboard`)**: **DEDICATED TARGET AREA**. Implemented under dedicated route spaces (`/admin`, `/employees`, `/payroll`, `/salaries`, `/attendance`, `/compliance`, `/reports`, `/settings`) with independent topbars, layouts, workflows, and strict RBAC enforcement.

---

## 3. Discovered greytHR Module Architecture & Route Map

Based on REA CDP inspection (`greythr_inspection.json`, `greythr-analysis.json`, and DOM link discovery):

| Module Category | greytHR Reference Route | IndiaPay Admin Route | Key Workflows & Observed UI Components |
| :--- | :--- | :--- | :--- |
| **Admin Welcome** | `/home/#welcome` | `/admin#welcome` | Centered Welcome pill, Cityscape greeting, 5 Favourite action cards, My Tasks split counters, Help Links, Latest Updates panel. |
| **Operational Dashboard** | `/home/#home-page-dashboard-panel` | `/admin#dashboard` | Active Staff, Today's Swipes, Pending Leaves, Net Payroll, Indian Statutory filing alerts. |
| **Core HR / Employees** | `/ngapp/employee/main/overview` | `/employees` | Employee Directory, Search by name/code, Department/Designation filters, Active/Resigned badges, profile drawer. |
| **Employee Onboarding** | `/ngapp/adminBackRoom/minor/updateEmployeeInfo` | `/employees?action=add` | Statutory New Hire master: PF UAN, ESIC IP, PAN, Aadhaar, Bank IFSC, CTC breakdown. |
| **Payroll Processing** | `/ngapp/payroll/main/overview/` | `/payroll` | Salary run wizard, LOP/Attendance integration, Earnings vs Deductions distribution, Gross-to-Net lock. |
| **Salary Structures** | `/ngapp/payroll/main/overview/` | `/salaries` | CTC Formula engine (Basic, HRA, Special Allowance, DA), Section 115BAC comparison, PT state rules. |
| **Workforce & Leaves** | `/ngapp/leave/main/overview` | `/attendance?tab=leaves` | Leave approval ledger, Sick/Casual/Privilege balances, absence calendar, Approve/Reject modal. |
| **Workflow Engine** | `/nx/workflow/module/leave` | `/delegates` | Delegated approval manager, escalation matrix, multi-tier audit history. |
| **Reports Gallery** | `/ngapp/reports/reports/reports-gallery` | `/reports` | EPFO ECR text format, ESIC monthly excel upload, Form 5A PT Karnataka statement, Salary Register. |
| **Roles & Permissions** | `/ngapp/userAdministration/user/roles` | `/settings?tab=roles` | RBAC Matrix: Admin, HR Manager, Payroll Officer, Member. Module permission toggles. |
| **Company Info** | `/ngapp/settings/general/company-info` | `/settings?tab=company` | Corporate legal identity, CIN, GSTIN, TAN, EPF Code, ESI Code, Work locations. |
| **Plan & Billing** | `/ngapp/accountInfo/plan` | `/platform` | Enterprise tier licensing, active headcount quotas, plan management. |

---

## 4. Design System, Tokens & Layout Geometry

Based on computed layout measurements from `greythr-reference.png` (1920 × 912 viewport):

### A. Layout Measurements
* **Header Height**: `56px` (`h-14`)
* **Content Max Width**: `1880px` (`max-w-[1880px]`)
* **Grid Split (Welcome View)**:
  * Left Workspace: `col-span-9` (75% width)
  * Right Updates Panel: `col-span-3` (25% width)
* **Card Border Radii**: `12px` (`rounded-xl`) and `16px` (`rounded-2xl`)
* **Elevation**: Subtle borders (`border-slate-200/90`) with soft depth (`shadow-2xs` / `shadow-xs`).

### B. Color Tokens
* **Canvas Background**: `#F8FAFC` (Slate 50)
* **Card Surfaces**: `#FFFFFF` (Pure white) with light pastel accents:
  * Add Employee Card: `#DBEAFE` (Blue-100 / Blue-200)
  * Payroll Cards: `#FEF3C7` / `#FFFBEB` (Amber-100 / Peach)
  * Task Counter Rail: `#FFF2E6` (Warm peach)
  * Latest Updates Panel: `#FAF5FF` (Soft lavender) with `#F3E8FF` (Purple-100) items.
* **Text Hierarchy**:
  * Headings: `#0F172A` (Slate-900), font-bold / font-semibold.
  * Body: `#334155` (Slate-700) and `#64748B` (Slate-500).
  * Monospace / Badges: `#2563EB` (Blue-600) and `#7C3AED` (Purple-600).

---

## 5. Security & RBAC Enforcement

1. **Route Level**:
   * Admin routes (`/admin`, `/payroll`, `/salaries`, etc.) verify the user's role on the workspace (`currentWorkspace.role === "admin" || currentWorkspace.role === "owner"`).
   * Unauthenticated or unauthorized employee requests are intercepted and redirected to `/` with a security wall message.
2. **Backend Convex Level**:
   * Mutations and queries (`adminOperations`, `runPayroll`, `approveLeave`, `createEmployee`) validate `workspaceId` and verify the caller's admin permissions before returning data or modifying tenant state.

---

## 6. Verification & Implementation Roadmap

* **Stage 1 (Completed)**: Initial REA CDP live inspection, extraction of `greythr-analysis.json`, and decoding of `greythr-reference.png`.
* **Stage 2 (Completed)**: Physical isolation of Employee (`/`) and Admin (`/admin`) dashboard trees, headers, and layouts.
* **Stage 3 (In Progress)**: Implementation of full administrative workflows (Employee Master, Payroll Wizard, Attendance/Leave Approvals, Statutory Returns).
* **Stage 4**: Cross-viewport visual QA and functional verification with side-by-side screenshot auditing.
