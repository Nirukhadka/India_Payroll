import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireMember, requireRole } from "./orgs";
import { audit } from "./auditLog";

const ATTENDANCE_STATUS = v.union(
  v.literal("present"),
  v.literal("absent"),
  v.literal("half_day"),
  v.literal("paid_leave"),
  v.literal("unpaid_leave")
);

// List attendance records by workspace and date range or employee
export const list = query({
  args: {
    workspaceId: v.id("workspaces"),
    startDate: v.optional(v.string()), // "YYYY-MM-DD"
    endDate: v.optional(v.string()),   // "YYYY-MM-DD"
    employeeId: v.optional(v.id("employees")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    const m = await requireMember(ctx, userId, args.workspaceId);

    if (m.role === "member") {
      const me = await ctx.db
        .query("employees")
        .withIndex("by_workspace_user", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("userId", userId)
        )
        .first();
      if (!me) return [];
      if (args.employeeId && args.employeeId !== me._id) {
        throw new ConvexError("Forbidden: You cannot view another employee's attendance records");
      }
      const records = await ctx.db
        .query("attendance")
        .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
        .order("desc")
        .collect();
      return records.filter((r) => {
        if (args.startDate && r.date < args.startDate) return false;
        if (args.endDate && r.date > args.endDate) return false;
        return true;
      });
    }

    if (args.employeeId) {
      const records = await ctx.db
        .query("attendance")
        .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId!))
        .order("desc")
        .collect();

      return records.filter((r) => {
        if (args.startDate && r.date < args.startDate) return false;
        if (args.endDate && r.date > args.endDate) return false;
        return true;
      });
    }

    const records = await ctx.db
      .query("attendance")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();

    return records.filter((r) => {
      if (args.startDate && r.date < args.startDate) return false;
      if (args.endDate && r.date > args.endDate) return false;
      return true;
    });
  },
});

// Summary for a date range (Restricted to HR / Admin / Owner)
export const summary = query({
  args: {
    workspaceId: v.id("workspaces"),
    startDate: v.string(), // "YYYY-MM-DD"
    endDate: v.string(),   // "YYYY-MM-DD"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const records = await ctx.db
      .query("attendance")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const filtered = records.filter(
      (r) => r.date >= args.startDate && r.date <= args.endDate
    );

    const stats = {
      totalRecords: filtered.length,
      present: 0,
      absent: 0,
      halfDay: 0,
      paidLeave: 0,
      unpaidLeave: 0,
    };

    for (const r of filtered) {
      if (r.status === "present") stats.present++;
      else if (r.status === "absent") stats.absent++;
      else if (r.status === "half_day") stats.halfDay++;
      else if (r.status === "paid_leave") stats.paidLeave++;
      else if (r.status === "unpaid_leave") stats.unpaidLeave++;
    }

    return stats;
  },
});

// Mark/Update attendance record (Single day per employee)
export const mark = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    date: v.string(), // "YYYY-MM-DD"
    status: ATTENDANCE_STATUS,
    checkInTime: v.optional(v.string()),
    checkOutTime: v.optional(v.string()),
    remarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Employee not found in workspace");
    }

    // Check existing
    const existing = await ctx.db
      .query("attendance")
      .withIndex("by_workspace_employee_date", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("employeeId", args.employeeId).eq("date", args.date)
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        checkInTime: args.checkInTime,
        checkOutTime: args.checkOutTime,
        remarks: args.remarks,
        updatedAt: now,
      });
      await audit(ctx, args.workspaceId, userId, "attendance.update", {
        attendanceId: existing._id,
        employeeId: args.employeeId,
        date: args.date,
        status: args.status,
      });
      return existing._id;
    }

    const attendanceId = await ctx.db.insert("attendance", {
      workspaceId: args.workspaceId,
      employeeId: args.employeeId,
      date: args.date,
      status: args.status,
      checkInTime: args.checkInTime,
      checkOutTime: args.checkOutTime,
      remarks: args.remarks,
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "attendance.create", {
      attendanceId,
      employeeId: args.employeeId,
      date: args.date,
      status: args.status,
    });

    return attendanceId;
  },
});

export const getMyAttendance = query({
  args: {
    workspaceId: v.id("workspaces"),
    periodMonth: v.string(), // "YYYY-MM"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const me = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .first();

    if (!me) return [];

    const startDate = `${args.periodMonth}-01`;
    const endDate = `${args.periodMonth}-31`;

    const records = await ctx.db
      .query("attendance")
      .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("workspaceId"), args.workspaceId),
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .collect();

    return records.sort((a, b) => a.date.localeCompare(b.date));
  },
});

// ── Attendance Regularization Workflows ───────────────────────────────────────

export const submitRegularization = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    date: v.string(), // "YYYY-MM-DD"
    requestedStatus: ATTENDANCE_STATUS,
    checkInTime: v.optional(v.string()), // "HH:MM"
    checkOutTime: v.optional(v.string()), // "HH:MM"
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const me = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();

    if (!me) {
      throw new ConvexError("No employee profile linked to your account.");
    }

    if (!args.reason.trim()) {
      throw new ConvexError("Please provide a valid reason for the regularization request.");
    }

    // Check for existing pending request for this date
    const existing = await ctx.db
      .query("attendanceRegularizations")
      .withIndex("by_employee_date", (q) =>
        q.eq("employeeId", me._id).eq("date", args.date),
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (existing) {
      throw new ConvexError(
        `A pending attendance regularization request already exists for ${args.date}.`,
      );
    }

    const now = Date.now();
    const requestId = await ctx.db.insert("attendanceRegularizations", {
      workspaceId: args.workspaceId,
      employeeId: me._id,
      date: args.date,
      requestedStatus: args.requestedStatus,
      checkInTime: args.checkInTime,
      checkOutTime: args.checkOutTime,
      reason: args.reason.trim(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "attendance.regularize_request", {
      requestId,
      date: args.date,
      requestedStatus: args.requestedStatus,
    });

    return requestId;
  },
});

export const listMyRegularizations = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const me = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();

    if (!me) return [];

    return await ctx.db
      .query("attendanceRegularizations")
      .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .order("desc")
      .collect();
  },
});

export const cancelMyRegularization = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    requestId: v.id("attendanceRegularizations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const me = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();

    if (!me) throw new ConvexError("Employee profile not linked.");

    const req = await ctx.db.get(args.requestId);
    if (!req || req.workspaceId !== args.workspaceId || req.employeeId !== me._id) {
      throw new ConvexError("Regularization request not found.");
    }

    if (req.status !== "pending") {
      throw new ConvexError(`Cannot cancel a request that is already ${req.status}.`);
    }

    await ctx.db.patch(args.requestId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    await audit(ctx, args.workspaceId, userId, "attendance.regularize_cancel", {
      requestId: args.requestId,
    });
  },
});

export const reviewRegularization = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    requestId: v.id("attendanceRegularizations"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    reviewRemarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const req = await ctx.db.get(args.requestId);
    if (!req || req.workspaceId !== args.workspaceId) {
      throw new ConvexError("Regularization request not found.");
    }

    if (req.status !== "pending") {
      throw new ConvexError(`Cannot review a request that is already ${req.status}.`);
    }

    const now = Date.now();
    await ctx.db.patch(args.requestId, {
      status: args.status,
      reviewedBy: userId,
      reviewRemarks: args.reviewRemarks,
      reviewedAt: now,
      updatedAt: now,
    });

    // If approved, update or insert into attendance table with admin authorization
    if (args.status === "approved") {
      const existing = await ctx.db
        .query("attendance")
        .withIndex("by_workspace_employee_date", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("employeeId", req.employeeId).eq("date", req.date),
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          status: req.requestedStatus,
          checkInTime: req.checkInTime,
          checkOutTime: req.checkOutTime,
          remarks: `Regularized: ${req.reason}`,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("attendance", {
          workspaceId: req.workspaceId,
          employeeId: req.employeeId,
          date: req.date,
          status: req.requestedStatus,
          checkInTime: req.checkInTime,
          checkOutTime: req.checkOutTime,
          remarks: `Regularized: ${req.reason}`,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    await audit(ctx, args.workspaceId, userId, "attendance.regularize_review", {
      requestId: args.requestId,
      status: args.status,
    });
  },
});



// ==========================================
// STEP 2.3: SHIFT & PUNCH PAIRING ENGINE
// ==========================================

export const createShift = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    code: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    isOvernight: v.boolean(),
    gracePeriodMinutes: v.optional(v.number()),
    halfDayThresholdHours: v.optional(v.number()),
    fullDayThresholdHours: v.optional(v.number()),
    breakDeductionRule: v.optional(
      v.union(
        v.literal("fixed_break"),
        v.literal("measured_breaks"),
        v.literal("whichever_is_greater"),
      ),
    ),
    fixedBreakMinutes: v.optional(v.number()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const cleanCode = args.code.trim().toUpperCase();
    const existing = await ctx.db
      .query("shifts")
      .withIndex("by_workspace_code", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("code", cleanCode),
      )
      .first();
    if (existing) {
      throw new ConvexError("Shift with code " + cleanCode + " already exists in this workspace");
    }
    const now = Date.now();
    const shiftId = await ctx.db.insert("shifts", {
      workspaceId: args.workspaceId,
      name: args.name.trim(),
      code: cleanCode,
      startTime: args.startTime,
      endTime: args.endTime,
      isOvernight: args.isOvernight,
      gracePeriodMinutes: args.gracePeriodMinutes ?? 15,
      halfDayThresholdHours: args.halfDayThresholdHours ?? 4,
      fullDayThresholdHours: args.fullDayThresholdHours ?? 8,
      breakDeductionRule: args.breakDeductionRule ?? "whichever_is_greater",
      fixedBreakMinutes: args.fixedBreakMinutes ?? 60,
      isDefault: args.isDefault ?? false,
      createdAt: now,
      updatedAt: now,
    });
    return shiftId;
  },
});

export const assignShift = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    shiftId: v.id("shifts"),
    effectiveFrom: v.string(),
    effectiveTo: v.optional(v.string()),
    createdById: v.id("users"),
  },
  handler: async (ctx, args) => {
    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Employee not found in this workspace");
    }
    const shift = await ctx.db.get(args.shiftId);
    if (!shift || shift.workspaceId !== args.workspaceId) {
      throw new ConvexError("Shift not found in this workspace");
    }

    const now = Date.now();
    const assignmentId = await ctx.db.insert("shiftAssignments", {
      workspaceId: args.workspaceId,
      employeeId: args.employeeId,
      shiftId: args.shiftId,
      effectiveFrom: args.effectiveFrom,
      effectiveTo: args.effectiveTo,
      createdById: args.createdById,
      createdAt: now,
      updatedAt: now,
    });
    return assignmentId;
  },
});

export const listShifts = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("shifts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const processPunchesForShiftCycle = internalMutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    shiftDate: v.string(),
  },
  handler: async (ctx, args) => {
    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Employee not found or tenant mismatch");
    }

    const workspace = await ctx.db.get(args.workspaceId);
    const timeZone = (workspace as any)?.timezone || "Asia/Kolkata";

    const existingAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_workspace_employee_date", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("employeeId", args.employeeId).eq("date", args.shiftDate),
      )
      .first();

    if (existingAttendance && existingAttendance.source === "regularized") {
      return { skipped: true, reason: "Attendance record is regularized" };
    }

    const assignments = await ctx.db
      .query("shiftAssignments")
      .withIndex("by_workspace_employee", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("employeeId", args.employeeId),
      )
      .collect();

    let assignedShift = null;
    for (const a of assignments) {
      if (a.effectiveFrom <= args.shiftDate && (!a.effectiveTo || a.effectiveTo >= args.shiftDate)) {
        assignedShift = await ctx.db.get(a.shiftId);
        if (assignedShift) break;
      }
    }

    const shift = assignedShift || {
      _id: undefined,
      name: "General Shift",
      code: "GEN",
      startTime: "09:00",
      endTime: "18:00",
      isOvernight: false,
      gracePeriodMinutes: 15,
      halfDayThresholdHours: 4,
      fullDayThresholdHours: 8,
      breakDeductionRule: "whichever_is_greater" as const,
      fixedBreakMinutes: 60,
    };

    const [startH, startM] = shift.startTime.split(":").map(Number);
    const [endH, endM] = shift.endTime.split(":").map(Number);

    const shiftStart = new Date(args.shiftDate + "T00:00:00.000Z");
    shiftStart.setUTCHours(startH ?? 9, startM ?? 0, 0, 0);

    const nextDateObj = new Date(args.shiftDate + "T00:00:00.000Z");
    nextDateObj.setUTCDate(nextDateObj.getUTCDate() + 1);
    const nextDateStr = nextDateObj.toISOString().slice(0, 10);

    let windowStart = shiftStart.getTime() - 2 * 60 * 60 * 1000;
    let windowEnd: number;

    if (shift.isOvernight) {
      const shiftEnd = new Date(nextDateStr + "T00:00:00.000Z");
      shiftEnd.setUTCHours(endH ?? 18, endM ?? 0, 0, 0);
      windowEnd = shiftEnd.getTime() + 4 * 60 * 60 * 1000;
    } else {
      const shiftEnd = new Date(args.shiftDate + "T00:00:00.000Z");
      shiftEnd.setUTCHours(endH ?? 18, endM ?? 0, 0, 0);
      windowEnd = shiftEnd.getTime() + 4 * 60 * 60 * 1000;
    }

    const punchesDay1 = await ctx.db
      .query("rawPunchLogs")
      .withIndex("by_workspace_employee_date", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("employeeId", args.employeeId).eq("punchDate", args.shiftDate),
      )
      .collect();

    let punchesDay2: any[] = [];
    if (shift.isOvernight) {
      punchesDay2 = await ctx.db
        .query("rawPunchLogs")
        .withIndex("by_workspace_employee_date", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("employeeId", args.employeeId).eq("punchDate", nextDateStr),
        )
        .collect();
    }

    const allPunches = [...punchesDay1, ...punchesDay2]
      .filter((p) => p.punchTimestamp >= windowStart && p.punchTimestamp <= windowEnd)
      .sort((a, b) => a.punchTimestamp - b.punchTimestamp);

    const debouncedPunches: typeof allPunches = [];
    for (const p of allPunches) {
      if (debouncedPunches.length === 0) {
        debouncedPunches.push(p);
      } else {
        const last = debouncedPunches[debouncedPunches.length - 1];
        if (p.punchTimestamp - last.punchTimestamp >= 60 * 1000) {
          debouncedPunches.push(p);
        }
      }
    }

    const now = Date.now();

    if (debouncedPunches.length === 0) {
      const dayOfWeek = new Date(args.shiftDate + "T00:00:00.000Z").getUTCDay();
      const isSunday = dayOfWeek === 0;

      const leave = await ctx.db
        .query("leaveRequests")
        .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId))
        .filter((q) =>
          q.and(
            q.eq(q.field("status"), "approved"),
            q.lte(q.field("startDate"), args.shiftDate),
            q.gte(q.field("endDate"), args.shiftDate),
          ),
        )
        .first();

      const holiday = await ctx.db
        .query("holidays")
        .withIndex("by_workspace_date", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("date", args.shiftDate),
        )
        .first();

      let autoStatus: "absent" | "weekly_off" | "holiday" | "paid_leave" = "absent";
      if (leave) {
        autoStatus = "paid_leave";
      } else if (holiday) {
        autoStatus = "holiday";
      } else if (isSunday) {
        autoStatus = "weekly_off";
      }

      const record = {
        workspaceId: args.workspaceId,
        employeeId: args.employeeId,
        date: args.shiftDate,
        status: autoStatus,
        source: "biometric" as const,
        completionStatus: "single_punch" as const,
        workDurationHours: 0,
        actualBreakMinutes: 0,
        deductedBreakMinutes: 0,
        lateInMinutes: 0,
        earlyOutMinutes: 0,
        shiftId: shift._id,
        timezone: timeZone,
        updatedAt: now,
      };

      if (existingAttendance) {
        await ctx.db.patch(existingAttendance._id, record);
      } else {
        await ctx.db.insert("attendance", { ...record, createdAt: now });
      }
      return { status: autoStatus, totalWorkMinutes: 0, completionStatus: "single_punch" };
    }

    const checkIns = debouncedPunches.filter((p) => p.punchType === "check_in");
    const checkOuts = debouncedPunches.filter((p) => p.punchType === "check_out");
    const breakOuts = debouncedPunches.filter((p) => p.punchType === "break_out");
    const breakIns = debouncedPunches.filter((p) => p.punchType === "break_in");

    let firstIn = checkIns.length > 0 ? checkIns[0] : null;
    let lastOut = checkOuts.length > 0 ? checkOuts[checkOuts.length - 1] : null;

    let completionStatus: "complete" | "missing_in" | "missing_out" | "single_punch" = "complete";
    if (!firstIn && !lastOut) {
      if (debouncedPunches.length === 1) {
        firstIn = debouncedPunches[0];
        completionStatus = "single_punch";
      } else {
        firstIn = debouncedPunches[0];
        lastOut = debouncedPunches[debouncedPunches.length - 1];
        completionStatus = "complete";
      }
    } else if (firstIn && !lastOut) {
      if (debouncedPunches.length === 1) {
        completionStatus = "single_punch";
      } else {
        completionStatus = "missing_out";
      }
    } else if (!firstIn && lastOut) {
      completionStatus = "missing_in";
    }

    let measuredBreaks = 0;
    const minBreaks = Math.min(breakOuts.length, breakIns.length);
    for (let i = 0; i < minBreaks; i++) {
      if (breakIns[i].punchTimestamp > breakOuts[i].punchTimestamp) {
        measuredBreaks += Math.floor(
          (breakIns[i].punchTimestamp - breakOuts[i].punchTimestamp) / (60 * 1000),
        );
      }
    }

    let finalBreakMinutes = 0;
    const rule = shift.breakDeductionRule || "whichever_is_greater";
    if (rule === "fixed_break") {
      finalBreakMinutes = shift.fixedBreakMinutes || 0;
    } else if (rule === "measured_breaks") {
      finalBreakMinutes = measuredBreaks;
    } else if (rule === "whichever_is_greater") {
      finalBreakMinutes = Math.max(measuredBreaks, shift.fixedBreakMinutes || 0);
    }

    let grossWorkMinutes = 0;
    if (firstIn && lastOut && lastOut.punchTimestamp > firstIn.punchTimestamp) {
      grossWorkMinutes = Math.floor(
        (lastOut.punchTimestamp - firstIn.punchTimestamp) / (60 * 1000),
      );
    }

    const totalWorkMinutes = Math.max(0, grossWorkMinutes - finalBreakMinutes);
    const workDurationHours = Math.round((totalWorkMinutes / 60) * 100) / 100;

    let lateInMinutes = 0;
    let earlyOutMinutes = 0;

    if (firstIn) {
      const diffMs = firstIn.punchTimestamp - shiftStart.getTime();
      const diffMinutes = Math.floor(diffMs / (60 * 1000));
      if (diffMinutes > (shift.gracePeriodMinutes || 0)) {
        lateInMinutes = diffMinutes;
      }
    }

    if (lastOut) {
      let shiftEndTarget: Date;
      if (shift.isOvernight) {
        shiftEndTarget = new Date(nextDateStr + "T00:00:00.000Z");
        shiftEndTarget.setUTCHours(endH ?? 18, endM ?? 0, 0, 0);
      } else {
        shiftEndTarget = new Date(args.shiftDate + "T00:00:00.000Z");
        shiftEndTarget.setUTCHours(endH ?? 18, endM ?? 0, 0, 0);
      }
      const diffMs = shiftEndTarget.getTime() - lastOut.punchTimestamp;
      const diffMinutes = Math.floor(diffMs / (60 * 1000));
      if (diffMinutes > 0) {
        earlyOutMinutes = diffMinutes;
      }
    }

    let status: "present" | "half_day" | "absent" = "absent";
    const totalHours = totalWorkMinutes / 60;
    if (totalHours >= (shift.fullDayThresholdHours || 8)) {
      status = "present";
    } else if (totalHours >= (shift.halfDayThresholdHours || 4)) {
      status = "half_day";
    } else {
      status = "absent";
    }

    const checkInTimeStr = firstIn
      ? new Date(firstIn.punchTimestamp).toISOString().substring(11, 16)
      : undefined;
    const checkOutTimeStr = lastOut
      ? new Date(lastOut.punchTimestamp).toISOString().substring(11, 16)
      : undefined;

    const record = {
      workspaceId: args.workspaceId,
      employeeId: args.employeeId,
      date: args.shiftDate,
      status,
      checkInTime: checkInTimeStr,
      checkOutTime: checkOutTimeStr,
      source: "biometric" as const,
      completionStatus,
      workDurationHours,
      actualBreakMinutes: measuredBreaks,
      deductedBreakMinutes: finalBreakMinutes,
      lateInMinutes,
      earlyOutMinutes,
      shiftId: shift._id,
      timezone: timeZone,
      updatedAt: now,
    };

    if (existingAttendance) {
      await ctx.db.patch(existingAttendance._id, record);
    } else {
      await ctx.db.insert("attendance", { ...record, createdAt: now });
    }

    return {
      status,
      completionStatus,
      totalWorkMinutes,
      workDurationHours,
      breakDurationMinutes: finalBreakMinutes,
      lateInMinutes,
      earlyOutMinutes,
    };
  },
});
