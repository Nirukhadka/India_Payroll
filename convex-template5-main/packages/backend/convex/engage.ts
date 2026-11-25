import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireMember, requireRole } from "./orgs";
import { audit } from "./auditLog";

// ── Announcements ────────────────────────────────────────────────────────────

export const listAnnouncements = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const announcements = await ctx.db
      .query("announcements")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();

    // Sort pinned to the top
    return announcements.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

export const createAnnouncement = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    title: v.string(),
    content: v.string(),
    category: v.union(
      v.literal("general"),
      v.literal("hr"),
      v.literal("event"),
      v.literal("policy"),
    ),
    pinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    const m = await requireMember(ctx, userId, args.workspaceId);

    // Only Admins (or legacy owners) can post announcements
    if (m.role !== "admin" && m.role !== "owner") {
      throw new ConvexError("Forbidden: Only administrators can post company announcements.");
    }

    if (!args.title.trim()) throw new ConvexError("Title cannot be empty.");
    if (!args.content.trim()) throw new ConvexError("Content cannot be empty.");

    const user = await ctx.db.get(userId);
    const authorName = user?.name || user?.email || "HR Administrator";

    const now = Date.now();
    const id = await ctx.db.insert("announcements", {
      workspaceId: args.workspaceId,
      title: args.title.trim(),
      content: args.content.trim(),
      category: args.category,
      authorId: userId,
      authorName,
      pinned: args.pinned ?? false,
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "announcement.create", {
      announcementId: id,
      title: args.title,
    });

    return id;
  },
});

// ── Polls ────────────────────────────────────────────────────────────────────

export const listPolls = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const polls = await ctx.db
      .query("polls")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();

    // Fetch user's votes in this workspace
    const userVotes = await ctx.db
      .query("pollVotes")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const userVoteMap = new Map(userVotes.map((v) => [v.pollId, v.optionIndex]));

    // Compute tallies for each poll
    const results = await Promise.all(
      polls.map(async (p) => {
        const votes = await ctx.db
          .query("pollVotes")
          .withIndex("by_poll", (q) => q.eq("pollId", p._id))
          .collect();

        const voteCounts = new Array(p.options.length).fill(0);
        for (const vote of votes) {
          if (vote.optionIndex >= 0 && vote.optionIndex < p.options.length) {
            voteCounts[vote.optionIndex]++;
          }
        }

        const totalVotes = votes.length;
        const myVoteIndex = userVoteMap.has(p._id) ? userVoteMap.get(p._id) : null;

        return {
          ...p,
          totalVotes,
          voteCounts,
          hasVoted: myVoteIndex !== null && myVoteIndex !== undefined,
          myVoteIndex,
        };
      }),
    );

    return results;
  },
});

export const createPoll = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    question: v.string(),
    options: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    if (!args.question.trim()) throw new ConvexError("Poll question cannot be empty.");
    if (!args.options || args.options.length < 2) {
      throw new ConvexError("Poll must have at least 2 options.");
    }

    const trimmedOptions = args.options.map((o) => o.trim()).filter(Boolean);
    if (trimmedOptions.length < 2) {
      throw new ConvexError("Poll options cannot be blank.");
    }

    const user = await ctx.db.get(userId);
    const creatorName = user?.name || user?.email || "Team Member";

    const now = Date.now();
    const id = await ctx.db.insert("polls", {
      workspaceId: args.workspaceId,
      question: args.question.trim(),
      options: trimmedOptions,
      createdById: userId,
      creatorName,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "poll.create", {
      pollId: id,
      question: args.question,
    });

    return id;
  },
});

export const votePoll = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    pollId: v.id("polls"),
    optionIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const poll = await ctx.db.get(args.pollId);
    if (!poll || poll.workspaceId !== args.workspaceId) {
      throw new ConvexError("Poll not found.");
    }

    if (poll.status !== "active") {
      throw new ConvexError("This poll is closed and no longer accepting votes.");
    }

    if (args.optionIndex < 0 || args.optionIndex >= poll.options.length) {
      throw new ConvexError("Invalid option selected.");
    }

    // Check if user already voted on this poll
    const existing = await ctx.db
      .query("pollVotes")
      .withIndex("by_poll_user", (q) => q.eq("pollId", args.pollId).eq("userId", userId))
      .first();

    if (existing) {
      throw new ConvexError("You have already voted on this poll.");
    }

    await ctx.db.insert("pollVotes", {
      workspaceId: args.workspaceId,
      pollId: args.pollId,
      userId,
      optionIndex: args.optionIndex,
      createdAt: Date.now(),
    });
  },
});

// ── Celebrations & Milestones ────────────────────────────────────────────────

export const listCelebrations = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const employees = await ctx.db
      .query("employees")
      .withIndex("by_workspace_status", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("status", "active"),
      )
      .collect();

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentYear = today.getFullYear();

    const anniversaries: Array<{
      employeeId: string;
      name: string;
      department: string;
      yearsCompleted: number;
      joiningDate: string;
      anniversaryDate: string;
      isThisMonth: boolean;
    }> = [];

    const newJoiners: Array<{
      employeeId: string;
      name: string;
      department: string;
      designation: string;
      joiningDate: string;
    }> = [];

    for (const emp of employees) {
      const name = `${emp.firstName} ${emp.lastName}`.trim();
      const dept = emp.department || "General";

      if (emp.joiningDate) {
        const jd = new Date(emp.joiningDate);
        if (!Number.isNaN(jd.getTime())) {
          const jYear = jd.getFullYear();
          const jMonth = jd.getMonth() + 1;
          const jDay = jd.getDate();

          const years = currentYear - jYear;
          if (years >= 1) {
            const thisYearAnniv = `${currentYear}-${String(jMonth).padStart(2, "0")}-${String(jDay).padStart(2, "0")}`;
            anniversaries.push({
              employeeId: emp._id,
              name,
              department: dept,
              yearsCompleted: years,
              joiningDate: emp.joiningDate,
              anniversaryDate: thisYearAnniv,
              isThisMonth: jMonth === currentMonth,
            });
          }

          // New joiner if joined within last 90 days
          const diffDays = Math.floor((today.getTime() - jd.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 90) {
            newJoiners.push({
              employeeId: emp._id,
              name,
              department: dept,
              designation: emp.designation || "Team Member",
              joiningDate: emp.joiningDate,
            });
          }
        }
      }
    }

    // Sort anniversaries: this month first
    anniversaries.sort((a, b) => {
      if (a.isThisMonth && !b.isThisMonth) return -1;
      if (!a.isThisMonth && b.isThisMonth) return 1;
      return a.anniversaryDate.localeCompare(b.anniversaryDate);
    });

    return {
      activeEmployeesCount: employees.length,
      anniversaries: anniversaries.slice(0, 10),
      newJoiners: newJoiners.slice(0, 10),
    };
  },
});

// ── Peer Recognition & Kudos ─────────────────────────────────────────────────

export const listKudos = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const kudosList = await ctx.db
      .query("kudos")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .take(20);

    const employees = await ctx.db
      .query("employees")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const empMap = new Map(employees.map((e) => [e._id, `${e.firstName} ${e.lastName}`]));

    return kudosList.map((k) => ({
      ...k,
      senderName: empMap.get(k.senderEmployeeId) || "Colleague",
      receiverName: empMap.get(k.receiverEmployeeId) || "Colleague",
    }));
  },
});

export const sendKudos = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    receiverEmployeeId: v.id("employees"),
    message: v.string(),
    badge: v.string(),
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
      throw new ConvexError("You must have an employee profile to give kudos.");
    }

    if (me._id === args.receiverEmployeeId) {
      throw new ConvexError("You cannot give kudos to yourself.");
    }

    const receiver = await ctx.db.get(args.receiverEmployeeId);
    if (!receiver || receiver.workspaceId !== args.workspaceId) {
      throw new ConvexError("Recipient employee not found.");
    }

    if (!args.message.trim()) {
      throw new ConvexError("Recognition message cannot be empty.");
    }

    const now = Date.now();
    const id = await ctx.db.insert("kudos", {
      workspaceId: args.workspaceId,
      senderEmployeeId: me._id,
      receiverEmployeeId: args.receiverEmployeeId,
      message: args.message.trim(),
      badge: args.badge || "Team Player",
      createdAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "kudos.send", {
      kudosId: id,
      receiverEmployeeId: args.receiverEmployeeId,
    });

    return id;
  },
});

// ── Feed Posts ───────────────────────────────────────────────────────────────

export const listPosts = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    return await ctx.db
      .query("posts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();
  },
});

export const createPost = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    content: v.string(),
    title: v.optional(v.string()),
    group: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    if (!args.content.trim()) {
      throw new ConvexError("Post content cannot be empty.");
    }

    const user = await ctx.db.get(userId);
    const authorName = user?.name || user?.email || "Team Member";

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();

    const now = Date.now();
    const id = await ctx.db.insert("posts", {
      workspaceId: args.workspaceId,
      title: args.title?.trim() || undefined,
      content: args.content.trim(),
      group: args.group || "General",
      authorId: userId,
      authorName,
      authorEmployeeId: employee?._id,
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "post.create", {
      postId: id,
    });

    return id;
  },
});

// ── Reactions & Comments ─────────────────────────────────────────────────────

export const toggleReaction = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    activityId: v.string(),
    activityType: v.string(),
    reactionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const existing = await ctx.db
      .query("reactions")
      .withIndex("by_activity_user", (q) =>
        q.eq("activityId", args.activityId).eq("userId", userId),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "removed" };
    }

    await ctx.db.insert("reactions", {
      workspaceId: args.workspaceId,
      activityId: args.activityId,
      activityType: args.activityType,
      userId,
      reactionType: args.reactionType || "like",
      createdAt: Date.now(),
    });
    return { action: "added" };
  },
});

export const addComment = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    activityId: v.string(),
    activityType: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    if (!args.content.trim()) {
      throw new ConvexError("Comment cannot be empty.");
    }

    const user = await ctx.db.get(userId);
    const userName = user?.name || user?.email || "Team Member";

    const id = await ctx.db.insert("comments", {
      workspaceId: args.workspaceId,
      activityId: args.activityId,
      activityType: args.activityType,
      userId,
      userName,
      content: args.content.trim(),
      createdAt: Date.now(),
    });

    return id;
  },
});

export const editComment = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    commentId: v.id("comments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    const m = await requireMember(ctx, userId, args.workspaceId);

    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.workspaceId !== args.workspaceId) {
      throw new ConvexError("Comment not found in this workspace");
    }

    // Only the author can edit their comment
    if (comment.userId !== userId) {
      throw new ConvexError("Forbidden: You can only edit your own comments");
    }

    if (!args.content.trim()) {
      throw new ConvexError("Comment cannot be empty");
    }

    await ctx.db.patch(args.commentId, {
      content: args.content.trim(),
    });

    return { success: true };
  },
});

export const deleteComment = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    const m = await requireMember(ctx, userId, args.workspaceId);

    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.workspaceId !== args.workspaceId) {
      throw new ConvexError("Comment not found in this workspace");
    }

    // Author or admin/owner can delete comments
    const isAdmin = m.role === "admin" || m.role === "owner";
    if (comment.userId !== userId && !isAdmin) {
      throw new ConvexError("Forbidden: You do not have permission to delete this comment");
    }

    await ctx.db.delete(args.commentId);
    return { success: true };
  },
});

export const listReactions = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return reactions.map((r) => ({
      ...r,
      isMine: r.userId === userId,
    }));
  },
});

export const listComments = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    return await ctx.db
      .query("comments")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("asc")
      .collect();
  },
});

