import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Phase 16.2: Complete Account Settings Replication Suite", async (t) => {
  await t.test("1. Layout & Tab Navigation Architecture", () => {
    const layoutPath = "apps/app/src/app/[locale]/(admin)/admin/account-settings/layout.tsx";
    assert.ok(fs.existsSync(layoutPath), "Layout shell must exist");
    const content = fs.readFileSync(layoutPath, "utf8");

    assert.ok(content.includes("Account Settings"), "Header title must be Account Settings");
    assert.ok(content.includes("/admin/account-settings/plan"), "Plan tab link");
    assert.ok(content.includes("/admin/account-settings/invoices"), "Invoices tab link");
    assert.ok(content.includes("/admin/account-settings/payments"), "Payments tab link");
    assert.ok(content.includes("/admin/account-settings/tickets"), "Ticket Management tab link");
    assert.ok(content.includes("/admin/account-settings/features"), "New Features tab link");
  });

  await t.test("2. Plan Page: 3 Pricing Cards & Confirmation Contract", () => {
    const planPath = "apps/app/src/app/[locale]/(admin)/admin/account-settings/plan/page.tsx";
    assert.ok(fs.existsSync(planPath), "Plan page must exist");
    const content = fs.readFileSync(planPath, "utf8");

    // 3 plans
    assert.ok(content.includes("ESSENTIAL"), "Essential plan");
    assert.ok(content.includes("GROWTH"), "Growth plan");
    assert.ok(content.includes("ENTERPRISE"), "Enterprise plan");

    // Prices
    assert.ok(content.includes("₹3,495"), "Essential base price");
    assert.ok(content.includes("₹5,495"), "Growth base price");
    assert.ok(content.includes("₹7,495"), "Enterprise base price");

    // Best Value ribbon
    assert.ok(content.includes("Best Value"), "Growth best value ribbon");

    // Mutation binding
    assert.ok(content.includes("api.accountSettings.requestPlanChange"), "Plan mutation contract");
  });

  await t.test("3. Invoices Page: Table & Accordion Details", () => {
    const invPath = "apps/app/src/app/[locale]/(admin)/admin/account-settings/invoices/page.tsx";
    assert.ok(fs.existsSync(invPath), "Invoices page must exist");
    const content = fs.readFileSync(invPath, "utf8");

    assert.ok(content.includes("Invoice No"), "Column Invoice No");
    assert.ok(content.includes("Billing Period"), "Column Billing Period");
    assert.ok(content.includes("Invoice Amount"), "Column Invoice Amount");
    assert.ok(content.includes("Download"), "Download button");
    assert.ok(content.includes("api.accountSettings.getInvoices"), "Query getInvoices");
  });

  await t.test("4. Payments Page: History & Invoices Settled", () => {
    const pmtPath = "apps/app/src/app/[locale]/(admin)/admin/account-settings/payments/page.tsx";
    assert.ok(fs.existsSync(pmtPath), "Payments page must exist");
    const content = fs.readFileSync(pmtPath, "utf8");

    assert.ok(content.includes("Payment Date"), "Column Payment Date");
    assert.ok(content.includes("Payment Mode"), "Column Payment Mode");
    assert.ok(content.includes("Cheque/DD/Ref No"), "Ref number field");
    assert.ok(content.includes("Invoices Settled"), "Applied invoices section");
    assert.ok(content.includes("api.accountSettings.getPayments"), "Query getPayments");
  });

  await t.test("5. Ticket Management: Columns, Search, Filter & Drawer", () => {
    const tktPath = "apps/app/src/app/[locale]/(admin)/admin/account-settings/tickets/page.tsx";
    assert.ok(fs.existsSync(tktPath), "Tickets page must exist");
    const content = fs.readFileSync(tktPath, "utf8");

    assert.ok(content.includes("Ticket ID"), "Column Ticket ID");
    assert.ok(content.includes("Date of Creation"), "Column Date of Creation");
    assert.ok(content.includes("Last Activity"), "Column Last Activity");
    assert.ok(content.includes("Search ticket subject or ID"), "Search placeholder");
    assert.ok(content.includes("api.accountSettings.getTickets"), "Query getTickets");
    assert.ok(content.includes("api.accountSettings.createTicket"), "Mutation createTicket");
  });

  await t.test("6. New Features: 25 Features Registry & Selection Filter", () => {
    const featPath = "apps/app/src/app/[locale]/(admin)/admin/account-settings/features/page.tsx";
    assert.ok(fs.existsSync(featPath), "Features page must exist");
    const content = fs.readFileSync(featPath, "utf8");

    assert.ok(content.includes("features selected"), "Features count heading");
    assert.ok(content.includes("Show All"), "Filter Show All");
    assert.ok(content.includes("Show Selected"), "Filter Show Selected");
    assert.ok(content.includes("Show Unselected"), "Filter Show Unselected");
    assert.ok(content.includes("api.accountSettings.getAccountFeatures"), "Query getAccountFeatures");
    assert.ok(content.includes("api.accountSettings.toggleAccountFeature"), "Mutation toggleAccountFeature");
  });

  await t.test("7. Backend Schema & Entity Integrity", () => {
    const schemaPath = "packages/backend/convex/schema.ts";
    const schema = fs.readFileSync(schemaPath, "utf8");

    assert.ok(schema.includes("accountSubscriptions: defineTable"), "accountSubscriptions table");
    assert.ok(schema.includes("accountInvoices: defineTable"), "accountInvoices table");
    assert.ok(schema.includes("accountPayments: defineTable"), "accountPayments table");
    assert.ok(schema.includes("accountTickets: defineTable"), "accountTickets table");
    assert.ok(schema.includes("accountFeatures: defineTable"), "accountFeatures table");
  });
});
