const fs = require('fs');

const inventory = JSON.parse(fs.readFileSync('docs/REPORTS-GALLERY-EXACT-REFERENCE-INVENTORY.json', 'utf8'));

// Build schema dictionary
const reportSchemas = {};

inventory.reports.forEach(r => {
  const params = r.parameters || [];
  const fields = [];

  // Determine fields based on category and parameters
  if (params.includes("payrollMonth") || r.category.includes("Payroll") || r.category.includes("MIS") || r.category.includes("HR")) {
    fields.push({
      name: "payrollMonth",
      label: "Payroll Period / Month",
      type: "select",
      required: true,
      defaultValue: "2026-11",
      options: [
        { label: "November 2026", value: "2026-11" },
        { label: "October 2026", value: "2026-10" },
        { label: "September 2026", value: "2026-09" },
        { label: "August 2026", value: "2026-08" }
      ]
    });
  }

  if (params.includes("financialYear") || r.category.includes("Income Tax") || r.reportId.includes("annual")) {
    fields.push({
      name: "financialYear",
      label: "Financial Year",
      type: "select",
      required: true,
      defaultValue: "2026-2027",
      options: [
        { label: "FY 2026-2027 (Current)", value: "2026-2027" },
        { label: "FY 2025-2026", value: "2025-2026" },
        { label: "FY 2024-2025", value: "2024-2025" }
      ]
    });
  }

  if (params.includes("assessmentYear")) {
    fields.push({
      name: "assessmentYear",
      label: "Assessment Year",
      type: "select",
      required: true,
      defaultValue: "2027-2028",
      options: [
        { label: "AY 2027-2028", value: "2027-2028" },
        { label: "AY 2026-2027", value: "2026-2027" }
      ]
    });
  }

  if (params.includes("statutoryState") || r.category.includes("Act") || r.category.includes("PF") || r.category.includes("ESI") || r.category.includes("PT") || r.category.includes("Rules")) {
    fields.push({
      name: "statutoryState",
      label: "Statutory Jurisdiction / State",
      type: "select",
      required: true,
      defaultValue: r.category.includes("Karnataka") ? "Karnataka" : r.category.includes("Tamil Nadu") ? "Tamil Nadu" : "Central",
      options: [
        { label: "Central Jurisdiction", value: "Central" },
        { label: "Karnataka", value: "Karnataka" },
        { label: "Tamil Nadu", value: "Tamil Nadu" },
        { label: "Maharashtra", value: "Maharashtra" },
        { label: "All States", value: "All" }
      ]
    });
  }

  if (params.includes("establishmentCode")) {
    fields.push({
      name: "establishmentCode",
      label: "Establishment / Unit Code",
      type: "select",
      required: false,
      defaultValue: "ALL_UNITS",
      options: [
        { label: "All Units (Consolidated)", value: "ALL_UNITS" },
        { label: "BLR-HQ-001 (Bangalore Main)", value: "BLR-HQ-001" },
        { label: "MUM-BR-002 (Mumbai Tech Hub)", value: "MUM-BR-002" },
        { label: "CHN-BR-003 (Chennai Branch)", value: "CHN-BR-003" }
      ]
    });
  }

  if (params.includes("dateRange") || r.category === "Leave" || r.category === "Reimbursement" || r.category === "Claims") {
    fields.push({
      name: "fromDate",
      label: "From Date",
      type: "date",
      required: true,
      defaultValue: "2026-11-01"
    });
    fields.push({
      name: "toDate",
      label: "To Date",
      type: "date",
      required: true,
      defaultValue: "2026-11-30"
    });
  }

  if (params.includes("employeeSelection") || fields.length < 3) {
    fields.push({
      name: "employeeFilter",
      label: "Employee Scope",
      type: "select",
      required: false,
      defaultValue: "ACTIVE",
      options: [
        { label: "All Active Employees", value: "ACTIVE" },
        { label: "Active & Separated Employees", value: "ALL" },
        { label: "Specific Employee", value: "SPECIFIC" }
      ]
    });
  }

  if (params.includes("department")) {
    fields.push({
      name: "department",
      label: "Department",
      type: "select",
      required: false,
      defaultValue: "All",
      options: [
        { label: "All Departments", value: "All" },
        { label: "Engineering", value: "Engineering" },
        { label: "Customer Operations", value: "Customer Operations" },
        { label: "Human Resources", value: "Human Resources" },
        { label: "Finance & Accounts", value: "Finance & Accounts" }
      ]
    });
  }

  if (params.includes("claimType") || r.category === "Reimbursement" || r.category === "Claims") {
    fields.push({
      name: "claimType",
      label: "Expense Category",
      type: "select",
      required: false,
      defaultValue: "ALL",
      options: [
        { label: "All Categories", value: "ALL" },
        { label: "Travel & Conveyance", value: "TRAVEL" },
        { label: "Meals & Entertainment", value: "MEALS" },
        { label: "Mobile / Internet", value: "TELECOM" },
        { label: "Medical Reimbursement", value: "MEDICAL" },
        { label: "Fuel Expenses", value: "FUEL" }
      ]
    });
  }

  if (params.includes("loanType") || r.category === "Loan") {
    fields.push({
      name: "loanType",
      label: "Loan Type",
      type: "select",
      required: false,
      defaultValue: "ALL",
      options: [
        { label: "All Loan Types", value: "ALL" },
        { label: "Personal Loan", value: "PERSONAL" },
        { label: "Salary Advance", value: "SALARY_ADVANCE" },
        { label: "Emergency Medical Loan", value: "EMERGENCY_LOAN" },
        { label: "Home Computer Loan", value: "EQUIPMENT_LOAN" }
      ]
    });
  }

  if (params.includes("leaveType") || r.category === "Leave") {
    fields.push({
      name: "leaveType",
      label: "Leave Type",
      type: "select",
      required: false,
      defaultValue: "ALL",
      options: [
        { label: "All Leave Types", value: "ALL" },
        { label: "Earned Leave (EL / PL)", value: "EARNED" },
        { label: "Casual Leave (CL)", value: "CASUAL" },
        { label: "Sick Leave (SL)", value: "SICK" },
        { label: "Compensatory Off", value: "COMP_OFF" },
        { label: "Loss of Pay (LOP)", value: "LOP" }
      ]
    });
  }

  if (params.includes("status")) {
    fields.push({
      name: "statusFilter",
      label: "Processing Status",
      type: "select",
      required: false,
      defaultValue: "ALL",
      options: [
        { label: "All Statuses", value: "ALL" },
        { label: "Approved / Disbursed", value: "APPROVED" },
        { label: "Pending Review", value: "PENDING" },
        { label: "Settled in Payroll", value: "SETTLED" }
      ]
    });
  }

  reportSchemas[r.reportId] = {
    reportId: r.reportId,
    category: r.category,
    reportName: r.reportName,
    isDraftStatutory: r.isDraftStatutory,
    supportedFormats: r.supportedFormats,
    fields: fields
  };
});

fs.writeFileSync('docs/REPORTS-GALLERY-R2-PARAMETER-SCHEMAS.json', JSON.stringify(reportSchemas, null, 2), 'utf8');
console.log('Saved docs/REPORTS-GALLERY-R2-PARAMETER-SCHEMAS.json for', Object.keys(reportSchemas).length, 'reports.');
