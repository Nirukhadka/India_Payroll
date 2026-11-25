import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Phase 16.1: Complete My Profile & Login History Test Suite", async (t) => {
  await t.test("1. Route & Breadcrumb Integrity", () => {
    const pagePath = "apps/app/src/app/[locale]/(admin)/admin/settings/profile/page.tsx";
    assert.ok(fs.existsSync(pagePath), "My Profile page must exist at canonical path");
    const content = fs.readFileSync(pagePath, "utf8");

    // Breadcrumb: Home > My profile
    assert.ok(content.includes("Home"), "Must have Home breadcrumb root");
    assert.ok(content.includes("My profile"), "Must match greytHR 'My profile' breadcrumb casing");
    assert.ok(content.includes("&gt;"), "Must include separator between breadcrumb levels");

    // Tabs: Profile and Login History
    assert.ok(content.includes('role="tab"'), "Must have accessible role=tab elements");
    assert.ok(content.includes("Profile"), "Must have Profile tab");
    assert.ok(content.includes("Login History"), "Must have Login History tab");
  });

  await t.test("2. Profile Tab: Account Details & Identity Loading", () => {
    const pagePath = "apps/app/src/app/[locale]/(admin)/admin/settings/profile/page.tsx";
    const content = fs.readFileSync(pagePath, "utf8");

    assert.ok(content.includes("Account Details"), "Must have Account Details card header");
    assert.ok(content.includes("api.users.getUser"), "Must load dynamic user identity from api.users.getUser");
    assert.ok(content.includes("api.employees.getMyProfile"), "Must load employee profile context");

    // Field displays
    assert.ok(content.includes("Name"), "Must display Name field");
    assert.ok(content.includes("Email Address"), "Must display Email Address field");
    assert.ok(content.includes("Timezone"), "Must display Timezone field");
    assert.ok(content.includes("Biography"), "Must display Biography field");

    // Action buttons
    assert.ok(content.includes("Change Password"), "Must include Change Password button");
    assert.ok(content.includes("Edit Info"), "Must include Edit Info button");
    assert.ok(content.includes("Upload"), "Must include Upload photo button");
    assert.ok(content.includes("Accepts .jpg, .jpeg, .png files"), "Must specify accepted image file formats");
  });

  await t.test("3. Profile Modals & Mutation Contracts", () => {
    const editModalPath = "apps/app/src/app/[locale]/(admin)/admin/settings/profile/edit-info-modal.tsx";
    assert.ok(fs.existsSync(editModalPath), "Edit Info modal component must exist");
    const editContent = fs.readFileSync(editModalPath, "utf8");

    assert.ok(editContent.includes("api.users.updateProfileInfo"), "Must mutate via api.users.updateProfileInfo");
    assert.ok(editContent.includes("name.trim()"), "Must validate non-empty name");
    assert.ok(editContent.includes("@"), "Must validate email format");

    const pwModalPath = "apps/app/src/app/[locale]/(admin)/admin/settings/profile/change-password-modal.tsx";
    assert.ok(fs.existsSync(pwModalPath), "Change Password modal component must exist");
    const pwContent = fs.readFileSync(pwModalPath, "utf8");

    assert.ok(pwContent.includes("api.users.changeUserPassword"), "Must mutate via api.users.changeUserPassword");
    assert.ok(pwContent.includes("newPassword !== confirmPassword"), "Must enforce password match check");
    assert.ok(pwContent.includes("newPassword.length < 8"), "Must validate min 8 char complexity");
  });

  await t.test("4. Login History: Summary Cards & Real Event Calculations", () => {
    const historyTabPath = "apps/app/src/app/[locale]/(admin)/admin/settings/profile/login-history-tab.tsx";
    assert.ok(fs.existsSync(historyTabPath), "Login History tab component must exist");
    const content = fs.readFileSync(historyTabPath, "utf8");

    // 3 Summary Cards
    assert.ok(content.includes("Last Login Date"), "Card 1: Last Login Date");
    assert.ok(content.includes("Last Login Failure Date"), "Card 2: Last Login Failure Date");
    assert.ok(content.includes("Password Changed Date"), "Card 3: Password Changed Date");

    // Query binding
    assert.ok(content.includes("api.users.getLoginHistorySummary"), "Must query real security summary");
    assert.ok(content.includes("api.users.getLoginHistoryList"), "Must query actual security event records");

    // Controls
    assert.ok(content.includes("Search by employee name, no. or email"), "Must have placeholder matching greytHR");
    assert.ok(content.includes('aria-label="columns"'), "Must have column settings toggle");
    assert.ok(content.includes('aria-label="filter"'), "Must have filter toggle");
    assert.ok(content.includes("Items per page"), "Must have items per page pagination");
  });

  await t.test("5. Backend Schema & Security Enforcement", () => {
    const schemaPath = "packages/backend/convex/schema.ts";
    const schemaContent = fs.readFileSync(schemaPath, "utf8");

    // Check loginHistory table definition
    assert.ok(schemaContent.includes("loginHistory: defineTable"), "loginHistory table must be defined");
    assert.ok(schemaContent.includes('eventType: v.union'), "Must categorize event types");
    assert.ok(schemaContent.includes('"login_success"'), "Must record login_success events");
    assert.ok(schemaContent.includes('"login_failure"'), "Must record login_failure events");
    assert.ok(schemaContent.includes('"password_changed"'), "Must record password_changed events");
    assert.ok(schemaContent.includes('ipAddress: v.string()'), "Must track IP address");

    // Users mutations in users.ts
    const usersPath = "packages/backend/convex/users.ts";
    const usersContent = fs.readFileSync(usersPath, "utf8");
    assert.ok(usersContent.includes("updateProfileInfo"), "Must export updateProfileInfo mutation");
    assert.ok(usersContent.includes("changeUserPassword"), "Must export changeUserPassword mutation");
    assert.ok(usersContent.includes("getLoginHistorySummary"), "Must export getLoginHistorySummary query");
    assert.ok(usersContent.includes("getLoginHistoryList"), "Must export getLoginHistoryList query");
    assert.ok(usersContent.includes("getAuthUserId(ctx)"), "Must enforce strict server-side auth identity");
  });
});
