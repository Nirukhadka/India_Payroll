/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { internal } from "./_generated/api";
import schema from "./schema";

const modules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === "function"
    ? (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
    : {};

describe("IndiaPay Attendance Phase 2 — Step 2.3 Shift Engine & Punch Pairing Tests", () => {
  async function createWorkspaceFixture(t: ReturnType<typeof convexTest>, name: string) {
    const ownerId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        name: name + " Owner",
        email: `owner-${Date.now()}-${Math.random()}@acme.in`,
      });
    });

    const workspaceId = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", {
        name,
        ownerId,
        createdAt: Date.now(),
      });
    });

    return { ownerId, workspaceId };
  }

  it("TC-2.3-01: Regular day shift (09:00 - 18:00) with on-time punches and break deduction", async () => {
    const t = convexTest(schema, modules);
    const { ownerId, workspaceId } = await createWorkspaceFixture(t, "Acme India Corp");

    const employeeId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Rohan",
        lastName: "Verma",
        employeeIdNumber: "EMP-201",
        email: "rohan@acme.in",
        department: "Engineering",
        designation: "Developer",
        joiningDate: "2024-01-01",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const shiftId = await t.run(async (ctx) => {
      return await ctx.db.insert("shifts", {
        workspaceId,
        name: "General Day Shift",
        code: "GEN-01",
        startTime: "09:00",
        endTime: "18:00",
        isOvernight: false,
        gracePeriodMinutes: 15,
        halfDayThresholdHours: 4,
        fullDayThresholdHours: 8,
        breakDeductionRule: "whichever_is_greater",
        fixedBreakMinutes: 60,
        isDefault: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("shiftAssignments", {
        workspaceId,
        employeeId,
        shiftId,
        effectiveFrom: "2026-11-01", createdById: ownerId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const shiftDate = "2026-11-03"; // Tuesday
    const tCheckIn = new Date("2026-11-03T09:05:00.000Z").getTime();
    const tBreakOut = new Date("2026-11-03T13:00:00.000Z").getTime();
    const tBreakIn = new Date("2026-11-03T13:45:00.000Z").getTime();
    const tCheckOut = new Date("2026-11-03T18:05:00.000Z").getTime();

    await t.run(async (ctx) => {
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-201",
        punchTimestamp: tCheckIn,
        punchDate: shiftDate,
        punchType: "check_in",
        idempotencyKey: "k1",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-201",
        punchTimestamp: tBreakOut,
        punchDate: shiftDate,
        punchType: "break_out",
        idempotencyKey: "k2",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-201",
        punchTimestamp: tBreakIn,
        punchDate: shiftDate,
        punchType: "break_in",
        idempotencyKey: "k3",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-201",
        punchTimestamp: tCheckOut,
        punchDate: shiftDate,
        punchType: "check_out",
        idempotencyKey: "k4",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
    });

    const result = await t.mutation(internal.attendance.processPunchesForShiftCycle, {
      workspaceId,
      employeeId,
      shiftDate,
    });

    expect(result.status).toBe("present");
    expect(result.completionStatus).toBe("complete");
    expect(result.breakDurationMinutes).toBe(60);
    expect(result.totalWorkMinutes).toBe(480);
    expect(result.workDurationHours).toBe(8);
    expect(result.lateInMinutes).toBe(0);
    expect(result.earlyOutMinutes).toBe(0);
  });

  it("TC-2.3-02: Overnight shift (21:00 - 06:00) cross-day attribution to shift start date", async () => {
    const t = convexTest(schema, modules);
    const { ownerId, workspaceId } = await createWorkspaceFixture(t, "Acme Overnight");

    const employeeId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Sneha",
        lastName: "Patil",
        employeeIdNumber: "EMP-202",
        email: "sneha@acme.in",
        department: "Operations",
        designation: "Supervisor",
        joiningDate: "2024-01-01",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const shiftId = await t.run(async (ctx) => {
      return await ctx.db.insert("shifts", {
        workspaceId,
        name: "Night Production Shift",
        code: "NIGHT-01",
        startTime: "21:00",
        endTime: "06:00",
        isOvernight: true,
        gracePeriodMinutes: 10,
        halfDayThresholdHours: 4,
        fullDayThresholdHours: 8,
        breakDeductionRule: "whichever_is_greater",
        fixedBreakMinutes: 60,
        isDefault: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("shiftAssignments", {
        workspaceId,
        employeeId,
        shiftId,
        effectiveFrom: "2026-11-01", createdById: ownerId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const shiftDate = "2026-11-05";
    const tCheckIn = new Date("2026-11-05T21:00:00.000Z").getTime();
    const tCheckOut = new Date("2026-11-06T06:00:00.000Z").getTime();

    await t.run(async (ctx) => {
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-202",
        punchTimestamp: tCheckIn,
        punchDate: "2026-11-05",
        punchType: "check_in",
        idempotencyKey: "k-night-1",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-202",
        punchTimestamp: tCheckOut,
        punchDate: "2026-11-06",
        punchType: "check_out",
        idempotencyKey: "k-night-2",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
    });

    const result = await t.mutation(internal.attendance.processPunchesForShiftCycle, {
      workspaceId,
      employeeId,
      shiftDate,
    });

    expect(result.status).toBe("present");
    expect(result.completionStatus).toBe("complete");
    expect(result.totalWorkMinutes).toBe(480);
    expect(result.workDurationHours).toBe(8);
    expect(result.lateInMinutes).toBe(0);
    expect(result.earlyOutMinutes).toBe(0);

    const attRecord = await t.run(async (ctx) => {
      return await ctx.db
        .query("attendance")
        .withIndex("by_workspace_employee_date", (q) =>
          q.eq("workspaceId", workspaceId).eq("employeeId", employeeId).eq("date", "2026-11-05"),
        )
        .first();
    });
    expect(attRecord).toBeDefined();
    expect(attRecord?.date).toBe("2026-11-05");
    expect(attRecord?.status).toBe("present");
  });

  it("TC-2.3-03: Punctuality tracking: late arrival exceeding grace and early departure", async () => {
    const t = convexTest(schema, modules);
    const { ownerId, workspaceId } = await createWorkspaceFixture(t, "Acme Punctuality");

    const employeeId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Amit",
        lastName: "Sharma",
        employeeIdNumber: "EMP-203",
        email: "amit@acme.in",
        department: "Sales",
        designation: "Executive",
        joiningDate: "2024-01-01",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const shiftDate = "2026-11-10";
    const tCheckIn = new Date("2026-11-10T09:35:00.000Z").getTime();
    const tCheckOut = new Date("2026-11-10T17:30:00.000Z").getTime();

    await t.run(async (ctx) => {
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-203",
        punchTimestamp: tCheckIn,
        punchDate: shiftDate,
        punchType: "check_in",
        idempotencyKey: "p-late",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-203",
        punchTimestamp: tCheckOut,
        punchDate: shiftDate,
        punchType: "check_out",
        idempotencyKey: "p-early",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
    });

    const result = await t.mutation(internal.attendance.processPunchesForShiftCycle, {
      workspaceId,
      employeeId,
      shiftDate,
    });

    expect(result.lateInMinutes).toBe(35);
    expect(result.earlyOutMinutes).toBe(30);
    expect(result.status).toBe("half_day");
  });

  it("TC-2.3-04: Missing punches and single punch explicit classification", async () => {
    const t = convexTest(schema, modules);
    const { ownerId, workspaceId } = await createWorkspaceFixture(t, "Acme Missing");

    const employeeId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Vikas",
        lastName: "Kumar",
        employeeIdNumber: "EMP-204",
        email: "vikas@acme.in",
        department: "Logistics",
        designation: "Coordinator",
        joiningDate: "2024-01-01",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const shiftDate = "2026-11-11";
    const tCheckIn = new Date("2026-11-11T09:00:00.000Z").getTime();
    await t.run(async (ctx) => {
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-204",
        punchTimestamp: tCheckIn,
        punchDate: shiftDate,
        punchType: "check_in",
        idempotencyKey: "p-single",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
    });

    const result = await t.mutation(internal.attendance.processPunchesForShiftCycle, {
      workspaceId,
      employeeId,
      shiftDate,
    });

    expect(result.completionStatus).toBe("single_punch");
    expect(result.totalWorkMinutes).toBe(0);
    expect(result.status).toBe("absent");
  });

  it("TC-2.3-05: Rapid punch debouncing (<60s) discards duplicate scans", async () => {
    const t = convexTest(schema, modules);
    const { ownerId, workspaceId } = await createWorkspaceFixture(t, "Acme Debounce");

    const employeeId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Pooja",
        lastName: "Nair",
        employeeIdNumber: "EMP-205",
        email: "pooja@acme.in",
        department: "HR",
        designation: "Specialist",
        joiningDate: "2024-01-01",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const shiftDate = "2026-11-12";
    const tCheckIn1 = new Date("2026-11-12T09:00:00.000Z").getTime();
    const tCheckIn2 = new Date("2026-11-12T09:00:15.000Z").getTime();
    const tCheckOut = new Date("2026-11-12T18:00:00.000Z").getTime();

    await t.run(async (ctx) => {
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-205",
        punchTimestamp: tCheckIn1,
        punchDate: shiftDate,
        punchType: "check_in",
        idempotencyKey: "p1",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-205",
        punchTimestamp: tCheckIn2,
        punchDate: shiftDate,
        punchType: "check_in",
        idempotencyKey: "p2",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
      await ctx.db.insert("rawPunchLogs", {
        workspaceId,
        employeeId,
        deviceSerial: "BIO-001",
        biometricUserId: "B-205",
        punchTimestamp: tCheckOut,
        punchDate: shiftDate,
        punchType: "check_out",
        idempotencyKey: "p3",
        processedStatus: "pending",
        createdAt: Date.now(),
      });
    });

    const result = await t.mutation(internal.attendance.processPunchesForShiftCycle, {
      workspaceId,
      employeeId,
      shiftDate,
    });

    expect(result.status).toBe("present");
    expect(result.completionStatus).toBe("complete");
    expect(result.totalWorkMinutes).toBe(480);
    expect(result.workDurationHours).toBe(8);
  });

  it("TC-2.3-06: Preserves existing regularized attendance records", async () => {
    const t = convexTest(schema, modules);
    const { ownerId, workspaceId } = await createWorkspaceFixture(t, "Acme Reg");

    const employeeId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Manoj",
        lastName: "Tiwari",
        employeeIdNumber: "EMP-206",
        email: "manoj@acme.in",
        department: "Finance",
        designation: "Analyst",
        joiningDate: "2024-01-01",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const shiftDate = "2026-11-13";
    await t.run(async (ctx) => {
      await ctx.db.insert("attendance", {
        workspaceId,
        employeeId,
        date: shiftDate,
        status: "present",
        source: "regularized",
        checkInTime: "09:00",
        checkOutTime: "18:00",
        workDurationHours: 8,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const result = await t.mutation(internal.attendance.processPunchesForShiftCycle, {
      workspaceId,
      employeeId,
      shiftDate,
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("Attendance record is regularized");

    const record = await t.run(async (ctx) => {
      return await ctx.db
        .query("attendance")
        .withIndex("by_workspace_employee_date", (q) =>
          q.eq("workspaceId", workspaceId).eq("employeeId", employeeId).eq("date", shiftDate),
        )
        .first();
    });
    expect(record?.source).toBe("regularized");
  });

  it("TC-2.3-07: Cross-tenant isolation blocks foreign employee punch processing", async () => {
    const t = convexTest(schema, modules);
    const { workspaceId: wsA } = await createWorkspaceFixture(t, "Tenant Alpha");
    const { workspaceId: wsB } = await createWorkspaceFixture(t, "Tenant Beta");

    const empAlpha = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId: wsA,
        firstName: "Alpha",
        lastName: "Worker",
        employeeIdNumber: "EMP-A01",
        email: "a@alpha.in",
        department: "General",
        designation: "Associate",
        joiningDate: "2024-01-01",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    await expect(
      t.mutation(internal.attendance.processPunchesForShiftCycle, {
        workspaceId: wsB,
        employeeId: empAlpha,
        shiftDate: "2026-11-14",
      }),
    ).rejects.toThrow("Employee not found or tenant mismatch");
  });
});