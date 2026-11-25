import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { audit } from "./auditLog";
import { requireMember, requireRole } from "./orgs";

// ── Validation & Normalization Helpers ────────────────────────────────────────

export function validatePan(pan: string): string {
  const normalized = pan.trim().toUpperCase();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(normalized)) {
    throw new ConvexError(
      "Invalid PAN format. Must be 10 alphanumeric characters (e.g. ABCDE1234F).",
    );
  }
  return normalized;
}

export function validateIfsc(ifsc: string): string {
  const normalized = ifsc.trim().toUpperCase();
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(normalized)) {
    throw new ConvexError(
      "Invalid IFSC code format. Must be 11 characters starting with 4 letters, '0', then 6 alphanumeric characters (e.g. HDFC0001234).",
    );
  }
  return normalized;
}

export function validateBankAccountNumber(acc: string): string {
  const normalized = acc.trim();
  const accRegex = /^\d{9,18}$/;
  if (!accRegex.test(normalized)) {
    throw new ConvexError(
      "Invalid bank account number. Must be between 9 and 18 digits.",
    );
  }
  return normalized;
}

export function validateUan(uan: string): string {
  const normalized = uan.trim();
  const uanRegex = /^\d{12}$/;
  if (!uanRegex.test(normalized)) {
    throw new ConvexError(
      "Invalid UAN format. Must be exactly 12 numeric digits.",
    );
  }
  return normalized;
}

export function validateEsicIpNumber(ip: string): string {
  const normalized = ip.trim();
  const esicRegex = /^\d{10,17}$/;
  if (!esicRegex.test(normalized)) {
    throw new ConvexError(
      "Invalid ESIC IP Number format. Must be 10 to 17 numeric digits.",
    );
  }
  return normalized;
}

export function validatePfMemberId(pfId: string): string {
  const normalized = pfId.trim().toUpperCase();
  const pfRegex = /^[A-Z0-9/]{10,30}$/;
  if (!pfRegex.test(normalized)) {
    throw new ConvexError(
      "Invalid PF Member ID format. Must be 10 to 30 alphanumeric characters.",
    );
  }
  return normalized;
}

export function validateAccountHolderName(name: string): string {
  const normalized = name.trim();
  if (normalized.length < 2 || normalized.length > 100) {
    throw new ConvexError(
      "Bank account holder name must be between 2 and 100 characters.",
    );
  }
  return normalized;
}

export function validateBankName(name: string): string {
  const normalized = name.trim();
  if (normalized.length < 2 || normalized.length > 100) {
    throw new ConvexError("Bank name must be between 2 and 100 characters.");
  }
  return normalized;
}

// ── Masking Utilities ────────────────────────────────────────────────────────

export function maskAccountNumber(acc?: string): string | undefined {
  if (!acc) return undefined;
  if (acc.length <= 4) return acc;
  return "•".repeat(acc.length - 4) + acc.slice(-4);
}

export function maskPan(pan?: string): string | undefined {
  if (!pan) return undefined;
  if (pan.length <= 4) return pan;
  return `••••••${pan.slice(-4)}`;
}

export function maskUan(uan?: string): string | undefined {
  if (!uan) return undefined;
  if (uan.length <= 4) return uan;
  return "•".repeat(uan.length - 4) + uan.slice(-4);
}

export type EmployeeWithMaskedFields = Doc<"employees"> & {
  maskedBankAccountNumber?: string;
  maskedPan?: string;
  maskedUan?: string;
};

// Helper to redact sensitive banking & statutory details for unauthorized roles
function redactEmployeeSensitiveData(
  emp: Doc<"employees">,
  isPrivileged: boolean,
  isOwnRecord: boolean,
): EmployeeWithMaskedFields {
  if (isPrivileged || isOwnRecord) {
    return {
      ...emp,
      maskedBankAccountNumber: maskAccountNumber(emp.bankAccountNumber),
      maskedPan: maskPan(emp.pan),
      maskedUan: maskUan(emp.uan),
    };
  }
  // Plain member viewing another employee: strip all banking and statutory fields!
  const {
    bankAccountHolderName: _b1,
    bankName: _b2,
    bankAccountNumber: _b3,
    ifscCode: _b4,
    pan: _b5,
    uan: _b6,
    esicIpNumber: _b7,
    pfMemberId: _b8,
    ...nonSensitive
  } = emp;
  return {
    ...nonSensitive,
    bankAccountHolderName: undefined,
    bankName: undefined,
    bankAccountNumber: undefined,
    ifscCode: undefined,
    pan: undefined,
    uan: undefined,
    esicIpNumber: undefined,
    pfMemberId: undefined,
    maskedBankAccountNumber: undefined,
    maskedPan: undefined,
    maskedUan: undefined,
  };
}

// ── Queries & Mutations ──────────────────────────────────────────────────────

export const list = query({
  args: {
    workspaceId: v.id("workspaces"),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    const m = await requireMember(ctx, userId, args.workspaceId);
    const isPrivileged = m.role === "owner" || m.role === "admin";

    let q = ctx.db
      .query("employees")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId));

    if (args.status) {
      const statusFilter = args.status;
      q = ctx.db
        .query("employees")
        .withIndex("by_workspace_status", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("status", statusFilter),
        );
    }

    const records = await q.order("desc").collect();
    return records
      .filter((emp) => !emp.isRemoved)
      .map((emp) =>
        redactEmployeeSensitiveData(emp, isPrivileged, emp.userId === userId),
      );
  },
});

export const getById = query({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    const m = await requireMember(ctx, userId, args.workspaceId);
    const isPrivileged = m.role === "owner" || m.role === "admin";

    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Employee not found");
    }

    // IDOR Protection: regular members cannot query other employees' records
    if (!isPrivileged && employee.userId !== userId) {
      throw new ConvexError(
        "Forbidden: Access to other employees' records is restricted.",
      );
    }

    return redactEmployeeSensitiveData(
      employee,
      isPrivileged,
      employee.userId === userId,
    );
  },
});

export const add = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    designation: v.optional(v.string()),
    employeeIdNumber: v.optional(v.string()),
    joiningDate: v.optional(v.string()),
    // Banking Details
    bankAccountHolderName: v.optional(v.string()),
    bankName: v.optional(v.string()),
    bankAccountNumber: v.optional(v.string()),
    ifscCode: v.optional(v.string()),
    // Statutory Details
    pan: v.optional(v.string()),
    uan: v.optional(v.string()),
    esicIpNumber: v.optional(v.string()),
    pfMemberId: v.optional(v.string()),
    isPfMember: v.optional(v.boolean()),
    isEsiMember: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const normalizedEmail = args.email.trim().toLowerCase();

    const existing = await ctx.db
      .query("employees")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .first();

    if (existing && !existing.isRemoved) {
      throw new ConvexError(
        "An employee with this email already exists in this workspace",
      );
    }

    // Duplicate Employee Number Protection (Defect 3)
    let normalizedEmployeeIdNumber: string | undefined = undefined;
    if (args.employeeIdNumber && args.employeeIdNumber.trim()) {
      normalizedEmployeeIdNumber = args.employeeIdNumber.trim().toUpperCase();
      const existingWithEmpId = await ctx.db
        .query("employees")
        .withIndex("by_workspace_employee_id", (q) =>
          q
            .eq("workspaceId", args.workspaceId)
            .eq("employeeIdNumber", normalizedEmployeeIdNumber),
        )
        .first();

      if (existingWithEmpId && !existingWithEmpId.isRemoved) {
        throw new ConvexError(
          `Employee number '${normalizedEmployeeIdNumber}' is already assigned to another employee in this workspace.`,
        );
      }
    }

    // Joining Date normalization (Defect 2)
    const normalizedJoiningDate = args.joiningDate?.trim() || undefined;

    // Validate optional banking & statutory fields
    const bankAccountHolderName = args.bankAccountHolderName?.trim()
      ? validateAccountHolderName(args.bankAccountHolderName)
      : undefined;
    const bankName = args.bankName?.trim()
      ? validateBankName(args.bankName)
      : undefined;
    const bankAccountNumber = args.bankAccountNumber?.trim()
      ? validateBankAccountNumber(args.bankAccountNumber)
      : undefined;
    const ifscCode = args.ifscCode?.trim()
      ? validateIfsc(args.ifscCode)
      : undefined;
    const pan = args.pan?.trim() ? validatePan(args.pan) : undefined;
    const uan = args.uan?.trim() ? validateUan(args.uan) : undefined;
    const esicIpNumber = args.esicIpNumber?.trim()
      ? validateEsicIpNumber(args.esicIpNumber)
      : undefined;
    const pfMemberId = args.pfMemberId?.trim()
      ? validatePfMemberId(args.pfMemberId)
      : undefined;

    const now = Date.now();
    const employeeId = await ctx.db.insert("employees", {
      workspaceId: args.workspaceId,
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      email: normalizedEmail,
      phone: args.phone?.trim() || undefined,
      department: args.department?.trim() || undefined,
      designation: args.designation?.trim() || undefined,
      status: "active",
      employeeIdNumber: normalizedEmployeeIdNumber,
      joiningDate: normalizedJoiningDate,
      bankAccountHolderName,
      bankName,
      bankAccountNumber,
      ifscCode,
      pan,
      uan,
      esicIpNumber,
      pfMemberId,
      isPfMember: args.isPfMember !== undefined ? args.isPfMember : true,
      isEsiMember:
        args.isEsiMember !== undefined
          ? args.isEsiMember
          : esicIpNumber
            ? true
            : undefined,
      createdAt: now,
      updatedAt: now,
    });

    if (args.isPfMember !== undefined) {
      const existingComp = await ctx.db
        .query("employeeCompliance")
        .withIndex("by_employee", (q) => q.eq("employeeId", employeeId))
        .first();
      if (existingComp) {
        await ctx.db.patch(existingComp._id, {
          epfOptOut: !args.isPfMember,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("employeeCompliance", {
          workspaceId: args.workspaceId,
          employeeId,
          taxRegime: "new",
          epfOptOut: !args.isPfMember,
          updatedAt: now,
        });
      }
    }

    // Masked audit logging - never write sensitive raw values to logs
    await audit(ctx, args.workspaceId, userId, "employee.add", {
      employeeId,
      hasBankingDetails: Boolean(bankAccountNumber),
      hasPan: Boolean(pan),
      hasUan: Boolean(uan),
    });

    return employeeId;
  },
});

export const update = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    designation: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    userId: v.optional(v.union(v.id("users"), v.null())),
    employeeIdNumber: v.optional(v.string()),
    joiningDate: v.optional(v.string()),
    // Banking Details
    bankAccountHolderName: v.optional(v.string()),
    bankName: v.optional(v.string()),
    bankAccountNumber: v.optional(v.string()),
    ifscCode: v.optional(v.string()),
    // Statutory Details
    pan: v.optional(v.string()),
    uan: v.optional(v.string()),
    esicIpNumber: v.optional(v.string()),
    pfMemberId: v.optional(v.string()),
    isPfMember: v.optional(v.boolean()),
    isEsiMember: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Employee not found");
    }

    const {
      workspaceId,
      employeeId,
      userId: incomingUserId,
      ...updates
    } = args;
    const finalUpdates: Record<string, unknown> = { updatedAt: Date.now() };

    if (incomingUserId !== undefined) {
      finalUpdates.userId =
        incomingUserId === null ? undefined : incomingUserId;
    }

    if (updates.isPfMember !== undefined) {
      finalUpdates.isPfMember = updates.isPfMember;
      const existingComp = await ctx.db
        .query("employeeCompliance")
        .withIndex("by_employee", (q) => q.eq("employeeId", employeeId))
        .first();
      if (existingComp) {
        await ctx.db.patch(existingComp._id, {
          epfOptOut: !updates.isPfMember,
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("employeeCompliance", {
          workspaceId: args.workspaceId,
          employeeId,
          taxRegime: "new",
          epfOptOut: !updates.isPfMember,
          updatedAt: Date.now(),
        });
      }
    }

    if (updates.isEsiMember !== undefined) {
      finalUpdates.isEsiMember = updates.isEsiMember;
    }

    if (updates.firstName !== undefined) {
      finalUpdates.firstName = updates.firstName.trim();
    }
    if (updates.lastName !== undefined) {
      finalUpdates.lastName = updates.lastName.trim();
    }
    if (updates.phone !== undefined) {
      finalUpdates.phone = updates.phone.trim() || undefined;
    }
    if (updates.department !== undefined) {
      finalUpdates.department = updates.department.trim() || undefined;
    }
    if (updates.designation !== undefined) {
      finalUpdates.designation = updates.designation.trim() || undefined;
    }
    if (updates.status !== undefined) {
      finalUpdates.status = updates.status;
    }

    if (updates.employeeIdNumber !== undefined) {
      if (updates.employeeIdNumber.trim()) {
        const normalizedEmpId = updates.employeeIdNumber.trim().toUpperCase();
        const existingWithEmpId = await ctx.db
          .query("employees")
          .withIndex("by_workspace_employee_id", (q) =>
            q
              .eq("workspaceId", args.workspaceId)
              .eq("employeeIdNumber", normalizedEmpId),
          )
          .first();

        if (
          existingWithEmpId &&
          existingWithEmpId._id !== args.employeeId &&
          !existingWithEmpId.isRemoved
        ) {
          throw new ConvexError(
            `Employee number '${normalizedEmpId}' is already assigned to another employee in this workspace.`,
          );
        }
        finalUpdates.employeeIdNumber = normalizedEmpId;
      } else {
        finalUpdates.employeeIdNumber = undefined;
      }
    }

    if (updates.joiningDate !== undefined) {
      finalUpdates.joiningDate = updates.joiningDate.trim() || undefined;
    }

    if (updates.email) {
      const normalizedEmail = updates.email.trim().toLowerCase();
      const existing = await ctx.db
        .query("employees")
        .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
        .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
        .first();

      if (existing && existing._id !== args.employeeId) {
        throw new ConvexError(
          "An employee with this email already exists in this workspace",
        );
      }
      finalUpdates.email = normalizedEmail;
    }

    // Validate Banking Fields
    if (updates.bankAccountHolderName !== undefined) {
      finalUpdates.bankAccountHolderName = updates.bankAccountHolderName.trim()
        ? validateAccountHolderName(updates.bankAccountHolderName)
        : undefined;
    }
    if (updates.bankName !== undefined) {
      finalUpdates.bankName = updates.bankName.trim()
        ? validateBankName(updates.bankName)
        : undefined;
    }
    if (updates.bankAccountNumber !== undefined) {
      finalUpdates.bankAccountNumber = updates.bankAccountNumber.trim()
        ? validateBankAccountNumber(updates.bankAccountNumber)
        : undefined;
    }
    if (updates.ifscCode !== undefined) {
      finalUpdates.ifscCode = updates.ifscCode.trim()
        ? validateIfsc(updates.ifscCode)
        : undefined;
    }

    // Validate Statutory Fields
    if (updates.pan !== undefined) {
      finalUpdates.pan = updates.pan.trim()
        ? validatePan(updates.pan)
        : undefined;
    }
    if (updates.uan !== undefined) {
      finalUpdates.uan = updates.uan.trim()
        ? validateUan(updates.uan)
        : undefined;
    }
    if (updates.esicIpNumber !== undefined) {
      finalUpdates.esicIpNumber = updates.esicIpNumber.trim()
        ? validateEsicIpNumber(updates.esicIpNumber)
        : undefined;
    }
    if (updates.pfMemberId !== undefined) {
      finalUpdates.pfMemberId = updates.pfMemberId.trim()
        ? validatePfMemberId(updates.pfMemberId)
        : undefined;
    }

    await ctx.db.patch(employeeId, finalUpdates);

    // Audit log records only which field names changed, never raw sensitive values
    await audit(ctx, args.workspaceId, userId, "employee.update", {
      employeeId,
      updatedFields: Object.keys(updates),
    });
  },
});

export const deactivate = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Employee not found");
    }

    await ctx.db.patch(args.employeeId, {
      status: "inactive",
      updatedAt: Date.now(),
    });
    await audit(ctx, args.workspaceId, userId, "employee.deactivate", {
      employeeId: args.employeeId,
    });
  },
});

export const remove = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Employee not found");
    }

    if (employee.isRemoved) {
      return; // Already removed
    }

    // Safe soft removal:
    // Mark the employee as inactive and removed from the active directory.
    // Crucially, historical records (payroll items, payslips, salaries, attendance, statutory filings)
    // are strictly preserved and remain intact for statutory compliance and audit oversight.
    const now = Date.now();
    await ctx.db.patch(args.employeeId, {
      status: "inactive",
      isRemoved: true,
      removedAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "employee.remove", {
      employeeId: args.employeeId,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      softRemoval: true,
      removedAt: now,
    });
  },
});

export const linkMyAccount = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const user = await ctx.db.get(userId);
    if (!user || !user.email)
      throw new ConvexError("No email on your account.");

    // Check if verified
    if (!user.emailVerificationTime) {
      throw new ConvexError("Your email address is not verified.");
    }

    // Ensure the user hasn't already linked to an employee in this workspace
    const alreadyLinked = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();
    if (alreadyLinked) {
      return alreadyLinked._id;
    }

    // Find by email in the workspace (normalized to lowercase)
    const normalizedEmail = user.email.trim().toLowerCase();
    const matches = await ctx.db
      .query("employees")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .collect();

    if (matches.length === 0) {
      throw new ConvexError(
        `No employee record found for email ${user.email} in this workspace.`,
      );
    }
    if (matches.length > 1) {
      throw new ConvexError(
        `Ambiguous match: multiple employee records share the email ${user.email}. Contact HR.`,
      );
    }

    const employee = matches[0];
    if (!employee) throw new ConvexError("No employee found");
    if (employee.userId) {
      throw new ConvexError(
        "This employee record is already claimed by another user.",
      );
    }

    await ctx.db.patch(employee._id, { userId });
    await audit(ctx, args.workspaceId, userId, "employee.linked", {
      employeeId: employee._id,
    });

    return employee._id;
  },
});

export const getMyProfile = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();

    if (!employee) return null;

    return redactEmployeeSensitiveData(employee, true, true);
  },
});
