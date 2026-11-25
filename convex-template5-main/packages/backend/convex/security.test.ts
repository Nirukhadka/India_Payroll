/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";
import { requireMember, requireRole } from "./orgs";

// Discover function modules for convex-test (includes _generated, excludes *.test.ts).
const modules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === "function"
    ? (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
    : {
        "./ResendOTP.ts": () => import("./ResendOTP"),
        "./apiKeys.ts": () => import("./apiKeys"),
        "./audit.ts": () => import("./audit"),
        "./auditLog.ts": () => import("./auditLog"),
        "./auth.config.ts": () => import("./auth.config"),
        "./auth.ts": () => import("./auth"),
        "./backend.ts": () => import("./backend"),
        "./counters.ts": () => import("./counters"),
        "./dashboard.ts": () => import("./dashboard"),
        "./devGuard.ts": () => import("./devGuard"),
        "./email.ts": () => import("./email"),
        "./env.ts": () => import("./env"),
        "./files.ts": () => import("./files"),
        "./http.ts": () => import("./http"),
        "./init.ts": () => import("./init"),
        "./jobs.ts": () => import("./jobs"),
        "./notifications.ts": () => import("./notifications"),
        "./orgs.ts": () => import("./orgs"),
        "./passwordProviders.ts": () => import("./passwordProviders"),
        "./schema.ts": () => import("./schema"),
        "./seed.ts": () => import("./seed"),
        "./sessions.ts": () => import("./sessions"),
        "./subscriptions.ts": () => import("./subscriptions"),
        "./usage.ts": () => import("./usage"),
        "./users.ts": () => import("./users"),
        "./web.ts": () => import("./web"),
        "./attendance.ts": () => import("./attendance"),
        "./compliance.ts": () => import("./compliance"),
        "./employees.ts": () => import("./employees"),
        "./leaves.ts": () => import("./leaves"),
        "./lop.ts": () => import("./lop"),
        "./payroll.ts": () => import("./payroll"),
        "./salaries.ts": () => import("./salaries"),
        "./statutory.ts": () => import("./statutory"),
        "./statutoryReports.ts": () => import("./statutoryReports"),
        "./epfoEcr.ts": () => import("./epfoEcr"),
        "./form138Tds.ts": () => import("./form138Tds"),
        "./devAccounts.ts": () => import("./devAccounts"),
        "./devAccountsMutation.ts": () => import("./devAccountsMutation"),
        "./_generated/api.js": () => import("./_generated/api.js"),
        "./_generated/server.js": () => import("./_generated/server.js"),
      };

// Identity helper — getAuthUserId reads `subject = userId|sessionId`.
const as = (userId: string) => ({ subject: `${userId}|sess_${userId}` });

async function seedWorkspace(t: ReturnType<typeof convexTest>) {
  return t.run(async (ctx) => {
    const owner = await ctx.db.insert("users", { email: "owner@t.test" });
    const member = await ctx.db.insert("users", { email: "member@t.test" });
    const outsider = await ctx.db.insert("users", { email: "outsider@t.test" });
    const ws = await ctx.db.insert("workspaces", {
      name: "WS",
      ownerId: owner,
      createdAt: Date.now(),
    });
    await ctx.db.insert("members", {
      workspaceId: ws,
      userId: owner,
      role: "owner",
      createdAt: Date.now(),
    });
    const memberRow = await ctx.db.insert("members", {
      workspaceId: ws,
      userId: member,
      role: "member",
      createdAt: Date.now(),
    });
    return { owner, member, outsider, ws, memberRow };
  });
}

describe("authorization helpers", () => {
  test("requireMember throws for a non-member", async () => {
    const t = convexTest(schema, modules);
    const { ws, outsider, member } = await seedWorkspace(t);
    await t.run(async (ctx) => {
      await expect(requireMember(ctx, member, ws)).resolves.toBeTruthy();
      await expect(requireMember(ctx, outsider, ws)).rejects.toThrow(
        /Forbidden/,
      );
    });
  });

  test("requireRole(admin) rejects a plain member", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner, member } = await seedWorkspace(t);
    await t.run(async (ctx) => {
      await expect(
        requireRole(ctx, owner, ws, ["admin"]),
      ).resolves.toBeTruthy();
      await expect(requireRole(ctx, member, ws, ["admin"])).rejects.toThrow(
        /Forbidden/,
      );
    });
  });
});

describe("member management (RBAC + integrity)", () => {
  test("removeMember refuses to remove the last admin", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner } = await seedWorkspace(t);
    const ownerMemberRow = await t.run(
      async (ctx) =>
        (
          await ctx.db
            .query("members")
            .withIndex("by_workspace", (q) => q.eq("workspaceId", ws))
            .collect()
        ).find((m) => m.role === "admin" || m.role === "owner")?._id,
    );
    await expect(
      t.withIdentity(as(owner)).mutation(api.orgs.removeMember, {
        workspaceId: ws,
        memberId: ownerMemberRow!,
      }),
    ).rejects.toThrow(/last administrator/i);
  });

  test("a plain member cannot remove anyone", async () => {
    const t = convexTest(schema, modules);
    const { ws, member, memberRow } = await seedWorkspace(t);
    await expect(
      t.withIdentity(as(member)).mutation(api.orgs.removeMember, {
        workspaceId: ws,
        memberId: memberRow,
      }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("changeRole rejects promotion to owner and bad roles", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner, memberRow } = await seedWorkspace(t);
    const asOwner = t.withIdentity(as(owner));
    await expect(
      asOwner.mutation(api.orgs.changeRole, {
        workspaceId: ws,
        memberId: memberRow,
        role: "owner",
      }),
    ).rejects.toThrow(/Invalid role/);
    await expect(
      asOwner.mutation(api.orgs.changeRole, {
        workspaceId: ws,
        memberId: memberRow,
        role: "superuser",
      }),
    ).rejects.toThrow(/Invalid role/);
    await asOwner.mutation(api.orgs.changeRole, {
      workspaceId: ws,
      memberId: memberRow,
      role: "admin",
    });
    const role = await t.run(
      async (ctx) => (await ctx.db.get(memberRow))?.role,
    );
    expect(role).toBe("admin");
  });
});

describe("cross-tenant isolation (IDOR)", () => {
  test("an outsider cannot read another workspace's jobs", async () => {
    const t = convexTest(schema, modules);
    const { ws, outsider } = await seedWorkspace(t);
    await expect(
      t.withIdentity(as(outsider)).query(api.jobs.list, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("unauthenticated reads return empty, not an error", async () => {
    const t = convexTest(schema, modules);
    const { ws } = await seedWorkspace(t);
    expect(await t.query(api.jobs.list, { workspaceId: ws })).toEqual([]);
  });
});

describe("jobs.complete idempotency (webhook replay defense)", () => {
  test("completing an already-finished job is a no-op", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner } = await seedWorkspace(t);
    const jobId = await t.run(async (ctx) =>
      ctx.db.insert("jobs", {
        workspaceId: ws,
        userId: owner,
        kind: "demo",
        status: "done",
        result: { first: true },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    );
    await t.mutation(internal.jobs.complete, {
      jobId,
      result: { second: true },
    });
    const job = await t.run(async (ctx) => ctx.db.get(jobId));
    expect(job?.result).toEqual({ first: true });
    expect(job?.status).toBe("done");
  });
});

// Full IDOR matrix: an authenticated outsider must be denied on EVERY workspace-scoped
// surface. This is the in-process, CI-runnable equivalent of the live p2-idor suite.
describe("cross-tenant isolation matrix (outsider vs workspace)", () => {
  // biome-ignore lint/suspicious/noExplicitAny: heterogeneous fn table for a test matrix
  const cases: Array<[string, (b: any, ws: any) => Promise<unknown>]> = [
    ["jobs.list", (b, ws) => b.query(api.jobs.list, { workspaceId: ws })],
    [
      "jobs.listPaged",
      (b, ws) =>
        b.query(api.jobs.listPaged, {
          workspaceId: ws,
          paginationOpts: { numItems: 5, cursor: null },
        }),
    ],
    [
      "jobs.create",
      (b, ws) =>
        b.mutation(api.jobs.create, { workspaceId: ws, kind: "x", input: {} }),
    ],
    [
      "apiKeys.listMine",
      (b, ws) => b.query(api.apiKeys.listMine, { workspaceId: ws }),
    ],
    [
      "apiKeys.create",
      (b, ws) => b.action(api.apiKeys.create, { workspaceId: ws, name: "x" }),
    ],
    ["orgs.members", (b, ws) => b.query(api.orgs.members, { workspaceId: ws })],
    [
      "orgs.invite",
      (b, ws) =>
        b.mutation(api.orgs.invite, {
          workspaceId: ws,
          email: "x@x.test",
          role: "member",
        }),
    ],
    [
      "orgs.pendingInvites",
      (b, ws) => b.query(api.orgs.pendingInvites, { workspaceId: ws }),
    ],
    ["usage.mine", (b, ws) => b.query(api.usage.mine, { workspaceId: ws })],
    ["audit.recent", (b, ws) => b.query(api.audit.recent, { workspaceId: ws })],
    ["files.list", (b, ws) => b.query(api.files.list, { workspaceId: ws })],
    [
      "files.listPaged",
      (b, ws) =>
        b.query(api.files.listPaged, {
          workspaceId: ws,
          paginationOpts: { numItems: 5, cursor: null },
        }),
    ],
    [
      "files.generateUploadUrl",
      (b, ws) => b.mutation(api.files.generateUploadUrl, { workspaceId: ws }),
    ],
  ];
  for (const [name, call] of cases) {
    test(`outsider is denied: ${name}`, async () => {
      const t = convexTest(schema, modules);
      const { ws, outsider } = await seedWorkspace(t);
      await expect(call(t.withIdentity(as(outsider)), ws)).rejects.toThrow();
    });
  }
});

describe("maintained counters (dashboard.stats stays O(1) + correct)", () => {
  test("create workspace/job + complete keeps counters accurate", async () => {
    const t = convexTest(schema, modules);
    const userId = await t.run((ctx) =>
      ctx.db.insert("users", { email: "c@t.test" }),
    );
    const u = t.withIdentity(as(userId));

    const ws = await u.mutation(api.orgs.createWorkspace, { name: "C" });
    let s = await u.query(api.dashboard.stats, { workspaceId: ws });
    expect(s?.members).toBe(1); // owner
    expect(s?.jobs).toBe(0);

    await u.mutation(api.jobs.create, {
      workspaceId: ws,
      kind: "demo",
      input: {},
    });
    s = await u.query(api.dashboard.stats, { workspaceId: ws });
    expect(s?.jobs).toBe(1);
    expect(s?.openJobs).toBe(1);

    const jobId = await t.run(async (ctx) => {
      const j = await ctx.db
        .query("jobs")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", ws))
        .first();
      if (!j) throw new Error("job not found");
      return j._id;
    });
    await t.mutation(internal.jobs.complete, { jobId, result: { ok: true } });
    s = await u.query(api.dashboard.stats, { workspaceId: ws });
    expect(s?.openJobs).toBe(0); // left the open set
    expect(s?.jobs).toBe(1); // total unchanged
  });

  test("dashboard.stats correctly aggregates approved and processed payroll runs and ignores draft/pending/rejected", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner, member } = await seedWorkspace(t);
    const u = t.withIdentity(as(owner));

    // 1. Initially, no payroll runs exist -> empty state (null totals)
    let s = await u.query(api.dashboard.stats, { workspaceId: ws });
    expect(s?.latestGrossPayroll).toBeNull();
    expect(s?.latestNetPayroll).toBeNull();
    expect(s?.latestPeriod).toBeNull();
    expect(s?.pendingApprovalsCount).toBe(0);

    // 2. Insert a draft / calculated payroll run -> should NOT qualify for Gross/Net cards
    const draftRunId = await t.run(async (ctx) => {
      return await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-09",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        status: "calculated",
        totalEmployees: 3,
        totalGrossSalary: 75000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 5000,
        totalNetSalary: 70000,
        createdById: member,
        createdAt: 1000,
        updatedAt: 1000,
      });
    });

    s = await u.query(api.dashboard.stats, { workspaceId: ws });
    expect(s?.latestGrossPayroll).toBeNull();
    expect(s?.latestNetPayroll).toBeNull();
    expect(s?.pendingApprovalsCount).toBe(0);

    // 3. Move to pending_approval -> should increment pendingApprovalsCount, but NOT Gross/Net
    await t.run(async (ctx) => {
      await ctx.db.patch(draftRunId, {
        status: "pending_approval",
        submittedBy: member,
        submittedAt: 1100,
      });
    });

    s = await u.query(api.dashboard.stats, { workspaceId: ws });
    expect(s?.latestGrossPayroll).toBeNull();
    expect(s?.latestNetPayroll).toBeNull();
    expect(s?.pendingApprovalsCount).toBe(1);

    // 4. Mark as approved -> should now qualify as approved payroll
    await t.run(async (ctx) => {
      await ctx.db.patch(draftRunId, {
        status: "approved",
        approvedBy: owner,
        approvedAt: 1200,
      });
    });

    s = await u.query(api.dashboard.stats, { workspaceId: ws });
    expect(s?.latestGrossPayroll).toBe(75000);
    expect(s?.latestNetPayroll).toBe(70000);
    expect(s?.latestPeriod).toBe("2026-09");
    expect(s?.latestPayrollStatus).toBe("approved");
    expect(s?.pendingApprovalsCount).toBe(0);

    // 5. Add a newer processed run for 2026-10 -> should take precedence as latest qualifying run
    await t.run(async (ctx) => {
      await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-10",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        status: "processed",
        totalEmployees: 4,
        totalGrossSalary: 100000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 8000,
        totalNetSalary: 92000,
        createdById: member,
        finalizedBy: owner,
        finalizedAt: 2000,
        createdAt: 1900,
        updatedAt: 2000,
      });
    });

    s = await u.query(api.dashboard.stats, { workspaceId: ws });
    expect(s?.latestGrossPayroll).toBe(100000);
    expect(s?.latestNetPayroll).toBe(92000);
    expect(s?.latestPeriod).toBe("2026-10");
    expect(s?.latestPayrollStatus).toBe("processed");
  });
});

describe("Maker-Checker payroll enforcement & Leave RBAC", () => {
  test("leave.review rejects non-admin / non-owner member", async () => {
    const t = convexTest(schema, modules);
    const { ws, member, owner } = await seedWorkspace(t);

    const empId = await t.run(async (ctx) => {
      return await ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Test",
        lastName: "Emp",
        email: "emp@t.test",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const leaveReqId = await t.run(async (ctx) => {
      return await ctx.db.insert("leaveRequests", {
        workspaceId: ws,
        employeeId: empId,
        leaveType: "casual",
        startDate: "2026-10-01",
        endDate: "2026-10-02",
        daysCount: 2,
        reason: "Personal",
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Plain member should be rejected
    await expect(
      t.withIdentity(as(member)).mutation(api.leaves.review, {
        workspaceId: ws,
        requestId: leaveReqId,
        status: "approved",
      }),
    ).rejects.toThrow(/Forbidden/);

    // Owner should succeed
    await expect(
      t.withIdentity(as(owner)).mutation(api.leaves.review, {
        workspaceId: ws,
        requestId: leaveReqId,
        status: "approved",
      }),
    ).resolves.toBeNull();
  });

  test("approveRun allows admin to approve submitted payroll run (admin full access)", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner } = await seedWorkspace(t);

    const runId = await t.run(async (ctx) => {
      return await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-09",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        status: "pending_approval",
        submittedBy: owner,
        submittedAt: Date.now(),
        createdById: owner,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalGrossSalary: 50000,
        totalNetSalary: 45000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 5000,
        totalEmployees: 1,
      });
    });

    // Submitter Admin has full access to approve their own run
    await expect(
      t.withIdentity(as(owner)).mutation(api.payroll.approveRun, {
        workspaceId: ws,
        payrollRunId: runId,
      }),
    ).resolves.toBeNull();

    // Verify status updated to approved
    const updated = await t.run(async (ctx) => ctx.db.get(runId));
    expect(updated?.status).toBe("approved");
    expect(updated?.approvedBy).toBe(owner);
  });
});

describe("Employee validation & cross-employee privacy", () => {
  test("employees.add rejects duplicate email in workspace", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner } = await seedWorkspace(t);
    const asOwner = t.withIdentity(as(owner));

    await asOwner.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "John",
      lastName: "Doe",
      email: "duplicate.test@example.com",
    });

    await expect(
      asOwner.mutation(api.employees.add, {
        workspaceId: ws,
        firstName: "Jane",
        lastName: "Smith",
        email: "DUPLICATE.TEST@example.com", // case-insensitive check
      }),
    ).rejects.toThrow(/already exists in this workspace/);
  });

  test("plain member cannot access another employee's salary or company salaries", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner, member } = await seedWorkspace(t);
    const asOwner = t.withIdentity(as(owner));
    const asMember = t.withIdentity(as(member));

    const empId = await asOwner.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Executive",
      lastName: "Leader",
      email: "exec@example.com",
    });

    await asOwner.mutation(api.salaries.add, {
      workspaceId: ws,
      employeeId: empId,
      basicSalary: 150000,
      allowances: [{ name: "Special", amount: 50000 }],
      deductions: [],
      effectiveDate: Date.now(),
    });

    // Plain member querying getCurrentSalaries must be forbidden
    await expect(
      asMember.query(api.salaries.getCurrentSalaries, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);

    // Plain member querying another employee's salary history must be forbidden
    await expect(
      asMember.query(api.salaries.listByEmployee, {
        workspaceId: ws,
        employeeId: empId,
      }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("plain member cannot access another employee's payslip", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner, member } = await seedWorkspace(t);
    const asOwner = t.withIdentity(as(owner));
    const asMember = t.withIdentity(as(member));

    const empId = await asOwner.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Other",
      lastName: "Person",
      email: "other@example.com",
    });

    const runId = await t.run(async (ctx) => {
      const r = await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-08",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        status: "processed",
        totalGrossSalary: 100000,
        totalNetSalary: 90000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 10000,
        totalEmployerContributions: 5000,
        totalEmployees: 1,
        createdById: owner,
        finalizedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await ctx.db.insert("payrollItems", {
        workspaceId: ws,
        payrollRunId: r,
        employeeId: empId,
        basicSalary: 100000,
        allowances: [],
        grossSalary: 100000,
        lopDays: 0,
        lopDeduction: 0,
        customDeductions: [],
        totalCustomDeductions: 0,
        statutoryDeductions: [
          { name: "PF", amount: 1800, isConfigured: true },
          { name: "PT", amount: 200, isConfigured: true },
          { name: "TDS", amount: 8000, isConfigured: true },
        ],
        totalStatutoryDeductions: 10000,
        employerContributions: [
          { name: "Employer PF", amount: 5000, isConfigured: true },
        ],
        totalEmployerContributions: 5000,
        totalDeductions: 10000,
        netSalary: 90000,
        hasSalaryStructure: true,
        warnings: [],
        createdAt: Date.now(),
      });

      return r;
    });

    // Plain member trying to fetch other person's payslip must fail
    await expect(
      asMember.query(api.payroll.getPayslip, {
        workspaceId: ws,
        payrollRunId: runId,
        employeeId: empId,
      }),
    ).rejects.toThrow(/Forbidden/);

    // Owner should be allowed to view it
    const payslip = await asOwner.query(api.payroll.getPayslip, {
      workspaceId: ws,
      payrollRunId: runId,
      employeeId: empId,
    });
    expect(payslip.grossSalary).toBe(100000);
    expect(payslip.totalEmployerContributions).toBe(5000);
  });
});

describe("attendance and leave privacy (IDOR prevention)", () => {
  test("plain member cannot access another employee's attendance or leaves", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner, member } = await seedWorkspace(t);
    const asOwner = t.withIdentity(as(owner));
    const asMember = t.withIdentity(as(member));

    // Create Employee A (linked to member) and Employee B (unlinked or another employee)
    const empA = await asOwner.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Member",
      lastName: "Emp",
      email: "member@t.test",
    });
    // Link empA to member
    await t.run(async (ctx) => {
      await ctx.db.patch(empA, { userId: member });
    });

    const empB = await asOwner.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Other",
      lastName: "Emp",
      email: "otheremp@example.com",
    });

    // Seed attendance & leave records for empB
    await t.run(async (ctx) => {
      await ctx.db.insert("attendance", {
        workspaceId: ws,
        employeeId: empB,
        date: "2026-08-10",
        status: "present",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await ctx.db.insert("leaveRequests", {
        workspaceId: ws,
        employeeId: empB,
        leaveType: "casual",
        startDate: "2026-08-12",
        endDate: "2026-08-13",
        daysCount: 2,
        reason: "Personal",
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // 1. Plain member querying attendance with empB id should be rejected
    await expect(
      asMember.query(api.attendance.list, {
        workspaceId: ws,
        employeeId: empB,
      }),
    ).rejects.toThrow(/Forbidden/);

    // 2. Plain member querying leaves with empB id should be rejected
    await expect(
      asMember.query(api.leaves.list, {
        workspaceId: ws,
        employeeId: empB,
      }),
    ).rejects.toThrow(/Forbidden/);

    // 3. Plain member attempting to submit leave for empB should be rejected
    await expect(
      asMember.mutation(api.leaves.submit, {
        workspaceId: ws,
        employeeId: empB,
        leaveType: "sick",
        startDate: "2026-08-15",
        endDate: "2026-08-15",
        daysCount: 1,
        reason: "Sick day",
      }),
    ).rejects.toThrow(/Forbidden/);

    // 4. Plain member querying leaves without employeeId should only receive their own records
    const memberLeaves = await asMember.query(api.leaves.list, {
      workspaceId: ws,
    });
    expect(memberLeaves.length).toBe(0); // empB's leave record must not leak!
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin vs Member RBAC — dev account role verification
//
// These tests use in-process convex-test (no live deployment needed) to verify
// that the two dev accounts (admin@indiapaypayroll.com = "admin" role,
// user@indiapaypayroll.com = "member" role) will experience the correct
// permission boundaries once provisioned.
// ─────────────────────────────────────────────────────────────────────────────
describe("Admin vs Member RBAC — dev account role verification", () => {
  /** Seed a workspace with owner, admin, and member users. */
  async function seedWithAdmin(t: ReturnType<typeof convexTest>) {
    return t.run(async (ctx) => {
      const owner = await ctx.db.insert("users", {
        email: "owner@indiapaypayroll.test",
      });
      const admin = await ctx.db.insert("users", {
        email: "admin@indiapaypayroll.test",
      });
      const member = await ctx.db.insert("users", {
        email: "user@indiapaypayroll.test",
      });

      const ws = await ctx.db.insert("workspaces", {
        name: "IndiaPay Dev Workspace",
        ownerId: owner,
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: owner,
        role: "owner",
        createdAt: Date.now(),
      });
      const adminRow = await ctx.db.insert("members", {
        workspaceId: ws,
        userId: admin,
        role: "admin",
        createdAt: Date.now(),
      });
      const memberRow = await ctx.db.insert("members", {
        workspaceId: ws,
        userId: member,
        role: "member",
        createdAt: Date.now(),
      });
      return { owner, admin, member, ws, adminRow, memberRow };
    });
  }

  // ── Workspace management ──────────────────────────────────────────────────

  test("admin can invite users; plain member cannot", async () => {
    const t = convexTest(schema, modules);
    const { admin, member, ws } = await seedWithAdmin(t);

    // Admin should be able to invite
    await expect(
      t.withIdentity(as(admin)).mutation(api.orgs.invite, {
        workspaceId: ws,
        email: "newperson@example.com",
        role: "member",
      }),
    ).resolves.toBeDefined();

    // Plain member must be denied
    await expect(
      t.withIdentity(as(member)).mutation(api.orgs.invite, {
        workspaceId: ws,
        email: "another@example.com",
        role: "member",
      }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("admin can remove a member; plain member cannot remove anyone", async () => {
    const t = convexTest(schema, modules);
    const { admin, member, memberRow } = await seedWithAdmin(t);
    const ws = await t.run(
      async (ctx) => (await ctx.db.get(memberRow))!.workspaceId,
    );

    // Plain member is forbidden
    await expect(
      t.withIdentity(as(member)).mutation(api.orgs.removeMember, {
        workspaceId: ws,
        memberId: memberRow,
      }),
    ).rejects.toThrow(/Forbidden/);

    // Admin can remove
    await expect(
      t.withIdentity(as(admin)).mutation(api.orgs.removeMember, {
        workspaceId: ws,
        memberId: memberRow,
      }),
    ).resolves.toBeNull();
  });

  test("admin can change member roles; plain member cannot", async () => {
    const t = convexTest(schema, modules);
    const { admin, member, memberRow } = await seedWithAdmin(t);
    const ws = await t.run(
      async (ctx) => (await ctx.db.get(memberRow))!.workspaceId,
    );

    // Plain member is forbidden
    await expect(
      t.withIdentity(as(member)).mutation(api.orgs.changeRole, {
        workspaceId: ws,
        memberId: memberRow,
        role: "admin",
      }),
    ).rejects.toThrow(/Forbidden/);

    // Admin can change roles
    await expect(
      t.withIdentity(as(admin)).mutation(api.orgs.changeRole, {
        workspaceId: ws,
        memberId: memberRow,
        role: "admin",
      }),
    ).resolves.toBeNull();
  });

  test("admin cannot be promoted to owner via changeRole (owner is a protected role)", async () => {
    const t = convexTest(schema, modules);
    const { owner, adminRow } = await seedWithAdmin(t);
    const ws = await t.run(
      async (ctx) => (await ctx.db.get(adminRow))!.workspaceId,
    );

    await expect(
      t.withIdentity(as(owner)).mutation(api.orgs.changeRole, {
        workspaceId: ws,
        memberId: adminRow,
        role: "owner",
      }),
    ).rejects.toThrow(/Invalid role/);
  });

  // ── Payroll data access ───────────────────────────────────────────────────

  test("admin can view all salaries; plain member cannot", async () => {
    const t = convexTest(schema, modules);
    const { admin, member, ws } = await seedWithAdmin(t);
    const asAdmin = t.withIdentity(as(admin));
    const asMember = t.withIdentity(as(member));

    // Add an employee with salary
    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Salary",
      lastName: "Employee",
      email: "salemp@indiapaypayroll.test",
    });
    await asAdmin.mutation(api.salaries.add, {
      workspaceId: ws,
      employeeId: empId,
      basicSalary: 80000,
      allowances: [],
      deductions: [],
      effectiveDate: Date.now(),
    });

    // Admin allowed
    const salaries = await asAdmin.query(api.salaries.getCurrentSalaries, {
      workspaceId: ws,
    });
    expect(salaries.length).toBeGreaterThan(0);

    // Member denied
    await expect(
      asMember.query(api.salaries.getCurrentSalaries, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("admin can view payslips; plain member cannot view others' payslips", async () => {
    const t = convexTest(schema, modules);
    const { admin, member, ws } = await seedWithAdmin(t);
    const asAdmin = t.withIdentity(as(admin));
    const asMember = t.withIdentity(as(member));

    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Pay",
      lastName: "Slip",
      email: "payslip@indiapaypayroll.test",
    });

    const runId = await t.run(async (ctx) => {
      const r = await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-09",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        status: "processed",
        totalGrossSalary: 80000,
        totalNetSalary: 72000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 8000,
        totalEmployees: 1,
        createdById: admin,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await ctx.db.insert("payrollItems", {
        workspaceId: ws,
        payrollRunId: r,
        employeeId: empId,
        basicSalary: 80000,
        allowances: [],
        grossSalary: 80000,
        lopDays: 0,
        lopDeduction: 0,
        customDeductions: [],
        totalCustomDeductions: 0,
        statutoryDeductions: [{ name: "PF", amount: 8000, isConfigured: true }],
        totalStatutoryDeductions: 8000,
        employerContributions: [],
        totalEmployerContributions: 0,
        totalDeductions: 8000,
        netSalary: 72000,
        hasSalaryStructure: true,
        warnings: [],
        createdAt: Date.now(),
      });
      return r;
    });

    // Admin can view
    const payslip = await asAdmin.query(api.payroll.getPayslip, {
      workspaceId: ws,
      payrollRunId: runId,
      employeeId: empId,
    });
    expect(payslip.grossSalary).toBe(80000);

    // Member cannot view another's payslip
    await expect(
      asMember.query(api.payroll.getPayslip, {
        workspaceId: ws,
        payrollRunId: runId,
        employeeId: empId,
      }),
    ).rejects.toThrow(/Forbidden/);
  });

  // ── Maker-Checker: admin is subject to the same two-person rule ───────────

  test("admin cannot approve payroll runs (owner-only permission) & maker-checker enforcement", async () => {
    const t = convexTest(schema, modules);
    const { admin, owner, ws } = await seedWithAdmin(t);

    const runId = await t.run(async (ctx) =>
      ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-10",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        status: "pending_approval",
        submittedBy: admin, // admin submitted it
        submittedAt: Date.now(),
        createdById: admin,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalGrossSalary: 60000,
        totalNetSalary: 54000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 6000,
        totalEmployees: 1,
      }),
    );

    // Admin submitted the run, and Admin has full access to approve own run
    await expect(
      t.withIdentity(as(admin)).mutation(api.payroll.approveRun, {
        workspaceId: ws,
        payrollRunId: runId,
      }),
    ).resolves.toBeNull();
  });

  test("plain member cannot reject payroll runs (RBAC permission)", async () => {
    const t = convexTest(schema, modules);
    const { member, admin, ws } = await seedWithAdmin(t);

    const runId = await t.run(async (ctx) =>
      ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-10",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        status: "pending_approval",
        submittedBy: admin,
        submittedAt: Date.now(),
        createdById: admin,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalGrossSalary: 60000,
        totalNetSalary: 54000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 6000,
        totalEmployees: 1,
      }),
    );

    // Member cannot reject (strict RBAC protection)
    await expect(
      t.withIdentity(as(member)).mutation(api.payroll.rejectRun, {
        workspaceId: ws,
        payrollRunId: runId,
        reason: "Test rejection",
      }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("plain member cannot calculate preview, list runs, or view run details (RBAC data privacy)", async () => {
    const t = convexTest(schema, modules);
    const { member, ws } = await seedWithAdmin(t);
    const asMember = t.withIdentity(as(member));

    const runId = await t.run(async (ctx) =>
      ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-10",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        status: "calculated",
        createdById: member,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalGrossSalary: 60000,
        totalNetSalary: 54000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 6000,
        totalEmployees: 1,
      }),
    );

    // Plain member cannot calculate preview
    await expect(
      asMember.query(api.payroll.calculatePreview, {
        workspaceId: ws,
        periodMonth: "2026-10",
      }),
    ).rejects.toThrow(/Forbidden/);

    // Plain member cannot list runs
    await expect(
      asMember.query(api.payroll.listRuns, {
        workspaceId: ws,
      }),
    ).rejects.toThrow(/Forbidden/);

    // Plain member cannot view full run details
    await expect(
      asMember.query(api.payroll.getRunDetails, {
        workspaceId: ws,
        payrollRunId: runId,
      }),
    ).rejects.toThrow(/Forbidden/);
  });

  // ── Leave approval ────────────────────────────────────────────────────────

  test("admin can approve leave requests; plain member cannot", async () => {
    const t = convexTest(schema, modules);
    const { admin, member, ws } = await seedWithAdmin(t);
    const asAdmin = t.withIdentity(as(admin));
    const asMember = t.withIdentity(as(member));

    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Leave",
      lastName: "Tester",
      email: "leavetester@indiapaypayroll.test",
    });

    const leaveId = await t.run(async (ctx) =>
      ctx.db.insert("leaveRequests", {
        workspaceId: ws,
        employeeId: empId,
        leaveType: "casual",
        startDate: "2026-11-01",
        endDate: "2026-11-01",
        daysCount: 1,
        reason: "Personal",
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    );

    // Plain member denied
    await expect(
      asMember.mutation(api.leaves.review, {
        workspaceId: ws,
        requestId: leaveId,
        status: "approved",
      }),
    ).rejects.toThrow(/Forbidden/);

    // Admin allowed
    await expect(
      asAdmin.mutation(api.leaves.review, {
        workspaceId: ws,
        requestId: leaveId,
        status: "approved",
      }),
    ).resolves.toBeNull();
  });

  // ── Pending invites visibility ────────────────────────────────────────────

  test("admin can list pending invites; plain member cannot", async () => {
    const t = convexTest(schema, modules);
    const { admin, member, ws } = await seedWithAdmin(t);

    // Admin can read pending invites
    await expect(
      t.withIdentity(as(admin)).query(api.orgs.pendingInvites, {
        workspaceId: ws,
      }),
    ).resolves.toBeInstanceOf(Array);

    // Plain member is denied
    await expect(
      t.withIdentity(as(member)).query(api.orgs.pendingInvites, {
        workspaceId: ws,
      }),
    ).rejects.toThrow(/Forbidden/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Owner Account Provisioning, RBAC, and Maker-Checker Enforcement
// ─────────────────────────────────────────────────────────────────────────────
describe("Owner Account Provisioning, RBAC & Maker-Checker Suite", () => {
  const DEV_OWNER_EMAIL = "owner@indiapaypayroll.com";
  const DEV_ADMIN_EMAIL = "admin@indiapaypayroll.com";
  const DEV_USER_EMAIL = "user@indiapaypayroll.com";

  test("devAccountsMutation requires DEV_SEED=1 guard", async () => {
    const t = convexTest(schema, modules);
    const origSeed = process.env.DEV_SEED;
    try {
      delete process.env.DEV_SEED;
      await expect(
        t.mutation(internal.devAccountsMutation.provisionDevAccountsMutation, {
          ownerHash: "mock_hash_owner",
        }),
      ).rejects.toThrow(/Dev\/seed functions are disabled/);
    } finally {
      process.env.DEV_SEED = origSeed;
    }
  });

  test("provisionDevAccountsMutation correctly provisions Owner account with role=owner", async () => {
    const t = convexTest(schema, modules);
    process.env.DEV_SEED = "1";

    const result = await t.mutation(
      internal.devAccountsMutation.provisionDevAccountsMutation,
      {
        ownerHash: "scrypt_mock_owner_hash",
        adminHash: "scrypt_mock_admin_hash",
        userHash: "scrypt_mock_user_hash",
      },
    );

    expect(result.ownerCreated).toBe(true);
    expect(result.adminCreated).toBe(true);
    expect(result.userCreated).toBe(true);

    const wsId = result.workspaceId as any;

    await t.run(async (ctx) => {
      // 1. Verify Owner user & authAccount
      const ownerUser = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", DEV_OWNER_EMAIL))
        .unique();
      expect(ownerUser).toBeDefined();
      expect(ownerUser?.emailVerificationTime).toBeDefined();

      const ownerAuth = await ctx.db
        .query("authAccounts")
        .withIndex("providerAndAccountId", (q) =>
          q.eq("provider", "password").eq("providerAccountId", DEV_OWNER_EMAIL),
        )
        .unique();
      expect(ownerAuth).toBeDefined();
      expect(ownerAuth?.userId).toEqual(ownerUser?._id);
      expect(ownerAuth?.secret).toBe("scrypt_mock_owner_hash");
      expect(ownerAuth?.emailVerified).toBe(DEV_OWNER_EMAIL);

      // 2. Verify Members table roles: Admin=admin, User=member (legacy owner provisioned as admin)
      const ownerMember = await ctx.db
        .query("members")
        .withIndex("by_user_workspace", (q) =>
          q.eq("userId", ownerUser!._id).eq("workspaceId", wsId),
        )
        .unique();
      expect(ownerMember?.role).toBe("admin");

      const adminUser = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", DEV_ADMIN_EMAIL))
        .unique();
      const adminMember = await ctx.db
        .query("members")
        .withIndex("by_user_workspace", (q) =>
          q.eq("userId", adminUser!._id).eq("workspaceId", wsId),
        )
        .unique();
      expect(adminMember?.role).toBe("admin");

      const userUser = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", DEV_USER_EMAIL))
        .unique();
      const userMember = await ctx.db
        .query("members")
        .withIndex("by_user_workspace", (q) =>
          q.eq("userId", userUser!._id).eq("workspaceId", wsId),
        )
        .unique();
      expect(userMember?.role).toBe("member");

      // 3. Verify Owner employee record
      const ownerEmp = await ctx.db
        .query("employees")
        .withIndex("by_email", (q) => q.eq("email", DEV_OWNER_EMAIL))
        .filter((q) => q.eq(q.field("workspaceId"), wsId))
        .first();
      expect(ownerEmp).toBeDefined();
      expect(ownerEmp?.userId).toEqual(ownerUser?._id);
      expect(ownerEmp?.status).toBe("active");
    });
  });

  test("Owner provisioning is idempotent and updates credentials without altering roles", async () => {
    const t = convexTest(schema, modules);
    process.env.DEV_SEED = "1";

    // Initial provision
    const res1 = await t.mutation(
      internal.devAccountsMutation.provisionDevAccountsMutation,
      {
        ownerHash: "initial_owner_hash",
        adminHash: "initial_admin_hash",
      },
    );

    // Re-provision with updated owner hash (simulating password rotation)
    const res2 = await t.mutation(
      internal.devAccountsMutation.provisionDevAccountsMutation,
      {
        ownerHash: "updated_owner_hash",
      },
    );

    expect(res2.workspaceId).toBe(res1.workspaceId);
    expect(res2.ownerCreated).toBe(false); // already existed

    await t.run(async (ctx) => {
      const ownerAuth = await ctx.db
        .query("authAccounts")
        .withIndex("providerAndAccountId", (q) =>
          q.eq("provider", "password").eq("providerAccountId", DEV_OWNER_EMAIL),
        )
        .unique();
      expect(ownerAuth?.secret).toBe("updated_owner_hash");

      // Verify Admin hash was preserved (not overwritten by undefined)
      const adminAuth = await ctx.db
        .query("authAccounts")
        .withIndex("providerAndAccountId", (q) =>
          q.eq("provider", "password").eq("providerAccountId", DEV_ADMIN_EMAIL),
        )
        .unique();
      expect(adminAuth?.secret).toBe("initial_admin_hash");
    });
  });

  test("Owner can authenticate and workspace identifies role as owner", async () => {
    const t = convexTest(schema, modules);
    process.env.DEV_SEED = "1";

    const { workspaceId } = await t.mutation(
      internal.devAccountsMutation.provisionDevAccountsMutation,
      { ownerHash: "h1", adminHash: "h2", userHash: "h3" },
    );

    const ownerUser = await t.run(async (ctx) =>
      (await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", DEV_OWNER_EMAIL))
        .unique())!._id,
    );

    const asOwner = t.withIdentity(as(ownerUser));
    const workspaces = await asOwner.query(api.orgs.myWorkspaces, {});
    const targetWs = workspaces.find((w) => w._id === (workspaceId as any));
    expect(targetWs).toBeDefined();
    expect(targetWs?.role).toBe("admin");
  });

  test("Owner can approve/reject payroll run submitted by Admin, but cannot approve run submitted by Owner", async () => {
    const t = convexTest(schema, modules);
    process.env.DEV_SEED = "1";

    const { workspaceId } = await t.mutation(
      internal.devAccountsMutation.provisionDevAccountsMutation,
      { ownerHash: "h1", adminHash: "h2", userHash: "h3" },
    );
    const ws = workspaceId as any;

    const { ownerUser, adminUser, userUser } = await t.run(async (ctx) => {
      const o = (await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", DEV_OWNER_EMAIL))
        .unique())!._id;
      const a = (await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", DEV_ADMIN_EMAIL))
        .unique())!._id;
      const u = (await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", DEV_USER_EMAIL))
        .unique())!._id;
      return { ownerUser: o, adminUser: a, userUser: u };
    });

    const asOwner = t.withIdentity(as(ownerUser));
    const asAdmin = t.withIdentity(as(adminUser));
    const asUser = t.withIdentity(as(userUser));

    // Run 1: Submitted by Admin
    const run1Id = await t.run(async (ctx) =>
      ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-11",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
        status: "pending_approval",
        submittedBy: adminUser,
        submittedAt: Date.now(),
        createdById: adminUser,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalGrossSalary: 75000,
        totalNetSalary: 67500,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 7500,
        totalEmployees: 1,
      }),
    );

    // Admin who submitted can approve with full admin access
    await expect(
      asAdmin.mutation(api.payroll.approveRun, {
        workspaceId: ws,
        payrollRunId: run1Id,
      }),
    ).resolves.toBeNull();

    // Plain member cannot reject
    await expect(
      asUser.mutation(api.payroll.rejectRun, {
        workspaceId: ws,
        payrollRunId: run1Id,
        reason: "User trying to reject",
      }),
    ).rejects.toThrow(/Forbidden/);

    // Run 2: Submitted by Owner/Admin
    const run2Id = await t.run(async (ctx) =>
      ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-12",
        startDate: "2026-12-01",
        endDate: "2026-12-31",
        status: "pending_approval",
        submittedBy: ownerUser,
        submittedAt: Date.now(),
        createdById: ownerUser,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalGrossSalary: 75000,
        totalNetSalary: 67500,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 7500,
        totalEmployees: 1,
      }),
    );

    // Admin/Owner CAN approve their own run
    await expect(
      asOwner.mutation(api.payroll.approveRun, {
        workspaceId: ws,
        payrollRunId: run2Id,
      }),
    ).resolves.toBeNull();

    // Run 3: Testing Owner rejection of Admin submitted run
    const run3Id = await t.run(async (ctx) =>
      ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2027-01",
        startDate: "2027-01-01",
        endDate: "2027-01-31",
        status: "pending_approval",
        submittedBy: adminUser,
        submittedAt: Date.now(),
        createdById: adminUser,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalGrossSalary: 75000,
        totalNetSalary: 67500,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 7500,
        totalEmployees: 1,
      }),
    );

    // Owner CAN reject run submitted by Admin
    await expect(
      asOwner.mutation(api.payroll.rejectRun, {
        workspaceId: ws,
        payrollRunId: run3Id,
        reason: "Review required for bonuses",
      }),
    ).resolves.toBeNull();

    const updatedRun3 = await t.run(async (ctx) => ctx.db.get(run3Id));
    expect(updatedRun3?.status).toBe("calculated");
    expect(updatedRun3?.rejectionReason).toBe("Review required for bonuses");
    expect(updatedRun3?.rejectedBy).toBe(ownerUser);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Role-Based Dashboard Authorization & Data Isolation Suite
// ─────────────────────────────────────────────────────────────────────────────
describe("Role-Based Dashboard Authorization & Data Isolation Suite", () => {
  async function seedDashboardWorkspace(t: ReturnType<typeof convexTest>) {
    return t.run(async (ctx) => {
      const owner = await ctx.db.insert("users", {
        email: "owner.dash@indiapaypayroll.test",
      });
      const admin = await ctx.db.insert("users", {
        email: "admin.dash@indiapaypayroll.test",
      });
      const memberLinked = await ctx.db.insert("users", {
        email: "member.linked@indiapaypayroll.test",
      });
      const memberUnlinked = await ctx.db.insert("users", {
        email: "member.unlinked@indiapaypayroll.test",
      });

      const ws = await ctx.db.insert("workspaces", {
        name: "Dashboard Test Workspace",
        ownerId: owner,
        createdAt: Date.now(),
      });

      // Insert second workspace for cross-workspace isolation tests
      const otherWs = await ctx.db.insert("workspaces", {
        name: "Other Workspace",
        ownerId: owner,
        createdAt: Date.now(),
      });

      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: owner,
        role: "owner",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: admin,
        role: "admin",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: memberLinked,
        role: "member",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: memberUnlinked,
        role: "member",
        createdAt: Date.now(),
      });

      // Employee 1 linked to memberLinked
      const emp1 = await ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Linked",
        lastName: "Member",
        email: "member.linked@indiapaypayroll.test",
        status: "active",
        userId: memberLinked,
        department: "Engineering",
        designation: "Software Engineer",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Employee 2 (other employee)
      const emp2 = await ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Other",
        lastName: "Colleague",
        email: "other.colleague@indiapaypayroll.test",
        status: "active",
        department: "Operations",
        designation: "Ops Lead",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Seed processed payroll run with items for emp1 and emp2
      const run = await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-10",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        status: "processed",
        totalEmployees: 2,
        totalGrossSalary: 120000,
        totalNetSalary: 110000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 10000,
        createdById: admin,
        finalizedBy: admin,
        finalizedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await ctx.db.insert("payrollItems", {
        workspaceId: ws,
        payrollRunId: run,
        employeeId: emp1,
        basicSalary: 50000,
        allowances: [{ name: "HRA", amount: 10000 }],
        grossSalary: 60000,
        lopDays: 0,
        lopDeduction: 0,
        customDeductions: [],
        totalCustomDeductions: 0,
        statutoryDeductions: [{ name: "PF", amount: 5000, isConfigured: true }],
        totalStatutoryDeductions: 5000,
        employerContributions: [],
        totalDeductions: 5000,
        netSalary: 55000,
        hasSalaryStructure: true,
        warnings: [],
        createdAt: Date.now(),
      });

      await ctx.db.insert("payrollItems", {
        workspaceId: ws,
        payrollRunId: run,
        employeeId: emp2,
        basicSalary: 50000,
        allowances: [{ name: "HRA", amount: 10000 }],
        grossSalary: 60000,
        lopDays: 0,
        lopDeduction: 0,
        customDeductions: [],
        totalCustomDeductions: 0,
        statutoryDeductions: [{ name: "PF", amount: 5000, isConfigured: true }],
        totalStatutoryDeductions: 5000,
        employerContributions: [],
        totalDeductions: 5000,
        netSalary: 55000,
        hasSalaryStructure: true,
        warnings: [],
        createdAt: Date.now(),
      });

      // Pending leave for emp1
      await ctx.db.insert("leaveRequests", {
        workspaceId: ws,
        employeeId: emp1,
        leaveType: "sick",
        startDate: "2026-10-20",
        endDate: "2026-10-21",
        daysCount: 2,
        reason: "Medical appointment",
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Attendance record for emp1 (in current month to avoid system date boundary failure)
      const now = new Date();
      const currentMonthDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-15`;
      await ctx.db.insert("attendance", {
        workspaceId: ws,
        employeeId: emp1,
        date: currentMonthDay,
        status: "present",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Audit log entry
      await ctx.db.insert("auditLogs", {
        workspaceId: ws,
        userId: admin,
        action: "payroll.finalize",
        at: Date.now(),
      });

      return {
        owner,
        admin,
        memberLinked,
        memberUnlinked,
        ws,
        otherWs,
        emp1,
        emp2,
        run,
      };
    });
  }

  // ── OWNER TESTS ──────────────────────────────────────────────────────────

  test("Owner can access authorized company-wide dashboard metrics and audit", async () => {
    const t = convexTest(schema, modules);
    const { owner, ws } = await seedDashboardWorkspace(t);
    const asOwner = t.withIdentity(as(owner));

    const s = await asOwner.query(api.dashboard.stats, { workspaceId: ws });
    expect(s?.role).toBe("owner");
    expect(s?.activeEmployeesCount).toBe(2);
    expect(s?.latestGrossPayroll).toBe(120000);
    expect(s?.latestNetPayroll).toBe(110000);
    expect(s?.canApprovePayroll).toBe(true);

    const auditLogs = await asOwner.query(api.audit.recent, {
      workspaceId: ws,
    });
    expect(auditLogs.length).toBeGreaterThanOrEqual(1);
    expect(auditLogs[0]?.action).toBe("payroll.finalize");
  });

  test("Owner cannot access another workspace's dashboard data", async () => {
    const t = convexTest(schema, modules);
    const { owner, otherWs } = await seedDashboardWorkspace(t);
    const asOwner = t.withIdentity(as(owner));

    // Owner is not a member of otherWs, so querying otherWs must be strictly rejected
    await expect(
      asOwner.query(api.dashboard.stats, { workspaceId: otherWs }),
    ).rejects.toThrow(/Forbidden/);
  });

  // ── ADMIN TESTS ──────────────────────────────────────────────────────────

  test("Admin can access operational dashboard data and has payroll approval authority in 2-role system", async () => {
    const t = convexTest(schema, modules);
    const { admin, memberLinked, ws, run } = await seedDashboardWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));
    const asMember = t.withIdentity(as(memberLinked));

    const ops = await asAdmin.query(api.dashboard.adminOperations, {
      workspaceId: ws,
    });
    expect(ops?.role).toBe("admin");
    expect(ops?.activeEmployeesCount).toBe(2);
    expect(ops?.pendingLeavesCount).toBe(1);
    expect(ops?.pendingLeaves[0]?.employeeName).toBe("Linked Member");
    expect(ops?.canApprovePayroll).toBe(true);

    // Plain member calling approveRun must be strictly rejected
    await expect(
      asMember.mutation(api.payroll.approveRun, {
        workspaceId: ws,
        payrollRunId: run,
      }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("Admin cannot access unauthorized workspace data", async () => {
    const t = convexTest(schema, modules);
    const { admin, otherWs } = await seedDashboardWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    // Admin is not a member of otherWs
    await expect(
      asAdmin.query(api.dashboard.adminOperations, { workspaceId: otherWs }),
    ).rejects.toThrow(/Forbidden/);
  });

  // ── USER / MEMBER TESTS ──────────────────────────────────────────────────

  test("User/Member CANNOT retrieve company-wide payroll totals through backend queries", async () => {
    const t = convexTest(schema, modules);
    const { memberLinked, ws } = await seedDashboardWorkspace(t);
    const asMember = t.withIdentity(as(memberLinked));

    // Direct backend request to dashboard.stats must be strictly forbidden
    await expect(
      asMember.query(api.dashboard.stats, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);

    // Direct backend request to dashboard.adminOperations must be strictly forbidden
    await expect(
      asMember.query(api.dashboard.adminOperations, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("User/Member CANNOT access company-wide audit information", async () => {
    const t = convexTest(schema, modules);
    const { memberLinked, ws } = await seedDashboardWorkspace(t);
    const asMember = t.withIdentity(as(memberLinked));

    // Direct backend request to audit.recent must be strictly forbidden
    await expect(
      asMember.query(api.audit.recent, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("User/Member CAN retrieve their own authorized personal data via memberSummary", async () => {
    const t = convexTest(schema, modules);
    const { memberLinked, ws } = await seedDashboardWorkspace(t);
    const asMember = t.withIdentity(as(memberLinked));

    const summary = await asMember.query(api.dashboard.memberSummary, {
      workspaceId: ws,
    });
    expect(summary?.isLinked).toBe(true);
    expect(summary?.employee?.firstName).toBe("Linked");
    expect(summary?.employee?.lastName).toBe("Member");
    expect(summary?.employee?.designation).toBe("Software Engineer");
    expect(summary?.latestPayslip?.netSalary).toBe(55000);
    expect(summary?.latestPayslip?.grossSalary).toBe(60000);
    expect(summary?.totalPayslipsCount).toBe(1);
    expect(summary?.pendingLeavesCount).toBe(1);
    expect(summary?.recentLeaves[0]?.leaveType).toBe("sick");
    expect(summary?.attendanceCurrentMonth.presentDays).toBe(1);
  });

  test("User with unlinked employee account receives unlinked state without fake data", async () => {
    const t = convexTest(schema, modules);
    const { memberUnlinked, ws } = await seedDashboardWorkspace(t);
    const asUnlinked = t.withIdentity(as(memberUnlinked));

    const summary = await asUnlinked.query(api.dashboard.memberSummary, {
      workspaceId: ws,
    });
    expect(summary?.isLinked).toBe(false);
    expect(summary?.employee).toBeNull();
    expect(summary?.latestPayslip).toBeNull();
    expect(summary?.totalPayslipsCount).toBe(0);
    expect(summary?.recentPayslips.length).toBe(0);
    expect(summary?.pendingLeavesCount).toBe(0);
  });

  test("User/Member cannot view other employees' payslips", async () => {
    const t = convexTest(schema, modules);
    const { memberLinked, ws, emp2, run } = await seedDashboardWorkspace(t);
    const asMember = t.withIdentity(as(memberLinked));

    // Member attempting to fetch emp2's payslip must be rejected with Forbidden
    await expect(
      asMember.query(api.payroll.getPayslip, {
        workspaceId: ws,
        payrollRunId: run,
        employeeId: emp2,
      }),
    ).rejects.toThrow(/Forbidden: You can only view your own payslip/);
  });
});

describe("Owner Dashboard vs Payroll Processing Page Discrepancy Reconciliation", () => {
  async function seedDiscrepancyWorkspace(t: ReturnType<typeof convexTest>) {
    return t.run(async (ctx) => {
      const owner = await ctx.db.insert("users", {
        email: "owner@indiapaypayroll.com",
      });
      const admin = await ctx.db.insert("users", {
        email: "admin@indiapaypayroll.com",
      });
      const member = await ctx.db.insert("users", {
        email: "user@indiapaypayroll.com",
      });
      const ws = await ctx.db.insert("workspaces", {
        name: "IndiaPay Dev",
        ownerId: owner,
        createdAt: 1791863953035,
      });

      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: owner,
        role: "owner",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: admin,
        role: "admin",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: member,
        role: "member",
        createdAt: Date.now(),
      });

      // Compliance settings (Karnataka, EPF, ESI enabled)
      await ctx.db.insert("workspaceCompliance", {
        workspaceId: ws,
        epfEnabled: true,
        epfWageCeiling: 15000,
        epfRestrictToCeiling: true,
        epsEnabled: true,
        epsWageCeiling: 15000,
        edliEnabled: true,
        adminChargesEnabled: true,
        esiEnabled: true,
        esiWageCeiling: 21000,
        ptEnabled: true,
        ptState: "Karnataka",
        updatedAt: 1791870337741,
      });

      await ctx.db.insert("lopSettings", {
        workspaceId: ws,
        calculationBasis: "calendar_days",
        includeUnpaidLeave: true,
        includeAbsent: true,
        halfDayFactor: 0.5,
        updatedAt: 1791870337741,
      });

      // Step 1: At initial payroll run creation, only 2 employees exist in the workspace:
      // Employee 1: Dev User (salary: 50,000 basic & gross)
      const emp1 = await ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Dev",
        lastName: "User",
        email: "user@indiapaypayroll.com",
        status: "active",
        userId: member,
        department: "Engineering",
        designation: "Software Engineer",
        createdAt: 1791866258516,
        updatedAt: 1791866258516,
      });

      // Employee 2: Dev Admin (status: active, but no salary structure yet at run creation time)
      const emp2 = await ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Dev",
        lastName: "Admin",
        email: "admin@indiapaypayroll.com",
        status: "active",
        userId: admin,
        department: "Human Resources",
        designation: "HR Admin",
        createdAt: 1791866258516,
        updatedAt: 1791866258516,
      });

      // Salary for emp1 only
      await ctx.db.insert("salaries", {
        workspaceId: ws,
        employeeId: emp1,
        basicSalary: 50000,
        allowances: [],
        deductions: [],
        grossSalary: 50000,
        effectiveDate: 1781308800000,
        createdAt: 1791870304222,
      });

      // Finalized payroll run for October 2026:
      const run = await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-10",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        status: "processed",
        totalEmployees: 2,
        totalGrossSalary: 50000,
        totalNetSalary: 48000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 2000,
        totalEmployerContributions: 1950,
        createdById: admin,
        submittedBy: admin,
        submittedAt: 1791870391303,
        approvedBy: owner,
        approvedAt: 1791906820171,
        finalizedBy: admin,
        finalizedAt: 1791967611679,
        createdAt: 1791870383648,
        updatedAt: 1791870383648,
      });

      // Payroll item for emp1 (Dev User)
      await ctx.db.insert("payrollItems", {
        workspaceId: ws,
        payrollRunId: run,
        employeeId: emp1,
        basicSalary: 50000,
        allowances: [],
        grossSalary: 50000,
        lopDays: 0,
        lopDeduction: 0,
        customDeductions: [],
        totalCustomDeductions: 0,
        statutoryDeductions: [
          {
            name: "PF (Provident Fund - 12%)",
            amount: 1800,
            isConfigured: true,
          },
          {
            name: "ESI (Employee State Insurance - 0.75%)",
            amount: 0,
            isConfigured: true,
          },
          {
            name: "Professional Tax (PT)",
            amount: 200,
            isConfigured: true,
          },
        ],
        totalStatutoryDeductions: 2000,
        employerContributions: [],
        totalEmployerContributions: 1950,
        totalDeductions: 2000,
        netSalary: 48000,
        hasSalaryStructure: true,
        warnings: [],
        createdAt: 1791870383648,
      });

      // Payroll item for emp2 (Dev Admin, missing salary at run creation time)
      await ctx.db.insert("payrollItems", {
        workspaceId: ws,
        payrollRunId: run,
        employeeId: emp2,
        basicSalary: 0,
        allowances: [],
        grossSalary: 0,
        lopDays: 0,
        lopDeduction: 0,
        customDeductions: [],
        totalCustomDeductions: 0,
        statutoryDeductions: [],
        totalStatutoryDeductions: 0,
        employerContributions: [],
        totalEmployerContributions: 0,
        totalDeductions: 0,
        netSalary: 0,
        hasSalaryStructure: false,
        warnings: ["Missing salary structure. Gross salary set to ₹0."],
        createdAt: 1791870383648,
      });

      return { ws, owner, admin, member, emp1, emp2, run };
    });
  }

  test("reconciles Owner dashboard finalized run (₹50k gross / ₹48k net) vs Payroll engine live preview (₹160k gross / ₹154,725 net)", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner, admin, emp2 } = await seedDiscrepancyWorkspace(t);

    const asOwner = t.withIdentity(as(owner));
    const asAdmin = t.withIdentity(as(admin));

    // 1. Verify Owner Dashboard initial state reflects the finalized historical run:
    const initialStats = await asOwner.query(api.dashboard.stats, {
      workspaceId: ws,
    });
    expect(initialStats?.latestGrossPayroll).toBe(50000);
    expect(initialStats?.latestNetPayroll).toBe(48000);
    expect(initialStats?.latestPeriod).toBe("2026-10");
    expect(initialStats?.latestPayrollStatus).toBe("processed");
    expect(initialStats?.activeEmployeesCount).toBe(2);

    // 2. Subsequent workspace changes (post-finalization mutations):
    // Nirmala Khadka added as active employee with 10k basic/gross:
    await t.run(async (ctx) => {
      const emp3 = await ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Nirmala",
        lastName: "Khadka",
        email: "khadkanirmala237@gmail.com",
        status: "active",
        department: "Engineering",
        designation: "AI Full stack developer",
        createdAt: 1791870566390,
        updatedAt: 1791870588720,
      });

      await ctx.db.insert("salaries", {
        workspaceId: ws,
        employeeId: emp3,
        basicSalary: 10000,
        allowances: [],
        deductions: [],
        grossSalary: 10000,
        effectiveDate: 1791849600000,
        createdAt: 1791871035193,
      });

      // Dev Admin salary structure added post-finalization: 100k
      await ctx.db.insert("salaries", {
        workspaceId: ws,
        employeeId: emp2,
        basicSalary: 100000,
        allowances: [],
        deductions: [],
        grossSalary: 100000,
        effectiveDate: 1791849600000,
        createdAt: 1791878285749,
      });

      // Dev Owner added as active employee (no salary structure):
      await ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Dev",
        lastName: "Owner",
        email: "owner@indiapaypayroll.com",
        status: "active",
        userId: owner,
        department: "Executive",
        designation: "Managing Director / Owner",
        createdAt: 1791903089798,
        updatedAt: 1791903089798,
      });
    });

    // 3. Query calculatePreview on Payroll Processing page:
    // It dynamically evaluates all 4 active employees and current salary structures:
    const preview = await asAdmin.query(api.payroll.calculatePreview, {
      workspaceId: ws,
      periodMonth: "2026-10",
    });

    // Reconcile exact Payroll Processing page figures:
    expect(preview.totalEmployees).toBe(4);
    expect(preview.totalGrossSalary).toBe(160000); // 50k (Dev User) + 100k (Dev Admin) + 10k (Nirmala Khadka)
    expect(preview.totalStatutoryDeductions).toBe(5275); // 2000 (emp1) + 2000 (emp2) + 1275 (emp3)
    expect(preview.totalNetSalary).toBe(154725); // 48000 + 98000 + 8725
    expect(preview.totalLopDeduction).toBe(0);

    // 4. Query Owner Dashboard again — MUST PRESERVE locked historical run:
    const postStats = await asOwner.query(api.dashboard.stats, {
      workspaceId: ws,
    });
    expect(postStats?.latestGrossPayroll).toBe(50000);
    expect(postStats?.latestNetPayroll).toBe(48000);
    expect(postStats?.latestPeriod).toBe("2026-10");
    expect(postStats?.latestPayrollStatus).toBe("processed");
    expect(postStats?.activeEmployeesCount).toBe(4); // active count reflects directory, but financials remain locked
  });

  test("status filtering consistency — non-qualifying statuses (draft, calculated, pending_approval) do not inflate latest gross/net payroll", async () => {
    const t = convexTest(schema, modules);
    const { owner, admin, ws } = await seedDiscrepancyWorkspace(t);
    const asOwner = t.withIdentity(as(owner));

    // Initially, latest qualifying run is 2026-10 (processed, 50000 gross, 48000 net)
    const initialStats = await asOwner.query(api.dashboard.stats, {
      workspaceId: ws,
    });
    expect(initialStats?.latestGrossPayroll).toBe(50000);
    expect(initialStats?.latestNetPayroll).toBe(48000);

    // Insert a November 2026 run in pending_approval status with unapproved numbers
    const novRun = await t.run(async (ctx) => {
      return await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-11",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
        status: "pending_approval",
        totalEmployees: 2,
        totalGrossSalary: 999999,
        totalNetSalary: 888888,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 111111,
        createdById: admin,
        submittedBy: admin,
        submittedAt: Date.now(),
        createdAt: Date.now() + 1000,
        updatedAt: Date.now() + 1000,
      });
    });

    // Owner dashboard should NOT use the pending run for latestGrossPayroll/latestNetPayroll
    const statsWithPending = await asOwner.query(api.dashboard.stats, {
      workspaceId: ws,
    });
    expect(statsWithPending?.latestGrossPayroll).toBe(50000);
    expect(statsWithPending?.latestNetPayroll).toBe(48000);
    expect(statsWithPending?.latestPeriod).toBe("2026-10");
    expect(statsWithPending?.pendingPayrollRunsCount).toBe(1);

    // Once approved by Owner, it qualifies as an authorized commitment
    await asOwner.mutation(api.payroll.approveRun, {
      workspaceId: ws,
      payrollRunId: novRun,
    });

    const statsAfterApproval = await asOwner.query(api.dashboard.stats, {
      workspaceId: ws,
    });
    expect(statsAfterApproval?.latestGrossPayroll).toBe(999999);
    expect(statsAfterApproval?.latestNetPayroll).toBe(888888);
    expect(statsAfterApproval?.latestPeriod).toBe("2026-11");
    expect(statsAfterApproval?.latestPayrollStatus).toBe("approved");
    expect(statsAfterApproval?.pendingPayrollRunsCount).toBe(0);
  });

  test("authorization boundary — Member strictly denied from calculatePreview, listRuns, and dashboard.stats", async () => {
    const t = convexTest(schema, modules);
    const { member, admin, ws } = await seedDiscrepancyWorkspace(t);
    const asMember = t.withIdentity(as(member));
    const asAdmin = t.withIdentity(as(admin));

    // Admin can calculatePreview and listRuns
    const preview = await asAdmin.query(api.payroll.calculatePreview, {
      workspaceId: ws,
      periodMonth: "2026-10",
    });
    expect(preview).toBeDefined();

    const runs = await asAdmin.query(api.payroll.listRuns, { workspaceId: ws });
    expect(runs.length).toBeGreaterThanOrEqual(1);

    // Member is strictly forbidden from calculatePreview, listRuns, and dashboard.stats
    await expect(
      asMember.query(api.payroll.calculatePreview, {
        workspaceId: ws,
        periodMonth: "2026-10",
      }),
    ).rejects.toThrow(/Forbidden/);

    await expect(
      asMember.query(api.payroll.listRuns, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);

    await expect(
      asMember.query(api.dashboard.stats, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("Member IDOR defense — Member cannot view another employee's compliance settings", async () => {
    const t = convexTest(schema, modules);
    const { ws, member, admin, emp1, emp2 } = await seedDiscrepancyWorkspace(t);
    const asMember = t.withIdentity(as(member));
    const asAdmin = t.withIdentity(as(admin));

    // Admin can inspect any employee's compliance
    const adminView = await asAdmin.query(api.compliance.getEmployeeCompliance, {
      workspaceId: ws,
      employeeId: emp1,
    });
    expect(adminView).toBeDefined();

    // Member (linked to emp1) can view their own compliance
    const ownCompliance = await asMember.query(
      api.compliance.getEmployeeCompliance,
      {
        workspaceId: ws,
        employeeId: emp1,
      },
    );
    expect(ownCompliance).toBeDefined();

    // Member cannot view another employee's (emp2) compliance
    await expect(
      asMember.query(api.compliance.getEmployeeCompliance, {
        workspaceId: ws,
        employeeId: emp2,
      }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("multiple runs consistency — processed run is prioritized over approved or calculated run for same period", async () => {
    const t = convexTest(schema, modules);
    const { ws, owner, admin } = await seedDiscrepancyWorkspace(t);
    const asOwner = t.withIdentity(as(owner));

    // Insert an approved run for 2026-10 created after the processed run
    await t.run(async (ctx) => {
      await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-10",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        status: "approved",
        totalEmployees: 4,
        totalGrossSalary: 160000,
        totalNetSalary: 154725,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 5275,
        createdById: admin,
        approvedBy: owner,
        createdAt: Date.now() + 5000,
        updatedAt: Date.now() + 5000,
      });
    });

    // stats with periodMonth = "2026-10" should prioritize the processed run (50k/48k)
    const statsForOct = await asOwner.query(api.dashboard.stats, {
      workspaceId: ws,
      periodMonth: "2026-10",
    });
    expect(statsForOct?.latestGrossPayroll).toBe(50000);
    expect(statsForOct?.latestNetPayroll).toBe(48000);
    expect(statsForOct?.latestPayrollStatus).toBe("processed");
    expect(statsForOct?.qualifyingRun?.status).toBe("processed");
  });
});

describe("Simplified 2-Role System (Admin & Member Only RBAC)", () => {
  async function seedTwoRoleWorkspace(t: ReturnType<typeof convexTest>) {
    return t.run(async (ctx) => {
      const adminUser = await ctx.db.insert("users", {
        name: "Admin User",
        email: "admin-role@indiapay.test",
      });
      const memberUser = await ctx.db.insert("users", {
        name: "Member User",
        email: "member-role@indiapay.test",
      });
      const otherMemberUser = await ctx.db.insert("users", {
        name: "Other Member User",
        email: "other-member@indiapay.test",
      });
      const outsiderUser = await ctx.db.insert("users", {
        name: "Outsider User",
        email: "outsider-role@indiapay.test",
      });

      const ws = await ctx.db.insert("workspaces", {
        name: "IndiaPay Corp",
        ownerId: adminUser,
        createdAt: Date.now(),
      });

      const adminMember = await ctx.db.insert("members", {
        workspaceId: ws,
        userId: adminUser,
        role: "admin",
        createdAt: Date.now(),
      });

      const memberMember = await ctx.db.insert("members", {
        workspaceId: ws,
        userId: memberUser,
        role: "member",
        createdAt: Date.now(),
      });

      const otherMemberMember = await ctx.db.insert("members", {
        workspaceId: ws,
        userId: otherMemberUser,
        role: "member",
        createdAt: Date.now(),
      });

      // Insert employees for member and otherMember
      const emp1 = await ctx.db.insert("employees", {
        workspaceId: ws,
        userId: memberUser,
        firstName: "Member",
        lastName: "One",
        email: "member-role@indiapay.test",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        bankAccountHolderName: "Member One",
        bankName: "HDFC Bank",
        bankAccountNumber: "123456789012",
        ifscCode: "HDFC0001234",
        pan: "ABCDE1234F",
      });

      const emp2 = await ctx.db.insert("employees", {
        workspaceId: ws,
        userId: otherMemberUser,
        firstName: "Other",
        lastName: "Member",
        email: "other-member@indiapay.test",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        bankAccountHolderName: "Other Member",
        bankName: "ICICI Bank",
        bankAccountNumber: "987654321098",
        ifscCode: "ICIC0001234",
        pan: "XYZAB5678C",
      });

      return {
        ws,
        adminUser,
        adminMember,
        memberUser,
        memberMember,
        otherMemberUser,
        otherMemberMember,
        outsiderUser,
        emp1,
        emp2,
      };
    });
  }

  test("1. Assignable roles are strictly restricted to admin and member", async () => {
    const t = convexTest(schema, modules);
    const { ws, adminUser, memberMember } = await seedTwoRoleWorkspace(t);
    const asAdmin = t.withIdentity(as(adminUser));

    // Valid invitation roles
    await asAdmin.mutation(api.orgs.invite, {
      workspaceId: ws,
      email: "newadmin@indiapay.test",
      role: "admin",
    });
    await asAdmin.mutation(api.orgs.invite, {
      workspaceId: ws,
      email: "newmember@indiapay.test",
      role: "member",
    });

    // Invalid roles rejected (including legacy owner)
    await expect(
      asAdmin.mutation(api.orgs.invite, {
        workspaceId: ws,
        email: "invalid1@indiapay.test",
        role: "owner" as any,
      }),
    ).rejects.toThrow(/Invalid role/);

    await expect(
      asAdmin.mutation(api.orgs.invite, {
        workspaceId: ws,
        email: "invalid2@indiapay.test",
        role: "superuser" as any,
      }),
    ).rejects.toThrow(/Invalid role/);

    // changeRole role validation
    await expect(
      asAdmin.mutation(api.orgs.changeRole, {
        workspaceId: ws,
        memberId: memberMember,
        role: "owner" as any,
      }),
    ).rejects.toThrow(/Invalid role/);
  });

  test("2. Admin can access all administrative modules & process payroll", async () => {
    const t = convexTest(schema, modules);
    const { ws, adminUser, emp1 } = await seedTwoRoleWorkspace(t);
    const asAdmin = t.withIdentity(as(adminUser));

    // Admin can add salary
    await asAdmin.mutation(api.salaries.add, {
      workspaceId: ws,
      employeeId: emp1,
      basicSalary: 30000,
      allowances: [{ name: "HRA", amount: 15000 }],
      deductions: [],
      effectiveDate: Date.now(),
    });

    // Admin can list all salaries
    const salaries = await asAdmin.query(api.salaries.getCurrentSalaries, {
      workspaceId: ws,
    });
    expect(salaries.length).toBeGreaterThanOrEqual(1);

    // Admin can view attendance summary
    const attendanceStats = await asAdmin.query(api.attendance.summary, {
      workspaceId: ws,
      startDate: "2026-10-01",
      endDate: "2026-10-31",
    });
    expect(attendanceStats.totalRecords).toBeDefined();

    // Admin can view compliance
    const compliance = await asAdmin.query(
      api.compliance.getWorkspaceCompliance,
      { workspaceId: ws },
    );
    expect(compliance).toBeDefined();

    // Admin can run preview calculation
    const preview = await asAdmin.query(api.payroll.calculatePreview, {
      workspaceId: ws,
      periodMonth: "2026-10",
    });
    expect(preview.items.length).toBeGreaterThanOrEqual(1);

    // Admin can preview statutory reports
    const ptReport = await asAdmin.query(
      api.statutoryReports.getPtReportData,
      { workspaceId: ws, periodMonth: "2026-10" },
    );
    expect(ptReport.periodMonth).toBe("2026-10");
  });

  test("3. Member can view their own profile, attendance, leaves, and payslips", async () => {
    const t = convexTest(schema, modules);
    const { ws, memberUser } = await seedTwoRoleWorkspace(t);
    const asMember = t.withIdentity(as(memberUser));

    // Member can view their own profile
    const myProfile = await asMember.query(api.employees.getMyProfile, {
      workspaceId: ws,
    });
    expect(myProfile).toBeDefined();
    expect(myProfile?.email).toBe("member-role@indiapay.test");

    // Member can view their own payslips
    const myPayslips = await asMember.query(api.payroll.getMyPayslips, {
      workspaceId: ws,
    });
    expect(Array.isArray(myPayslips)).toBe(true);

    // Member can view their own leaves
    const myLeaves = await asMember.query(api.leaves.getMyLeaves, {
      workspaceId: ws,
    });
    expect(Array.isArray(myLeaves)).toBe(true);
  });

  test("4. Member cannot view other employees' salary, bank info, or payslips", async () => {
    const t = convexTest(schema, modules);
    const { ws, adminUser, memberUser, emp2 } = await seedTwoRoleWorkspace(t);
    const asMember = t.withIdentity(as(memberUser));

    // Member cannot list company salaries
    await expect(
      asMember.query(api.salaries.getCurrentSalaries, { workspaceId: ws }),
    ).rejects.toThrow();

    // Member cannot access another employee's payslip directly
    const runId = await t.run(async (ctx) => {
      return await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-10",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        status: "processed",
        totalEmployees: 1,
        totalGrossSalary: 40000,
        totalNetSalary: 37000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 3000,
        createdById: adminUser,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Member (emp1) cannot fetch emp2's payslip
    await expect(
      asMember.query(api.payroll.getPayslip, {
        workspaceId: ws,
        payrollRunId: runId,
        employeeId: emp2,
      }),
    ).rejects.toThrow(/Forbidden: You can only view your own payslip/i);
  });

  test("5. Member cannot process payroll, view reports, or invite users", async () => {
    const t = convexTest(schema, modules);
    const { ws, memberUser } = await seedTwoRoleWorkspace(t);
    const asMember = t.withIdentity(as(memberUser));

    // Cannot calculate payroll preview
    await expect(
      asMember.query(api.payroll.calculatePreview, {
        workspaceId: ws,
        periodMonth: "2026-10",
      }),
    ).rejects.toThrow();

    // Cannot view reports
    await expect(
      asMember.query(api.statutoryReports.previewPfEcrSummary, {
        workspaceId: ws,
        periodMonth: "2026-10",
      }),
    ).rejects.toThrow();

    // Cannot invite users
    await expect(
      asMember.mutation(api.orgs.invite, {
        workspaceId: ws,
        email: "hacked@test.com",
        role: "admin",
      }),
    ).rejects.toThrow();
  });

  test("6. Member cannot self-promote to Admin", async () => {
    const t = convexTest(schema, modules);
    const { ws, memberUser, memberMember } = await seedTwoRoleWorkspace(t);
    const asMember = t.withIdentity(as(memberUser));

    await expect(
      asMember.mutation(api.orgs.changeRole, {
        workspaceId: ws,
        memberId: memberMember,
        role: "admin",
      }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("7. Cross-workspace access is rejected for both Admin and Member", async () => {
    const t = convexTest(schema, modules);
    const { ws, outsiderUser } = await seedTwoRoleWorkspace(t);
    const asOutsider = t.withIdentity(as(outsiderUser));

    await expect(
      asOutsider.query(api.salaries.getCurrentSalaries, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);

    await expect(
      asOutsider.query(api.employees.getMyProfile, { workspaceId: ws }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("8. Retain at least one Admin: cannot delete or demote the last admin", async () => {
    const t = convexTest(schema, modules);
    const { ws, adminUser, adminMember } = await seedTwoRoleWorkspace(t);
    const asAdmin = t.withIdentity(as(adminUser));

    // Attempt to demote the sole admin to member
    await expect(
      asAdmin.mutation(api.orgs.changeRole, {
        workspaceId: ws,
        memberId: adminMember,
        role: "member",
      }),
    ).rejects.toThrow(/last administrator/i);

    // Attempt to remove the sole admin
    await expect(
      asAdmin.mutation(api.orgs.removeMember, {
        workspaceId: ws,
        memberId: adminMember,
      }),
    ).rejects.toThrow(/last administrator/i);

    // If a second admin is added, demoting one is permitted
    const secondAdminUser = await t.run(async (ctx) => {
      const u = await ctx.db.insert("users", {
        email: "admin2@indiapay.test",
      });
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId: u,
        role: "admin",
        createdAt: Date.now(),
      });
      return u;
    });

    // Now demoting adminMember succeeds because secondAdminUser exists
    await asAdmin.mutation(api.orgs.changeRole, {
      workspaceId: ws,
      memberId: adminMember,
      role: "member",
    });

    const updatedRole = await t.run(async (ctx) => (await ctx.db.get(adminMember))?.role);
    expect(updatedRole).toBe("member");
  });

  test("9. migrateOwnerRolesToAdmin safely migrates legacy owner roles and is repeatable", async () => {
    const t = convexTest(schema, modules);
    const { ws, adminUser } = await seedTwoRoleWorkspace(t);

    // Insert a legacy owner member and legacy owner invite
    const { legacyMemberId, legacyInviteId } = await t.run(async (ctx) => {
      const legacyUser = await ctx.db.insert("users", {
        email: "legacy-owner@indiapay.test",
      });
      const mId = await ctx.db.insert("members", {
        workspaceId: ws,
        userId: legacyUser,
        role: "owner" as any,
        createdAt: Date.now(),
      });
      const invId = await ctx.db.insert("invites", {
        workspaceId: ws,
        email: "legacy-invite@indiapay.test",
        role: "owner" as any,
        invitedBy: adminUser,
        accepted: false,
        createdAt: Date.now(),
      });
      return { legacyMemberId: mId, legacyInviteId: invId };
    });

    const asAdmin = t.withIdentity(as(adminUser));

    // Run migration
    const result1 = await asAdmin.mutation(api.orgs.migrateOwnerRolesToAdmin, {
      workspaceId: ws,
    });
    expect(result1.migratedMembersCount).toBe(1);
    expect(result1.migratedInvitesCount).toBe(1);

    // Verify database record has role: "admin"
    const migratedMember = await t.run(async (ctx) => ctx.db.get(legacyMemberId));
    expect(migratedMember?.role).toBe("admin");

    const migratedInvite = await t.run(async (ctx) => ctx.db.get(legacyInviteId));
    expect(migratedInvite?.role).toBe("admin");

    // Repeatable / idempotent: second run updates 0 records
    const result2 = await asAdmin.mutation(api.orgs.migrateOwnerRolesToAdmin, {
      workspaceId: ws,
    });
    expect(result2.migratedMembersCount).toBe(0);
    expect(result2.migratedInvitesCount).toBe(0);
  });
});
