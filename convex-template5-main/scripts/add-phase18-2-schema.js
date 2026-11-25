const fs = require('fs');
const schemaPath = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/packages/backend/convex/schema.ts';
let schema = fs.readFileSync(schemaPath, 'utf8');

if (schema.includes('systemListOfValues: defineTable')) {
  console.log('Tables already present in schema.ts');
  process.exit(0);
}

const newTables = `
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
`;

const lastIndex = schema.lastIndexOf('});');
if (lastIndex !== -1) {
  schema = schema.slice(0, lastIndex) + newTables + '\n});\n';
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('Successfully appended Phase 18.2 tables to schema.ts');
} else {
  console.error('Could not find closing }); in schema.ts');
}
