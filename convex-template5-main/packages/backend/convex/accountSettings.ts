import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 25 greytHR Features Seed Registry
export const GREYTHR_FEATURES_REGISTRY = [
  {
    featureKey: "aadhaar_validation",
    name: "Aadhaar Validation",
    since: "Since 3 years ago",
    description:
      "Employees in an organization would be eligible for aadhaar validation while doing Employee onboarding",
    defaultEnabled: false,
  },
  {
    featureKey: "alumni_portal",
    name: "Alumni Portal",
    since: "Since 3 years ago",
    description:
      "Enabling this lets your ex-employees access their payslips, form 16, IT statement, Letters and more using the portal after they've left the company. Note: It's an add-on feature to your account.",
    defaultEnabled: false,
  },
  {
    featureKey: "bulletin_board",
    name: "Bulletin Board",
    since: "Since 16 years ago",
    description:
      "Bulletin Board is a space intended for the posting of public messages to the Employees.",
    defaultEnabled: true,
    enabledAt: "Jul 24, 2024 @ 5:30AM",
  },
  {
    featureKey: "company_policies_forms",
    name: "Company Policies and Forms",
    since: "Since 15 years ago",
    description:
      "This module allows you to upload various forms like PF forms, ESI Forms, etc, and Company Policies like Leave Policies, Data and Mobile Expenses Reimbursement Policy, etc that can be published to the employees.",
    defaultEnabled: true,
    enabledAt: "Oct 29, 2020 @ 5:30AM",
  },
  {
    featureKey: "datashare_hub",
    name: "DataShare Hub",
    since: "Since 4 years ago",
    description:
      "The DataShare Hub module will facilitate the document and the report exchange between the PSP and their customers to process the payroll successfully",
    defaultEnabled: false,
  },
  {
    featureKey: "digital_signature_letters",
    name: "Digital Signature for Letters",
    since: "Since a year ago",
    description:
      "Enabling this lets you digitally sign letters issued to your employees, ensuring authenticity, integrity, and compliance. The signed documents are legally valid and secure. Note: It's an add-on feature to your account.",
    defaultEnabled: true,
    enabledAt: "Mar 23, 2026 @ 5:30AM",
  },
  {
    featureKey: "document_centre",
    name: "Document Centre",
    since: "Since 16 years ago",
    description:
      "Document Centre module helps you to upload Employee specific documents like Appraisal letter, Confirmation Letter, Incentive / Bonus letter, etc.",
    defaultEnabled: true,
    enabledAt: "Jul 24, 2024 @ 5:30AM",
  },
  {
    featureKey: "employee_attendance_permission",
    name: "Employee Attendance Permission",
    since: "Since 4 years ago",
    description:
      "To provide employee to take permission for particular time of the day.",
    defaultEnabled: true,
    enabledAt: "Jul 5, 2023 @ 5:30AM",
  },
  {
    featureKey: "employee_ctc_breakup",
    name: "Employee CTC Break Up",
    since: "Since 15 years ago",
    description: "Employees can view and print their CTC salary item breakups.",
    defaultEnabled: true,
    enabledAt: "Sep 22, 2026 @ 5:30AM",
  },
  {
    featureKey: "employee_confirmation",
    name: "Employee Confirmation",
    since: "Since 4 years ago",
    description:
      "To provide a comprehensive employee confirmation module that helps admins completely automate employee confirmation from probation.",
    defaultEnabled: true,
    enabledAt: "May 16, 2024 @ 5:30AM",
  },
  {
    featureKey: "employee_exit",
    name: "Employee Exit",
    since: "Since 5 years ago",
    description:
      "Exit Module lets you manage all the exit formalities during an employee’s voluntary or involuntary termination. With this module, you can manage the employee’s offboarding journey right from initiating an exit request upto releasing the post exit documents.",
    defaultEnabled: true,
    enabledAt: "Oct 5, 2026 @ 5:30AM",
  },
  {
    featureKey: "engage_feedback",
    name: "Engage-Feedback",
    since: "Since 3 years ago",
    description:
      "Feedback App collects user feedback to improve products, services, and experiences, offering actionable insights for developers and stakeholders.",
    defaultEnabled: true,
    enabledAt: "Jun 25, 2024 @ 5:30AM",
  },
  {
    featureKey: "engage_kudos",
    name: "Engage-Kudos",
    since: "Since 3 years ago",
    description:
      "Kudos is a app which used to express praise, admiration, or congratulations for someone's achievements or actions.",
    defaultEnabled: true,
    enabledAt: "Jun 25, 2024 @ 5:30AM",
  },
  {
    featureKey: "engage_poll",
    name: "Engage-Poll",
    since: "Since 3 years ago",
    description:
      "Gather insights and preferences from team members on various topics by creating polls.",
    defaultEnabled: true,
    enabledAt: "Jun 25, 2024 @ 5:30AM",
  },
  {
    featureKey: "geofence_autosignin",
    name: "Geofence Auto Sign in",
    since: "Since 4 years ago",
    description:
      "This feature is used to capture the attendance swipe from geofence automatically by detecting the GPS of the Employee through the mobile device.",
    defaultEnabled: false,
  },
  {
    featureKey: "insurance",
    name: "Insurance",
    since: "Since 6 years ago",
    description:
      "This module enables you to add Insurance type, Name of the Insured, Insurance Provider, Policy No and Sum Insured along with Insurance Issued and expiry date. By providing permissions employee can view and edit the insurance details",
    defaultEnabled: false,
  },
  {
    featureKey: "kiosk_attendance",
    name: "Kiosk for Attendance Capture",
    since: "Since 6 years ago",
    description: "Kiosk for Attendance Capture using face recognition.",
    defaultEnabled: false,
  },
  {
    featureKey: "loan_workflow",
    name: "Loan Workflow",
    since: "Since 4 years ago",
    description:
      "The process involves having a workflow option for the loans and salary advance which will allow the employees to apply for the loans and take approval within the system",
    defaultEnabled: true,
    enabledAt: "Sep 22, 2026 @ 5:30AM",
  },
  {
    featureKey: "manpower_planning",
    name: "Manpower Planning",
    since: "Since 6 months ago",
    description: "Manpower Planning Module",
    defaultEnabled: false,
  },
  {
    featureKey: "nomination_details",
    name: "Nomination Details",
    since: "Since 14 years ago",
    description: "Employee's Nomination Details for EPF, EPS, ESI etc.",
    defaultEnabled: true,
    enabledAt: "May 29, 2023 @ 5:30AM",
  },
  {
    featureKey: "orgchart_ess",
    name: "Org Chart ESS",
    since: "Since 4 years ago",
    description: "Enable Organization Chart for ESS",
    defaultEnabled: true,
    enabledAt: "Mar 7, 2023 @ 5:30AM",
  },
  {
    featureKey: "overtime",
    name: "Overtime",
    since: "Since 6 years ago",
    description:
      "Overtime module looks at capturing any excess hours worked by the employee beyond his call of duty, after shift. The excess hours will be paid to the employee as an Overtime payment through the payroll module as per the clients payout policies and set workflows.",
    defaultEnabled: false,
  },
  {
    featureKey: "passport_visa",
    name: "Passport and Visa Details",
    since: "Since 15 years ago",
    description:
      "User can update or add his/her family Passport details and Visa details",
    defaultEnabled: true,
    enabledAt: "Oct 5, 2026 @ 5:30AM",
  },
  {
    featureKey: "split_shift",
    name: "Split Shift",
    since: "Since 3 years ago",
    description:
      "Enabling the Split Shift service code allows administrators to configure Split Shift-related information using relevant fields in the Greythr application",
    defaultEnabled: false,
  },
  {
    featureKey: "unite_marketplace",
    name: "Unite",
    since: "Since 4 years ago",
    description: "Enable Marketplace",
    defaultEnabled: true,
    enabledAt: "May 16, 2024 @ 5:30AM",
  },
];

// Helper to resolve workspace
async function getActiveWorkspace(
  ctx:
    | import("./_generated/server").QueryCtx
    | import("./_generated/server").MutationCtx,
): Promise<import("./_generated/dataModel").Doc<"workspaces"> | null> {
  const ws = await ctx.db.query("workspaces").first();
  if (ws) return ws;
  if ("insert" in ctx.db) {
    const wsId = await (ctx.db as any).insert("workspaces", {
      name: "Victor Chasex Pvt Ltd",
      slug: "victorchasex",
    });
    return (await ctx.db.get(wsId)) as import("./_generated/dataModel").Doc<"workspaces"> | null;
  }
  return null;
}

// -----------------------------------------------------------------------------
// 1. Plan Subscriptions
// -----------------------------------------------------------------------------
export const getSubscriptionInfo = query({
  args: {},
  handler: async (ctx) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return null;

    const sub = await ctx.db
      .query("accountSubscriptions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .first();

    if (!sub) {
      // Default to Growth plan (matching greytHR Best Value)
      return {
        planKey: "growth",
        billingCycle: "monthly",
        status: "active",
        employeeAllowance: 50,
        activeHeadcount: 42,
        monthlyBasePrice: 5495,
        additionalEmployeeRate: 65,
        startDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
        renewalDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
        requestedPlan: undefined,
      };
    }

    return sub;
  },
});

export const requestPlanChange = mutation({
  args: {
    planKey: v.union(
      v.literal("essential"),
      v.literal("growth"),
      v.literal("enterprise"),
    ),
    billingCycle: v.optional(
      v.union(v.literal("monthly"), v.literal("annual")),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("No active workspace");

    const existing = await ctx.db
      .query("accountSubscriptions")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .first();

    const planPrices = {
      essential: { base: 3495, add: 35 },
      growth: { base: 5495, add: 65 },
      enterprise: { base: 7495, add: 105 },
    };

    const chosen = planPrices[args.planKey];
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        planKey: args.planKey,
        monthlyBasePrice: chosen.base,
        additionalEmployeeRate: chosen.add,
        requestedPlan: args.planKey,
        status: "active",
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("accountSubscriptions", {
        workspaceId: ws._id,
        planKey: args.planKey,
        billingCycle: args.billingCycle || "monthly",
        status: "active",
        requestedPlan: args.planKey,
        employeeAllowance: 50,
        activeHeadcount: 42,
        monthlyBasePrice: chosen.base,
        additionalEmployeeRate: chosen.add,
        startDate: now,
        renewalDate: now + 30 * 24 * 60 * 60 * 1000,
        updatedAt: now,
      });
    }

    return { success: true, planKey: args.planKey };
  },
});

// -----------------------------------------------------------------------------
// 2. Invoices
// -----------------------------------------------------------------------------
export const getInvoices = query({
  args: {},
  handler: async (ctx) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    const invoices = await ctx.db
      .query("accountInvoices")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .order("desc")
      .collect();

    if (invoices.length === 0) {
      // Seed initial invoice matching greytHR screenshot format (GO/26/10/1544)
      return [
        {
          _id: "seed_inv_1" as unknown as import("./_generated/dataModel").Id<"accountInvoices">,
          invoiceNo: "GO/26/10/1544",
          billingPeriodStart: "01 Oct 2026",
          billingPeriodEnd: "31 Oct 2026",
          invoiceDate: "31 Oct 2026",
          invoiceAmount: 5888.0,
          status: "due" as const,
          currency: "INR",
          lineItems: [
            {
              slNo: 1,
              service: "IndiaPay HRMS - Growth Plan (50 Employees)",
              headCount: 50,
              amount: 5495.0,
              totalAmount: 5495.0,
              taxPercent: 18,
              invoiceAmount: 5888.0,
            },
          ],
        },
        {
          _id: "seed_inv_2" as unknown as import("./_generated/dataModel").Id<"accountInvoices">,
          invoiceNo: "GO/26/09/1402",
          billingPeriodStart: "01 Sep 2026",
          billingPeriodEnd: "30 Sep 2026",
          invoiceDate: "30 Sep 2026",
          invoiceAmount: 5888.2,
          status: "paid" as const,
          currency: "INR",
          lineItems: [
            {
              slNo: 1,
              service: "IndiaPay HRMS - Growth Plan (50 Employees)",
              headCount: 50,
              amount: 5495.0,
              totalAmount: 5495.0,
              taxPercent: 18,
              invoiceAmount: 5888.2,
            },
          ],
        },
      ];
    }

    return invoices;
  },
});

// -----------------------------------------------------------------------------
// 3. Payments
// -----------------------------------------------------------------------------
export const getPayments = query({
  args: {},
  handler: async (ctx) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    const payments = await ctx.db
      .query("accountPayments")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .order("desc")
      .collect();

    if (payments.length === 0) {
      // Seed payment record matching greytHR reference (29 Sep 2026, 5,888.20)
      return [
        {
          _id: "seed_pmt_1" as unknown as import("./_generated/dataModel").Id<"accountPayments">,
          paymentDate: "29 Sep 2026",
          amount: 5888.2,
          paymentMode: "Online Transfer / NEFT",
          chequeOrRefNo: "HDFC9284918239",
          bankName: "HDFC Bank",
          chequeDate: "29 Sep 2026",
          acknowledgementSent: false,
          invoiceNo: "GO/26/09/1402",
          invoiceDate: "30 Sep 2026",
          invoiceAmount: 5888.2,
          paidAmount: 5888.2,
          status: "successful" as const,
        },
      ];
    }

    return payments;
  },
});

// -----------------------------------------------------------------------------
// 4. Ticket Management
// -----------------------------------------------------------------------------
export const getTickets = query({
  args: {
    searchTerm: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    let tickets = await ctx.db
      .query("accountTickets")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .order("desc")
      .collect();

    if (tickets.length === 0) {
      // Seed tickets matching greytHR screenshot
      const seedTickets = [
        {
          _id: "seed_tkt_1" as unknown as import("./_generated/dataModel").Id<"accountTickets">,
          ticketId: "1864026",
          subject: "Pending Queries - Victor Chasex",
          category: "Payroll Query",
          priority: "medium" as const,
          status: "Closed" as const,
          dateOfCreation: "19 Oct 2026",
          lastActivity: "22 Oct 2026",
          createdByEmail: "fatheema@networkershome.com",
          createdByName: "Javeria",
          messages: [
            {
              sender: "Javeria",
              senderRole: "Customer",
              message:
                "Please clarify the October PF ECR challan wage ceiling.",
              timestamp: "19 Oct 2026, 10:14 AM",
            },
            {
              sender: "greytHR Support Desk",
              senderRole: "Support Representative",
              message:
                "Resolved. The statutory limit of ₹15,000 has been verified.",
              timestamp: "22 Oct 2026, 04:30 PM",
            },
          ],
        },
        {
          _id: "seed_tkt_2" as unknown as import("./_generated/dataModel").Id<"accountTickets">,
          ticketId: "1850583",
          subject:
            "greytHR Application Implementation Sign-Off & CSM Introduction -VICTOR CHASEX PRIVATE LIMITED",
          category: "Implementation",
          priority: "high" as const,
          status: "Closed" as const,
          dateOfCreation: "08 Oct 2026",
          lastActivity: "08 Oct 2026",
          createdByEmail: "csm@greythr.com",
          createdByName: "CSM Team",
          messages: [
            {
              sender: "CSM Lead",
              senderRole: "Implementation Manager",
              message:
                "Onboarding and parallel payroll test run completed with sign-off.",
              timestamp: "08 Oct 2026, 03:00 PM",
            },
          ],
        },
        {
          _id: "seed_tkt_3" as unknown as import("./_generated/dataModel").Id<"accountTickets">,
          ticketId: "1842734",
          subject:
            "greytHR Implementation Admin Login Credentials | VICTOR CHASEX PRIVATE LIMITED",
          category: "Security",
          priority: "urgent" as const,
          status: "Closed" as const,
          dateOfCreation: "01 Oct 2026",
          lastActivity: "06 Oct 2026",
          createdByEmail: "system@greythr.com",
          createdByName: "System Dispatcher",
          messages: [
            {
              sender: "System",
              senderRole: "Automated",
              message: "Admin credentials established and OTP verified.",
              timestamp: "01 Oct 2026, 09:00 AM",
            },
          ],
        },
      ];

      tickets = seedTickets as unknown as typeof tickets;
    }

    let filtered = tickets;
    if (args.status && args.status !== "All") {
      filtered = filtered.filter((t) => t.status === args.status);
    }

    if (args.searchTerm?.trim()) {
      const term = args.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.ticketId.toLowerCase().includes(term) ||
          t.subject.toLowerCase().includes(term),
      );
    }

    return filtered;
  },
});

export const createTicket = mutation({
  args: {
    subject: v.string(),
    category: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("No active workspace");

    const user = await ctx.db.get(userId);
    const now = Date.now();
    const dateStr = new Date(now).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const ticketNumber = Math.floor(1800000 + Math.random() * 90000).toString();

    const tktId = await ctx.db.insert("accountTickets", {
      workspaceId: ws._id,
      ticketId: ticketNumber,
      subject: args.subject.trim(),
      category: args.category,
      priority: args.priority,
      status: "Open",
      dateOfCreation: dateStr,
      lastActivity: dateStr,
      createdByEmail: user?.email || "admin@domain.com",
      createdByName: user?.name || user?.username || "Admin",
      messages: [
        {
          sender: user?.name || user?.username || "Admin",
          senderRole: "Customer",
          message: args.description.trim(),
          timestamp: new Date().toLocaleString("en-GB"),
        },
      ],
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, ticketId: ticketNumber, id: tktId };
  },
});

// -----------------------------------------------------------------------------
// 5. New Features Registry & Persistence
// -----------------------------------------------------------------------------
export const getAccountFeatures = query({
  args: {},
  handler: async (ctx) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    const existing = await ctx.db
      .query("accountFeatures")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    // If already stored in DB, return them
    if (existing.length >= GREYTHR_FEATURES_REGISTRY.length) {
      return existing;
    }

    // Otherwise merge default registry with DB overrides
    const dbMap = new Map(existing.map((f) => [f.featureKey, f]));
    return GREYTHR_FEATURES_REGISTRY.map((reg) => {
      const dbEntry = dbMap.get(reg.featureKey);
      return {
        featureKey: reg.featureKey,
        name: reg.name,
        description: reg.description,
        since: reg.since,
        enabled: dbEntry ? dbEntry.enabled : reg.defaultEnabled,
        enabledAt: dbEntry ? dbEntry.enabledAt : reg.enabledAt,
      };
    });
  },
});

export const toggleAccountFeature = mutation({
  args: {
    featureKey: v.string(),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("No active workspace");

    const existing = await ctx.db
      .query("accountFeatures")
      .withIndex("by_workspace_feature", (q) =>
        q.eq("workspaceId", ws._id).eq("featureKey", args.featureKey),
      )
      .first();

    const reg = GREYTHR_FEATURES_REGISTRY.find(
      (r) => r.featureKey === args.featureKey,
    );
    const now = Date.now();
    const dateFormatted = `${new Date(now).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} @ 5:30AM`;

    if (existing) {
      await ctx.db.patch(existing._id, {
        enabled: args.enabled,
        enabledAt: args.enabled ? dateFormatted : undefined,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("accountFeatures", {
        workspaceId: ws._id,
        featureKey: args.featureKey,
        name: reg?.name || args.featureKey,
        description: reg?.description || "",
        since: reg?.since || "Since 1 year ago",
        enabled: args.enabled,
        enabledAt: args.enabled ? dateFormatted : undefined,
        updatedAt: now,
      });
    }

    return {
      success: true,
      featureKey: args.featureKey,
      enabled: args.enabled,
    };
  },
});
