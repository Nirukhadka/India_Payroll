const fs = require('fs');
const file = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/packages/backend/convex/systemSettings.ts';
let code = fs.readFileSync(file, 'utf8');

if (code.includes('getListOfValues')) {
  console.log('Phase 18.2 functions already exist in systemSettings.ts');
  process.exit(0);
}

const additions = `
// =============================================================================
// PHASE 18.2: GENERAL & EMPLOYEE SETTINGS QUERIES & MUTATIONS
// =============================================================================

// Default seed data for List of Values
export const DEFAULT_LOV_ITEMS = [
  // Blood Group
  { category: "G_EMPLOYEE_BLOODGROUP", code: "A_POS", description: "A+", sortOrder: 1, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_BLOODGROUP", code: "A_NEG", description: "A-", sortOrder: 2, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_BLOODGROUP", code: "B_POS", description: "B+", sortOrder: 3, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_BLOODGROUP", code: "B_NEG", description: "B-", sortOrder: 4, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_BLOODGROUP", code: "O_POS", description: "O+", sortOrder: 5, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_BLOODGROUP", code: "O_NEG", description: "O-", sortOrder: 6, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_BLOODGROUP", code: "AB_POS", description: "AB+", sortOrder: 7, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_BLOODGROUP", code: "AB_NEG", description: "AB-", sortOrder: 8, isActive: true, isSystem: true },
  // Leaving Feedback
  { category: "G_EMPLOYEE_FEEDBACK", code: "BETTER_OPPORTUNITY", description: "Better Career Opportunity", sortOrder: 1, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_FEEDBACK", code: "HIGHER_STUDIES", description: "Higher Studies", sortOrder: 2, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_FEEDBACK", code: "RELOCATION", description: "Personal / Family Relocation", sortOrder: 3, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_FEEDBACK", code: "COMPENSATION", description: "Compensation & Benefits", sortOrder: 4, isActive: true, isSystem: true },
  // PF Leaving Reason
  { category: "G_EMPLOYEE_PFLEAVINGREASON", code: "CESSATION", description: "Cessation (Short Service)", sortOrder: 1, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_PFLEAVINGREASON", code: "RETIREMENT", description: "Superannuation / Retirement", sortOrder: 2, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_PFLEAVINGREASON", code: "ILL_HEALTH", description: "Permanent Ill Health", sortOrder: 3, isActive: true, isSystem: true },
  // PF Scheme
  { category: "G_EMPLOYEE_PFSCHEME", code: "PF_APPLICABLE", description: "Provident Fund - Standard Scheme", sortOrder: 1, isActive: true, isSystem: true },
  { category: "G_EMPLOYEE_PFSCHEME", code: "PF_EXEMPT", description: "Provident Fund - Exempt Trust", sortOrder: 2, isActive: true, isSystem: true },
];

export const DEFAULT_BANK_BRANCHES = [
  { bankName: "State Bank of India", branchName: "Koramangala Bangalore", ifscCode: "SBIN0005383", micrCode: "560002029", address: "80 Feet Road, 7th Block, Koramangala", city: "Bengaluru", state: "Karnataka", isActive: true },
  { bankName: "State Bank of India", branchName: "Indiranagar Bangalore", ifscCode: "SBIN0003301", micrCode: "560002016", address: "100 Feet Road, HAL 2nd Stage", city: "Bengaluru", state: "Karnataka", isActive: true },
  { bankName: "HDFC Bank", branchName: "Koramangala 4th Block", ifscCode: "HDFC0000053", micrCode: "560240003", address: "No. 8, 80 Feet Road, 4th Block", city: "Bengaluru", state: "Karnataka", isActive: true },
  { bankName: "HDFC Bank", branchName: "Cyber City Gurugram", ifscCode: "HDFC0000572", micrCode: "110240078", address: "DLF Cyber City, Building 9", city: "Gurugram", state: "Haryana", isActive: true },
  { bankName: "ICICI Bank", branchName: "MG Road Bangalore", ifscCode: "ICIC0000002", micrCode: "560229002", address: "M.G. Road Branch, Trinity Circle", city: "Bengaluru", state: "Karnataka", isActive: true },
  { bankName: "Axis Bank", branchName: "Whitefield Bangalore", ifscCode: "UTIB0000155", micrCode: "560211007", address: "ITPL Main Road, Brookefields", city: "Bengaluru", state: "Karnataka", isActive: true },
];

export const DEFAULT_COMPANY_BANKS = [
  {
    bankName: "HDFC Bank",
    branchName: "Koramangala 4th Block",
    ifscCode: "HDFC0000053",
    accountNumber: "50200088991122",
    accountType: "Current",
    iban: "IN53HDFC000005350200088991122",
    isPrimary: true,
    status: "Active",
  },
  {
    bankName: "State Bank of India",
    branchName: "Koramangala Bangalore",
    ifscCode: "SBIN0005383",
    accountNumber: "38992211004",
    accountType: "Current",
    iban: "IN83SBIN000538338992211004",
    isPrimary: false,
    status: "Active",
  },
];

export const DEFAULT_INDIAN_STATES = [
  { country: "India", stateCode: "AN", stateName: "Andaman and Nicobar Islands", unionTerritory: true, tinCode: "35", ptApplicable: false, lwfApplicable: false, isActive: true },
  { country: "India", stateCode: "AP", stateName: "Andhra Pradesh", unionTerritory: false, tinCode: "37", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "AR", stateName: "Arunachal Pradesh", unionTerritory: false, tinCode: "12", ptApplicable: false, lwfApplicable: false, isActive: true },
  { country: "India", stateCode: "AS", stateName: "Assam", unionTerritory: false, tinCode: "18", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "BR", stateName: "Bihar", unionTerritory: false, tinCode: "10", ptApplicable: true, lwfApplicable: false, isActive: true },
  { country: "India", stateCode: "CH", stateName: "Chandigarh", unionTerritory: true, tinCode: "04", ptApplicable: false, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "CG", stateName: "Chhattisgarh", unionTerritory: false, tinCode: "22", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "DN", stateName: "Dadra and Nagar Haveli and Daman and Diu", unionTerritory: true, tinCode: "26", ptApplicable: false, lwfApplicable: false, isActive: true },
  { country: "India", stateCode: "DL", stateName: "Delhi", unionTerritory: true, tinCode: "07", ptApplicable: false, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "GA", stateName: "Goa", unionTerritory: false, tinCode: "30", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "GJ", stateName: "Gujarat", unionTerritory: false, tinCode: "24", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "HR", stateName: "Haryana", unionTerritory: false, tinCode: "06", ptApplicable: false, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "HP", stateName: "Himachal Pradesh", unionTerritory: false, tinCode: "02", ptApplicable: false, lwfApplicable: false, isActive: true },
  { country: "India", stateCode: "JH", stateName: "Jharkhand", unionTerritory: false, tinCode: "20", ptApplicable: true, lwfApplicable: false, isActive: true },
  { country: "India", stateCode: "KA", stateName: "Karnataka", unionTerritory: false, tinCode: "29", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "KL", stateName: "Kerala", unionTerritory: false, tinCode: "32", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "MP", stateName: "Madhya Pradesh", unionTerritory: false, tinCode: "23", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "MH", stateName: "Maharashtra", unionTerritory: false, tinCode: "27", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "OD", stateName: "Odisha", unionTerritory: false, tinCode: "21", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "PB", stateName: "Punjab", unionTerritory: false, tinCode: "03", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "RJ", stateName: "Rajasthan", unionTerritory: false, tinCode: "08", ptApplicable: false, lwfApplicable: false, isActive: true },
  { country: "India", stateCode: "TN", stateName: "Tamil Nadu", unionTerritory: false, tinCode: "33", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "TS", stateName: "Telangana", unionTerritory: false, tinCode: "36", ptApplicable: true, lwfApplicable: true, isActive: true },
  { country: "India", stateCode: "UP", stateName: "Uttar Pradesh", unionTerritory: false, tinCode: "09", ptApplicable: false, lwfApplicable: false, isActive: true },
  { country: "India", stateCode: "WB", stateName: "West Bengal", unionTerritory: false, tinCode: "19", ptApplicable: true, lwfApplicable: true, isActive: true },
];

export const DEFAULT_EMP_NO_SERIES = [
  {
    seriesName: "Permanent Employees",
    prefix: "",
    currentSerial: 1,
    startingNumber: 1,
    digitCount: 4,
    format: "0001",
    isDefault: true,
    isManualEntryAllowed: false,
    isDisabled: false,
  },
  {
    seriesName: "Temporary Employees",
    prefix: "T",
    currentSerial: 1,
    startingNumber: 1,
    digitCount: 4,
    format: "T0001",
    isDefault: false,
    isManualEntryAllowed: false,
    isDisabled: false,
  },
  {
    seriesName: "Contractors & Retainers",
    prefix: "C",
    currentSerial: 1,
    startingNumber: 1,
    digitCount: 4,
    format: "C0001",
    isDefault: false,
    isManualEntryAllowed: true,
    isDisabled: false,
  },
];

export const DEFAULT_TRANSITION_GROUPS = [
  {
    screenKey: "eim-profile-category",
    screenName: "EIM Profile Category",
    availableCategories: ["Cost Center", "Grade", "Business Unit", "Project"],
    selectedCategories: ["Department", "Designation", "Location"],
  },
  {
    screenKey: "ess-filter-category",
    screenName: "Ess Filter Category",
    availableCategories: ["Cost Center", "Project", "Grade"],
    selectedCategories: ["Department", "Location"],
  },
  {
    screenKey: "general-employee-category",
    screenName: "General Employee Category",
    availableCategories: ["Project", "Division"],
    selectedCategories: ["Department", "Designation", "Location", "Grade"],
  },
  {
    screenKey: "leave-review-page-category",
    screenName: "Leave Review Page",
    availableCategories: ["Cost Center", "Project"],
    selectedCategories: ["Department", "Designation"],
  },
  {
    screenKey: "paygroup-emp-category",
    screenName: "Pay Group Employee Category",
    availableCategories: ["Project"],
    selectedCategories: ["Department", "Location", "Grade"],
  },
];

// 1. LIST OF VALUES (LOV)
export const getListOfValues = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    let items = await ctx.db
      .query("systemListOfValues")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    // Auto-seed if empty
    if (items.length === 0) {
      return DEFAULT_LOV_ITEMS.filter((i) => !args.category || i.category === args.category);
    }

    if (args.category) {
      items = items.filter((i) => i.category === args.category);
    }
    return items.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
  },
});

export const saveListOfValue = mutation({
  args: {
    category: v.string(),
    code: v.string(),
    description: v.string(),
    sortOrder: v.optional(v.number()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const userId = await getAuthUserId(ctx);

    // Validation
    const cleanCode = args.code.trim().toUpperCase();
    const cleanDesc = args.description.trim();
    if (!cleanCode) throw new Error("Code is required");
    if (!cleanDesc) throw new Error("Description is required");

    // Check duplicate
    const existing = await ctx.db
      .query("systemListOfValues")
      .withIndex("by_workspace_category_code", (q) =>
        q.eq("workspaceId", ws._id).eq("category", args.category).eq("code", cleanCode)
      )
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        description: cleanDesc,
        sortOrder: args.sortOrder ?? existing.sortOrder,
        isActive: args.isActive,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id: existing._id, updated: true };
    } else {
      const id = await ctx.db.insert("systemListOfValues", {
        workspaceId: ws._id,
        category: args.category,
        code: cleanCode,
        description: cleanDesc,
        sortOrder: args.sortOrder ?? 10,
        isActive: args.isActive,
        isSystem: false,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id, created: true };
    }
  },
});

export const deleteListOfValue = mutation({
  args: {
    id: v.id("systemListOfValues"),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const item = await ctx.db.get(args.id);
    if (!item || item.workspaceId !== ws._id) throw new Error("Record not found");
    if (item.isSystem) throw new Error("Cannot delete built-in system values");
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// 2. BANK BRANCH
export const getBankBranches = query({
  args: {
    bankName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    let branches = await ctx.db
      .query("systemBankBranches")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    if (branches.length === 0) {
      return DEFAULT_BANK_BRANCHES.filter((b) => !args.bankName || b.bankName === args.bankName);
    }

    if (args.bankName) {
      branches = branches.filter((b) => b.bankName === args.bankName);
    }
    return branches;
  },
});

export const saveBankBranch = mutation({
  args: {
    bankName: v.string(),
    branchName: v.string(),
    ifscCode: v.string(),
    micrCode: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const userId = await getAuthUserId(ctx);

    const ifsc = args.ifscCode.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      throw new Error("Invalid IFSC format. Must be 11 characters (e.g. SBIN0005383)");
    }
    if (!args.bankName.trim()) throw new Error("Bank name is required");
    if (!args.branchName.trim()) throw new Error("Branch name is required");

    const existing = await ctx.db
      .query("systemBankBranches")
      .withIndex("by_workspace_ifsc", (q) => q.eq("workspaceId", ws._id).eq("ifscCode", ifsc))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        bankName: args.bankName.trim(),
        branchName: args.branchName.trim(),
        micrCode: args.micrCode?.trim(),
        address: args.address?.trim(),
        city: args.city?.trim(),
        state: args.state?.trim(),
        isActive: args.isActive,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id: existing._id, updated: true };
    } else {
      const id = await ctx.db.insert("systemBankBranches", {
        workspaceId: ws._id,
        bankName: args.bankName.trim(),
        branchName: args.branchName.trim(),
        ifscCode: ifsc,
        micrCode: args.micrCode?.trim(),
        address: args.address?.trim(),
        city: args.city?.trim(),
        state: args.state?.trim(),
        isActive: args.isActive,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id, created: true };
    }
  },
});

export const deleteBankBranch = mutation({
  args: { id: v.id("systemBankBranches") },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const item = await ctx.db.get(args.id);
    if (!item || item.workspaceId !== ws._id) throw new Error("Record not found");
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// 3. COMPANY BANK DETAILS
export const getCompanyBanks = query({
  args: {},
  handler: async (ctx) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    const banks = await ctx.db
      .query("systemCompanyBanks")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    if (banks.length === 0) {
      return DEFAULT_COMPANY_BANKS;
    }
    return banks;
  },
});

export const saveCompanyBank = mutation({
  args: {
    bankName: v.string(),
    branchName: v.string(),
    ifscCode: v.string(),
    accountNumber: v.string(),
    accountType: v.string(),
    iban: v.optional(v.string()),
    isPrimary: v.boolean(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const userId = await getAuthUserId(ctx);

    const accNo = args.accountNumber.trim();
    if (accNo.length < 8 || accNo.length > 25) {
      throw new Error("Invalid account number length");
    }
    const ifsc = args.ifscCode.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      throw new Error("Invalid IFSC code format");
    }

    // If marked as primary, unmark previous primaries
    if (args.isPrimary) {
      const allBanks = await ctx.db
        .query("systemCompanyBanks")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
        .collect();
      for (const b of allBanks) {
        if (b.isPrimary) {
          await ctx.db.patch(b._id, { isPrimary: false });
        }
      }
    }

    const existing = await ctx.db
      .query("systemCompanyBanks")
      .withIndex("by_workspace_accountNumber", (q) =>
        q.eq("workspaceId", ws._id).eq("accountNumber", accNo)
      )
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        bankName: args.bankName.trim(),
        branchName: args.branchName.trim(),
        ifscCode: ifsc,
        accountType: args.accountType,
        iban: args.iban?.trim(),
        isPrimary: args.isPrimary,
        status: args.status,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id: existing._id, updated: true };
    } else {
      const id = await ctx.db.insert("systemCompanyBanks", {
        workspaceId: ws._id,
        bankName: args.bankName.trim(),
        branchName: args.branchName.trim(),
        ifscCode: ifsc,
        accountNumber: accNo,
        accountType: args.accountType,
        iban: args.iban?.trim(),
        isPrimary: args.isPrimary,
        status: args.status,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id, created: true };
    }
  },
});

export const deleteCompanyBank = mutation({
  args: { id: v.id("systemCompanyBanks") },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const item = await ctx.db.get(args.id);
    if (!item || item.workspaceId !== ws._id) throw new Error("Record not found");
    if (item.isPrimary) throw new Error("Cannot delete the primary company bank account");
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// 4. STATE CONFIGURATION
export const getStates = query({
  args: {
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    let states = await ctx.db
      .query("systemStates")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    if (states.length === 0) {
      return DEFAULT_INDIAN_STATES.filter((s) => !args.country || s.country === args.country);
    }

    if (args.country) {
      states = states.filter((s) => s.country === args.country);
    }
    return states.sort((a, b) => a.stateName.localeCompare(b.stateName));
  },
});

export const saveStateConfig = mutation({
  args: {
    country: v.string(),
    stateCode: v.string(),
    stateName: v.string(),
    unionTerritory: v.boolean(),
    tinCode: v.optional(v.string()),
    ptApplicable: v.boolean(),
    lwfApplicable: v.boolean(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const userId = await getAuthUserId(ctx);

    const code = args.stateCode.trim().toUpperCase();
    if (!code) throw new Error("State code is required");
    if (!args.stateName.trim()) throw new Error("State name is required");

    const existing = await ctx.db
      .query("systemStates")
      .withIndex("by_workspace_stateCode", (q) => q.eq("workspaceId", ws._id).eq("stateCode", code))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        country: args.country.trim(),
        stateName: args.stateName.trim(),
        unionTerritory: args.unionTerritory,
        tinCode: args.tinCode?.trim(),
        ptApplicable: args.ptApplicable,
        lwfApplicable: args.lwfApplicable,
        isActive: args.isActive,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id: existing._id, updated: true };
    } else {
      const id = await ctx.db.insert("systemStates", {
        workspaceId: ws._id,
        country: args.country.trim(),
        stateCode: code,
        stateName: args.stateName.trim(),
        unionTerritory: args.unionTerritory,
        tinCode: args.tinCode?.trim(),
        ptApplicable: args.ptApplicable,
        lwfApplicable: args.lwfApplicable,
        isActive: args.isActive,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id, created: true };
    }
  },
});

// 5. EMPLOYEE NUMBER SERIES
export const getEmployeeNoSeries = query({
  args: {},
  handler: async (ctx) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    const list = await ctx.db
      .query("systemEmployeeNoSeries")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    if (list.length === 0) {
      return DEFAULT_EMP_NO_SERIES;
    }
    return list;
  },
});

export const saveEmployeeNoSeries = mutation({
  args: {
    seriesName: v.string(),
    prefix: v.string(),
    startingNumber: v.number(),
    digitCount: v.number(),
    isDefault: v.boolean(),
    isManualEntryAllowed: v.boolean(),
    isDisabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const userId = await getAuthUserId(ctx);

    const name = args.seriesName.trim();
    if (!name) throw new Error("Series name is required");
    if (args.startingNumber < 0) throw new Error("Starting number must be positive");
    if (args.digitCount < 1 || args.digitCount > 10) throw new Error("Digit count must be between 1 and 10");

    const format = args.prefix + String(args.startingNumber).padStart(args.digitCount, "0");

    if (args.isDefault) {
      const all = await ctx.db
        .query("systemEmployeeNoSeries")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
        .collect();
      for (const s of all) {
        if (s.isDefault) await ctx.db.patch(s._id, { isDefault: false });
      }
    }

    const existing = await ctx.db
      .query("systemEmployeeNoSeries")
      .withIndex("by_workspace_seriesName", (q) => q.eq("workspaceId", ws._id).eq("seriesName", name))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        prefix: args.prefix,
        startingNumber: args.startingNumber,
        digitCount: args.digitCount,
        format,
        isDefault: args.isDefault,
        isManualEntryAllowed: args.isManualEntryAllowed,
        isDisabled: args.isDisabled,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id: existing._id, updated: true };
    } else {
      const id = await ctx.db.insert("systemEmployeeNoSeries", {
        workspaceId: ws._id,
        seriesName: name,
        prefix: args.prefix,
        currentSerial: args.startingNumber,
        startingNumber: args.startingNumber,
        digitCount: args.digitCount,
        format,
        isDefault: args.isDefault,
        isManualEntryAllowed: args.isManualEntryAllowed,
        isDisabled: args.isDisabled,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id, created: true };
    }
  },
});

export const deleteEmployeeNoSeries = mutation({
  args: { id: v.id("systemEmployeeNoSeries") },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const item = await ctx.db.get(args.id);
    if (!item || item.workspaceId !== ws._id) throw new Error("Record not found");
    if (item.isDefault) throw new Error("Cannot delete default employee number series");
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// 6. TRANSITION GROUPS (CATEGORY GROUPS)
export const getTransitionGroups = query({
  args: {
    screenKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    let groups = await ctx.db
      .query("systemTransitionGroups")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    if (groups.length === 0) {
      return DEFAULT_TRANSITION_GROUPS.filter((g) => !args.screenKey || g.screenKey === args.screenKey);
    }

    if (args.screenKey) {
      groups = groups.filter((g) => g.screenKey === args.screenKey);
    }
    return groups;
  },
});

export const saveTransitionGroup = mutation({
  args: {
    screenKey: v.string(),
    screenName: v.string(),
    availableCategories: v.array(v.string()),
    selectedCategories: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("Workspace not found");
    const userId = await getAuthUserId(ctx);

    const existing = await ctx.db
      .query("systemTransitionGroups")
      .withIndex("by_workspace_screenKey", (q) =>
        q.eq("workspaceId", ws._id).eq("screenKey", args.screenKey)
      )
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        screenName: args.screenName,
        availableCategories: args.availableCategories,
        selectedCategories: args.selectedCategories,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id: existing._id, updated: true };
    } else {
      const id = await ctx.db.insert("systemTransitionGroups", {
        workspaceId: ws._id,
        screenKey: args.screenKey,
        screenName: args.screenName,
        availableCategories: args.availableCategories,
        selectedCategories: args.selectedCategories,
        updatedAt: now,
        updatedBy: userId ?? undefined,
      });
      return { success: true, id, created: true };
    }
  },
});
`;

code += additions;
fs.writeFileSync(file, code, 'utf8');
console.log('Appended Phase 18.2 queries & mutations to systemSettings.ts');
