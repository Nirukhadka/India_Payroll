const fs = require('fs');

let content = fs.readFileSync('packages/backend/convex/reports.ts', 'utf8');

const oldArgs = `export const generateReportData = query({
  args: {
    workspaceId: v.id("workspaces"),
    reportId: v.string(),
    periodMonth: v.optional(v.string()), // e.g. "2026-11"
    department: v.optional(v.string()),
    employeeId: v.optional(v.id("employees")),
  },`;

const newArgs = `export const generateReportData = query({
  args: {
    workspaceId: v.id("workspaces"),
    reportId: v.string(),
    periodMonth: v.optional(v.string()), // e.g. "2026-11"
    department: v.optional(v.string()),
    employeeId: v.optional(v.id("employees")),
    financialYear: v.optional(v.string()),
    statutoryState: v.optional(v.string()),
    fromDate: v.optional(v.string()),
    toDate: v.optional(v.string()),
    claimType: v.optional(v.string()),
    loanType: v.optional(v.string()),
    leaveType: v.optional(v.string()),
    statusFilter: v.optional(v.string()),
  },`;

if (content.includes(oldArgs)) {
  content = content.replace(oldArgs, newArgs);
  fs.writeFileSync('packages/backend/convex/reports.ts', content, 'utf8');
  console.log('Successfully expanded generateReportData arguments in reports.ts');
} else {
  console.log('generateReportData arguments already updated or pattern not matched');
}
