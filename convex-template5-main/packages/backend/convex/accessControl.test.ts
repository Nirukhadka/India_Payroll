/// <reference types="vite/client" />
// Security Remediation Phase 1 regression tests:
//   - apiKeys.create: admin-only (audit D-2)
//   - apiKeys.revoke: owner may revoke own key; admins may revoke any workspace key (audit S-4)
//   - files.remove: owner may delete own file; admins may delete any workspace file (audit D-1)
// Legacy rows (missing workspaceId on apiKeys) remain owner-only.
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

// Discover function modules for convex-test (includes _generated, excludes *.test.ts).
const modules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === "function"
    ? (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
    : {
        "./ResendOTP.ts": () => import("./ResendOTP"),
        "./apiKeys.ts": () => import("./apiKeys"),
        "./auditLog.ts": () => import("./auditLog"),
        "./audit.ts": () => import("./audit"),
        "./auth.config.ts": () => import("./auth.config"),
        "./auth.ts": () => import("./auth"),
        "./backend.ts": () => import("./backend"),
        "./counters.ts": () => import("./counters"),
        "./dashboard.ts": () => import("./dashboard"),
        "./devAccounts.ts": () => import("./devAccounts"),
        "./devAccountsMutation.ts": () => import("./devAccountsMutation"),
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
        "./_generated/api.js": () => import("./_generated/api.js"),
        "./_generated/server.js": () => import("./_generated/server.js"),
      };

const as = (userId: string) => ({ subject: `${userId}|sess_${userId}` });

async function seed(t: ReturnType<typeof convexTest>) {
  return t.run(async (ctx) => {
    const owner = await ctx.db.insert("users", { email: "owner@t.test" });
    const admin = await ctx.db.insert("users", { email: "admin@t.test" });
    const memberA = await ctx.db.insert("users", { email: "a@t.test" });
    const memberB = await ctx.db.insert("users", { email: "b@t.test" });
    const outsider = await ctx.db.insert("users", { email: "o@t.test" });
    const ws = await ctx.db.insert("workspaces", {
      name: "WS",
      ownerId: owner,
      createdAt: Date.now(),
    });
    const mk = async (
      userId: string,
      role: "owner" | "admin" | "member",
    ) => {
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId,
        role,
        createdAt: Date.now(),
      });
    };
    await mk(owner, "owner");
    await mk(admin, "admin");
    await mk(memberA, "member");
    await mk(memberB, "member");
    return { owner, admin, memberA, memberB, outsider, ws };
  });
}

const seedKey = (
  t: ReturnType<typeof convexTest>,
  workspaceId: string,
  userId: string,
) =>
  t.run(async (ctx) =>
    ctx.db.insert("apiKeys", {
      workspaceId,
      userId,
      name: "k",
      prefix: "sk_legacy",
      hash: `h_${userId}`,
      revoked: false,
      createdAt: Date.now(),
    }),
  );

const seedFile = (
  t: ReturnType<typeof convexTest>,
  workspaceId: string,
  userId: string,
) =>
  t.run(async (ctx) => {
    const storageId = await ctx.storage.store(new Blob(["hello"]));
    return ctx.db.insert("files", {
      workspaceId,
      userId,
      name: "f",
      storageId,
      size: 1,
      contentType: "text/plain",
      createdAt: Date.now(),
    });
  });

describe("apiKeys.create (admin-only, audit D-2)", () => {
  test("admin can create a key; plaintext is returned once", async () => {
    const t = convexTest(schema, modules);
    const { admin, ws } = await seed(t);
    const res = await t
      .withIdentity(as(admin))
      .action(api.apiKeys.create, { workspaceId: ws, name: "ci" });
    expect(res.key.startsWith("sk_")).toBe(true);
    // Plaintext must be stored hashed, never in the DB row.
    const stored = await t.run(async (ctx) =>
      ctx.db
        .query("apiKeys")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", ws))
        .collect(),
    );
    expect(stored).toHaveLength(1);
    expect(stored[0].hash).not.toContain(res.key);
    expect(stored[0].prefix).toBe(res.key.slice(0, 11));
    expect(stored[0].revoked).toBe(false);
  });

  test("plain member cannot create a key (unchanged DB)", async () => {
    const t = convexTest(schema, modules);
    const { memberA, ws } = await seed(t);
    await expect(
      t
        .withIdentity(as(memberA))
        .action(api.apiKeys.create, { workspaceId: ws, name: "x" }),
    ).rejects.toThrow(/Forbidden/);
    const rows = await t.run(async (ctx) =>
      ctx.db.query("apiKeys").collect(),
    );
    expect(rows).toHaveLength(0);
  });

  test("outsider cannot create a key in another workspace", async () => {
    const t = convexTest(schema, modules);
    const { outsider, ws } = await seed(t);
    await expect(
      t
        .withIdentity(as(outsider))
        .action(api.apiKeys.create, { workspaceId: ws, name: "x" }),
    ).rejects.toThrow(/Forbidden/);
  });
});

describe("apiKeys.revoke (owner-or-admin, audit S-4)", () => {
  test("admin can revoke another member's key", async () => {
    const t = convexTest(schema, modules);
    const { admin, memberA, ws } = await seed(t);
    const keyId = await seedKey(t, ws, memberA);
    await t.withIdentity(as(admin)).mutation(api.apiKeys.revoke, { id: keyId });
    expect((await t.run((ctx) => ctx.db.get(keyId)))?.revoked).toBe(true);
  });

  test("member can revoke their own key", async () => {
    const t = convexTest(schema, modules);
    const { memberA, ws } = await seed(t);
    const keyId = await seedKey(t, ws, memberA);
    await t
      .withIdentity(as(memberA))
      .mutation(api.apiKeys.revoke, { id: keyId });
    expect((await t.run((ctx) => ctx.db.get(keyId)))?.revoked).toBe(true);
  });

  test("member cannot revoke another member's key (unchanged DB)", async () => {
    const t = convexTest(schema, modules);
    const { memberA, memberB, ws } = await seed(t);
    const b = await seedKey(t, ws, memberB);
    await expect(
      t.withIdentity(as(memberA)).mutation(api.apiKeys.revoke, { id: b }),
    ).rejects.toThrow(/Forbidden/);
    const row = await t.run((ctx) => ctx.db.get(b));
    expect(row?.revoked).toBe(false);
  });

  test("member cannot revoke an admin's key", async () => {
    const t = convexTest(schema, modules);
    const { admin, memberA, ws } = await seed(t);
    const a = await seedKey(t, ws, admin);
    await expect(
      t.withIdentity(as(memberA)).mutation(api.apiKeys.revoke, { id: a }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("revoke is owner-checked for legacy rows without workspaceId", async () => {
    const t = convexTest(schema, modules);
    const { memberA, memberB } = await seed(t);
    const legacy = await t.run(async (ctx) =>
      ctx.db.insert("apiKeys", {
        userId: memberA,
        name: "legacy",
        prefix: "sk_legacy",
        hash: "h_legacy",
        revoked: false,
        createdAt: Date.now(),
      }),
    );
    await expect(
      t.withIdentity(as(memberB)).mutation(api.apiKeys.revoke, { id: legacy }),
    ).rejects.toThrow(/Forbidden/);
    expect((await t.run((ctx) => ctx.db.get(legacy)))?.revoked).toBe(false);
    await t.withIdentity(as(memberA)).mutation(api.apiKeys.revoke, { id: legacy });
    expect((await t.run((ctx) => ctx.db.get(legacy)))?.revoked).toBe(true);
  });

  test("revoking a deleted key returns Not found", async () => {
    const t = convexTest(schema, modules);
    const { owner, memberA, ws } = await seed(t);
    const keyId = await seedKey(t, ws, memberA);
    await t.run((ctx) => ctx.db.delete(keyId));
    await expect(
      t
        .withIdentity(as(owner))
        .mutation(api.apiKeys.revoke, { id: keyId }),
    ).rejects.toThrow(/Not found/);
  });
});

describe("files.remove (owner-or-admin, audit D-1)", () => {
  test("member can delete their own file", async () => {
    const t = convexTest(schema, modules);
    const { memberA, ws } = await seed(t);
    const own = await seedFile(t, ws, memberA);
    await t.withIdentity(as(memberA)).mutation(api.files.remove, {
      fileId: own,
    });
    expect(await t.run((ctx) => ctx.db.get(own))).toBeNull();
  });

  test("member cannot delete another member's file (unchanged DB)", async () => {
    const t = convexTest(schema, modules);
    const { memberA, memberB, ws } = await seed(t);
    const b = await seedFile(t, ws, memberB);
    await expect(
      t.withIdentity(as(memberA)).mutation(api.files.remove, { fileId: b }),
    ).rejects.toThrow(/Forbidden/);
    expect(await t.run((ctx) => ctx.db.get(b))).not.toBeNull();
  });

  test("admin can delete another member's file", async () => {
    const t = convexTest(schema, modules);
    const { admin, memberB, ws } = await seed(t);
    const b = await seedFile(t, ws, memberB);
    await t.withIdentity(as(admin)).mutation(api.files.remove, { fileId: b });
    expect(await t.run((ctx) => ctx.db.get(b))).toBeNull();
  });

  test("outsider cannot delete a file in another workspace", async () => {
    const t = convexTest(schema, modules);
    const { outsider, memberA, ws } = await seed(t);
    const a = await seedFile(t, ws, memberA);
    await expect(
      t.withIdentity(as(outsider)).mutation(api.files.remove, { fileId: a }),
    ).rejects.toThrow(/Forbidden/);
  });

  test("deleting a deleted file returns Not found", async () => {
    const t = convexTest(schema, modules);
    const { owner, memberA, ws } = await seed(t);
    const fileId = await seedFile(t, ws, memberA);
    await t.run((ctx) => ctx.db.delete(fileId));
    await expect(
      t
        .withIdentity(as(owner))
        .mutation(api.files.remove, { fileId }),
    ).rejects.toThrow(/Not found/);
  });

  // ── WORKSPACE-SPECIFIC SUSPENSION & LAST-ADMIN RBAC TESTS ──
  test("requireMember strictly rejects suspended member in workspace", async () => {
    const t = convexTest(schema, modules);
    const { memberA, ws } = await seed(t);

    // Suspend memberA in ws
    await t.run(async (ctx) => {
      const m = await ctx.db
        .query("members")
        .withIndex("by_user_workspace", (q) =>
          q.eq("userId", memberA).eq("workspaceId", ws),
        )
        .unique();
      if (m) await ctx.db.patch(m._id, { status: "suspended" });
    });

    // memberA attempting file listing or protected workspace query must throw Forbidden
    await expect(
      t.withIdentity(as(memberA)).query(api.files.list, { workspaceId: ws }),
    ).rejects.toThrow(/Member is suspended in this workspace/);
  });

  test("suspending user in Workspace A does NOT affect their active access in Workspace B", async () => {
    const t = convexTest(schema, modules);
    const { memberA, ws: wsA } = await seed(t);

    // Create Workspace B and add memberA as active
    const wsB = await t.run(async (ctx) => {
      const w = await ctx.db.insert("workspaces", {
        name: "WS_B",
        ownerId: memberA,
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: w,
        userId: memberA,
        role: "admin",
        status: "active",
        createdAt: Date.now(),
      });
      return w;
    });

    // Suspend memberA in wsA only
    await t.run(async (ctx) => {
      const mA = await ctx.db
        .query("members")
        .withIndex("by_user_workspace", (q) =>
          q.eq("userId", memberA).eq("workspaceId", wsA),
        )
        .unique();
      if (mA) await ctx.db.patch(mA._id, { status: "suspended" });
    });

    // Rejected in wsA
    await expect(
      t.withIdentity(as(memberA)).query(api.files.list, { workspaceId: wsA }),
    ).rejects.toThrow(/Member is suspended in this workspace/);

    // Allowed in wsB
    const filesB = await t
      .withIdentity(as(memberA))
      .query(api.files.list, { workspaceId: wsB });
    expect(filesB).toEqual([]);
  });

  test("legacy member rows without status field default to active", async () => {
    const t = convexTest(schema, modules);
    const { memberA, ws } = await seed(t);

    // Ensure memberA has undefined status (legacy row)
    await t.run(async (ctx) => {
      const m = await ctx.db
        .query("members")
        .withIndex("by_user_workspace", (q) =>
          q.eq("userId", memberA).eq("workspaceId", ws),
        )
        .unique();
      if (m) {
        const { status: _status, ...rest } = m as any;
        await ctx.db.replace(m._id, rest);
      }
    });

    // Access must succeed without errors
    const files = await t
      .withIdentity(as(memberA))
      .query(api.files.list, { workspaceId: ws });
    expect(files).toEqual([]);
  });
});
