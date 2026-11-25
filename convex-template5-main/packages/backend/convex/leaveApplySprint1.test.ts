import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";
import { isOverlappingLeave } from "./leaves";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const modules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === "function"
    ? (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
    : {
        "./leaves.ts": () => import("./leaves"),
        "./orgs.ts": () => import("./orgs"),
        "./schema.ts": () => import("./schema"),
      };

describe("Leave Apply Sprint 1 - Comprehensive Functional, Validation & Security Suite", () => {
  it("validates overlap helper correctly for full-day, opposite sessions, and identical sessions", () => {
    // Exact same date, full day vs full day -> overlap
    expect(
      isOverlappingLeave(
        { startDate: "2026-12-01", endDate: "2026-12-01", session: "full_day" },
        { startDate: "2026-12-01", endDate: "2026-12-01", session: "full_day" }
      )
    ).toBe(true);

    // Exact same date, session 1 vs session 2 -> NO overlap
    expect(
      isOverlappingLeave(
        { startDate: "2026-12-01", endDate: "2026-12-01", session: "session_1" },
        { startDate: "2026-12-01", endDate: "2026-12-01", session: "session_2" }
      )
    ).toBe(false);

    // Exact same date, session 1 vs session 1 -> overlap
    expect(
      isOverlappingLeave(
        { startDate: "2026-12-01", endDate: "2026-12-01", session: "session_1" },
        { startDate: "2026-12-01", endDate: "2026-12-01", session: "session_1" }
      )
    ).toBe(true);

    // Different dates -> NO overlap
    expect(
      isOverlappingLeave(
        { startDate: "2026-12-01", endDate: "2026-12-01", session: "full_day" },
        { startDate: "2026-12-02", endDate: "2026-12-02", session: "full_day" }
      )
    ).toBe(false);
  });

  it("enforces comprehensive server-side validations: sick balance, RH quota, overlap, suspended & cross-workspace isolation", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    // 1. Setup primary workspace (ws1) and secondary workspace (ws2)
    const { ws1, ws2, empUser, suspendedUser, foreignUser, emp1 } = await t.run(
      async (ctx: MutationCtx) => {
        const empUser = await ctx.db.insert("users", {
          name: "Active Employee",
          email: "user@indiapaypayroll.com",
          emailVerificationTime: now,
        });

        const suspendedUser = await ctx.db.insert("users", {
          name: "Suspended Employee",
          email: "suspended@indiapaypayroll.com",
          emailVerificationTime: now,
        });

        const foreignUser = await ctx.db.insert("users", {
          name: "Foreign Employee",
          email: "foreign@othercorp.com",
          emailVerificationTime: now,
        });

        const ws1 = await ctx.db.insert("workspaces", {
          name: "Primary Workspace",
          ownerId: empUser,
          createdAt: now,
        });

        const ws2 = await ctx.db.insert("workspaces", {
          name: "Isolated Foreign Workspace",
          ownerId: foreignUser,
          createdAt: now,
        });

        // Memberships in ws1
        await ctx.db.insert("members", {
          workspaceId: ws1,
          userId: empUser,
          role: "member",
          status: "active",
          createdAt: now,
        });

        await ctx.db.insert("members", {
          workspaceId: ws1,
          userId: suspendedUser,
          role: "member",
          status: "suspended",
          createdAt: now,
        });

        // Membership in ws2
        await ctx.db.insert("members", {
          workspaceId: ws2,
          userId: foreignUser,
          role: "member",
          status: "active",
          createdAt: now,
        });

        // Employee records
        const emp1 = await ctx.db.insert("employees", {
          workspaceId: ws1,
          userId: empUser,
          firstName: "Active",
          lastName: "Dev",
          email: "user@indiapaypayroll.com",
          status: "active",
          createdAt: now,
          updatedAt: now,
        });

        await ctx.db.insert("employees", {
          workspaceId: ws1,
          userId: suspendedUser,
          firstName: "Suspended",
          lastName: "User",
          email: "suspended@indiapaypayroll.com",
          status: "suspended",
          createdAt: now,
          updatedAt: now,
        });

        await ctx.db.insert("employees", {
          workspaceId: ws2,
          userId: foreignUser,
          firstName: "Foreign",
          lastName: "Worker",
          email: "foreign@othercorp.com",
          status: "active",
          createdAt: now,
          updatedAt: now,
        });

        return { ws1, ws2, empUser, suspendedUser, foreignUser, emp1 };
      }
    );

    const asEmployee = t.withIdentity({
      subject: empUser,
      issuer: "https://auth.indiapaypayroll.com",
    });

    const asSuspended = t.withIdentity({
      subject: suspendedUser,
      issuer: "https://auth.indiapaypayroll.com",
    });

    const asForeign = t.withIdentity({
      subject: foreignUser,
      issuer: "https://auth.indiapaypayroll.com",
    });

    // 2. Reason validation check
    await expect(
      asEmployee.mutation(api.leaves.submitMyLeave, {
        workspaceId: ws1,
        leaveType: "sick",
        startDate: "2026-12-01",
        endDate: "2026-12-01",
        reason: "   ",
      })
    ).rejects.toThrow(/Reason is required/i);

    // 3. Start date after end date is rejected
    await expect(
      asEmployee.mutation(api.leaves.submitMyLeave, {
        workspaceId: ws1,
        leaveType: "sick",
        startDate: "2026-12-05",
        endDate: "2026-12-01",
        reason: "Invalid date sequence",
      })
    ).rejects.toThrow(/Start date must be on or before end date/i);

    // 4. Policy enforcement: Casual Leave is blocked for self-service
    await expect(
      asEmployee.mutation(api.leaves.submitMyLeave, {
        workspaceId: ws1,
        leaveType: "casual",
        startDate: "2026-12-01",
        endDate: "2026-12-01",
        reason: "Attempting casual leave",
      })
    ).rejects.toThrow(/not permitted/i);

    // 5. Submit Half-Day Sick Leave (Session 1)
    const req1 = await asEmployee.mutation(api.leaves.submitMyLeave, {
      workspaceId: ws1,
      leaveType: "sick",
      startDate: "2026-12-01",
      endDate: "2026-12-01",
      session: "session_1",
      reason: "Doctor consultation morning",
    });
    expect(req1).toBeDefined();

    const storedReq1 = await t.run(async (ctx) => ctx.db.get(req1));
    expect(storedReq1?.daysCount).toBe(0.5);
    expect(storedReq1?.status).toBe("pending");

    // 6. Opposite half-day session on the same date (Session 2) is permitted
    const req2 = await asEmployee.mutation(api.leaves.submitMyLeave, {
      workspaceId: ws1,
      leaveType: "sick",
      startDate: "2026-12-01",
      endDate: "2026-12-01",
      session: "session_2",
      reason: "Recovery afternoon",
    });
    expect(req2).toBeDefined();

    // 7. Conflicting session overlap (Session 1 again) is rejected
    await expect(
      asEmployee.mutation(api.leaves.submitMyLeave, {
        workspaceId: ws1,
        leaveType: "sick",
        startDate: "2026-12-01",
        endDate: "2026-12-01",
        session: "session_1",
        reason: "Duplicate morning session",
      })
    ).rejects.toThrow(/Overlapping leave conflict/i);

    // 8. Full-day overlap on same date is rejected
    await expect(
      asEmployee.mutation(api.leaves.submitMyLeave, {
        workspaceId: ws1,
        leaveType: "unpaid",
        startDate: "2026-12-01",
        endDate: "2026-12-01",
        session: "full_day",
        reason: "Full day conflicting with existing half days",
      })
    ).rejects.toThrow(/Overlapping leave conflict/i);

    // 9. Cross-workspace security: foreign user cannot apply in ws1
    await expect(
      asForeign.mutation(api.leaves.submitMyLeave, {
        workspaceId: ws1,
        leaveType: "sick",
        startDate: "2026-12-10",
        endDate: "2026-12-10",
        reason: "Cross workspace hack attempt",
      })
    ).rejects.toThrow();

    // 10. Suspended user is blocked from submitting leaves
    await expect(
      asSuspended.mutation(api.leaves.submitMyLeave, {
        workspaceId: ws1,
        leaveType: "sick",
        startDate: "2026-12-15",
        endDate: "2026-12-15",
        reason: "Suspended account submission",
      })
    ).rejects.toThrow();

    // 11. Restricted Holiday Annual Quota Check (Max 2 per year)
    await asEmployee.mutation(api.leaves.submitMyLeave, {
      workspaceId: ws1,
      leaveType: "restricted_holiday",
      startDate: "2026-10-02",
      endDate: "2026-10-02",
      reason: "Optional Holiday 1",
    });

    await asEmployee.mutation(api.leaves.submitMyLeave, {
      workspaceId: ws1,
      leaveType: "restricted_holiday",
      startDate: "2026-11-01",
      endDate: "2026-11-01",
      reason: "Optional Holiday 2",
    });

    // 3rd day exceeds quota of 2
    await expect(
      asEmployee.mutation(api.leaves.submitMyLeave, {
        workspaceId: ws1,
        leaveType: "restricted_holiday",
        startDate: "2026-12-25",
        endDate: "2026-12-25",
        reason: "Optional Holiday 3 - Exceeds quota",
      })
    ).rejects.toThrow(/Restricted Holiday quota exceeded/i);

    // 12. Verify cancellation flow
    await asEmployee.mutation(api.leaves.cancelMyLeave, {
      workspaceId: ws1,
      requestId: req1,
    });
    const cancelledReq = await t.run(async (ctx) => ctx.db.get(req1));
    expect(cancelledReq?.status).toBe("cancelled");
  });
});
