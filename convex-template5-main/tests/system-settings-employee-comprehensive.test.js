import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("PHASE 18.3: Employee System Settings Verification Suite", async (t) => {
  const root = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main";
  const canonicalInventoryPath = path.join(root, "docs/greythr-canonical-164-inventory.json");

  await t.test("Canonical Inventory has all 9 Employee entries", () => {
    assert.strictEqual(fs.existsSync(canonicalInventoryPath), true, "Inventory file must exist");
    const raw = JSON.parse(fs.readFileSync(canonicalInventoryPath, "utf8"));
    const employeeItems = raw.categories?.Employee || [];
    assert.strictEqual(employeeItems.length, 9, "Employee category must have exactly 9 entries");

    const expectedStates = [
      "settings.employee",
      "settings.employee.emp-no-series",
      "settings.employee.employee-preferences",
      "settings.employee.transitiongroup",
      "settings.employee.employeecategories",
      "settings.employee.emp-no-series-edit",
      "settings.employee.leavingreason",
      "settings.employee.asset-group-settings",
      "settings.employee.dirconfig",
    ];

    expectedStates.forEach((st) => {
      const match = employeeItems.find((item) => item.state === st);
      assert.ok(match, `Canonical entry ${st} must exist in inventory`);
    });
  });

  await t.test("All Employee System Settings routes exist and export valid Next.js page components", () => {
    const pages = [
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/preferences/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/emp-no-series/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/transitiongroup/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/positions/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/leaving-reason/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/asset-group-settings/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/dirconfig/page.tsx",
    ];

    pages.forEach((p) => {
      const fullPath = path.join(root, p);
      assert.strictEqual(fs.existsSync(fullPath), true, `Page ${p} must exist`);
      const src = fs.readFileSync(fullPath, "utf8");
      assert.ok(src.includes("export default function"), `${p} must have default export`);
    });
  });

  await t.test("Directory Configuration has live preview and statutory categories", () => {
    const dirConfigPath = path.join(root, "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/dirconfig/page.tsx");
    const src = fs.readFileSync(dirConfigPath, "utf8");
    assert.ok(src.includes("Extension No"), "Must contain Extension No field");
    assert.ok(src.includes("Emergency Contact No"), "Must contain Emergency Contact No");
    assert.ok(src.includes("Live Card Preview"), "Must contain Live Card Preview");
    assert.ok(src.includes("Raj Kumar Yadav"), "Must contain interactive preview mockup");
  });

  await t.test("Asset Group Settings supports returnable and depreciation configuration", () => {
    const assetPath = path.join(root, "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/asset-group-settings/page.tsx");
    const src = fs.readFileSync(assetPath, "utf8");
    assert.ok(src.includes("LAPTOP"), "Must contain LAPTOP category");
    assert.ok(src.includes("depreciationRate"), "Must handle depreciation rate");
    assert.ok(src.includes("isReturnable"), "Must handle returnable status");
    assert.ok(src.includes("requiresApproval"), "Must handle line manager approval");
  });

  await t.test("Leaving Reasons has statutory PF codes and resignation classifications", () => {
    const leavingPath = path.join(root, "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/leaving-reason/page.tsx");
    const src = fs.readFileSync(leavingPath, "utf8");
    assert.ok(src.includes('pfCode: "10"'), "Must include PF Cessation code 10");
    assert.ok(src.includes('pfCode: "02"'), "Must include PF Retirement code 02");
    assert.ok(src.includes('pfCode: "03"'), "Must include PF Termination code 03");
    assert.ok(src.includes("EPFO ECR"), "Must reference EPFO ECR compliance");
  });

  await t.test("System Settings layout navigation lists all Employee submodules", () => {
    const layoutPath = path.join(root, "apps/app/src/app/[locale]/(admin)/admin/system-settings/layout.tsx");
    const src = fs.readFileSync(layoutPath, "utf8");
    assert.ok(src.includes("/admin/system-settings/employee/positions"), "Layout must link to positions");
    assert.ok(src.includes("/admin/system-settings/employee/leaving-reason"), "Layout must link to leaving-reason");
    assert.ok(src.includes("/admin/system-settings/employee/asset-group-settings"), "Layout must link to asset-group-settings");
    assert.ok(src.includes("/admin/system-settings/employee/dirconfig"), "Layout must link to dirconfig");
  });

  await t.test("Screenshots captured for all implemented Employee Settings pages", () => {
    const brainDir = "C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e";
    const expectedScreenshots = [
      "indiapay-employee-settings-positions-1920x1080.png",
      "indiapay-employee-settings-positions-1366x768.png",
      "indiapay-employee-settings-leaving-reason-1920x1080.png",
      "indiapay-employee-settings-leaving-reason-1366x768.png",
      "indiapay-employee-settings-asset-group-settings-1920x1080.png",
      "indiapay-employee-settings-asset-group-settings-1366x768.png",
      "indiapay-employee-settings-dirconfig-1920x1080.png",
      "indiapay-employee-settings-dirconfig-1366x768.png",
      "indiapay-employee-settings-employee-hub-1920x1080.png",
      "indiapay-employee-settings-employee-hub-1366x768.png",
    ];

    expectedScreenshots.forEach((shot) => {
      const full = path.join(brainDir, shot);
      assert.strictEqual(fs.existsSync(full), true, `Screenshot ${shot} must exist in brain directory`);
    });
  });
});
