/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

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

describe("Biometric Ingestion to Shift Cycle Attendance Integration", () => {
  it("ingests punch pair and automatically calculates present status", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    const adminUserId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: "Admin User",
        email: "admin@corp.in",
      });
    });

    const ws = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", {
        name: "Workspace Attendance Test",
        ownerId: adminUserId,
        createdAt: now,
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: adminUserId,
        role: "admin",
        status: "active",
        createdAt: now,
      });
    });

    // Create employee
    const empId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Ramesh",
        lastName: "Kumar",
        email: "ramesh@corp.in",
        employeeIdNumber: "EMP1001",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
    });

    // Register biometric terminal
    const asAdmin = t.withIdentity({ subject: adminUserId });
    const regResult = await asAdmin.mutation(api.biometric.registerDevice, {
      workspaceId: ws,
      name: "Office Main Gate",
      deviceSerial: "TERM-BIO-999",
    });

    // Ingest check_in (09:00 UTC) and check_out (18:00 UTC) for 2026-11-25
    const shiftDate = "2026-11-25";
    const inTime = new Date(`${shiftDate}T09:00:00.000Z`).getTime();
    const outTime = new Date(`${shiftDate}T18:00:00.000Z`).getTime();

    const ingestResult = await t.run(async (ctx) => {
      return await ctx.db.get(regResult.deviceId);
    });
    expect(ingestResult).toBeDefined();

    // Call ingestRawPunches internal mutation
    const res = await t.mutation(internal.biometric.ingestRawPunches, {
      workspaceId: ws,
      deviceId: regResult.deviceId,
      deviceSerial: "TERM-BIO-999",
      punches: [
        {
          biometricUserId: "EMP1001",
          punchTimestamp: inTime,
          punchType: "check_in",
          punchDate: shiftDate,
        },
        {
          biometricUserId: "EMP1001",
          punchTimestamp: outTime,
          punchType: "check_out",
          punchDate: shiftDate,
        },
      ],
    });

    expect(res.inserted).toBe(2);
    expect(res.duplicates).toBe(0);

    // Verify attendance record was dynamically generated with 'present' status
    const attendanceRecord = await t.run(async (ctx) => {
      return await ctx.db
        .query("attendance")
        .withIndex("by_workspace_employee_date", (q) =>
          q.eq("workspaceId", ws).eq("employeeId", empId).eq("date", shiftDate)
        )
        .first();
    });

    expect(attendanceRecord).toBeDefined();
    expect(attendanceRecord?.status).toBe("present");
    expect(attendanceRecord?.source).toBe("biometric");
    expect(attendanceRecord?.workDurationHours).toBeGreaterThanOrEqual(8);
  });
});
