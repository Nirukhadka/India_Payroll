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

describe("Biometric Webhook End-to-End Route Logic & Integration Audit", () => {
  async function setupAuditEnvironment() {
    const t = convexTest(schema, modules);

    const adminUserId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Security Admin",
        email: "admin@corp.in",
      });
    });

    const workspaceAlpha = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", {
        name: "Workspace Alpha",
        ownerId: adminUserId,
        createdAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("members", {
        workspaceId: workspaceAlpha,
        userId: adminUserId,
        role: "admin",
        status: "active",
        createdAt: Date.now(),
      });
    });

    const asAdmin = t.withIdentity({ subject: adminUserId });
    const activeDevice = await asAdmin.mutation(api.biometric.registerDevice, {
      workspaceId: workspaceAlpha,
      name: "Gate Terminal 1",
      deviceSerial: "DEV-ACTIVE-001",
    });

    const deactDevice = await asAdmin.mutation(api.biometric.registerDevice, {
      workspaceId: workspaceAlpha,
      name: "Gate Terminal Deact",
      deviceSerial: "DEV-DEACT-002",
    });
    await asAdmin.mutation(api.biometric.deactivateDevice, {
      workspaceId: workspaceAlpha,
      deviceId: deactDevice.deviceId,
    });

    const empAlphaId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId: workspaceAlpha,
        firstName: "Aarav",
        lastName: "Mehta",
        email: "aarav@corp.in",
        employeeIdNumber: "BADGE-101",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const workspaceBeta = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", {
        name: "Workspace Beta",
        ownerId: adminUserId,
        createdAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("employees", {
        workspaceId: workspaceBeta,
        firstName: "Beta",
        lastName: "User",
        email: "beta@corp.in",
        employeeIdNumber: "BADGE-202",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    return { t, adminUserId, workspaceAlpha, workspaceBeta, activeDevice, deactDevice, empAlphaId };
  }

  // Simulated HTTP Webhook Dispatcher executing exact same pipeline as http.ts
  async function executeWebhook(t: any, req: { headers: Record<string, string>; bodyText: string }) {
    const contentLength = Number(req.headers["content-length"] || 0);
    if (contentLength > 5 * 1024 * 1024) {
      return { status: 413, body: { error: "payload_too_large" } };
    }

    const deviceSerial = req.headers["x-device-serial"];
    const signature = req.headers["x-signature"];
    const timestampHeader = req.headers["x-timestamp"];
    const nonce = req.headers["x-nonce"];
    const workspaceIdHeader = req.headers["x-workspace-id"];

    if (!deviceSerial || !signature || !timestampHeader || !nonce) {
      return { status: 400, body: { error: "missing_headers" } };
    }

    const reqTimestamp = Number(timestampHeader);
    if (isNaN(reqTimestamp)) return { status: 400, body: { error: "invalid_timestamp" } };

    const now = Date.now();
    const reqTimeMs = reqTimestamp < 10000000000 ? reqTimestamp * 1000 : reqTimestamp;
    const timeDiffSeconds = Math.abs(now - reqTimeMs) / 1000;
    if (timeDiffSeconds > 300) {
      return { status: 401, body: { error: "timestamp_expired" } };
    }

    let targetWorkspaceId = workspaceIdHeader;
    let device = null;
    if (targetWorkspaceId) {
      device = await t.query(internal.biometric.getDeviceForAuth, {
        workspaceId: targetWorkspaceId as any,
        deviceSerial,
      });
    } else {
      const matchingDevices = await t.query(internal.biometric.getDevicesBySerial, { deviceSerial });
      if (matchingDevices.length === 1 && matchingDevices[0]) {
        device = await t.query(internal.biometric.getDeviceForAuth, {
          workspaceId: matchingDevices[0].workspaceId,
          deviceSerial,
        });
      }
    }

    if (!device || !device.secret) {
      return { status: 401, body: { error: "device_not_found" } };
    }

    if (device.status !== "active") {
      return { status: 403, body: { error: "device_inactive" } };
    }

    // HMAC Signature Check using Web Crypto
    const rawBody = req.bodyText;
    const signaturePayload = timestampHeader + "." + nonce + "." + rawBody;
    const expectedSignature = crypto.createHmac("sha256", device.secret).update(signaturePayload).digest("hex");

    if (signature.length !== expectedSignature.length) {
      return { status: 401, body: { error: "invalid_signature" } };
    }
    let diff = 0;
    for (let i = 0; i < signature.length; i++) {
      diff |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    if (diff !== 0) {
      return { status: 401, body: { error: "invalid_signature" } };
    }

    // Nonce Claim
    const nonceClaim = await t.mutation(internal.biometric.claimNonce, {
      workspaceId: device.workspaceId,
      deviceSerial,
      nonce,
      timestamp: reqTimeMs,
    });
    if (!nonceClaim.accepted) {
      return { status: 409, body: { error: "replay_detected" } };
    }

    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(rawBody);
    } catch (e) {
      return { status: 400, body: { error: "invalid_json" } };
    }

    if (parsedPayload.type === "heartbeat") {
      await t.mutation(internal.biometric.recordHeartbeat, {
        workspaceId: device.workspaceId,
        deviceSerial,
        timestamp: reqTimeMs,
      });
      return { status: 200, body: { success: true, type: "heartbeat_acknowledged" } };
    }

    const rawPunches = Array.isArray(parsedPayload.punches) ? parsedPayload.punches : [];
    if (rawPunches.length === 0) {
      return { status: 400, body: { error: "empty_payload" } };
    }

    const ingestionResult = await t.mutation(internal.biometric.ingestRawPunches, {
      workspaceId: device.workspaceId,
      deviceId: device._id,
      deviceSerial,
      punches: rawPunches,
    });

    return { status: 200, body: { success: true, ingestion: ingestionResult } };
  }

  function prepareSignedRequest(opts: { secret?: string; serial?: string; timestamp?: string; nonce?: string; workspaceId?: string; bodyObj?: any; rawBodyOverride?: string; tamperBody?: boolean; tamperSig?: boolean; omitHeaders?: boolean; contentLength?: number }) {
    const rawBody = opts.rawBodyOverride !== undefined ? opts.rawBodyOverride : JSON.stringify(opts.bodyObj);
    const ts = opts.timestamp || Date.now().toString();
    const nonce = opts.nonce || crypto.randomUUID();
    const payload = ts + "." + nonce + "." + rawBody;
    let sig = "";
    if (opts.secret) {
      sig = crypto.createHmac("sha256", opts.secret).update(payload).digest("hex");
    }
    if (opts.tamperSig) sig = "0".repeat(64);
    const finalBody = opts.tamperBody ? rawBody + " " : rawBody;
    const headers: Record<string, string> = {};
    if (opts.contentLength !== undefined) headers["content-length"] = opts.contentLength.toString();
    if (!opts.omitHeaders) {
      if (opts.serial) headers["x-device-serial"] = opts.serial;
      if (sig) headers["x-signature"] = sig;
      headers["x-timestamp"] = ts;
      headers["x-nonce"] = nonce;
      if (opts.workspaceId) headers["x-workspace-id"] = opts.workspaceId;
    }
    return { headers, bodyText: finalBody };
  }

  describe("Section A: HTTP Endpoint Integration Audit", () => {
    it("accepts valid authenticated punch submission with HTTP 200", async () => {
      const env = await setupAuditEnvironment();
      const req = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        bodyObj: {
          punches: [{ biometricUserId: "BADGE-101", punchTimestamp: 1711200000000, punchType: "check_in", punchDate: "2024-03-23" }],
        },
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.ingestion.inserted).toBe(1);
    });

    it("accepts valid heartbeat request with HTTP 200", async () => {
      const env = await setupAuditEnvironment();
      const req = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        bodyObj: { type: "heartbeat" },
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(200);
      expect(res.body.type).toBe("heartbeat_acknowledged");
    });

    it("rejects tampered request body with HTTP 401", async () => {
      const env = await setupAuditEnvironment();
      const req = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        bodyObj: { type: "heartbeat" },
        tamperBody: true,
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("invalid_signature");
    });

    it("rejects incorrect signature with HTTP 401", async () => {
      const env = await setupAuditEnvironment();
      const req = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        bodyObj: { type: "heartbeat" },
        tamperSig: true,
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("invalid_signature");
    });

    it("rejects expired and future timestamps with HTTP 401", async () => {
      const env = await setupAuditEnvironment();
      const expReq = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        timestamp: (Date.now() - 350000).toString(),
        bodyObj: { type: "heartbeat" },
      });
      const expRes = await executeWebhook(env.t, expReq);
      expect(expRes.status).toBe(401);
      expect(expRes.body.error).toBe("timestamp_expired");

      const futReq = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        timestamp: (Date.now() + 350000).toString(),
        bodyObj: { type: "heartbeat" },
      });
      const futRes = await executeWebhook(env.t, futReq);
      expect(futRes.status).toBe(401);
      expect(futRes.body.error).toBe("timestamp_expired");
    });

    it("rejects reused nonce with HTTP 409", async () => {
      const env = await setupAuditEnvironment();
      const fixedNonce = "reused-nonce-" + Date.now();
      const req1 = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        nonce: fixedNonce,
        bodyObj: { type: "heartbeat" },
      });
      const res1 = await executeWebhook(env.t, req1);
      expect(res1.status).toBe(200);

      const req2 = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        nonce: fixedNonce,
        bodyObj: { type: "heartbeat" },
      });
      const res2 = await executeWebhook(env.t, req2);
      expect(res2.status).toBe(409);
      expect(res2.body.error).toBe("replay_detected");
    });

    it("rejects unknown device serial with HTTP 401", async () => {
      const env = await setupAuditEnvironment();
      const req = prepareSignedRequest({
        secret: "secret",
        serial: "DEV-UNKNOWN",
        workspaceId: env.workspaceAlpha,
        bodyObj: { type: "heartbeat" },
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("device_not_found");
    });

    it("rejects deactivated device with HTTP 403", async () => {
      const env = await setupAuditEnvironment();
      const req = prepareSignedRequest({
        secret: env.deactDevice.deviceSecret,
        serial: env.deactDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        bodyObj: { type: "heartbeat" },
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("device_inactive");
    });

    it("rejects malformed JSON payload with HTTP 400", async () => {
      const env = await setupAuditEnvironment();
      const req = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        rawBodyOverride: "{ malformed: ",
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("invalid_json");
    });

    it("rejects oversized payload with HTTP 413", async () => {
      const env = await setupAuditEnvironment();
      const req = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        bodyObj: { type: "heartbeat" },
        contentLength: 6 * 1024 * 1024,
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(413);
      expect(res.body.error).toBe("payload_too_large");
    });
  });

  describe("Section B: Concurrency and Idempotency Audit", () => {
    it("handles concurrent identical punch batches safely (atomic idempotency)", async () => {
      const env = await setupAuditEnvironment();
      const fixedTs = 1711200088000;
      const batch = [{ biometricUserId: "BADGE-101", punchTimestamp: fixedTs, punchType: "check_in" as const, punchDate: "2024-03-23" }];
      const promises = Array.from({ length: 4 }, () => {
        const req = prepareSignedRequest({
          secret: env.activeDevice.deviceSecret,
          serial: env.activeDevice.deviceSerial,
          workspaceId: env.workspaceAlpha,
          bodyObj: { punches: batch },
        });
        return executeWebhook(env.t, req);
      });
      const responses = await Promise.all(promises);
      for (const r of responses) expect(r.status).toBe(200);

      const logs = await env.t.run(async (ctx) => {
        return await ctx.db
          .query("rawPunchLogs")
          .withIndex("by_workspace", (q) => q.eq("workspaceId", env.workspaceAlpha))
          .filter((q) => q.and(q.eq(q.field("biometricUserId"), "BADGE-101"), q.eq(q.field("punchTimestamp"), fixedTs)))
          .collect();
      });
      expect(logs.length).toBe(1);
    });

    it("preserves distinct legitimate punches from the same employee across timestamps", async () => {
      const env = await setupAuditEnvironment();
      const punches = [
        { biometricUserId: "BADGE-101", punchTimestamp: 1711200000000, punchType: "check_in" as const, punchDate: "2024-03-23" },
        { biometricUserId: "BADGE-101", punchTimestamp: 1711214400000, punchType: "break_out" as const, punchDate: "2024-03-23" },
        { biometricUserId: "BADGE-101", punchTimestamp: 1711218000000, punchType: "break_in" as const, punchDate: "2024-03-23" },
        { biometricUserId: "BADGE-101", punchTimestamp: 1711232400000, punchType: "check_out" as const, punchDate: "2024-03-23" },
      ];
      const req = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        bodyObj: { punches },
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(200);
      expect(res.body.ingestion.total).toBe(4);
      expect(res.body.ingestion.inserted).toBe(4);
      expect(res.body.ingestion.duplicates).toBe(0);
    });
  });

  describe("Section C: Security and Tenant Isolation Audit", () => {
    it("strictly isolates cross-workspace employee resolution", async () => {
      const env = await setupAuditEnvironment();
      const req = prepareSignedRequest({
        secret: env.activeDevice.deviceSecret,
        serial: env.activeDevice.deviceSerial,
        workspaceId: env.workspaceAlpha,
        bodyObj: { punches: [{ biometricUserId: "BADGE-202", punchTimestamp: 1711200099000, punchType: "check_in", punchDate: "2024-03-23" }] },
      });
      const res = await executeWebhook(env.t, req);
      expect(res.status).toBe(200);
      expect(res.body.ingestion.unmapped).toBe(1);
      expect(res.body.ingestion.results[0].status).toBe("unmapped");
      expect(res.body.ingestion.results[0].employeeId).toBeUndefined();
    });
  });
});