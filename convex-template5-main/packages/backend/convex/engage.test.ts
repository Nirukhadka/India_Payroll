import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

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
        "./declarations.ts": () => import("./declarations"),
        "./employees.ts": () => import("./employees"),
        "./leaves.ts": () => import("./leaves"),
        "./lop.ts": () => import("./lop"),
        "./payroll.ts": () => import("./payroll"),
        "./salaries.ts": () => import("./salaries"),
        "./statutory.ts": () => import("./statutory"),
        "./statutoryTds.ts": () => import("./statutoryTds"),
        "./professionalTax.ts": () => import("./professionalTax"),
        "./devAccounts.ts": () => import("./devAccounts"),
        "./devAccountsMutation.ts": () => import("./devAccountsMutation"),
        "./delegates.ts": () => import("./delegates"),
        "./helpdesk.ts": () => import("./helpdesk"),
        "./resignation.ts": () => import("./resignation"),
        "./engage.ts": () => import("./engage"),
        "./_generated/api.js": () => import("./_generated/api.js"),
        "./_generated/server.js": () => import("./_generated/server.js"),
      };

const as = (userId: string) => ({ subject: `${userId}|sess_${userId}` });

describe("Engage Community & Recognition Suite", () => {
  async function setupEngageEnv() {
    const t = convexTest(schema, modules);
    let adminId: any;
    let member1Id: any;
    let member2Id: any;
    let workspaceId: any;
    let emp1Id: any;
    let emp2Id: any;

    await t.run(async (ctx) => {
      adminId = await ctx.db.insert("users", {
        name: "Admin Leader",
        email: "admin@indiapay.test",
      });
      member1Id = await ctx.db.insert("users", {
        name: "Alice Engineer",
        email: "alice@indiapay.test",
      });
      member2Id = await ctx.db.insert("users", {
        name: "Bob Designer",
        email: "bob@indiapay.test",
      });

      workspaceId = await ctx.db.insert("workspaces", {
        name: "IndiaPay Tech Corp",
        ownerId: adminId,
        createdAt: Date.now(),
      });

      await ctx.db.insert("members", {
        workspaceId,
        userId: adminId,
        role: "admin",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId,
        userId: member1Id,
        role: "member",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId,
        userId: member2Id,
        role: "member",
        createdAt: Date.now(),
      });

      emp1Id = await ctx.db.insert("employees", {
        workspaceId,
        userId: member1Id,
        firstName: "Alice",
        lastName: "Engineer",
        email: "alice@indiapay.test",
        department: "Engineering",
        designation: "Senior SRE",
        joiningDate: "2024-10-15", // 2-year anniversary
        status: "active",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 730,
        updatedAt: Date.now(),
      });

      emp2Id = await ctx.db.insert("employees", {
        workspaceId,
        userId: member2Id,
        firstName: "Bob",
        lastName: "Designer",
        email: "bob@indiapay.test",
        department: "Design",
        designation: "Product Designer",
        joiningDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10), // 10 days ago (New Joiner)
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    return { t, adminId, member1Id, member2Id, workspaceId, emp1Id, emp2Id };
  }

  test("Announcements: Admin can post announcements, non-admin is rejected", async () => {
    const { t, adminId, member1Id, workspaceId } = await setupEngageEnv();

    // Admin posts announcement
    const announceId = await t
      .withIdentity(as(adminId))
      .mutation(api.engage.createAnnouncement, {
        workspaceId,
        title: "All-Hands Meeting This Friday",
        content: "Join us at 4 PM for quarterly updates.",
        category: "general",
        pinned: true,
      });
    expect(announceId).toBeDefined();

    // Regular member attempts to post announcement -> rejected!
    await expect(
      t.withIdentity(as(member1Id)).mutation(api.engage.createAnnouncement, {
        workspaceId,
        title: "Unapproved Notice",
        content: "Selling my old chair.",
        category: "general",
      }),
    ).rejects.toThrow("Forbidden: Only administrators can post company announcements.");

    // List announcements verifies pinned sorting
    const list = await t
      .withIdentity(as(member1Id))
      .query(api.engage.listAnnouncements, { workspaceId });
    expect(list.length).toBe(1);
    expect(list[0].title).toBe("All-Hands Meeting This Friday");
    expect(list[0].pinned).toBe(true);
  });

  test("Polls: Create, vote, calculate tally, and prevent double voting", async () => {
    const { t, member1Id, member2Id, workspaceId } = await setupEngageEnv();

    // 1. Member creates a poll
    const pollId = await t.withIdentity(as(member1Id)).mutation(api.engage.createPoll, {
      workspaceId,
      question: "Which day should we host the hackathon demo?",
      options: ["Thursday", "Friday", "Monday"],
    });
    expect(pollId).toBeDefined();

    // 2. Member 1 votes for option 1 ("Friday")
    await t.withIdentity(as(member1Id)).mutation(api.engage.votePoll, {
      workspaceId,
      pollId,
      optionIndex: 1,
    });

    // 3. Member 1 tries to vote again on the same poll -> rejected!
    await expect(
      t.withIdentity(as(member1Id)).mutation(api.engage.votePoll, {
        workspaceId,
        pollId,
        optionIndex: 0,
      }),
    ).rejects.toThrow("You have already voted on this poll.");

    // 4. Member 2 votes for option 1 ("Friday")
    await t.withIdentity(as(member2Id)).mutation(api.engage.votePoll, {
      workspaceId,
      pollId,
      optionIndex: 1,
    });

    // 5. Query polls verifies 2 votes total, 100% on Friday
    const polls = await t
      .withIdentity(as(member1Id))
      .query(api.engage.listPolls, { workspaceId });
    expect(polls.length).toBe(1);
    expect(polls[0].totalVotes).toBe(2);
    expect(polls[0].voteCounts[1]).toBe(2);
    expect(polls[0].hasVoted).toBe(true);
    expect(polls[0].myVoteIndex).toBe(1);
  });

  test("Celebrations: Computes work anniversaries and new joiners from directory", async () => {
    const { t, member1Id, workspaceId } = await setupEngageEnv();

    const celebrations = await t
      .withIdentity(as(member1Id))
      .query(api.engage.listCelebrations, { workspaceId });

    expect(celebrations.activeEmployeesCount).toBe(2);
    // Alice has joining date in 2024 (2 years)
    expect(celebrations.anniversaries.length).toBeGreaterThanOrEqual(1);
    expect(celebrations.anniversaries[0].name).toBe("Alice Engineer");
    expect(celebrations.anniversaries[0].yearsCompleted).toBe(2);

    // Bob joined 10 days ago (New joiner)
    expect(celebrations.newJoiners.length).toBeGreaterThanOrEqual(1);
    expect(celebrations.newJoiners[0].name).toBe("Bob Designer");
  });

  test("Peer Kudos: Send praise, cannot praise self, and list wall", async () => {
    const { t, member1Id, member2Id, workspaceId, emp1Id, emp2Id } =
      await setupEngageEnv();

    // Alice tries to give kudos to herself -> rejected!
    await expect(
      t.withIdentity(as(member1Id)).mutation(api.engage.sendKudos, {
        workspaceId,
        receiverEmployeeId: emp1Id,
        message: "I am amazing",
        badge: "Innovator",
      }),
    ).rejects.toThrow("You cannot give kudos to yourself.");

    // Alice gives kudos to Bob
    const kudosId = await t
      .withIdentity(as(member1Id))
      .mutation(api.engage.sendKudos, {
        workspaceId,
        receiverEmployeeId: emp2Id,
        message: "Outstanding design work on the new portal screens!",
        badge: "Going the Extra Mile",
      });
    expect(kudosId).toBeDefined();

    // List kudos wall
    const wall = await t
      .withIdentity(as(member2Id))
      .query(api.engage.listKudos, { workspaceId });
    expect(wall.length).toBe(1);
    expect(wall[0].senderName).toBe("Alice Engineer");
    expect(wall[0].receiverName).toBe("Bob Designer");
    expect(wall[0].badge).toBe("Going the Extra Mile");
  });

  test("Posts, Reactions & Comments: Full interaction workflow", async () => {
    const { t, member1Id, member2Id, workspaceId } = await setupEngageEnv();

    // Member 1 creates a post
    const postId = await t
      .withIdentity(as(member1Id))
      .mutation(api.engage.createPost, {
        workspaceId,
        content: "Excited to launch our new product features this quarter!",
        title: "Product Launch Q4",
        group: "Engineering",
      });
    expect(postId).toBeDefined();

    // List posts
    const posts = await t
      .withIdentity(as(member2Id))
      .query(api.engage.listPosts, { workspaceId });
    expect(posts.length).toBe(1);
    expect(posts[0].content).toContain("Excited to launch");

    // Member 2 toggles reaction
    const reactRes = await t
      .withIdentity(as(member2Id))
      .mutation(api.engage.toggleReaction, {
        workspaceId,
        activityId: postId,
        activityType: "post",
        reactionType: "like",
      });
    expect(reactRes.action).toBe("added");

    // Check reactions
    let reactions = await t
      .withIdentity(as(member2Id))
      .query(api.engage.listReactions, { workspaceId });
    expect(reactions.length).toBe(1);
    expect(reactions[0].isMine).toBe(true);

    // Member 2 adds a comment
    const commentId = await t
      .withIdentity(as(member2Id))
      .mutation(api.engage.addComment, {
        workspaceId,
        activityId: postId,
        activityType: "post",
        content: "Great work team! Looking forward to it.",
      });
    expect(commentId).toBeDefined();

    // Check comments
    const comments = await t
      .withIdentity(as(member1Id))
      .query(api.engage.listComments, { workspaceId });
    expect(comments.length).toBe(1);
    expect(comments[0].content).toBe("Great work team! Looking forward to it.");

    // Member 2 edits their own comment
    await t
      .withIdentity(as(member2Id))
      .mutation(api.engage.editComment, {
        workspaceId,
        commentId,
        content: "Updated: Great work team! Let's achieve our targets.",
      });

    const updatedComments = await t
      .withIdentity(as(member1Id))
      .query(api.engage.listComments, { workspaceId });
    expect(updatedComments[0].content).toBe("Updated: Great work team! Let's achieve our targets.");

    // Member 1 (non-admin, not author) cannot edit Member 2's comment
    await expect(
      t.withIdentity(as(member1Id)).mutation(api.engage.editComment, {
        workspaceId,
        commentId,
        content: "Hacked comment",
      })
    ).rejects.toThrow("Forbidden: You can only edit your own comments");

    // Member 2 deletes their comment
    await t
      .withIdentity(as(member2Id))
      .mutation(api.engage.deleteComment, {
        workspaceId,
        commentId,
      });

    const remainingComments = await t
      .withIdentity(as(member1Id))
      .query(api.engage.listComments, { workspaceId });
    expect(remainingComments.length).toBe(0);
  });
});
