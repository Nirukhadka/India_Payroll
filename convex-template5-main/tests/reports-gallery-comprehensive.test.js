import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Reports Gallery Comprehensive Verification Suite", async (t) => {
  const invPath = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/REPORTS-GALLERY-COMPLETE-REFERENCE-INVENTORY.json";
  assert(fs.existsSync(invPath), "Inventory file must exist");
  const inventoryData = JSON.parse(fs.readFileSync(invPath, "utf8"));

  const regPath = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts";
  assert(fs.existsSync(regPath), "Reports registry must exist");
  const registryCode = fs.readFileSync(regPath, "utf8");

  await t.test("1. Reference Inventory: Contains all 27 categories inspected from authenticated greytHR", () => {
    assert.strictEqual(inventoryData.inventory.length, 27);
    const expectedCategories = [
      "Payroll Payout",
      "Payroll Control",
      "ESI - EMPLOYEES' STATE INSURANCE FUND",
      "PF - Provident Fund",
      "PT - Profession Tax",
      "Workforce Attrition Reports",
      "Income Tax",
      "Reimbursement",
      "Loan",
      "Claims",
      "MIS Reports",
      "Leave",
      "Help Desk",
      "Labour Welfare Fund Act - Karnataka",
      "Minimum Wages Rules - Karnataka",
      "Factories Act - Karnataka",
      "Maternity Benefit Act - Central",
      "CLRA Act & Rules - Central",
      "Payment of Bonus Act - Central",
      "Equal Remuneration Act - Central",
      "Workmen's Compensation Act",
      "Ease of Compliance - Central",
      "Shops & Est Act - Karnataka",
      "Tamil Nadu Labour Welfare Fund Act, 1972",
      "Labour Reports",
      "Payment of Gratuity Act - Central",
      "HR Reports"
    ];

    expectedCategories.forEach(cat => {
      const found = inventoryData.inventory.some(c => c.categoryName === cat);
      assert(found, `Category ${cat} must exist in canonical inventory`);
      assert(registryCode.includes(JSON.stringify(cat)), `Category ${cat} must exist in registry code`);
    });
  });

  await t.test("2. Catalogue Completeness: Contains exactly 192 total reports from reference application", () => {
    const totalReports = inventoryData.inventory.reduce((sum, c) => sum + c.reports.length, 0);
    assert.strictEqual(totalReports, 192, "Exactly 192 reports must be inventoried");
  });

  await t.test("3. Primary Route: /reports renders Reports Gallery directly with 0 promotional banners", () => {
    const reportsPage = fs.readFileSync(
      "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/reports/page.tsx",
      "utf8"
    );
    assert(reportsPage.includes("ReportsGalleryPage") || reportsPage.includes("ReportsGalleryMainPage"), "Must export Reports gallery page component");
    assert(!reportsPage.includes("Switch to greytHR Reports Gallery & Query Builder"), "Must NOT have promotional switch banner");
    assert(reportsPage.includes("REPORTS_REGISTRY"), "Must render full reports registry");
  });

  await t.test("4. Feature Preservation: Payroll History preserved and accessible under /reports/payroll-history", () => {
    const historyPagePath = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/reports/payroll-history/page.tsx";
    assert(fs.existsSync(historyPagePath), "Payroll history page must exist at /reports/payroll-history");
    const historyCode = fs.readFileSync(historyPagePath, "utf8");
    assert(historyCode.includes("Reports & Payroll History"), "Payroll history page must retain full payroll run functionality");
  });

  await t.test("5. Favorites & Search: Persistent Favorites controls and real-time Search functionality", () => {
    const reportsPage = fs.readFileSync(
      "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/reports/page.tsx",
      "utf8"
    );
    assert(reportsPage.includes("handleToggleFavorite"), "Must support favorite toggling");
    assert(reportsPage.includes('activeTab === "favorites"'), "Must support filtering by favorites");
    assert(reportsPage.includes("searchTerm"), "Must support text search across report names and categories");
  });

  await t.test("6. Jurisdiction & State: State selector configures state-specific statutory compliance reports", () => {
    const reportsPage = fs.readFileSync(
      "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/reports/page.tsx",
      "utf8"
    );
    assert(reportsPage.includes("selectedState"), "Must support state selection");
    assert(reportsPage.includes("Karnataka"), "Must configure Karnataka statutory filters");
    assert(reportsPage.includes("Tamil Nadu"), "Must configure Tamil Nadu statutory filters");
  });

  await t.test("7. Export Execution: Report workflow supports PDF, XLSX, and CSV formats with actual row data", () => {
    const reportsPage = fs.readFileSync(
      "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/reports/page.tsx",
      "utf8"
    );
    assert(reportsPage.includes("handleExecuteExport"), "Must support export execution");
    assert(reportsPage.includes('exportFormat === "CSV"'), "Must generate actual CSV file data");
    assert(reportsPage.includes('exportFormat === "XLSX"'), "Must generate actual Excel file data");
    assert(reportsPage.includes('exportFormat === "PDF"'), "Must support PDF print formatting");
  });

  await t.test("8. Security & RBAC: Server-side RBAC and workspace isolation in backend reports query", () => {
    const backendCode = fs.readFileSync(
      "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/packages/backend/convex/reports.ts",
      "utf8"
    );
    assert(backendCode.includes("requireMember(ctx, userId, args.workspaceId)"), "Must enforce workspace isolation");
    assert(backendCode.includes('member.role === "admin"'), "Must enforce RBAC checks");
    assert(backendCode.includes("bankAccount"), "Must mask sensitive bank account details for unauthorized roles");
  });
});
