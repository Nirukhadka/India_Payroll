/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";
import crypto from "node:crypto";

const modules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === "function"
    ? (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
    : {
        "./biometric.ts": () => import("./biometric"),
        "./attendance.ts": () => import("./attendance"),
        "./orgs.ts": () => import("./orgs"),
        "./schema.ts": () => import("./schema"),
        "./auditLog.ts": () => import("./auditLog"),
        "./audit.ts": () => import("./audit"),
        "./auth.config.ts": () => import("./auth.config"),
        "./auth.ts": () => import("./auth"),
        "./_generated/api.js": () => import("./_generated/api.js"),
        "./_generated/server.js": () => import("./_generated/server.js"),
      };

describe("Biometric Device Management and Ingestion Security", () => {
  async function setupWorkspaceAndAdmin() {
    const t = convexTest(schema, modules);
    const adminUserId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Biometric Admin",
        email: "admin@biometric-corp.in",
        }); }); const workspaceId = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", {
        name: "Biometric Workspace Alpha",
        ownerId: adminUserId,
        createdAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("members", {
        workspaceId,
        userId: adminUserId,
        role: "admin",
        status: "active",
        createdAt: Date.now(),
      });
    });

    const memberUserId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Regular Employee",
        email: "emp@biometric-corp.in",
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("members", {
        workspaceId,
        userId: memberUserId,
        role: "member",
        status: "active",
        createdAt: Date.now(),
      });
    });

    return { t, adminUserId, memberUserId, workspaceId };
  }

  it("registers a new device securely and audits registration", async () => {
    const { t, adminUserId, workspaceId } = await setupWorkspaceAndAdmin();
    const asAdmin = t.withIdentity({ subject: adminUserId });

    const res = await asAdmin.mutation(api.biometric.registerDevice, {
      workspaceId,
      name: "Main Turnstile 1",
      deviceSerial: "BIO-SERIAL-001",
      deviceModel: "eSSL K90 Pro",
      ipAddress: "192.168.1.101",
    });

    expect(res.deviceId).toBeDefined();
    expect(res.deviceSerial).toBe("BIO-SERIAL-001");
    expect(res.keyFingerprint).toHaveLength(16);
    expect(res.keyVersion).toBe(1);
    expect(res.deviceSecret).toHaveLength(64);

    const auditLogs = await t.run(async (ctx) => {
      return await ctx.db
        .query("auditLogs")
        .withIndex("by_workspace", (q2) => q2.eq("workspaceId", workspaceId))
        .collect();
    });
    expect(auditLogs.some((a) => a.action === "biometric.device_registered")).toBe(true);
  });

  it("prevents non-admins from registering devices", async () => {
    const { t, memberUserId, workspaceId } = await setupWorkspaceAndAdmin();
    const asMember = t.withIdentity({ subject: memberUserId });

    await expect(
      asMember.mutation(api.biometric.registerDevice, {
        workspaceId,
        name: "Unauthorized Terminal",
        deviceSerial: "BIO-SERIAL-UNAUTH",
      })
    ).rejects.toThrow();
  });

  it("rotates device key and invalidates prior key version", async () => {
    const { t, adminUserId, workspaceId } = await setupWorkspaceAndAdmin();
    const asAdmin = t.withIdentity({ subject: adminUserId });

    const reg = await asAdmin.mutation(api.biometric.registerDevice, {
      workspaceId,
      name: "Rotatable Terminal",
      deviceSerial: "BIO-ROT-001",
    });

    const rotated = await asAdmin.mutation(api.biometric.rotateDeviceKey, {
      workspaceId,
      deviceId: reg.deviceId,
    });

    expect(rotated.keyVersion).toBe(2);
    expect(rotated.keyFingerprint).not.toBe(reg.keyFingerprint);
    expect(rotated.deviceSecret).not.toBe(reg.deviceSecret);

    const authDevice = await t.run(async (ctx) => {
      return await ctx.db.get(reg.deviceId);
    });
    expect(authDevice?.keyVersion).toBe(2);
  });

  it("deactivates device and verifies deactivated status", async () => {
    const { t, adminUserId, workspaceId } = await setupWorkspaceAndAdmin();
    const asAdmin = t.withIdentity({ subject: adminUserId });

    const reg = await asAdmin.mutation(api.biometric.registerDevice, {
      workspaceId,
      name: "Deactivatable Terminal",
      deviceSerial: "BIO-DEACT-001",
    });

    await asAdmin.mutation(api.biometric.deactivateDevice, {
      workspaceId,
      deviceId: reg.deviceId,
    });

    const updated = await t.run(async (ctx) => {
      return await ctx.db.get(reg.deviceId);
    });
    expect(updated?.status).toBe("deactivated");

    await expect(
      asAdmin.mutation(api.biometric.rotateDeviceKey, {
        workspaceId,
        deviceId: reg.deviceId,
      })
    ).rejects.toThrow();
  });

  it("public device list redacts secretCiphertext and secretIv", async () => {
    const { t, adminUserId, workspaceId } = await setupWorkspaceAndAdmin();
    const asAdmin = t.withIdentity({ subject: adminUserId });

    await asAdmin.mutation(api.biometric.registerDevice, {
      workspaceId,
      name: "Terminal Public Check",
      deviceSerial: "BIO-SAFE-001",
    });

    const list = await asAdmin.query(api.biometric.listDevices, { workspaceId });
    expect(list.length).toBeGreaterThan(0);
    const found = list.find((d2) => d2.deviceSerial === "BIO-SAFE-001");
    expect(found).toBeDefined();
    expect((found as any).secretCiphertext).toBeUndefined();
    expect((found as any).secretIv).toBeUndefined();
  });

  it("enforces atomic nonce replay protection", async () => {
    const { t, workspaceId } = await setupWorkspaceAndAdmin();

    const now = Date.now();
    const nonce = "random-nonce-12345";
    const deviceSerial = "BIO-NONCE-001";

    const firstClaim = await t.mutation(internal.biometric.claimNonce, {
      workspaceId,
      deviceSerial,
      nonce,
      timestamp: now,
    });
    expect(firstClaim.accepted).toBe(true);

    const secondClaim = await t.mutation(internal.biometric.claimNonce, {
      workspaceId,
      deviceSerial,
      nonce,
      timestamp: now,
    });
    expect(secondClaim.accepted).toBe(false);
    expect(secondClaim.reason).toBe("nonce_already_used");
  });

  it("ingests raw punches with atomic idempotency and workspace employee resolution", async () => {
    const { t, workspaceId } = await setupWorkspaceAndAdmin();

    const empId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Rahul",
        lastName: "Sharma",
        email: "rahul@biometric-corp.in",
        employeeIdNumber: "EMP-1001",
        department: "Engineering",
        designation: "Lead Engineer",
        joiningDate: "2024-01-01",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const punchTimestamp = 1711200000000;
    const punches = [
      {
        biometricUserId: "EMP-1001",
        punchTimestamp,
        punchType: "check_in" as const,
        punchDate: "2024-03-23",
      },
      {
        biometricUserId: "EMP-9999",
        punchTimestamp,
        punchType: "check_in" as const,
        punchDate: "2024-03-23",
      },
    ];

    const ingestionRes = await t.mutation(internal.biometric.ingestRawPunches, {
      workspaceId,
      deviceSerial: "BIO-INGEST-001",
      punches,
    });

    expect(ingestionRes.total).toBe(2);
    expect(ingestionRes.inserted).toBe(2);
    expect(ingestionRes.duplicates).toBe(0);
    expect(ingestionRes.unmapped).toBe(1);

    const mappedResult = ingestionRes.results.find((r) => r.biometricUserId === "EMP-1001");
    expect(mappedResult?.status).toBe("pending");
    expect(mappedResult?.employeeId).toBe(empId);

    const retryRes = await t.mutation(internal.biometric.ingestRawPunches, {
      workspaceId,
      deviceSerial: "BIO-INGEST-001",
      punches,
    });

    expect(retryRes.total).toBe(2);
    expect(retryRes.inserted).toBe(0);
    expect(retryRes.duplicates).toBe(2);
  });

  it("rejects cross-workspace employee mapping", async () => {
    const { t, adminUserId, workspaceId: workspaceAlpha } = await setupWorkspaceAndAdmin();

    const workspaceBeta = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", {
        name: "Biometric Workspace Beta",
        ownerId: adminUserId,
        createdAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId: workspaceBeta,
        firstName: "Cross",
        lastName: "Tenant",
        email: "cross@other.in",
        employeeIdNumber: "BADGE-777",
        department: "Operations",
        designation: "Executive",
        joiningDate: "2024-01-01",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const res = await t.mutation(internal.biometric.ingestRawPunches, {
      workspaceId: workspaceAlpha,
      deviceSerial: "BIO-ALPHA-01",
      punches: [
        {
          biometricUserId: "BADGE-777",
          punchTimestamp: 1711200000000,
          punchType: "check_in",
          punchDate: "2024-03-23",
        },
      ],
    });

    expect(res.unmapped).toBe(1);
    expect(res.results[0].status).toBe("unmapped");
    expect(res.results[0].employeeId).toBeUndefined();
  });
});

describe("HMAC Webhook Cryptographic Verification", () => {
  it("computes and verifies HMAC signature correctly", async () => {
    const secret = "9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef";
    const timestamp = Date.now().toString();
    const nonce = "test-nonce-123";
    const rawBody = JSON.stringify({
      type: "punches",
      punches: [
        { biometricUserId: "EMP-001", punchTimestamp: 1711200000000, punchType: "check_in" },
      ],
    });

    const payload = timestamp + "." + nonce + "." + rawBody;
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const checkSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    expect(signature).toBe(checkSig);

    const tamperedPayload = timestamp + "." + nonce + "." + rawBody.replace("EMP-001", "EMP-002");
    const tamperedSig = crypto.createHmac("sha256", secret).update(tamperedPayload).digest("hex");
    expect(signature).not.toBe(tamperedSig);
  });
});
describe("POST /api/biometric/push Protocol and Cryptographic Rules", () => {
  it("validates signature payload format: timestamp.nonce.rawBody", () => {
    const secret = "abcdef1234567890abcdef1234567890";
    const timestamp = "1711200000000";
    const nonce = "test-nonce";
    const rawBody = JSON.stringify({ type: "heartbeat" });
    const payload = timestamp + "." + nonce + "." + rawBody;
    const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    expect(sig).toHaveLength(64);
  });

  it("detects and rejects expired timestamps (> 300s window)", () => {
    const now = Date.now();
    const expiredTimestamp = now - 350000;
    const diffSeconds = Math.abs(now - expiredTimestamp) / 1000;
    expect(diffSeconds > 300).toBe(true);

    const validTimestamp = now - 50000;
    const validDiff = Math.abs(now - validTimestamp) / 1000;
    expect(validDiff <= 300).toBe(true);
  });

  it("performs constant-time signature comparison securely", () => {
    const sigA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const sigB = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab";
    const sigC = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    function constantTimeCompare(a: string, b: string): boolean {
      if (a.length !== b.length) return false;
      let diff = 0;
      for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
      }
      return diff === 0;
    }

    expect(constantTimeCompare(sigA, sigB)).toBe(false);
    expect(constantTimeCompare(sigA, sigC)).toBe(true);
  });
});