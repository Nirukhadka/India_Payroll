/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

const modules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === "function"
    ? (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
    : {
        "./files.ts": () => import("./files"),
        "./orgs.ts": () => import("./orgs"),
        "./schema.ts": () => import("./schema"),
        "./auditLog.ts": () => import("./auditLog"),
        "./audit.ts": () => import("./audit"),
        "./auth.config.ts": () => import("./auth.config"),
        "./auth.ts": () => import("./auth"),
        "./counters.ts": () => import("./counters"),
        "./_generated/api.js": () => import("./_generated/api.js"),
        "./_generated/server.js": () => import("./_generated/server.js"),
      };

describe("Document Center E-Sign & Audit Workflow", () => {
  it("executes e-sign request, verifies permissions, and records immutable audit trail", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    const adminUserId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "HR Admin",
        email: "hr@company.com",
      });
    });

    const empUserId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Anand Verma",
        email: "anand@company.com",
      });
    });

    const ws1 = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", {
        name: "Workspace Alpha",
        ownerId: adminUserId,
        createdAt: now,
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("members", {
        workspaceId: ws1,
        userId: adminUserId,
        role: "admin",
        status: "active",
        createdAt: now,
      });
      await ctx.db.insert("members", {
        workspaceId: ws1,
        userId: empUserId,
        role: "member",
        status: "active",
        createdAt: now,
      });
    });

    // Create a mock document in files using storage.store
    const storageId = await t.run(async (ctx) => {
      return await ctx.storage.store(new Blob(["mock pdf content"], { type: "application/pdf" }));
    });

    const fileId = await t.run(async (ctx) => {
      return await ctx.db.insert("files", {
        workspaceId: ws1,
        userId: adminUserId,
        name: "Employment_Agreement.pdf",
        storageId,
        size: 1048576,
        contentType: "application/pdf",
        eSignStatus: "none",
        createdAt: now,
      });
    });

    // Admin requests e-signature from employee
    const asAdmin = t.withIdentity({ subject: adminUserId });
    const reqResult = await asAdmin.mutation(api.files.requestESignature, {
      workspaceId: ws1,
      fileId,
      signerUserId: empUserId,
      notes: "Please sign the standard employment agreement",
    });
    expect(reqResult.success).toBe(true);

    // Verify document status updated to pending_signature
    const pendingDoc = await t.run(async (ctx) => {
      return await ctx.db.get(fileId);
    });
    expect(pendingDoc?.eSignStatus).toBe("pending_signature");
    expect(pendingDoc?.signerUserId).toBe(empUserId);
    expect(pendingDoc?.auditTrail?.length).toBe(1);

    // Employee signs document
    const asEmployee = t.withIdentity({ subject: empUserId });
    const signResult = await asEmployee.mutation(api.files.signDocument, {
      workspaceId: ws1,
      fileId,
      signatureMethod: "CLICK_WRAP_OTP",
      ipAddress: "192.168.1.50",
    });

    expect(signResult.success).toBe(true);
    expect(signResult.auditHash).toBeDefined();

    // Verify document status updated to signed with timestamp and audit trail
    const signedDoc = await t.run(async (ctx) => {
      return await ctx.db.get(fileId);
    });

    expect(signedDoc?.eSignStatus).toBe("signed");
    expect(signedDoc?.signedAt).toBeDefined();
    expect(signedDoc?.signatureAuditHash).toBe(signResult.auditHash);
    expect(signedDoc?.auditTrail?.length).toBe(2);
    expect(signedDoc?.auditTrail?.[1]?.action).toBe("document_signed");
    expect(signedDoc?.auditTrail?.[1]?.actorName).toBe("Anand Verma");

    // Second signing attempt should be rejected
    await expect(
      asEmployee.mutation(api.files.signDocument, {
        workspaceId: ws1,
        fileId,
      })
    ).rejects.toThrow("Document has already been signed");
  });
});
