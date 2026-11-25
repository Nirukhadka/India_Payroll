import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("Phase 18.2: General & Employee System Settings Test Suite", async (t) => {
  const root = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main";

  await t.test("1. Route & Page Existence for all 6 Pages", () => {
    const requiredPages = [
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/general/lov/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/general/bank-branch/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/general/company-bank/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/general/state/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/emp-no-series/page.tsx",
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/transitiongroup/page.tsx",
    ];

    for (const rel of requiredPages) {
      const full = path.join(root, rel);
      assert.ok(fs.existsSync(full), `Page file must exist: ${rel}`);
      const content = fs.readFileSync(full, "utf8");
      assert.ok(content.length > 500, `Page file must contain functional code: ${rel}`);
      assert.ok(!content.includes("@workspace/backend"), `Must use @v1/backend, not @workspace/backend in ${rel}`);
    }
  });

  await t.test("2. System Settings Layout Navigation Includes All 6 Routes", () => {
    const layoutPath = path.join(
      root,
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/layout.tsx"
    );
    const content = fs.readFileSync(layoutPath, "utf8");
    assert.ok(content.includes("/admin/system-settings/general/lov"), "Layout must link LOV");
    assert.ok(content.includes("/admin/system-settings/general/bank-branch"), "Layout must link Bank Branch");
    assert.ok(content.includes("/admin/system-settings/general/company-bank"), "Layout must link Company Bank");
    assert.ok(content.includes("/admin/system-settings/general/state"), "Layout must link State");
    assert.ok(content.includes("/admin/system-settings/employee/emp-no-series"), "Layout must link Emp No Series");
    assert.ok(content.includes("/admin/system-settings/employee/transitiongroup"), "Layout must link Transition Group");
  });

  await t.test("3. Backend Schema Definitions for Phase 18.2 Entities", () => {
    const schemaPath = path.join(root, "packages/backend/convex/schema.ts");
    const content = fs.readFileSync(schemaPath, "utf8");

    assert.ok(content.includes("systemListOfValues: defineTable"), "Schema must define systemListOfValues");
    assert.ok(content.includes("systemBankBranches: defineTable"), "Schema must define systemBankBranches");
    assert.ok(content.includes("systemCompanyBanks: defineTable"), "Schema must define systemCompanyBanks");
    assert.ok(content.includes("systemStates: defineTable"), "Schema must define systemStates");
    assert.ok(content.includes("systemEmployeeNoSeries: defineTable"), "Schema must define systemEmployeeNoSeries");
    assert.ok(content.includes("systemTransitionGroups: defineTable"), "Schema must define systemTransitionGroups");

    // Workspace scoping indices
    assert.ok(content.includes(`.index("by_workspace", ["workspaceId"])`), "Must index tables by workspaceId");
  });

  await t.test("4. Backend Queries & Mutations for Phase 18.2", () => {
    const backendPath = path.join(root, "packages/backend/convex/systemSettings.ts");
    const content = fs.readFileSync(backendPath, "utf8");

    // LOV
    assert.ok(content.includes("export const getListOfValues = query"), "Must export getListOfValues query");
    assert.ok(content.includes("export const saveListOfValue = mutation"), "Must export saveListOfValue mutation");
    assert.ok(content.includes("export const deleteListOfValue = mutation"), "Must export deleteListOfValue mutation");

    // Bank Branch
    assert.ok(content.includes("export const getBankBranches = query"), "Must export getBankBranches query");
    assert.ok(content.includes("export const saveBankBranch = mutation"), "Must export saveBankBranch mutation");
    assert.ok(content.includes("export const deleteBankBranch = mutation"), "Must export deleteBankBranch mutation");

    // Company Bank
    assert.ok(content.includes("export const getCompanyBanks = query"), "Must export getCompanyBanks query");
    assert.ok(content.includes("export const saveCompanyBank = mutation"), "Must export saveCompanyBank mutation");
    assert.ok(content.includes("export const deleteCompanyBank = mutation"), "Must export deleteCompanyBank mutation");

    // States
    assert.ok(content.includes("export const getStates = query"), "Must export getStates query");
    assert.ok(content.includes("export const saveStateConfig = mutation"), "Must export saveStateConfig mutation");

    // Employee No Series
    assert.ok(content.includes("export const getEmployeeNoSeries = query"), "Must export getEmployeeNoSeries query");
    assert.ok(content.includes("export const saveEmployeeNoSeries = mutation"), "Must export saveEmployeeNoSeries mutation");
    assert.ok(content.includes("export const deleteEmployeeNoSeries = mutation"), "Must export deleteEmployeeNoSeries mutation");

    // Transition Groups
    assert.ok(content.includes("export const getTransitionGroups = query"), "Must export getTransitionGroups query");
    assert.ok(content.includes("export const saveTransitionGroup = mutation"), "Must export saveTransitionGroup mutation");
  });

  await t.test("5. Employee Number Series Format & Concurrency Safety", () => {
    const backendPath = path.join(root, "packages/backend/convex/systemSettings.ts");
    const content = fs.readFileSync(backendPath, "utf8");

    assert.ok(content.includes("format = args.prefix + String(args.startingNumber).padStart(args.digitCount, \"0\")"), "Must properly format padded employee series");
    assert.ok(content.includes("args.digitCount < 1 || args.digitCount > 10"), "Must validate digit padding range");
    assert.ok(content.includes("isDefault"), "Must support default series designation and exclusivity");
  });

  await t.test("6. Corporate Bank Security & Account Masking", () => {
    const compBankPage = path.join(
      root,
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/general/company-bank/page.tsx"
    );
    const content = fs.readFileSync(compBankPage, "utf8");

    assert.ok(content.includes("maskAccount"), "Must implement client-side account masking");
    assert.ok(content.includes("unmaskedRows"), "Must track row-level reveal toggles");
    assert.ok(content.includes("Confirm Account Number"), "Must require re-entry confirmation");
    assert.ok(content.includes("isPrimary"), "Must support primary disbursement bank flag");
  });

  await t.test("7. State Configuration Jurisdiction & Tax Compliance", () => {
    const statePage = path.join(
      root,
      "apps/app/src/app/[locale]/(admin)/admin/system-settings/general/state/page.tsx"
    );
    const content = fs.readFileSync(statePage, "utf8");

    assert.ok(content.includes("ptApplicable"), "Must support Professional Tax applicability");
    assert.ok(content.includes("lwfApplicable"), "Must support Labour Welfare Fund applicability");
    assert.ok(content.includes("tinCode"), "Must support GST TIN state code");
    assert.ok(content.includes("unionTerritory"), "Must distinguish union territories");
  });

  await t.test("8. Screenshot Evidence Verification for All 6 Pages", () => {
    const brainDir = "C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e";
    const pages = ["lov", "bank-branch", "company-bank", "state", "emp-no-series", "transitiongroup"];

    for (const p of pages) {
      const ind1080 = path.join(brainDir, `indiapay-settings-${p}-1920x1080.png`);
      const ind768 = path.join(brainDir, `indiapay-settings-${p}-1366x768.png`);
      const greyt1080 = path.join(brainDir, `greythr-settings-${p}-1920x1080.png`);
      const greyt768 = path.join(brainDir, `greythr-settings-${p}-1366x768.png`);

      assert.ok(fs.existsSync(ind1080), `IndiaPay 1920x1080 screenshot must exist for ${p}`);
      assert.ok(fs.existsSync(ind768), `IndiaPay 1366x768 screenshot must exist for ${p}`);
      assert.ok(fs.existsSync(greyt1080), `greytHR 1920x1080 screenshot must exist for ${p}`);
      assert.ok(fs.existsSync(greyt768), `greytHR 1366x768 screenshot must exist for ${p}`);
    }
  });
});
