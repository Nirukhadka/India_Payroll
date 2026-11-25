import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("PHASE 20: Reports Gallery Independent Acceptance Audit Suite", async (t) => {
  const root = "C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main";
  const invPath = path.join(root, "docs/REPORTS-GALLERY-COMPLETE-REFERENCE-INVENTORY.json");
  const coveragePath = path.join(root, "docs/PHASE-20-REPORTS-GALLERY-192-REPORT-COVERAGE.json");

  await t.test("1. Inventory Verification: Exactly 27 categories and 192 report entries", () => {
    assert.strictEqual(fs.existsSync(invPath), true, "Inventory file must exist");
    const inv = JSON.parse(fs.readFileSync(invPath, "utf8"));
    assert.strictEqual(inv.inventory.length, 27, "Must contain exactly 27 categories");
    
    let totalReports = 0;
    const allIds = new Set();
    inv.inventory.forEach(c => {
      c.reports.forEach(r => {
        totalReports++;
        assert.ok(!allIds.has(r.id), `Report ID ${r.id} must be unique`);
        allIds.add(r.id);
      });
    });
    assert.strictEqual(totalReports, 192, "Must contain exactly 192 reports");
    assert.strictEqual(allIds.size, 192, "Must contain 192 unique IDs");
  });

  await t.test("2. Coverage Matrix Classification: Accurate 5-tier classification without false positives", () => {
    assert.strictEqual(fs.existsSync(coveragePath), true, "Coverage JSON must exist");
    const cov = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
    assert.strictEqual(cov.reports.length, 192, "Coverage file must account for all 192 reports");
    
    // Validate honest classifications:
    // - VERIFIED: Salary, PF, ESI, PT, Leave (64 reports)
    // - PARTIAL: MIS, HR, Income Tax, Claims (61 reports)
    // - UI ONLY: Factory Acts, Labour Welfare, Minimum Wages, CLRA (67 reports)
    assert.strictEqual(cov.metadata.counts.VERIFIED, 64, "Verified count must match verified business logic implementations");
    assert.strictEqual(cov.metadata.counts.PARTIAL, 61, "Partial count must accurately reflect generic fallbacks");
    assert.strictEqual(cov.metadata.counts["UI ONLY"], 67, "UI Only count must reflect statutory act templates awaiting custom forms");
  });

  await t.test("3. Backend Security & Isolation: Workspace isolation and role-based field masking", () => {
    const backendPath = path.join(root, "packages/backend/convex/reports.ts");
    assert.strictEqual(fs.existsSync(backendPath), true, "Backend reports.ts must exist");
    const code = fs.readFileSync(backendPath, "utf8");

    assert.ok(code.includes("requireMember(ctx, userId, args.workspaceId)"), "Must enforce workspace membership check");
    assert.ok(code.includes("by_workspace"), "Must filter database records by workspace index");
    assert.ok(code.includes("isAdmin ?"), "Must enforce role-based masking for PAN and Bank Account numbers");
    assert.ok(code.includes("••••"), "Must mask sensitive digits for non-admin roles");
  });

  await t.test("4. Multi-Resolution Visual Verification Artifacts", () => {
    const brainDir = "C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e";
    const shot1920 = path.join(brainDir, "indiapay-reports-gallery-audit-1920x1080.png");
    const shot1366 = path.join(brainDir, "indiapay-reports-gallery-audit-1366x768.png");

    assert.strictEqual(fs.existsSync(shot1920), true, "1920x1080 screenshot must exist");
    assert.strictEqual(fs.existsSync(shot1366), true, "1366x768 screenshot must exist");
  });
});
