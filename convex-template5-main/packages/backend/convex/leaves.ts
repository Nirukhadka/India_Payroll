import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireMember, requireRole } from "./orgs";
import { audit } from "./auditLog";

const LEAVE_TYPE = v.union(
  v.literal("casual"),
  v.literal("sick"),
  v.literal("earned"),
  v.literal("unpaid"),
  v.literal("restricted_holiday"),
  v.literal("comp_off"),
);

export function isOverlappingLeave(
  reqA: {
    startDate: string;
    endDate: string;
    session?: "full_day" | "session_1" | "session_2";
  },
  reqB: {
    startDate: string;
    endDate: string;
    session?: "full_day" | "session_1" | "session_2";
  },
): boolean {
  if (reqA.startDate > reqB.endDate || reqA.endDate < reqB.startDate) {
    return false;
  }
  // Single-day boundary overlap with opposite half-day sessions
  if (
    reqA.startDate === reqA.endDate &&
    reqB.startDate === reqB.endDate &&
    reqA.startDate === reqB.startDate
  ) {
    const sA = reqA.session ?? "full_day";
    const sB = reqB.session ?? "full_day";
    if (sA === "session_1" && sB === "session_2") return false;
    if (sA === "session_2" && sB === "session_1") return false;
    return true;
  }
  return true;
}

const LEAVE_STATUS = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("cancelled")
);

export const list = query({
  args: {
    workspaceId: v.id("workspaces"),
    status: v.optional(LEAVE_STATUS),
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
        throw new ConvexError("Forbidden: You cannot view another employee's leave requests");
      }
      const records = await ctx.db
        .query("leaveRequests")
        .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
        .order("desc")
        .collect();
      if (args.status) return records.filter((r) => r.status === args.status);
      return records;
    }

    if (args.employeeId) {
      const q = ctx.db
        .query("leaveRequests")
        .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId!));
      const results = await q.order("desc").collect();
      if (args.status) return results.filter((r) => r.status === args.status);
      return results;
    }

    if (args.status) {
      return await ctx.db
        .query("leaveRequests")
        .withIndex("by_workspace_status", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("status", args.status!)
        )
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("leaveRequests")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();
  },
});

export const submit = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    leaveType: LEAVE_TYPE,
    startDate: v.string(), // "YYYY-MM-DD"
    endDate: v.string(),   // "YYYY-MM-DD"
    daysCount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    const m = await requireMember(ctx, userId, args.workspaceId);

    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Employee not found in workspace");
    }

    if (m.role === "member" && employee.userId !== userId) {
      throw new ConvexError("Forbidden: You cannot submit leave requests for another employee");
    }

    if (!args.reason || !args.reason.trim()) {
      throw new ConvexError("Reason is required.");
    }
    if (args.startDate > args.endDate) {
      throw new ConvexError("Start date cannot be after end date");
    }

    if (args.daysCount <= 0) {
      throw new ConvexError("Days count must be greater than 0");
    }

    // Overlap validation against active leaves
    const existingActive = await ctx.db
      .query("leaveRequests")
      .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId))
      .filter((q) =>
        q.and(
          q.eq(q.field("workspaceId"), args.workspaceId),
          q.neq(q.field("status"), "rejected"),
          q.neq(q.field("status"), "cancelled"),
        ),
      )
      .collect();

    for (const ex of existingActive) {
      if (
        isOverlappingLeave(
          { startDate: args.startDate, endDate: args.endDate },
          { startDate: ex.startDate, endDate: ex.endDate, session: ex.session },
        )
      ) {
        throw new ConvexError(
          `Overlapping leave conflict: A leave request already exists from ${ex.startDate} to ${ex.endDate} (${ex.status}: ${ex.leaveType} leave).`,
        );
      }
    }

    const now = Date.now();
    const requestId = await ctx.db.insert("leaveRequests", {
      workspaceId: args.workspaceId,
      employeeId: args.employeeId,
      leaveType: args.leaveType,
      startDate: args.startDate,
      endDate: args.endDate,
      daysCount: args.daysCount,
      reason: args.reason,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "leave.submit", {
      requestId,
      employeeId: args.employeeId,
    });

    return requestId;
  },
});

export const review = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    requestId: v.id("leaveRequests"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    reviewRemarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const request = await ctx.db.get(args.requestId);
    if (!request || request.workspaceId !== args.workspaceId) {
      throw new ConvexError("Leave request not found");
    }

    if (request.status !== "pending") {
      throw new ConvexError(`Cannot review a request that is already ${request.status}`);
    }

    const now = Date.now();
    await ctx.db.patch(args.requestId, {
      status: args.status,
      reviewedBy: userId,
      reviewRemarks: args.reviewRemarks,
      reviewedAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "leave.review", {
      requestId: args.requestId,
      status: args.status,
    });
  },
});

export const getMyLeaves = query({
  args: {
    workspaceId: v.id("workspaces"),
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

    return await ctx.db
      .query("leaveRequests")
      .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .order("desc")
      .collect();
  },
});

export const getLeaveBalances = query({
  args: {
    workspaceId: v.id("workspaces"),
    year: v.optional(v.number()),
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
      return {
        sick: { granted: 12, consumed: 0, pending: 0, balance: 12 },
        casual: { granted: 12, consumed: 0, pending: 0, balance: 12 },
        earned: { granted: 15, consumed: 0, pending: 0, balance: 15 },
        lop: { granted: 0, consumed: 0, pending: 0, balance: 0 },
      };
    }

    const currentYear = args.year ?? new Date().getFullYear();
    const yearPrefix = `${currentYear}-`;

    const myLeaves = await ctx.db
      .query("leaveRequests")
      .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .collect();

    const yearLeaves = myLeaves.filter(
      (l) => l.startDate.startsWith(yearPrefix) && l.status !== "cancelled" && l.status !== "rejected",
    );

    function calcType(type: string, granted: number) {
      const approved = yearLeaves
        .filter((l) => l.leaveType === type && l.status === "approved")
        .reduce((sum, l) => sum + (l.daysCount || 0), 0);
      const pending = yearLeaves
        .filter((l) => l.leaveType === type && l.status === "pending")
        .reduce((sum, l) => sum + (l.daysCount || 0), 0);
      const consumed = approved;
      const balance = Math.max(0, granted - consumed);
      return { granted, consumed, pending, balance };
    }

    // Attendance unpaid LOP count
    const myAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .collect();

    const lopDays = myAttendance.filter(
      (a) => a.date.startsWith(yearPrefix) && (a.status === "unpaid_leave" || a.status === "absent"),
    ).length;

    // Approved Comp-Off Grants
    const approvedCompOffGrants = await ctx.db
      .query("compOffRequests")
      .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("workspaceId"), args.workspaceId),
          q.eq(q.field("status"), "approved"),
        ),
      )
      .collect();

    const totalCompOffGranted = approvedCompOffGrants.reduce(
      (sum, c) => sum + (c.daysCount || 0),
      0,
    );

    return {
      sick: calcType("sick", 12),
      casual: calcType("casual", 12),
      earned: calcType("earned", 15),
      restricted_holiday: calcType("restricted_holiday", 2),
      comp_off: calcType("comp_off", totalCompOffGranted),
      lop: { granted: 0, consumed: lopDays, pending: 0, balance: 0 },
    };
  },
});

export const submitMyLeave = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    leaveType: v.union(
      v.literal("sick"),
      v.literal("casual"),
      v.literal("earned"),
      v.literal("unpaid"),
      v.literal("restricted_holiday"),
      v.literal("comp_off"),
    ),
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.string(), // YYYY-MM-DD
    session: v.optional(v.union(v.literal("full_day"), v.literal("session_1"), v.literal("session_2"))),
    contactDetails: v.optional(v.string()),
    reason: v.string(),
    fileAttachment: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const me = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .first();

    if (!me) {
      throw new ConvexError("No employee record linked to your account.");
    }

    if (!args.reason || !args.reason.trim()) {
      throw new ConvexError("Reason is required.");
    }
    if (args.startDate > args.endDate) {
      throw new ConvexError("Start date must be on or before end date");
    }

    // Enforce removal of Casual Leave and Earned Leave for employee requests
    if (args.leaveType === "casual" || args.leaveType === "earned") {
      throw new ConvexError(
        `Leave type "${args.leaveType}" is not permitted. Casual Leave and Earned Leave are no longer available for new requests. Please apply for Sick Leave or Unpaid Leave.`,
      );
    }

    let daysCount = 1;
    if (args.startDate === args.endDate && args.session && args.session !== "full_day") {
      daysCount = 0.5;
    } else {
      const start = new Date(args.startDate);
      const end = new Date(args.endDate);
      daysCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    }

    // Server-side Overlap Validation against active leave requests
    const existingActiveLeaves = await ctx.db
      .query("leaveRequests")
      .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("workspaceId"), args.workspaceId),
          q.neq(q.field("status"), "rejected"),
          q.neq(q.field("status"), "cancelled"),
        ),
      )
      .collect();

    for (const ex of existingActiveLeaves) {
      if (
        isOverlappingLeave(
          { startDate: args.startDate, endDate: args.endDate, session: args.session },
          { startDate: ex.startDate, endDate: ex.endDate, session: ex.session },
        )
      ) {
        throw new ConvexError(
          `Overlapping leave conflict: A leave request already exists from ${ex.startDate} to ${ex.endDate} (${ex.status}: ${ex.leaveType} leave). You cannot apply for overlapping dates.`,
        );
      }
    }

    // Restricted Holiday Quota Validation (max 2 per calendar year)
    if (args.leaveType === "restricted_holiday") {
      const currentYear = args.startDate.slice(0, 4);
      const rhLeaves = existingActiveLeaves.filter(
        (l) => l.leaveType === "restricted_holiday" && l.startDate.startsWith(currentYear),
      );
      const rhConsumedDays = rhLeaves.reduce((sum, l) => sum + (l.daysCount || 0), 0);
      if (rhConsumedDays + daysCount > 2) {
        throw new ConvexError(
          `Restricted Holiday quota exceeded. You have already applied for ${rhConsumedDays} of 2 allowable RH days for ${currentYear}.`,
        );
      }
    }

    // Sick Leave Balance Validation
    if (args.leaveType === "sick") {
      const sickLeaves = existingActiveLeaves.filter((l) => l.leaveType === "sick");
      const sickApproved = sickLeaves
        .filter((l) => l.status === "approved")
        .reduce((sum, l) => sum + (l.daysCount || 0), 0);
      const sickPending = sickLeaves
        .filter((l) => l.status === "pending")
        .reduce((sum, l) => sum + (l.daysCount || 0), 0);
      const sickGranted = 12; // IndiaPay annual policy default
      const availableSick = Math.max(0, sickGranted - sickApproved - sickPending);
      if (daysCount > availableSick) {
        throw new ConvexError(
          `Insufficient leave balance. You are applying for ${daysCount} day(s), but have only ${availableSick} Sick Leave day(s) remaining.`,
        );
      }
    }

    // Comp-off Balance Validation
    if (args.leaveType === "comp_off") {
      const approvedGrants = await ctx.db
        .query("compOffRequests")
        .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
        .filter((q) =>
          q.and(
            q.eq(q.field("workspaceId"), args.workspaceId),
            q.eq(q.field("status"), "approved"),
          ),
        )
      .collect();
      const granted = approvedGrants.reduce((sum, g) => sum + (g.daysCount || 0), 0);
      const used = existingActiveLeaves
        .filter((l) => l.leaveType === "comp_off")
        .reduce((sum, l) => sum + (l.daysCount || 0), 0);
      const available = Math.max(0, granted - used);
      if (daysCount > available) {
        throw new ConvexError(
          `Insufficient Comp-Off balance. You are applying for ${daysCount} day(s), but have only ${available} approved Comp-Off day(s) available.`,
        );
      }
    }

    const now = Date.now();
    const requestId = await ctx.db.insert("leaveRequests", {
      workspaceId: args.workspaceId,
      employeeId: me._id,
      leaveType: args.leaveType,
      startDate: args.startDate,
      endDate: args.endDate,
      session: args.session ?? "full_day",
      contactDetails: args.contactDetails,
      fileAttachment: args.fileAttachment,
      storageId: args.storageId,
      daysCount,
      reason: args.reason,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "leave.submit_my", {
      requestId,
      employeeId: me._id,
      hasAttachment: Boolean(args.storageId),
    });

    return requestId;
  },
});

export const cancelMyLeave = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    requestId: v.id("leaveRequests"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const me = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .first();

    if (!me) throw new ConvexError("Employee not linked");

    const req = await ctx.db.get(args.requestId);
    if (!req || req.workspaceId !== args.workspaceId || req.employeeId !== me._id) {
      throw new ConvexError("Leave request not found");
    }

    if (req.status !== "pending") {
      throw new ConvexError(`Cannot cancel a request that is already ${req.status}`);
    }

    await ctx.db.patch(args.requestId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    await audit(ctx, args.workspaceId, userId, "leave.cancel_my", {
      requestId: args.requestId,
    });
  },
});

export const getHolidays = query({
  args: {
    workspaceId: v.id("workspaces"),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const customHolidays = await ctx.db
      .query("holidays")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    if (customHolidays.length > 0) {
      return customHolidays.sort((a, b) => a.date.localeCompare(b.date));
    }

    // Default Statutory Indian Gazetted & Restricted Holidays Calendar
    const year = args.year ?? 2026;
    return [
      { name: "Republic Day", date: `${year}-01-26`, type: "gazetted", description: "National Holiday" },
      { name: "Maha Shivratri", date: `${year}-02-17`, type: "restricted", description: "Restricted Holiday" },
      { name: "Holi", date: `${year}-03-04`, type: "gazetted", description: "Festival of Colors" },
      { name: "Eid-ul-Fitr", date: `${year}-03-20`, type: "gazetted", description: "Islamic Festival" },
      { name: "Mahavir Jayanti", date: `${year}-03-31`, type: "gazetted", description: "Jain Festival" },
      { name: "Good Friday", date: `${year}-04-03`, type: "gazetted", description: "Christian Festival" },
      { name: "Ambedkar Jayanti", date: `${year}-04-14`, type: "gazetted", description: "National Observance" },
      { name: "Buddha Purnima", date: `${year}-05-02`, type: "gazetted", description: "Buddhist Festival" },
      { name: "Bakrid / Eid al-Adha", date: `${year}-05-27`, type: "gazetted", description: "Islamic Festival" },
      { name: "Muharram", date: `${year}-06-26`, type: "gazetted", description: "Islamic New Year" },
      { name: "Independence Day", date: `${year}-08-15`, type: "gazetted", description: "National Holiday" },
      { name: "Milad un-Nabi", date: `${year}-08-26`, type: "gazetted", description: "Prophet's Birthday" },
      { name: "Mahatma Gandhi Jayanti", date: `${year}-10-02`, type: "gazetted", description: "National Holiday" },
      { name: "Dussehra (Vijaya Dashami)", date: `${year}-10-20`, type: "gazetted", description: "Hindu Festival" },
      { name: "Diwali (Deepavali)", date: `${year}-11-08`, type: "gazetted", description: "Festival of Lights" },
      { name: "Guru Nanak Jayanti", date: `${year}-11-24`, type: "gazetted", description: "Sikh Festival" },
      { name: "Christmas Day", date: `${year}-12-25`, type: "gazetted", description: "Christian Festival" },
    ];
  },
});

export const getAttachmentUrl = query({
  args: {
    workspaceId: v.id("workspaces"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);
    return await ctx.storage.getUrl(args.storageId);
  },
});

// ── Comp-Off Grant Requests & Reviews ────────────────────────────────────────

export const submitCompOffRequest = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    workDate: v.string(), // "YYYY-MM-DD"
    reason: v.string(),
    daysCount: v.optional(v.number()), // default 1
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

    if (!me) throw new ConvexError("No employee profile linked to your account.");

    if (!args.workDate) throw new ConvexError("Work date is required.");
    if (!args.reason.trim()) throw new ConvexError("Reason is required.");

    const daysCount = args.daysCount ?? 1;
    if (daysCount <= 0 || daysCount > 2) {
      throw new ConvexError("Days count must be between 0.5 and 2 days.");
    }

    const now = Date.now();
    const requestId = await ctx.db.insert("compOffRequests", {
      workspaceId: args.workspaceId,
      employeeId: me._id,
      workDate: args.workDate,
      reason: args.reason.trim(),
      daysCount,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "comp_off.submit", {
      requestId,
      employeeId: me._id,
      workDate: args.workDate,
    });

    return requestId;
  },
});

export const listMyCompOffRequests = query({
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
      .query("compOffRequests")
      .withIndex("by_employee", (q) => q.eq("employeeId", me._id))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .order("desc")
      .collect();
  },
});

export const reviewCompOffRequest = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    requestId: v.id("compOffRequests"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    reviewRemarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const req = await ctx.db.get(args.requestId);
    if (!req || req.workspaceId !== args.workspaceId) {
      throw new ConvexError("Comp-off request not found.");
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

    await audit(ctx, args.workspaceId, userId, "comp_off.review", {
      requestId: args.requestId,
      status: args.status,
    });
  },
});

