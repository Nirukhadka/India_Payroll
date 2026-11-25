import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Multi-tenant: resources carry workspaceId. It is `optional` on pre-existing tables only so
// deploys don't fail validation against pre-migration rows; the function layer always sets it.
export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    username: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    timezone: v.optional(v.string()),
    biography: v.optional(v.string()),
    lastPasswordChangedDate: v.optional(v.number()),
  }).index("email", ["email"]),

  events: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    source: v.string(),
    type: v.string(),
    payload: v.any(),
    receivedAt: v.number(),
  })
    .index("by_received", ["receivedAt"])
    .index("by_workspace", ["workspaceId"]),

  jobs: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.id("users"),
    kind: v.string(),
    status: v.string(),
    input: v.optional(v.any()),
    result: v.optional(v.any()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"]),

  auditLogs: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.id("users"),
    action: v.string(),
    meta: v.optional(v.any()),
    at: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"]),

  usage: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.optional(v.id("users")),
    metric: v.string(),
    count: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_metric", ["userId", "metric"])
    .index("by_workspace_metric", ["workspaceId", "metric"]),

  apiKeys: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.id("users"),
    name: v.string(),
    prefix: v.string(),
    hash: v.string(),
    revoked: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_hash", ["hash"]),

  // Files (workspace-scoped). Stored in Convex file storage; row holds metadata.
  files: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    name: v.string(),
    storageId: v.id("_storage"),
    size: v.number(),
    contentType: v.string(),
    category: v.optional(
      v.union(
        v.literal("documents"),
        v.literal("payslips"),
        v.literal("form16"),
        v.literal("policies"),
        v.literal("forms"),
      ),
    ),
    // E-Sign and Digital Signature Workflow Metadata
    eSignStatus: v.optional(
      v.union(
        v.literal("none"),
        v.literal("pending_signature"),
        v.literal("signed"),
        v.literal("declined"),
      ),
    ),
    signerUserId: v.optional(v.id("users")),
    signerName: v.optional(v.string()),
    signedAt: v.optional(v.number()),
    signatureMethod: v.optional(v.string()), // e.g. "INTERNAL_DIGITAL_OTP", "CLICK_WRAP_AUDIT"
    signatureAuditHash: v.optional(v.string()),
    auditTrail: v.optional(
      v.array(
        v.object({
          action: v.string(),
          actorId: v.id("users"),
          actorName: v.string(),
          timestamp: v.number(),
          ipAddress: v.optional(v.string()),
          notes: v.optional(v.string()),
        }),
      ),
    ),
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"])
    .index("by_workspace_esign", ["workspaceId", "eSignStatus"]),

  workspaces: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
  }),
  members: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.string(),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("suspended"),
        v.literal("invited"),
      ),
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_workspace", ["workspaceId"])
    .index("by_user_workspace", ["userId", "workspaceId"]),
  invites: defineTable({
    workspaceId: v.id("workspaces"),
    email: v.string(),
    role: v.string(),
    invitedBy: v.id("users"),
    accepted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_email", ["email"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    body: v.optional(v.string()),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "read"]),

  // Maintained counters so dashboard.stats is O(1) instead of scanning every row.
  counters: defineTable({
    workspaceId: v.id("workspaces"),
    metric: v.string(),
    value: v.number(),
  }).index("by_workspace_metric", ["workspaceId", "metric"]),

  employees: defineTable({
    workspaceId: v.id("workspaces"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    designation: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    userId: v.optional(v.id("users")),
    employeeIdNumber: v.optional(v.string()),
    joiningDate: v.optional(v.string()),
    // Banking Master Data
    bankAccountHolderName: v.optional(v.string()),
    bankName: v.optional(v.string()),
    bankAccountNumber: v.optional(v.string()),
    ifscCode: v.optional(v.string()),
    // Statutory Master Data
    pan: v.optional(v.string()),
    uan: v.optional(v.string()),
    esicIpNumber: v.optional(v.string()),
    pfMemberId: v.optional(v.string()),
    isPfMember: v.optional(v.boolean()),
    isEsiMember: v.optional(v.boolean()),
    isRemoved: v.optional(v.boolean()),
    removedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_status", ["workspaceId", "status"])
    .index("by_workspace_user", ["workspaceId", "userId"])
    .index("by_email", ["email"])
    .index("by_workspace_employee_id", ["workspaceId", "employeeIdNumber"]),

  salaries: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    basicSalary: v.number(),
    allowances: v.array(v.object({ name: v.string(), amount: v.number() })),
    deductions: v.array(v.object({ name: v.string(), amount: v.number() })),
    grossSalary: v.number(),
    effectiveDate: v.number(),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_employee", ["employeeId"])
    .index("by_employee_date", ["employeeId", "effectiveDate"]),

  attendance: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    date: v.string(), // "YYYY-MM-DD"
    status: v.union(
      v.literal("present"),
      v.literal("absent"),
      v.literal("half_day"),
      v.literal("paid_leave"),
      v.literal("unpaid_leave"),
      v.literal("holiday"),
      v.literal("weekly_off"),
    ),
    checkInTime: v.optional(v.string()), // "HH:MM"
    checkOutTime: v.optional(v.string()), // "HH:MM"
    workDurationHours: v.optional(v.number()), // Net work duration in hours
    actualBreakMinutes: v.optional(v.number()), // Measured duration of breaks
    deductedBreakMinutes: v.optional(v.number()), // Break duration deducted after precedence check
    lateInMinutes: v.optional(v.number()), // Minutes late past shift start + grace
    earlyOutMinutes: v.optional(v.number()), // Minutes early before shift end
    shiftId: v.optional(v.id("shifts")),
    source: v.optional(
      v.union(v.literal("biometric"), v.literal("manual"), v.literal("regularized")),
    ),
    completionStatus: v.optional(
      v.union(
        v.literal("complete"),
        v.literal("missing_out"),
        v.literal("missing_in"),
        v.literal("single_punch"),
      ),
    ),
    timezone: v.optional(v.string()), // e.g. "Asia/Kolkata"
    remarks: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_date", ["workspaceId", "date"])
    .index("by_employee", ["employeeId"])
    .index("by_employee_date", ["employeeId", "date"])
    .index("by_workspace_employee_date", ["workspaceId", "employeeId", "date"]),

  leaveRequests: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    leaveType: v.union(
      v.literal("casual"),
      v.literal("sick"),
      v.literal("earned"),
      v.literal("unpaid"),
      v.literal("restricted_holiday"),
      v.literal("comp_off"),
    ),
    startDate: v.string(), // "YYYY-MM-DD"
    endDate: v.string(), // "YYYY-MM-DD"
    daysCount: v.number(),
    reason: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
    ),
    session: v.optional(
      v.union(
        v.literal("full_day"),
        v.literal("session_1"),
        v.literal("session_2"),
      ),
    ),
    contactDetails: v.optional(v.string()),
    fileAttachment: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    reviewedBy: v.optional(v.id("users")),
    reviewRemarks: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_status", ["workspaceId", "status"])
    .index("by_employee", ["employeeId"])
    .index("by_employee_status", ["employeeId", "status"]),

  lopSettings: defineTable({
    workspaceId: v.id("workspaces"),
    calculationBasis: v.union(
      v.literal("calendar_days"), // Gross / Days in Month
      v.literal("fixed_30_days"), // Gross / 30
      v.literal("working_days"), // Gross / (Month Days - Standard Weekends)
    ),
    includeUnpaidLeave: v.boolean(),
    includeAbsent: v.boolean(),
    halfDayFactor: v.number(), // standard 0.5
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  payrollRuns: defineTable({
    workspaceId: v.id("workspaces"),
    periodMonth: v.string(), // "YYYY-MM"
    startDate: v.string(), // "YYYY-MM-DD"
    endDate: v.string(), // "YYYY-MM-DD"
    status: v.union(
      v.literal("draft"),
      v.literal("calculated"),
      v.literal("pending_approval"),
      v.literal("approved"),
      v.literal("processed"),
    ),
    totalEmployees: v.number(),
    totalGrossSalary: v.number(),
    totalLopDeduction: v.number(),
    totalCustomDeductions: v.number(),
    totalStatutoryDeductions: v.number(),
    totalEmployerContributions: v.optional(v.number()),
    totalNetSalary: v.number(),
    createdById: v.id("users"),
    submittedBy: v.optional(v.id("users")),
    submittedAt: v.optional(v.number()),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("users")),
    rejectionReason: v.optional(v.string()),
    finalizedBy: v.optional(v.id("users")),
    finalizedAt: v.optional(v.number()),
    // Supplementary Run Fields (optional for full backward compatibility)
    runType: v.optional(
      v.union(v.literal("regular"), v.literal("supplementary")),
    ),
    originalPayrollRunId: v.optional(v.id("payrollRuns")),
    targetEmployeeId: v.optional(v.id("employees")),
    adjustmentReason: v.optional(v.string()),
    adjustmentCategory: v.optional(v.string()),
    correctionKey: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_period", ["workspaceId", "periodMonth"]),

  payrollItems: defineTable({
    workspaceId: v.id("workspaces"),
    payrollRunId: v.id("payrollRuns"),
    employeeId: v.id("employees"),
    salaryId: v.optional(v.id("salaries")),
    basicSalary: v.number(),
    allowances: v.array(v.object({ name: v.string(), amount: v.number() })),
    grossSalary: v.number(),
    lopDays: v.number(),
    lopDeduction: v.number(),
    customDeductions: v.array(
      v.object({ name: v.string(), amount: v.number() }),
    ),
    totalCustomDeductions: v.number(),
    statutoryDeductions: v.array(
      v.object({
        name: v.string(),
        amount: v.number(),
        isConfigured: v.boolean(),
      }),
    ),
    totalStatutoryDeductions: v.number(),
    employerContributions: v.array(
      v.object({
        name: v.string(),
        amount: v.number(),
        isConfigured: v.boolean(),
      }),
    ),
    totalEmployerContributions: v.optional(v.number()),
    totalDeductions: v.number(),
    netSalary: v.number(),
    hasSalaryStructure: v.boolean(),
    warnings: v.array(v.string()),
    loanDeductions: v.optional(
      v.array(
        v.object({
          loanId: v.id("loans"),
          loanType: v.string(),
          emiAmount: v.number(),
          principalComponent: v.number(),
          interestComponent: v.number(),
          deductedAmount: v.number(),
          outstandingBefore: v.number(),
          outstandingAfter: v.number(),
          isPartial: v.boolean(),
          isBounced: v.boolean(),
        })
      )
    ),
    totalLoanDeductions: v.optional(v.number()),
    reimbursementItems: v.optional(
      v.array(
        v.object({
          claimId: v.id("reimbursementClaims"),
          claimNumber: v.string(),
          categoryCode: v.string(),
          taxTreatment: v.string(),
          approvedAmount: v.number(),
          isTaxExempt: v.boolean(),
        })
      )
    ),
    totalReimbursements: v.optional(v.number()),
    paymentMode: v.optional(
      v.union(v.literal("bank_transfer"), v.literal("cash"), v.literal("cheque"))
    ),
    paymentStatus: v.optional(
      v.union(
        v.literal("PENDING"),
        v.literal("AUTHORIZED"),
        v.literal("PROCESSING"),
        v.literal("PAID"),
        v.literal("FAILED"),
        v.literal("PARTIALLY_PAID")
      )
    ),
    paymentReference: v.optional(v.string()),
    amountPaid: v.optional(v.number()),
    remainingBalance: v.optional(v.number()),
    settlementEvidenceReference: v.optional(v.string()),
    settlementVerifiedAt: v.optional(v.number()),
    settlementVerifiedById: v.optional(v.id("users")),
    paidAt: v.optional(v.number()),
    isHold: v.optional(v.boolean()),
    isStopProcessing: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_run", ["payrollRunId"])
    .index("by_employee", ["employeeId"]),

  workspaceCompliance: defineTable({
    workspaceId: v.id("workspaces"),
    epfEnabled: v.boolean(),
    epfWageCeiling: v.optional(v.number()), // Statutory default is 15000
    epfRestrictToCeiling: v.optional(v.boolean()), // true = restrict to wage ceiling, false = actual basic
    epsEnabled: v.optional(v.boolean()), // 8.33% EPS pension allocation
    epsWageCeiling: v.optional(v.number()), // EPS ceiling default 15000 (capping EPS at 1250)
    edliEnabled: v.optional(v.boolean()), // 0.5% EDLI insurance
    adminChargesEnabled: v.optional(v.boolean()), // 0.5% admin charges
    epfEstablishmentCode: v.optional(v.string()), // Optional EPFO Establishment Code (e.g. MHBAN0012345000)
    esiEnabled: v.boolean(),
    esiWageCeiling: v.optional(v.number()), // Statutory default 21000
    ptState: v.optional(v.string()), // e.g., "Karnataka"
    ptEnabled: v.boolean(),
    lwfEnabled: v.optional(v.boolean()),
    lwfState: v.optional(v.string()), // e.g., "Karnataka", "Maharashtra"
    // Employer TDS Master Data (Form 138 / Form 24Q)
    tan: v.optional(v.string()), // 10-char Tax Deduction Account Number, e.g. BLRK12345A
    employerPan: v.optional(v.string()), // 10-char Employer PAN
    deductorType: v.optional(
      v.union(
        v.literal("company"),
        v.literal("individual"),
        v.literal("firm"),
        v.literal("government"),
        v.literal("other"),
      ),
    ),
    paoCode: v.optional(v.string()), // Pay and Accounts Office Code (e.g. PAO001)
    ddoCode: v.optional(v.string()), // Drawing and Disbursing Office Code (e.g. DDO001)
    ministryName: v.optional(v.string()), // Ministry Name for Government deductors
    responsiblePersonName: v.optional(v.string()),
    responsiblePersonPan: v.optional(v.string()),
    responsiblePersonDesignation: v.optional(v.string()),
    responsiblePersonEmail: v.optional(v.string()),
    responsiblePersonMobile: v.optional(v.string()),
    responsiblePersonAddress: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  employeeCompliance: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    taxRegime: v.union(v.literal("old"), v.literal("new")),
    epfOptOut: v.boolean(),
    epfOnActualBasic: v.optional(v.boolean()), // Voluntary EPF contribution on full basic
    tdsOverride: v.optional(v.number()), // Manual TDS override amount
    section197CertificateNumber: v.optional(v.string()), // 10-char Certificate Number u/s 197 issued by AO
    section197Rate: v.optional(v.number()), // Lower tax deduction rate (e.g. 0% or 2%)
    esiContributionPeriodCovered: v.optional(v.boolean()), // Continues coverage under Sec 2(9) proviso if crossed 21k mid-period
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_employee", ["employeeId"]),

  // Employee Tax Declarations (Form 12BB under Rule 26C, Income-tax Rules, 1962)
  taxDeclarations: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    financialYear: v.string(), // e.g. "2026-27"
    regime: v.union(v.literal("new"), v.literal("old")),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    hra: v.optional(
      v.object({
        annualRentPaid: v.number(),
        landlordName: v.optional(v.string()),
        landlordPan: v.optional(v.string()),
        landlordAddress: v.optional(v.string()),
        cityType: v.optional(
          v.union(v.literal("metro"), v.literal("non_metro")),
        ),
      }),
    ),
    homeLoan: v.optional(
      v.object({
        annualInterest: v.number(),
        lenderName: v.optional(v.string()),
        lenderPan: v.optional(v.string()),
      }),
    ),
    chapterVIA: v.optional(
      v.object({
        section80C: v.optional(v.number()), // Capped at ₹1.5L
        section80D: v.optional(v.number()), // Health insurance
        section80CCD1B: v.optional(v.number()), // Additional NPS up to ₹50k
        section80E: v.optional(v.number()), // Education loan interest
        section80G: v.optional(v.number()), // Donations
        otherDeductions: v.optional(v.number()),
      }),
    ),
    previousEmployer: v.optional(
      v.object({
        grossSalary: v.number(),
        tdsDeducted: v.number(),
        employerName: v.optional(v.string()),
        employerPan: v.optional(v.string()),
        employerTan: v.optional(v.string()),
      }),
    ),
    proofs: v.array(
      v.object({
        id: v.string(),
        category: v.string(), // "rent_receipt", "insurance_receipt", "home_loan_cert", "investment_proof", "other"
        title: v.string(),
        fileId: v.optional(v.id("files")),
        storageId: v.optional(v.id("_storage")),
        fileName: v.string(),
        uploadedAt: v.number(),
      }),
    ),
    reviewRemarks: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    submittedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_employee_fy", ["employeeId", "financialYear"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // Quarterly Tax Deposit Challans (ITNS 281) for Form 138 / Form 24Q
  tdsChallans: defineTable({
    workspaceId: v.id("workspaces"),
    quarter: v.union(
      v.literal("Q1"),
      v.literal("Q2"),
      v.literal("Q3"),
      v.literal("Q4"),
    ),
    financialYear: v.string(), // e.g. "2026-27"
    bsrCode: v.string(), // 7 digits
    depositDate: v.string(), // "YYYY-MM-DD"
    challanSerialNumber: v.string(), // 5 digits
    minorHead: v.union(v.literal("200"), v.literal("400")), // 200 = TDS Payable by taxpayer, 400 = Regular Assessment
    taxAmount: v.number(),
    surcharge: v.optional(v.number()),
    cess: v.optional(v.number()),
    interest: v.optional(v.number()),
    fee: v.optional(v.number()), // Section 234E late fee
    penalty: v.optional(v.number()),
    totalAmount: v.number(),
    remarks: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_quarter", ["workspaceId", "financialYear", "quarter"]),

  // Company Holiday Calendar (Indian Statutory / Gazetted & Restricted Holidays)
  holidays: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    date: v.string(), // "YYYY-MM-DD"
    type: v.union(
      v.literal("gazetted"),
      v.literal("restricted"),
      v.literal("company"),
    ),
    description: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_date", ["workspaceId", "date"]),

  // Employee Helpdesk & Support Tickets
  helpdeskTickets: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    ticketNumber: v.string(),
    category: v.union(
      v.literal("payroll"),
      v.literal("leaves"),
      v.literal("attendance"),
      v.literal("benefits"),
      v.literal("general"),
    ),
    subject: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed"),
    ),
    assignedTo: v.optional(v.id("users")),
    resolutionRemarks: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_employee", ["employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // Resignation & Notice Period Requests
  resignations: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    proposedResignationDate: v.string(), // "YYYY-MM-DD"
    noticePeriodDays: v.number(),
    expectedLastWorkingDay: v.string(), // "YYYY-MM-DD"
    approvedLastWorkingDay: v.optional(v.string()),
    reason: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("withdrawn"),
    ),
    hrComments: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_employee", ["employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // Attendance Regularization Requests
  attendanceRegularizations: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    date: v.string(), // "YYYY-MM-DD"
    requestedStatus: v.union(
      v.literal("present"),
      v.literal("absent"),
      v.literal("half_day"),
      v.literal("paid_leave"),
      v.literal("unpaid_leave"),
      v.literal("holiday"),
      v.literal("weekly_off"),
    ),
    checkInTime: v.optional(v.string()), // "HH:MM"
    checkOutTime: v.optional(v.string()), // "HH:MM"
    reason: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled"),
    ),
    reviewedBy: v.optional(v.id("users")),
    reviewRemarks: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_status", ["workspaceId", "status"])
    .index("by_employee", ["employeeId"])
    .index("by_employee_date", ["employeeId", "date"]),

  // -------------------------------------------------------------------------
  // Biometric Attendance & Shift Parity Modules (Phase 2)
  // -------------------------------------------------------------------------

  // 1. Biometric Hardware Devices
  biometricDevices: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(), // e.g. "Main Gate Terminal"
    deviceSerial: v.string(), // Hardware serial number
    deviceModel: v.optional(v.string()), // e.g. "eSSL K90 Pro"
    ipAddress: v.optional(v.string()),
    keyFingerprint: v.string(), // SHA-256 preview for UI identification
    secretCiphertext: v.string(), // Encrypted communication secret
    secretIv: v.string(), // Initialization vector for AES-GCM
    keyVersion: v.number(), // Monotonically increasing version
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("deactivated")),
    lastHeartbeatAt: v.optional(v.number()),
    lastSyncAt: v.optional(v.number()),
    createdById: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_status", ["workspaceId", "status"])
    .index("by_workspace_serial", ["workspaceId", "deviceSerial"]),

  // 2. Raw Biometric Punch Logs
  rawPunchLogs: defineTable({
    workspaceId: v.id("workspaces"),
    deviceId: v.optional(v.id("biometricDevices")),
    deviceSerial: v.string(),
    biometricUserId: v.string(), // Badge or device user ID
    employeeId: v.optional(v.id("employees")), // Resolved employee reference
    punchTimestamp: v.number(), // Epoch ms
    punchType: v.union(
      v.literal("check_in"),
      v.literal("check_out"),
      v.literal("break_out"),
      v.literal("break_in"),
      v.literal("auto"),
    ),
    punchDate: v.string(), // "YYYY-MM-DD"
    idempotencyKey: v.string(), // SHA256(workspaceId:deviceSerial:biometricUserId:punchTimestamp)
    processedStatus: v.union(
      v.literal("pending"),
      v.literal("processed"),
      v.literal("unmapped"),
      v.literal("ignored"),
      v.literal("duplicate"),
    ),
    processedAt: v.optional(v.number()),
    processingNotes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_idempotency", ["idempotencyKey"])
    .index("by_workspace_date", ["workspaceId", "punchDate"])
    .index("by_workspace_employee_date", ["workspaceId", "employeeId", "punchDate"])
    .index("by_device_timestamp", ["deviceSerial", "punchTimestamp"]),

  // 3. Shift Master
  shifts: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(), // "General Shift", "Night Shift"
    code: v.string(), // "GEN", "NIGHT"
    startTime: v.string(), // "HH:MM", e.g. "09:00"
    endTime: v.string(), // "HH:MM", e.g. "18:00"
    isOvernight: v.boolean(),
    gracePeriodMinutes: v.number(), // Allowed late arrival without penalty
    halfDayThresholdHours: v.number(), // Minimum hours for half day
    fullDayThresholdHours: v.number(), // Minimum hours for full day
    breakDeductionRule: v.union(
      v.literal("measured_breaks"),
      v.literal("fixed_break"),
      v.literal("whichever_is_greater"),
    ),
    fixedBreakMinutes: v.number(), // e.g. 60
    isDefault: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_code", ["workspaceId", "code"]),

  // 5. Biometric Replay Protection Nonces
  biometricNonces: defineTable({
    workspaceId: v.id('workspaces'),
    deviceSerial: v.string(),
    nonce: v.string(),
    timestamp: v.number(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_device_nonce', ['workspaceId', 'deviceSerial', 'nonce'])
    .index('by_expires', ['expiresAt']),

  // 4. Employee Shift Assignments
  shiftAssignments: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    shiftId: v.id("shifts"),
    effectiveFrom: v.string(), // "YYYY-MM-DD"
    effectiveTo: v.optional(v.string()), // "YYYY-MM-DD"
    createdById: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_employee_effective", ["employeeId", "effectiveFrom"]),

  // Workflow Delegation Settings
  workflowDelegates: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    delegateEmployeeId: v.id("employees"),
    workflowType: v.union(
      v.literal("leave_approvals"),
      v.literal("attendance_approvals"),
      v.literal("all"),
    ),
    startDate: v.string(), // "YYYY-MM-DD"
    endDate: v.string(), // "YYYY-MM-DD"
    status: v.union(v.literal("active"), v.literal("inactive")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_employee", ["employeeId"]),

  // Compensatory Off (Comp-Off) Grant Requests
  compOffRequests: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    workDate: v.string(), // "YYYY-MM-DD"
    reason: v.string(),
    daysCount: v.number(), // typically 1 or 0.5
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    reviewedBy: v.optional(v.id("users")),
    reviewRemarks: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_employee", ["employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // Engage — Company Announcements
  announcements: defineTable({
    workspaceId: v.id("workspaces"),
    title: v.string(),
    content: v.string(),
    category: v.union(
      v.literal("general"),
      v.literal("hr"),
      v.literal("event"),
      v.literal("policy"),
    ),
    authorId: v.id("users"),
    authorName: v.string(),
    pinned: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_pinned", ["workspaceId", "pinned"]),

  // Engage — Interactive Team Polls
  polls: defineTable({
    workspaceId: v.id("workspaces"),
    question: v.string(),
    options: v.array(v.string()),
    createdById: v.id("users"),
    creatorName: v.string(),
    status: v.union(v.literal("active"), v.literal("closed")),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // Engage — Poll Votes
  pollVotes: defineTable({
    workspaceId: v.id("workspaces"),
    pollId: v.id("polls"),
    userId: v.id("users"),
    optionIndex: v.number(),
    createdAt: v.number(),
  })
    .index("by_poll", ["pollId"])
    .index("by_poll_user", ["pollId", "userId"])
    .index("by_workspace", ["workspaceId"]),

  // Engage — Peer Recognition & Kudos
  kudos: defineTable({
    workspaceId: v.id("workspaces"),
    senderEmployeeId: v.id("employees"),
    receiverEmployeeId: v.id("employees"),
    message: v.string(),
    badge: v.string(),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_receiver", ["receiverEmployeeId"]),

  // Engage — Feed Posts
  posts: defineTable({
    workspaceId: v.id("workspaces"),
    title: v.optional(v.string()),
    content: v.string(),
    group: v.optional(v.string()), // "Events", "General", "Engineering", "HR"
    authorId: v.id("users"),
    authorName: v.string(),
    authorEmployeeId: v.optional(v.id("employees")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_created", ["workspaceId", "createdAt"]),

  // Engage — Activity Reactions
  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    activityId: v.string(),
    activityType: v.string(), // "post", "kudos", "announcement", "poll", "celebration"
    userId: v.id("users"),
    reactionType: v.string(), // "like", "heart", "clap", "celebrate"
    createdAt: v.number(),
  })
    .index("by_activity", ["activityId"])
    .index("by_activity_user", ["activityId", "userId"])
    .index("by_workspace", ["workspaceId"]),

  // Engage — Activity Comments
  comments: defineTable({
    workspaceId: v.id("workspaces"),
    activityId: v.string(),
    activityType: v.string(),
    userId: v.id("users"),
    userName: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_activity", ["activityId"])
    .index("by_workspace", ["workspaceId"]),

  // Workflow Module: Employee Onboarding Tasks
  onboardingTasks: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    taskName: v.string(),
    category: v.union(
      v.literal("documentation"),
      v.literal("it_setup"),
      v.literal("training"),
      v.literal("hr_orientation"),
      v.literal("compliance"),
    ),
    assignedToId: v.optional(v.id("users")),
    assignedRole: v.optional(v.string()), // e.g. "HR Manager", "IT Admin"
    dueDate: v.string(), // "YYYY-MM-DD"
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("verified"),
    ),
    completionRemarks: v.optional(v.string()),
    verifiedBy: v.optional(v.id("users")),
    verifiedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_employee", ["employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // Workflow Module: Employee Confirmation & Probation
  employeeConfirmations: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    probationPeriodMonths: v.number(), // typically 3 or 6 months
    probationEndDate: v.string(), // "YYYY-MM-DD"
    confirmationDueDate: v.string(), // "YYYY-MM-DD"
    reviewerId: v.optional(v.id("users")),
    rating: v.optional(
      v.union(
        v.literal("exceeds"),
        v.literal("meets"),
        v.literal("needs_improvement"),
      ),
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("extended"),
      v.literal("terminated"),
    ),
    extensionMonths: v.optional(v.number()),
    effectiveConfirmationDate: v.optional(v.string()),
    remarks: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_employee", ["employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // Workflow Setup: Reviewer Types
  workflowReviewerTypes: defineTable({
    workspaceId: v.id("workspaces"),
    typeCode: v.string(), // e.g., "MANAGER", "HR_ADMIN", "DEPT_HEAD", "FINANCE"
    typeName: v.string(), // e.g., "Reporting Manager", "HR Administrator"
    description: v.string(),
    hierarchyLevel: v.number(), // 1, 2, 3
    isSystemDefault: v.boolean(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_code", ["workspaceId", "typeCode"]),

  // Workflow Setup: Approval Levels & Escalation Rules
  workflowLevels: defineTable({
    workspaceId: v.id("workspaces"),
    workflowModule: v.union(
      v.literal("leave"),
      v.literal("leave_cancel"),
      v.literal("comp_off"),
      v.literal("rh_leave"),
      v.literal("resignation"),
      v.literal("confirmation"),
      v.literal("help_desk"),
      v.literal("onboarding"),
    ),
    levelIndex: v.number(), // 1, 2, 3
    levelName: v.string(), // "Primary Reviewer", "HR Escalation", etc.
    reviewerTypeId: v.string(), // reviewer type code or role
    autoApprovalDays: v.number(), // 0 for disabled, or 2, 3, etc.
    canEscalate: v.boolean(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_module", ["workspaceId", "workflowModule"]),

  // Reports Module: User Report Favorites
  reportFavorites: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    reportId: v.string(), // ID corresponding to reports registry (e.g. "salary_statement_monthly")
    createdAt: v.number(),
  })
    .index("by_workspace_user", ["workspaceId", "userId"])
    .index("by_workspace_report", ["workspaceId", "reportId"]),

  // Reports Module: Report Execution Runs & History
  reportRuns: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    reportId: v.string(),
    reportName: v.string(),
    category: v.string(),
    parameters: v.string(), // JSON stringified filter values (e.g. periodMonth, dept)
    format: v.union(v.literal("PDF"), v.literal("XLSX"), v.literal("CSV")),
    status: v.union(v.literal("completed"), v.literal("failed")),
    rowCount: v.number(),
    fileSizeKb: v.number(),
    generatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_user", ["workspaceId", "userId"])
    .index("by_workspace_date", ["workspaceId", "generatedAt"]),

  // Reports Module: Saved Query Builder Definitions
  savedQueries: defineTable({
    workspaceId: v.id("workspaces"),
    createdBy: v.id("users"),
    queryName: v.string(),
    description: v.optional(v.string()),
    primarySource: v.union(
      v.literal("employees"),
      v.literal("salaries"),
      v.literal("attendance"),
      v.literal("leaves"),
    ),
    selectedFields: v.array(v.string()), // allowlisted field keys
    filters: v.array(
      v.object({
        field: v.string(),
        operator: v.union(
          v.literal("equals"),
          v.literal("not_equals"),
          v.literal("contains"),
          v.literal("greater_than"),
          v.literal("less_than"),
        ),
        value: v.string(),
      }),
    ),
    sortBy: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    groupBy: v.optional(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_creator", ["workspaceId", "createdBy"]),
  // -------------------------------------------------------------------------
  // Unite Marketplace Module (Phase 15)
  // -------------------------------------------------------------------------

  // Marketplace Applications Registry
  marketplaceApps: defineTable({
    appId: v.string(), // e.g. "springverify", "fatakpay", "cleartax"
    name: v.string(),
    provider: v.string(),
    tagline: v.string(),
    description: v.string(),
    category: v.string(), // "Background Verification", "Advance Salary", etc.
    secondaryCategory: v.optional(v.string()),
    rating: v.number(),
    ratingCount: v.number(),
    offerBadge: v.optional(v.string()), // e.g. "20% Discount on Background Checks"
    isFeatured: v.boolean(),
    isInterestedDefault: v.optional(v.boolean()),
    integrationType: v.union(
      v.literal("native"),
      v.literal("connector"),
      v.literal("third_party"),
      v.literal("demo"),
    ),
    supportedFeatures: v.array(v.string()),
    pricingModel: v.string(), // e.g. "Paid per check", "Enterprise subscription", "Free trial available"
    dataExchanged: v.array(v.string()),
    securityCompliance: v.array(v.string()), // e.g. ["ISO 27001", "SOC 2 Type II", "GDPR"]
    docUrl: v.optional(v.string()),
    isActiveInCatalog: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_app_id", ["appId"])
    .index("by_category", ["category"])
    .index("by_featured", ["isFeatured"]),

  // Organization App Installation / Request Status
  marketplaceOrgApps: defineTable({
    workspaceId: v.id("workspaces"),
    appId: v.string(),
    status: v.union(
      v.literal("available"),
      v.literal("requested"),
      v.literal("pending_approval"),
      v.literal("approved"),
      v.literal("installed"),
      v.literal("active"),
      v.literal("suspended"),
      v.literal("rejected"),
    ),
    requestedBy: v.optional(v.id("users")),
    requestReason: v.optional(v.string()),
    requestedModules: v.optional(v.array(v.string())),
    contactName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    reviewComments: v.optional(v.string()),
    configSettings: v.optional(v.string()), // JSON configuration (non-sensitive)
    requestedAt: v.optional(v.number()),
    reviewedAt: v.optional(v.number()),
    installedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_app", ["workspaceId", "appId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // User / Org Interested Apps (Bookmarked / Saved for later)
  marketplaceInterestedApps: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    appId: v.string(),
    addedAt: v.number(),
  })
    .index("by_workspace_user", ["workspaceId", "userId"])
    .index("by_workspace_app", ["workspaceId", "appId"]),

  // Marketplace In-App Notifications
  marketplaceNotifications: defineTable({
    workspaceId: v.id("workspaces"),
    recipientUserId: v.optional(v.id("users")), // undefined = all admins in org
    appId: v.string(),
    appName: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("request_submitted"),
      v.literal("request_approved"),
      v.literal("request_rejected"),
      v.literal("installation_completed"),
      v.literal("config_required"),
      v.literal("status_changed"),
    ),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_read", ["workspaceId", "isRead"])
    .index("by_workspace_recipient", ["workspaceId", "recipientUserId"]),

  // Marketplace Demo Requests (Book A Demo)
  marketplaceDemoRequests: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    name: v.string(),
    organization: v.string(),
    workEmail: v.string(),
    contactNumber: v.string(),
    interestedAppId: v.string(),
    preferredDate: v.string(),
    additionalInfo: v.optional(v.string()),
    status: v.union(
      v.literal("received"),
      v.literal("contacted"),
      v.literal("scheduled"),
    ),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_user", ["workspaceId", "userId"]),

  // User Tour Preference (Take A Tour completion)
  marketplaceTourPreferences: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    hasCompletedTour: v.boolean(),
    completedAt: v.optional(v.number()),
  }).index("by_workspace_user", ["workspaceId", "userId"]),

  // My Profile: Login & Security History Records (Phase 16.1)
  loginHistory: defineTable({
    workspaceId: v.optional(v.id("workspaces")),
    userId: v.id("users"),
    userEmail: v.string(),
    userName: v.optional(v.string()),
    employeeNo: v.optional(v.string()),
    eventType: v.union(
      v.literal("login_success"),
      v.literal("login_failure"),
      v.literal("password_changed"),
    ),
    ipAddress: v.string(),
    userAgent: v.optional(v.string()),
    timestamp: v.number(), // Unix timestamp (ms)
  })
    .index("by_user", ["userId"])
    .index("by_user_timestamp", ["userId", "timestamp"])
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_timestamp", ["workspaceId", "timestamp"])
    .index("by_event_type", ["eventType"]),

  // Phase 16.2: Account Settings Schemas
  // 1. Plan Subscriptions
  accountSubscriptions: defineTable({
    workspaceId: v.id("workspaces"),
    planKey: v.union(
      v.literal("essential"),
      v.literal("growth"),
      v.literal("enterprise"),
    ),
    billingCycle: v.union(v.literal("monthly"), v.literal("annual")),
    status: v.union(
      v.literal("active"),
      v.literal("trial"),
      v.literal("pending_change"),
      v.literal("cancelled"),
    ),
    requestedPlan: v.optional(v.string()),
    employeeAllowance: v.number(),
    activeHeadcount: v.number(),
    monthlyBasePrice: v.number(),
    additionalEmployeeRate: v.number(),
    startDate: v.number(),
    renewalDate: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  // 2. Invoices
  accountInvoices: defineTable({
    workspaceId: v.id("workspaces"),
    invoiceNo: v.string(),
    billingPeriodStart: v.string(),
    billingPeriodEnd: v.string(),
    invoiceDate: v.string(),
    invoiceAmount: v.number(),
    status: v.union(v.literal("paid"), v.literal("unpaid"), v.literal("due")),
    currency: v.string(),
    lineItems: v.array(
      v.object({
        slNo: v.number(),
        service: v.string(),
        headCount: v.number(),
        amount: v.number(),
        totalAmount: v.number(),
        taxPercent: v.number(),
        invoiceAmount: v.number(),
      }),
    ),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_invoice_no", ["invoiceNo"]),

  // 3. Payment Records
  accountPayments: defineTable({
    workspaceId: v.id("workspaces"),
    paymentDate: v.string(),
    amount: v.number(),
    paymentMode: v.string(),
    chequeOrRefNo: v.string(),
    bankName: v.string(),
    chequeDate: v.optional(v.string()),
    acknowledgementSent: v.boolean(),
    invoiceNo: v.string(),
    invoiceDate: v.string(),
    invoiceAmount: v.number(),
    paidAmount: v.number(),
    status: v.union(
      v.literal("successful"),
      v.literal("pending"),
      v.literal("failed"),
    ),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_invoice_no", ["invoiceNo"]),

  // 4. Support Tickets
  accountTickets: defineTable({
    workspaceId: v.id("workspaces"),
    ticketId: v.string(),
    subject: v.string(),
    category: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent"),
    ),
    status: v.union(
      v.literal("Open"),
      v.literal("In Progress"),
      v.literal("Resolved"),
      v.literal("Closed"),
    ),
    dateOfCreation: v.string(),
    lastActivity: v.string(),
    createdByEmail: v.string(),
    createdByName: v.string(),
    messages: v.array(
      v.object({
        sender: v.string(),
        senderRole: v.string(),
        message: v.string(),
        timestamp: v.string(),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_ticket_id", ["ticketId"])
    .index("by_status", ["status"]),

  // 5. Account Features
  accountFeatures: defineTable({
    workspaceId: v.id("workspaces"),
    featureKey: v.string(),
    name: v.string(),
    description: v.string(),
    enabled: v.boolean(),
    since: v.string(),
    enabledAt: v.optional(v.string()),
    category: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_feature", ["workspaceId", "featureKey"]),

  // Phase 17: User Administration Schemas
  // 1. User Roles with Granular Permission Matrix
  userAdminRoles: defineTable({
    workspaceId: v.id("workspaces"),
    roleKey: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    isSystem: v.boolean(), // Protected system roles cannot be deleted
    lastUpdatedOn: v.string(),
    permissions: v.object({
      payroll: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      attendance: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      employees: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      leaves: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      claims: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      reports: v.object({ view: v.boolean(), export: v.boolean() }),
      settings: v.object({ view: v.boolean(), write: v.boolean() }),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_roleKey", ["workspaceId", "roleKey"]),

  // 2. Linked Employee Account Mappings
  linkedEmployeeAccounts: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    employeeNo: v.string(),
    employeeName: v.string(),
    userId: v.id("users"),
    userName: v.string(),
    userEmail: v.string(),
    fromDate: v.string(),
    toDate: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_user", ["workspaceId", "userId"]),

  // ---------------------------------------------------------------------------
  // PHASE 18: SYSTEM SETTINGS
  // ---------------------------------------------------------------------------
  systemCompanySettings: defineTable({
    workspaceId: v.id("workspaces"),
    companyName: v.string(),
    companyAddress: v.string(),
    country: v.string(),
    states: v.string(),
    industry: v.string(),
    timezone: v.string(),
    currency: v.string(),
    pfNo: v.optional(v.string()),
    tanNo: v.optional(v.string()),
    panNo: v.optional(v.string()),
    esiNo: v.optional(v.string()),
    linNo: v.optional(v.string()),
    gstNo: v.optional(v.string()),
    registrationCertificateNo: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    companyLogoUrl: v.optional(v.string()),
    signatureUploadUrl: v.optional(v.string()),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  }).index("by_workspace", ["workspaceId"]),

  systemGeneralPreferences: defineTable({
    workspaceId: v.id("workspaces"),
    financialYearStart: v.string(),
    defaultLanguage: v.string(),
    enableAuditTrail: v.boolean(),
    enableMultiCurrency: v.boolean(),
    dateFormat: v.string(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  systemEmployeePreferences: defineTable({
    workspaceId: v.id("workspaces"),
    empNoAutoGenerate: v.boolean(),
    empNoPrefix: v.string(),
    empNoStartingNumber: v.number(),
    empNoLength: v.number(),
    probationPeriodMonths: v.number(),
    noticePeriodDays: v.number(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  payrollControls: defineTable({
    workspaceId: v.id("workspaces"),
    periodMonth: v.string(), // "YYYY-MM"
    payrollInputsLocked: v.boolean(),
    employeeViewReleased: v.boolean(),
    itStatementReleased: v.boolean(),
    payrollLocked: v.boolean(),
    lockedById: v.optional(v.id("users")),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_period", ["workspaceId", "periodMonth"]),

  payrollSettlementAuditLogs: defineTable({
    workspaceId: v.id("workspaces"),
    payrollRunId: v.id("payrollRuns"),
    payrollItemId: v.id("payrollItems"),
    employeeId: v.id("employees"),
    action: v.string(), // "STATUS_CHANGE" | "PAYMENT_RECORDED" | "DUPLICATE_ATTEMPT_BLOCKED"
    previousStatus: v.optional(v.string()),
    newStatus: v.string(),
    amount: v.number(),
    remainingBalance: v.number(),
    paymentMode: v.string(),
    evidenceReference: v.string(),
    performedById: v.id("users"),
    timestamp: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_item", ["payrollItemId"])
    .index("by_run", ["payrollRunId"]),

  systemPayrollPreferences: defineTable({
    workspaceId: v.id("workspaces"),
    payPeriodCycle: v.string(), // "1-to-last" or "26-to-25"
    payDay: v.number(),
    roundOffSalary: v.boolean(),
    pfCeilingLimit: v.number(),
    esiCeilingLimit: v.number(),
    ptApplicable: v.boolean(),
    labourWelfareFund: v.boolean(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  systemIncomeTaxPreferences: defineTable({
    workspaceId: v.id("workspaces"),
    activeFinancialYear: v.string(),
    defaultTaxRegime: v.union(v.literal("new"), v.literal("old")),
    allowRegimeSwitch: v.boolean(),
    declarationWindowOpen: v.boolean(),
    proofSubmissionDeadline: v.string(),
    panValidationRequired: v.boolean(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  systemLeavePreferences: defineTable({
    workspaceId: v.id("workspaces"),
    leaveYearStartMonth: v.number(), // 1 for Jan, 4 for Apr
    enableCarryForward: v.boolean(),
    maxCarryForwardDays: v.number(),
    enableEncashment: v.boolean(),
    probationLeaveAllowed: v.boolean(),
    negativeBalanceAllowed: v.boolean(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  systemIntegrationConnectors: defineTable({
    workspaceId: v.id("workspaces"),
    connectorKey: v.string(), // e.g. "quickbooks", "slack", "zoho_books", "webhook"
    name: v.string(),
    category: v.string(),
    status: v.union(
      v.literal("NOT_CONFIGURED"),
      v.literal("CONFIGURED"),
      v.literal("CONNECTED"),
      v.literal("DEMO"),
    ),
    webhookUrl: v.optional(v.string()),
    apiVersion: v.optional(v.string()),
    lastSyncTime: v.optional(v.string()),
    isEnabled: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_connectorKey", ["workspaceId", "connectorKey"]),

  // ---------------------------------------------------------------------------
  // PHASE 18.2: GENERAL & EMPLOYEE SETTINGS TABLES
  // ---------------------------------------------------------------------------
  systemListOfValues: defineTable({
    workspaceId: v.id("workspaces"),
    category: v.string(), // e.g. "G_EMPLOYEE_BLOODGROUP", "G_EMPLOYEE_FEEDBACK", etc.
    code: v.string(),     // unique code per category
    description: v.string(),
    sortOrder: v.optional(v.number()),
    isActive: v.boolean(),
    isSystem: v.boolean(), // prevents deleting built-in values
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_category", ["workspaceId", "category"])
    .index("by_workspace_category_code", ["workspaceId", "category", "code"]),

  systemBankBranches: defineTable({
    workspaceId: v.id("workspaces"),
    bankName: v.string(), // e.g. "State Bank of India", "HDFC Bank", etc.
    branchName: v.string(),
    ifscCode: v.string(),
    micrCode: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    isActive: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_bank", ["workspaceId", "bankName"])
    .index("by_workspace_ifsc", ["workspaceId", "ifscCode"]),

  systemCompanyBanks: defineTable({
    workspaceId: v.id("workspaces"),
    bankName: v.string(),
    branchName: v.string(),
    ifscCode: v.string(),
    accountNumber: v.string(),
    accountType: v.string(), // "Current", "Savings", "OD"
    iban: v.optional(v.string()),
    isPrimary: v.boolean(),
    status: v.string(), // "Active", "Inactive"
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_accountNumber", ["workspaceId", "accountNumber"]),

  systemStates: defineTable({
    workspaceId: v.id("workspaces"),
    country: v.string(), // "India"
    stateCode: v.string(), // "KA", "MH", etc.
    stateName: v.string(), // "Karnataka", "Maharashtra", etc.
    unionTerritory: v.boolean(),
    tinCode: v.optional(v.string()), // GST state code e.g. "29", "27"
    ptApplicable: v.boolean(),
    lwfApplicable: v.boolean(),
    isActive: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_country", ["workspaceId", "country"])
    .index("by_workspace_stateCode", ["workspaceId", "stateCode"]),

  systemEmployeeNoSeries: defineTable({
    workspaceId: v.id("workspaces"),
    seriesName: v.string(), // e.g. "Permanent Employees", "Temporary Employees"
    prefix: v.string(),     // e.g. "EMP-", "T-"
    currentSerial: v.number(), // e.g. 1
    startingNumber: v.number(), // e.g. 1
    digitCount: v.number(), // e.g. 4 -> "0001"
    format: v.string(), // e.g. "0001", "T0001", "EMP-0001"
    isDefault: v.boolean(),
    isManualEntryAllowed: v.boolean(),
    isDisabled: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_seriesName", ["workspaceId", "seriesName"]),

  systemTransitionGroups: defineTable({
    workspaceId: v.id("workspaces"),
    screenKey: v.string(), // e.g. "eim-profile-category", "general-employee-category", etc.
    screenName: v.string(),
    availableCategories: v.array(v.string()),
    selectedCategories: v.array(v.string()),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_screenKey", ["workspaceId", "screenKey"]),

  systemEmployeePositions: defineTable({
    workspaceId: v.id("workspaces"),
    code: v.string(),
    title: v.string(),
    department: v.string(),
    level: v.string(),
    isCritical: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    status: v.optional(v.string()),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_code", ["workspaceId", "code"]),

  systemLeavingReasons: defineTable({
    workspaceId: v.id("workspaces"),
    code: v.string(),
    description: v.string(),
    pfCode: v.string(),
    isActive: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_code", ["workspaceId", "code"]),

  systemAssetGroupSettings: defineTable({
    workspaceId: v.id("workspaces"),
    groupCode: v.string(),
    groupName: v.string(),
    returnable: v.boolean(),
    depreciationPct: v.number(),
    approvalRequired: v.boolean(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_groupCode", ["workspaceId", "groupCode"]),

  systemEmployeeDirectoryConfig: defineTable({
    workspaceId: v.id("workspaces"),
    config: v.optional(v.any()),
    visibleFields: v.optional(v.array(v.string())),
    searchableFields: v.optional(v.array(v.string())),
    allowExport: v.optional(v.boolean()),
    restrictInactiveProfiles: v.optional(v.boolean()),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  }).index("by_workspace", ["workspaceId"]),


  // ─────────────────────────────────────────────────────────────────────────────
  // BATCH P0 SECURE BACKEND FOUNDATION MODELS
  // ─────────────────────────────────────────────────────────────────────────────

  // 1. Employee Loans Master
  loans: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    loanType: v.string(), // "PERSONAL", "SALARY_ADVANCE", "EMERGENCY", "EQUIPMENT", "EDUCATION", "HOUSING"
    purpose: v.optional(v.string()),
    principalAmount: v.number(),
    interestRatePercent: v.number(), // Annual rate e.g. 8.5 (or 0 for interest-free)
    tenureMonths: v.number(),
    monthlyEmiAmount: v.number(),
    startDate: v.optional(v.string()), // "YYYY-MM"
    expectedCompletionDate: v.optional(v.string()), // "YYYY-MM"
    approvalStatus: v.optional(
      v.union(v.literal("PENDING"), v.literal("APPROVED"), v.literal("REJECTED"))
    ),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("users")),
    rejectedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    disbursementStatus: v.optional(
      v.union(v.literal("PENDING"), v.literal("DISBURSED"), v.literal("CANCELLED"))
    ),
    disbursedAt: v.optional(v.number()),
    disbursedBy: v.optional(v.id("users")),
    status: v.union(
      v.literal("PENDING"),
      v.literal("APPROVED"),
      v.literal("DISBURSED"),
      v.literal("ACTIVE"),
      v.literal("CLOSED"),
      v.literal("REJECTED")
    ),
    outstandingPrincipal: v.number(),
    totalRepaid: v.number(),
    closedAt: v.optional(v.number()),
    closedBy: v.optional(v.id("users")),
    closureReason: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // 2. Loan Repayments & Payroll Deductions
  loanRepayments: defineTable({
    workspaceId: v.id("workspaces"),
    loanId: v.id("loans"),
    employeeId: v.id("employees"),
    repaymentMonth: v.string(), // "YYYY-MM"
    installmentNumber: v.number(),
    principalPaid: v.number(),
    interestPaid: v.number(),
    totalDeducted: v.number(),
    outstandingBalanceAfter: v.optional(v.number()),
    repaymentType: v.optional(
      v.union(v.literal("PAYROLL_DEDUCTION"), v.literal("EARLY_REPAYMENT"), v.literal("PARTIAL_REPAYMENT"), v.literal("MANUAL_ADJUSTMENT"))
    ),
    payrollRunId: v.optional(v.id("payrollRuns")),
    deductionStatus: v.union(
      v.literal("SCHEDULED"),
      v.literal("PROCESSED"),
      v.literal("WAIVED"),
      v.literal("BOUNCED")
    ),
    notes: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_loan", ["loanId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_month", ["workspaceId", "repaymentMonth"]),

  // 3a. Configurable Reimbursement Categories
  reimbursementCategories: defineTable({
    workspaceId: v.id("workspaces"),
    categoryCode: v.string(), // "TRAVEL", "MEDICAL", "TELECOM", "FOOD", "HOTEL", "FUEL", "LEARNING", "BOOKS", "GENERAL"
    categoryName: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    maxClaimLimit: v.optional(v.number()), // Ceiling in INR (optional)
    receiptRequired: v.boolean(),
    taxTreatment: v.union(
      v.literal("TAXABLE"),
      v.literal("POTENTIALLY_EXEMPT"),
      v.literal("NON_TAXABLE_BUSINESS"),
      v.literal("REQUIRES_REVIEW")
    ),
    requiresManagerApproval: v.boolean(),
    requiresFinanceApproval: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_code", ["workspaceId", "categoryCode"]),

  // 3b. Employee Reimbursement Claims & Multi-stage Approval Workflow
  reimbursementClaims: defineTable({
    workspaceId: v.id("workspaces"),
    claimNumber: v.string(), // e.g. "CLM-202611-001"
    employeeId: v.id("employees"),
    categoryCode: v.string(), // Foreign key to category
    claimType: v.string(), // Category name or fallback type
    claimAmount: v.number(),
    approvedAmount: v.optional(v.number()),
    expenseDate: v.string(), // "YYYY-MM-DD"
    businessPurpose: v.string(),
    description: v.string(),
    paymentMethod: v.optional(v.string()), // "PAYROLL", "DIRECT_BANK_TRANSFER", "CORPORATE_CARD"
    referenceNumber: v.optional(v.string()),
    billAttachmentStorageId: v.optional(v.id("_storage")),
    billAttachmentUrl: v.optional(v.string()),
    taxTreatment: v.union(
      v.literal("TAXABLE"),
      v.literal("POTENTIALLY_EXEMPT"),
      v.literal("NON_TAXABLE_BUSINESS"),
      v.literal("REQUIRES_REVIEW")
    ),
    isTaxExempt: v.boolean(),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("SUBMITTED"),
      v.literal("MANAGER_REVIEW"),
      v.literal("FINANCE_REVIEW"),
      v.literal("APPROVED"),
      v.literal("REJECTED"),
      v.literal("RETURNED_FOR_CORRECTION"),
      v.literal("ON_HOLD"),
      v.literal("PROCESSING"),
      v.literal("SETTLED"),
      v.literal("CANCELLED")
    ),
    managerReviewedBy: v.optional(v.id("users")),
    managerReviewedAt: v.optional(v.number()),
    managerComments: v.optional(v.string()),
    financeReviewedBy: v.optional(v.id("users")),
    financeReviewedAt: v.optional(v.number()),
    financeComments: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    holdReason: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewerComments: v.optional(v.string()),
    settledInPayrollMonth: v.optional(v.string()), // "YYYY-MM"
    settledInPayrollRunId: v.optional(v.id("payrollRuns")),
    settledAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"])
    .index("by_workspace_claim_number", ["workspaceId", "claimNumber"]),

  // 3c. Reimbursement Audit Timeline Ledger
  reimbursementAuditLogs: defineTable({
    workspaceId: v.id("workspaces"),
    claimId: v.id("reimbursementClaims"),
    action: v.string(), // "CREATED_DRAFT", "SUBMITTED", "MANAGER_APPROVED", "FINANCE_APPROVED", "REJECTED", "HELD", "SETTLED", etc.
    actorUserId: v.id("users"),
    fromStatus: v.string(),
    toStatus: v.string(),
    notes: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_claim", ["claimId"]),

  // 4. Full & Final Settlement (F&F) Calculation & Clearance Ledger
  fnfSettlements: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    leavingDate: v.string(), // "YYYY-MM-DD"
    reasonForLeaving: v.string(),
    serviceTenureYears: v.number(),
    lastDrawnBasicSalary: v.number(),
    exitMonthSalaryPayable: v.number(),
    earnedLeaveDaysBalance: v.number(),
    leaveEncashmentAmount: v.number(),
    isGratuityEligible: v.boolean(),
    gratuityAmount: v.number(),
    bonusOrExGratia: v.number(),
    grossPayable: v.number(),
    noticePeriodShortfallDays: v.number(),
    noticePayDeduction: v.number(),
    outstandingLoanRecovery: v.number(),
    otherDeductions: v.number(),
    totalDeductions: v.number(),
    netSettlementPayable: v.number(),
    clearanceStatus: v.union(
      v.literal("DRAFT"),
      v.literal("DEPT_CLEARANCE_PENDING"),
      v.literal("APPROVED"),
      v.literal("PAID"),
      v.literal("CANCELLED")
    ),
    calculatedBy: v.id("users"),
    approvedBy: v.optional(v.id("users")),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_status", ["workspaceId", "clearanceStatus"]),

  // 5. Outbound System Email Delivery Diagnostic Log (Non-credential)
  emailLogs: defineTable({
    workspaceId: v.id("workspaces"),
    recipientEmail: v.string(),
    recipientEmployeeId: v.optional(v.id("employees")),
    subject: v.string(),
    templateName: v.string(), // "PAYSLIP_DISPATCH", "OTP_VERIFY", "ONBOARDING_INVITE", "LEAVE_APPROVAL"
    dispatchStatus: v.union(
      v.literal("QUEUED"),
      v.literal("SENT"),
      v.literal("FAILED"),
      v.literal("BOUNCED"),
      v.literal("NOT_CONFIGURED")
    ),
    providerMessageId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_status", ["workspaceId", "dispatchStatus"])
    .index("by_workspace_created", ["workspaceId", "createdAt"]),

  // 6. Security-Restricted User Impersonation Session Audit Ledger
  userImpersonationSessions: defineTable({
    workspaceId: v.id("workspaces"),
    adminUserId: v.id("users"), // Must be authenticated Super Admin
    targetUserId: v.id("users"), // Target user being previewed
    targetEmployeeId: v.optional(v.id("employees")),
    businessReason: v.string(), // Mandatory audit justification
    startedAt: v.number(),
    expiresAt: v.number(), // Strict time-based expiry (e.g. max 30 mins)
    endedAt: v.optional(v.number()),
    status: v.union(
      v.literal("ACTIVE"),
      v.literal("EXPIRED"),
      v.literal("REVOKED")
    ),
    ipAddressMasked: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_admin", ["adminUserId"])
    .index("by_target", ["targetUserId"])
    .index("by_workspace_status", ["workspaceId", "status"]),
});
