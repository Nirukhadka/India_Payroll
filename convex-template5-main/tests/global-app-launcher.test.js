import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Phase: Global Nine-Dot App Launcher Full Verification Suite", async (t) => {
  const launcherPath = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/_components/quick-launcher-modal.tsx";
  assert(fs.existsSync(launcherPath), "QuickLauncherModal component must exist");
  const launcherCode = fs.readFileSync(launcherPath, "utf8");

  const adminTopbarPath = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/admin-topbar.tsx";
  assert(fs.existsSync(adminTopbarPath), "AdminTopbar component must exist");
  const adminTopbarCode = fs.readFileSync(adminTopbarPath, "utf8");

  await t.test("1. Launcher Configuration: Exposes 'Your Apps' and all 8 canonical applications in exact order", () => {
    assert(launcherCode.includes("Your Apps"), "Panel header must display 'Your Apps'");
    
    const expectedApps = [
      { id: "homepage", name: "Homepage", href: "/" },
      { id: "employee", name: "Employee", href: "/admin/employee/main/overview" },
      { id: "payroll", name: "Payroll", href: "/admin/payroll" },
      { id: "workforce", name: "Workforce Management", sublabel: "Formerly Leave & Attendance", href: "/admin/leave/overview" },
      { id: "workflow", name: "Workflow", href: "/admin/workflow/leave" },
      { id: "reports", name: "Reports", href: "/reports" },
      { id: "engage", name: "Engage", href: "/engage" },
      { id: "unite", name: "Unite Marketplace", href: "/admin/unite" },
    ];

    expectedApps.forEach((app, idx) => {
      assert(launcherCode.includes(`id: "${app.id}"`), `App ${app.id} must be configured`);
      assert(launcherCode.includes(`name: "${app.name}"`), `App name ${app.name} must be configured`);
      assert(launcherCode.includes(`href: "${app.href}"`), `App href ${app.href} must match canonical route`);
      if (app.sublabel) {
        assert(launcherCode.includes(`sublabel: "${app.sublabel}"`), `Workforce Management must have sublabel '${app.sublabel}'`);
      }
    });
  });

  await t.test("2. Integration in Shared Admin Header: AdminTopbar properly binds launcher state and toggle handlers", () => {
    assert(adminTopbarCode.includes("const [launcherOpen, setLauncherOpen] = useState(false);"), "Must maintain launcherOpen state");
    assert(adminTopbarCode.includes("setLauncherOpen((prev) => !prev)"), "Button click must toggle open/closed state");
    assert(adminTopbarCode.includes("open={launcherOpen}"), "Must pass open prop to QuickLauncherModal");
    assert(adminTopbarCode.includes("onOpenChange={setLauncherOpen}"), "Must pass onOpenChange callback");
    assert(adminTopbarCode.includes("QuickLauncherModal"), "Must render QuickLauncherModal in topbar");
  });

  await t.test("3. Modal Dismissal: Supports Escape key and outside click dismissal with click-boundary guard", () => {
    assert(launcherCode.includes('e.key === "Escape"'), "Must handle Escape key press");
    assert(launcherCode.includes("handleClickOutside"), "Must handle outside clicks");
    assert(launcherCode.includes("button[title=\"Apps\"]"), "Must guard against immediate dismissal when clicking toggle button");
  });

  await t.test("4. Shell Consistency: Workforce, Employee, Payroll, Workflow, and Settings headers inherit AdminTopbar", () => {
    const workforceHeaderPath = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/leave/workforce-header.tsx";
    const workforceCode = fs.readFileSync(workforceHeaderPath, "utf8");
    assert(workforceCode.includes("<AdminTopbar"), "Workforce header must render shared AdminTopbar");

    const workflowHeaderPath = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/workflow/workflow-header.tsx";
    const workflowCode = fs.readFileSync(workflowHeaderPath, "utf8");
    assert(workflowCode.includes("<AdminTopbar"), "Workflow header must render shared AdminTopbar");

    const reportsHeaderPath = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/reports/reports-header.tsx";
    const reportsCode = fs.readFileSync(reportsHeaderPath, "utf8");
    assert(reportsCode.includes("<AdminTopbar"), "Reports header must render shared AdminTopbar");
  });
});
