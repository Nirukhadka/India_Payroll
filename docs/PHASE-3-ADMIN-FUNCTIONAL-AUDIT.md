# Phase 3 — Admin Portal Functional Audit

## 1. Overview & Scope
This audit documents the functional verification of every administrative route, button, workflow, role-based boundary, and data model mapping inside the newly isolated IndiaPay Admin Portal (`/admin` and admin subsystems) compared against the active reference greytHR portal (`https://victorchasex.greythr.com/home#/`).

---

## 2. Module Functional Verification Matrix

| # | Administrative Module | Route | Navigation Trigger | Functionality & Backend Integration | Audit Result | Status |
|---|---|---|---|---|---|---|
| **1** | **Admin Welcome** | `/admin#welcome` | Welcome Pill | Hero greeting, dynamic stats, quick shortcuts, task queue summary | Fully Functional via `api.dashboard.adminOperations` | **PASS** |
| **2** | **Operational Dashboard** | `/admin#dashboard` | Dashboard Pill | Live KPI Ribbon: Active Staff, Swipes, Pending Leaves, Net Salary | Bound to Convex reactive queries | **PASS** |
| **3** | **Employee Directory** | `/employees` | Shortcut Card / Sidebar | Directory search, department filters, status badges, employee profile drawer | Functional via `api.employees.list` | **PASS** |
| **4** | **Add Employee** | `/employees?action=add` | Shortcut Card / New Hire | Multi-step form: Basic Info, Statutory (PF/ESI/PAN/UAN), Bank details | Validated form with Convex insert mutation | **PASS** |
| **5** | **Payroll Processing** | `/payroll` | Shortcut Card / Sidebar | Run wizard, attendance/LOP calculation, gross-to-net summary | Bound to `api.payroll.listRuns` & `createRun` | **PASS** |
| **6** | **Salary Structures** | `/salaries` | Shortcut Card / Sidebar | CTC formulas, Basic/HRA/Special allowances, Section 115BAC comparison | Reactive wage engine in Convex | **PASS** |
| **7** | **Attendance Muster** | `/attendance` | Quick Launcher / Nav | Daily punch logs, shift timings, biometric status indicators | Bound to `api.attendance.getPunches` | **PASS** |
| **8** | **Leave Approvals** | `/attendance?tab=leaves` | My Tasks / Monitor Link | Leave applications queue, approve/reject with remarks | Functional via `api.leaves.approve` & `reject` | **PASS** |
| **9** | **Compliance & Tax** | `/compliance` | Latest Updates / Nav | Indian statutory guidelines, EPFO ECR, ESIC, Form 138 TDS Challan 281 | Active compliance overview | **PASS** |
| **10** | **Reports Gallery** | `/reports` | Shortcut Card / Nav | Downloadable statutory returns: PF ECR, ESI Excel, Form 5A PT | Export file generation enabled | **PASS** |
| **11** | **Workflow Delegates** | `/delegates` | Nav | Assign approval authority, escalation rules | Delegate assignment active in DB | **PASS** |
| **12** | **Organization Settings**| `/settings` | Topbar Settings Icon | Legal entity details, CIN, GSTIN, TAN, EPF code, ESI code | RBAC-guarded settings | **PASS** |

---

## 3. Role-Based Access Control (RBAC) & Data Isolation Audit

* **Tenant Isolation**: All administrative queries and mutations enforce `workspaceId` filtering directly at the database layer in Convex.
* **Route Protection**:
  * `/admin`: Verifies `currentWorkspace.role === "admin" || currentWorkspace.role === "owner"`. Non-admin members are redirected to `/` with an authorization notice.
  * Backend mutations (`createRun`, `approveLeave`, `onboardEmployee`) verify role permissions before mutating state.
* **Employee Protection**:
  * Non-admin employees navigating to `/` access only the untouched Employee Self-Service Dashboard (`MemberDashboard`).

---

## 4. Identified Gaps & Non-Consequential Placeholders
* Real-time automated bank disbursements: Documented gap (standard mock/manual payout status maintained).
* Production EPFO API Gateway: External Indian government portal direct webhook submission is replaced with compliant text ECR file export (`PF_ECR_Sep26.txt` standard).
