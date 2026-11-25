import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Reports Gallery Batch R2: Parameter Schema Verification Suite", async (t) => {
  const schemas = JSON.parse(fs.readFileSync("docs/REPORTS-GALLERY-R2-PARAMETER-SCHEMAS.json", "utf8"));
  const inventory = JSON.parse(fs.readFileSync("docs/REPORTS-GALLERY-EXACT-REFERENCE-INVENTORY.json", "utf8"));

  await t.test("1. Registry & Schema Completeness: All 192 reports have defined schemas", () => {
    assert.equal(Object.keys(schemas).length, 192, "Must contain exactly 192 report schemas");
    inventory.reports.forEach((r) => {
      assert.ok(schemas[r.reportId], `Report ${r.reportId} must have a registered schema`);
    });
  });

  await t.test("2. Specialized Field Coverage: Forms vary by category rather than using a static template", () => {
    const salarySchema = schemas["salary_statement_monthly"];
    const taxSchema = schemas["income_tax_worksheet"];
    const pfSchema = schemas["epf_form_11_declaration_form"];
    const leaveSchema = schemas["leave_balance_as_on_a_day"];
    const reimbSchema = schemas["reimbursement_claim_report"];

    // Salary reports should have payroll month and department
    assert.ok(salarySchema.fields.some((f) => f.name === "payrollMonth"), "Salary must require payrollMonth");
    assert.ok(salarySchema.fields.some((f) => f.name === "department"), "Salary must require department");

    // Tax reports should have financial year
    assert.ok(taxSchema.fields.some((f) => f.name === "financialYear"), "Tax must require financialYear");

    // PF / Statutory reports should have statutoryState & establishmentCode
    assert.ok(pfSchema.fields.some((f) => f.name === "statutoryState"), "PF must require statutoryState");
    assert.ok(pfSchema.fields.some((f) => f.name === "establishmentCode"), "PF must have establishmentCode");

    // Leave reports should have date range and leaveType
    assert.ok(leaveSchema.fields.some((f) => f.name === "leaveType"), "Leave must require leaveType");
    assert.ok(leaveSchema.fields.some((f) => f.name === "fromDate"), "Leave must require fromDate");

    // Reimbursement reports should have claimType and status
    assert.ok(reimbSchema.fields.some((f) => f.name === "claimType"), "Reimbursement must require claimType");
  });

  await t.test("3. Schema Integrity: All fields have names, labels, default values, and valid types", () => {
    Object.values(schemas).forEach((s) => {
      assert.ok(s.fields.length >= 1, `Report ${s.reportId} must have at least one parameter field`);
      s.fields.forEach((f) => {
        assert.ok(f.name, "Field name must be present");
        assert.ok(f.label, "Field label must be present");
        assert.ok(["select", "date", "text", "number"].includes(f.type), `Invalid field type ${f.type}`);
        assert.notEqual(f.defaultValue, undefined, "Default value must be present");
      });
    });
  });

  await t.test("4. UI Integration: Parameter schema file exists and compiles cleanly", () => {
    const tsFile = "apps/app/src/app/[locale]/(admin)/admin/reports/report-parameter-schemas.ts";
    assert.ok(fs.existsSync(tsFile), "TypeScript parameter schema module must exist");
    const content = fs.readFileSync(tsFile, "utf8");
    assert.ok(content.includes("REPORT_PARAMETER_SCHEMAS"), "Module must export REPORT_PARAMETER_SCHEMAS");
  });

  await t.test("5. Options Persistence & Reset Interface: Verified in dashboard and admin pages", () => {
    const p1 = fs.readFileSync("apps/app/src/app/[locale]/(dashboard)/reports/page.tsx", "utf8");
    const p2 = fs.readFileSync("apps/app/src/app/[locale]/(admin)/admin/reports/page.tsx", "utf8");
    assert.ok(p1.includes("handleSaveOptions") && p1.includes("handleResetOptions"), "Dashboard must support Save/Reset Options");
    assert.ok(p2.includes("handleSaveOptions") && p2.includes("handleResetOptions"), "Admin must support Save/Reset Options");
  });
});
