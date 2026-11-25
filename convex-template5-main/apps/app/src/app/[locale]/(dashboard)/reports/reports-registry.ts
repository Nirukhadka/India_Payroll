export interface ReportItemDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  supportedFormats: ("PDF" | "XLSX" | "CSV")[];
  status: "VERIFIED" | "PARTIAL" | "UI ONLY" | "BLOCKED";
  parameters: string[];
  isDraftStatutory?: boolean;
}

export interface ReportCategoryDefinition {
  category: string;
  reports: ReportItemDefinition[];
}

export const REPORTS_REGISTRY: ReportCategoryDefinition[] = [
  {
    category: "Payroll Payout",
    reports: [
      {
        id: "payroll_jv_reimbursements",
        name: "Payroll JV - Reimbursements",
        category: "Payroll Payout",
        description: "Payroll JV - Reimbursements - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "payment_register",
        name: "Payment Register",
        category: "Payroll Payout",
        description: "Payment Register - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "payroll_transfer_reconciliation_payment_type_wise",
        name: "Payroll Transfer Reconciliation (Payment Type-Wise)",
        category: "Payroll Payout",
        description: "Payroll Transfer Reconciliation (Payment Type-Wise) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "bank_transfer_advise",
        name: "Bank Transfer Advise",
        category: "Payroll Payout",
        description: "Bank Transfer Advise - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "bank_transfer_statement",
        name: "Bank Transfer Statement",
        category: "Payroll Payout",
        description: "Bank Transfer Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "payroll_jv",
        name: "Payroll JV",
        category: "Payroll Payout",
        description: "Payroll JV - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "other_payroll_transfer_statements",
        name: "Other Payroll Transfer Statements",
        category: "Payroll Payout",
        description: "Other Payroll Transfer Statements - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "payroll_transfer_summaries",
        name: "Payroll Transfer Summaries",
        category: "Payroll Payout",
        description: "Payroll Transfer Summaries - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "salary_bill_register",
        name: "Salary Bill Register",
        category: "Payroll Payout",
        description: "Salary Bill Register - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "salary_register",
        name: "Salary Register",
        category: "Payroll Payout",
        description: "Salary Register - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "salary_register_cash",
        name: "Salary Register (Cash)",
        category: "Payroll Payout",
        description: "Salary Register (Cash) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "salary_statement_monthly",
        name: "Salary Statement - Monthly",
        category: "Payroll Payout",
        description: "Salary Statement - Monthly - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Payroll Control",
    reports: [
      {
        id: "duplicate_report",
        name: "Duplicate Report",
        category: "Payroll Control",
        description: "Duplicate Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "hold_release_salary_report",
        name: "Hold-Release Salary Report",
        category: "Payroll Control",
        description: "Hold-Release Salary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "employee_reconciliation_report",
        name: "Employee Reconciliation Report",
        category: "Payroll Control",
        description: "Employee Reconciliation Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "negative_cost_report",
        name: "Negative Cost Report",
        category: "Payroll Control",
        description: "Negative Cost Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "payroll_reconciliation_consolidated",
        name: "Payroll Reconciliation-Consolidated",
        category: "Payroll Control",
        description: "Payroll Reconciliation-Consolidated - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "payroll_reconciliation",
        name: "Payroll Reconciliation",
        category: "Payroll Control",
        description: "Payroll Reconciliation - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
    reports: [
      {
        id: "esi_form_1_declaration_form",
        name: "ESI Form 1 Declaration Form",
        category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
        description: "ESI Form 1 Declaration Form - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_11_accident_book",
        name: "Form 11 Accident Book",
        category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
        description: "Form 11 Accident Book - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "esi_arrear_report",
        name: "ESI Arrear Report",
        category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
        description: "ESI Arrear Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "esi_challan_report",
        name: "ESI - Challan Report",
        category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
        description: "ESI - Challan Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "esi_monthly_report_upload_format",
        name: "ESI Monthly Report Upload Format",
        category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
        description: "ESI Monthly Report Upload Format - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "esi_monthly_statement",
        name: "ESI - Monthly Statement",
        category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
        description: "ESI - Monthly Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "esi_monthly_summary_report",
        name: "ESI - Monthly Summary Report",
        category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
        description: "ESI - Monthly Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "esi_form_6_half_yearly_statement",
        name: "ESI - Form 6 - Half Yearly Statement",
        category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
        description: "ESI - Form 6 - Half Yearly Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "esi_form_7_half_yearly_statement",
        name: "ESI - Form 7 - Half Yearly Statement",
        category: "ESI - EMPLOYEES' STATE INSURANCE FUND",
        description: "ESI - Form 7 - Half Yearly Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "PF - Provident Fund",
    reports: [
      {
        id: "epf_form_11_declaration_form",
        name: "EPF Form 11 - Declaration Form",
        category: "PF - Provident Fund",
        description: "EPF Form 11 - Declaration Form - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "epf_form_2",
        name: "EPF Form 2",
        category: "PF - Provident Fund",
        description: "EPF Form 2 - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_aadhaar_details_of_members_annexure_i",
        name: "PF - AADHAAR DETAILS OF MEMBERS (ANNEXURE - I)",
        category: "PF - Provident Fund",
        description: "PF - AADHAAR DETAILS OF MEMBERS (ANNEXURE - I) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_combined_challan_report",
        name: "PF - Combined Challan Report",
        category: "PF - Provident Fund",
        description: "PF - Combined Challan Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_combined_challan_report_v1",
        name: "PF - Combined Challan Report V1",
        category: "PF - Provident Fund",
        description: "PF - Combined Challan Report V1 - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_10c_employee_pension_scheme",
        name: "PF - Form 10C - Employee Pension Scheme",
        category: "PF - Provident Fund",
        description: "PF - Form 10C - Employee Pension Scheme - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_10_consolidated_statement_of_members_leaving_pf",
        name: "PF - Form 10 - Consolidated statement of members leaving PF",
        category: "PF - Provident Fund",
        description: "PF - Form 10 - Consolidated statement of members leaving PF - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_12a_pf_monthly_statement_of_consolidation_paid",
        name: "PF - Form 12A - PF Monthly Statement of Consolidation paid",
        category: "PF - Provident Fund",
        description: "PF - Form 12A - PF Monthly Statement of Consolidation paid - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_12a_pf_monthly_statement_of_consolidation_paid_v1",
        name: "PF - Form 12A - PF Monthly Statement of Consolidation paid V1",
        category: "PF - Provident Fund",
        description: "PF - Form 12A - PF Monthly Statement of Consolidation paid V1 - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_19_employee_pf_claim_form",
        name: "PF - Form 19 - Employee PF Claim Form",
        category: "PF - Provident Fund",
        description: "PF - Form 19 - Employee PF Claim Form - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_19_pf_composite_claim_form_aadhar",
        name: "Form 19 - PF Composite Claim form ( Aadhar )",
        category: "PF - Provident Fund",
        description: "Form 19 - PF Composite Claim form ( Aadhar ) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_3a",
        name: "PF - Form 3A",
        category: "PF - Provident Fund",
        description: "PF - Form 3A - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_5_consolidated_statement_of_members_joining_pf",
        name: "PF - Form 5 - Consolidated statement of members joining PF",
        category: "PF - Provident Fund",
        description: "PF - Form 5 - Consolidated statement of members joining PF - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_6a_consolidated_statement_for_contribution_card",
        name: "PF - Form 6A - Consolidated Statement For Contribution Card",
        category: "PF - Provident Fund",
        description: "PF - Form 6A - Consolidated Statement For Contribution Card - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_r1_monthly_return_for_employees",
        name: "PF - Form R1 - Monthly Return for Employees",
        category: "PF - Provident Fund",
        description: "PF - Form R1 - Monthly Return for Employees - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_form_r1_monthly_return_for_employees_v1",
        name: "PF - Form R1 - Monthly Return for Employees V1",
        category: "PF - Provident Fund",
        description: "PF - Form R1 - Monthly Return for Employees V1 - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "nps_contribution_report",
        name: "NPS Contribution Report",
        category: "PF - Provident Fund",
        description: "NPS Contribution Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_wage_ceiling_increase_analysis_report",
        name: "PF Wage Ceiling Increase - Analysis Report",
        category: "PF - Provident Fund",
        description: "PF Wage Ceiling Increase - Analysis Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_and_pension_contribution",
        name: "PF And Pension Contribution",
        category: "PF - Provident Fund",
        description: "PF And Pension Contribution - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_arrear_report",
        name: "PF Arrear Report",
        category: "PF - Provident Fund",
        description: "PF Arrear Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_monthly_statement",
        name: "PF - Monthly Statement",
        category: "PF - Provident Fund",
        description: "PF - Monthly Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_monthly_statementv1",
        name: "PF - Monthly StatementV1",
        category: "PF - Provident Fund",
        description: "PF - Monthly StatementV1 - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_summary_report",
        name: "PF - Summary Report",
        category: "PF - Provident Fund",
        description: "PF - Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_summary_report_v1",
        name: "PF - Summary Report V1",
        category: "PF - Provident Fund",
        description: "PF - Summary Report V1 - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "pf_ecr_format",
        name: "PF - ECR Format",
        category: "PF - Provident Fund",
        description: "PF - ECR Format - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "statement_of_international_workers_iw_1_with_cover_letter",
        name: "Statement of International Workers (IW) - 1 with cover letter",
        category: "PF - Provident Fund",
        description: "Statement of International Workers (IW) - 1 with cover letter - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "PT - Profession Tax",
    reports: [
      {
        id: "profession_tax_monthly_statement_any_state",
        name: "Profession Tax Monthly Statement (Any State)",
        category: "PT - Profession Tax",
        description: "Profession Tax Monthly Statement (Any State) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_5_profession_tax_annual_return_karnataka",
        name: "FORM 5 - Profession Tax Annual Return - Karnataka",
        category: "PT - Profession Tax",
        description: "FORM 5 - Profession Tax Annual Return - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_5a_profession_tax_monthly_statement_karnataka",
        name: "FORM 5A - Profession Tax Monthly Statement - Karnataka",
        category: "PT - Profession Tax",
        description: "FORM 5A - Profession Tax Monthly Statement - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Workforce Attrition Reports",
    reports: [
      {
        id: "attrition_report",
        name: "Attrition Report",
        category: "Workforce Attrition Reports",
        description: "Attrition Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Income Tax",
    reports: [
      {
        id: "monthly_tds_challan",
        name: "Monthly TDS Challan",
        category: "Income Tax",
        description: "Monthly TDS Challan - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "income_tax_statement_consolidated",
        name: "Income Tax Statement - Consolidated",
        category: "Income Tax",
        description: "Income Tax Statement - Consolidated - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "income_tax_worksheet",
        name: "Income Tax Worksheet",
        category: "Income Tax",
        description: "Income Tax Worksheet - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "annual_tax_report",
        name: "Annual Tax Report",
        category: "Income Tax",
        description: "Annual Tax Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "form_12bb_it_savings",
        name: "Form 12BB - IT Savings",
        category: "Income Tax",
        description: "Form 12BB - IT Savings - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "income_tax_form_16a",
        name: "Income Tax - Form 16A",
        category: "Income Tax",
        description: "Income Tax - Form 16A - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "income_tax_monthly_statement",
        name: "Income Tax - Monthly Statement",
        category: "Income Tax",
        description: "Income Tax - Monthly Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "income_tax_statement",
        name: "Income Tax Statement",
        category: "Income Tax",
        description: "Income Tax Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "it_landlord_details",
        name: "IT Landlord Details",
        category: "Income Tax",
        description: "IT Landlord Details - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "it_savings_chapter6_report",
        name: "IT Savings Chapter6 Report",
        category: "Income Tax",
        description: "IT Savings Chapter6 Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "it_savings_other_reports",
        name: "IT Savings Other Reports",
        category: "Income Tax",
        description: "IT Savings Other Reports - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "it_savings_previous_employement_report",
        name: "IT Savings Previous Employement Report",
        category: "Income Tax",
        description: "IT Savings Previous Employement Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "it_savings_reports",
        name: "IT Savings Reports",
        category: "Income Tax",
        description: "IT Savings Reports - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "monthly_tds_challan_report_tds_bank_payment_file",
        name: "Monthly TDS challan report - TDS Bank Payment File",
        category: "Income Tax",
        description: "Monthly TDS challan report - TDS Bank Payment File - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "proof_of_investment_declaration",
        name: "Proof Of Investment Declaration",
        category: "Income Tax",
        description: "Proof Of Investment Declaration - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "income_tax_liability_report",
        name: "Income Tax Liability Report",
        category: "Income Tax",
        description: "Income Tax Liability Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["financialYear","assessmentYear","employeeSelection"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Reimbursement",
    reports: [
      {
        id: "reimbursement_balance_report",
        name: "Reimbursement Balance Report",
        category: "Reimbursement",
        description: "Reimbursement Balance Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["claimType","dateRange","status","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "reimbursement_claim_report",
        name: "Reimbursement Claim Report",
        category: "Reimbursement",
        description: "Reimbursement Claim Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["claimType","dateRange","status","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "detailed_reimbursement_summary_report",
        name: "Detailed Reimbursement Summary Report",
        category: "Reimbursement",
        description: "Detailed Reimbursement Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["claimType","dateRange","status","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "reimbursement_overall_entitlement_summary_report",
        name: "Reimbursement Overall Entitlement Summary Report",
        category: "Reimbursement",
        description: "Reimbursement Overall Entitlement Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["claimType","dateRange","status","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "reimbursement_summary_report",
        name: "Reimbursement Summary Report",
        category: "Reimbursement",
        description: "Reimbursement Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["claimType","dateRange","status","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "reimbursement_transaction_report",
        name: "Reimbursement Transaction Report",
        category: "Reimbursement",
        description: "Reimbursement Transaction Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["claimType","dateRange","status","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "reimbursement_ytd_report",
        name: "Reimbursement YTD Report",
        category: "Reimbursement",
        description: "Reimbursement YTD Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["claimType","dateRange","status","employeeSelection"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Loan",
    reports: [
      {
        id: "loan_balance_report",
        name: "Loan Balance Report",
        category: "Loan",
        description: "Loan Balance Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["loanType","status","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "loan_summary_report",
        name: "Loan Summary Report",
        category: "Loan",
        description: "Loan Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["loanType","status","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "loan_transaction_report",
        name: "Loan Transaction Report",
        category: "Loan",
        description: "Loan Transaction Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["loanType","status","employeeSelection"],
        isDraftStatutory: false
      },
      {
        id: "loan_details_report",
        name: "Loan Details Report",
        category: "Loan",
        description: "Loan Details Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["loanType","status","employeeSelection"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Claims",
    reports: [
      {
        id: "claim_bank_transfer_statement",
        name: "Claim bank transfer statement",
        category: "Claims",
        description: "Claim bank transfer statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["claimType","dateRange","status","employeeSelection"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "MIS Reports",
    reports: [
      {
        id: "lop_reversal_report",
        name: "LOP Reversal Report",
        category: "MIS Reports",
        description: "LOP Reversal Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "arrear_report",
        name: "Arrear Report",
        category: "MIS Reports",
        description: "Arrear Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "compensation_item_statement_monthly",
        name: "Compensation Item Statement - Monthly",
        category: "MIS Reports",
        description: "Compensation Item Statement - Monthly - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "compensation_item_statement_consolidated",
        name: "Compensation Item Statement - Consolidated",
        category: "MIS Reports",
        description: "Compensation Item Statement - Consolidated - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "reimbursement_duplicate_bills_report",
        name: "Reimbursement Duplicate bills Report",
        category: "MIS Reports",
        description: "Reimbursement Duplicate bills Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "employee_bio_data",
        name: "Employee Bio data",
        category: "MIS Reports",
        description: "Employee Bio data - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "employee_filter_configuration_report",
        name: "Employee Filter Configuration Report",
        category: "MIS Reports",
        description: "Employee Filter Configuration Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "employee_master_information_report",
        name: "Employee Master information Report",
        category: "MIS Reports",
        description: "Employee Master information Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "excel_import_log_report",
        name: "Excel Import Log Report",
        category: "MIS Reports",
        description: "Excel Import Log Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "exit_interview_checklist",
        name: "Exit Interview Checklist",
        category: "MIS Reports",
        description: "Exit Interview Checklist - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "form_12b",
        name: "FORM 12B",
        category: "MIS Reports",
        description: "FORM 12B - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "form_25_gratuity_nomination_form",
        name: "Form 25 - Gratuity Nomination Form",
        category: "MIS Reports",
        description: "Form 25 - Gratuity Nomination Form - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "salary_input_history",
        name: "Salary Input History",
        category: "MIS Reports",
        description: "Salary Input History - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "implementation_verification_report",
        name: "Implementation Verification Report",
        category: "MIS Reports",
        description: "Implementation Verification Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "monthly_change_tracking_report_for_employee_info_updates",
        name: "Monthly Change Tracking Report for Employee Info Updates",
        category: "MIS Reports",
        description: "Monthly Change Tracking Report for Employee Info Updates - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "overrides_report_employeewise",
        name: "Overrides Report (EmployeeWise)",
        category: "MIS Reports",
        description: "Overrides Report (EmployeeWise) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "overrides_report_itemwise",
        name: "Overrides Report (ItemWise)",
        category: "MIS Reports",
        description: "Overrides Report (ItemWise) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "payroll_anomalies_report",
        name: "Payroll Anomalies Report",
        category: "MIS Reports",
        description: "Payroll Anomalies Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "resettlement_report",
        name: "ReSettlement Report",
        category: "MIS Reports",
        description: "ReSettlement Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "reversal_transaction_report",
        name: "Reversal transaction Report",
        category: "MIS Reports",
        description: "Reversal transaction Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "salary_revision_history",
        name: "Salary Revision History",
        category: "MIS Reports",
        description: "Salary Revision History - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "salary_structure_report",
        name: "Salary Structure Report",
        category: "MIS Reports",
        description: "Salary Structure Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "settlement_report",
        name: "Settlement Report",
        category: "MIS Reports",
        description: "Settlement Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "user_activity_log_report",
        name: "User Activity Log Report",
        category: "MIS Reports",
        description: "User Activity Log Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "ytd_statement",
        name: "YTD Statement",
        category: "MIS Reports",
        description: "YTD Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "ytd_statement_consolidated_report",
        name: "YTD Statement Consolidated Report",
        category: "MIS Reports",
        description: "YTD Statement Consolidated Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "ytd_summary_report",
        name: "YTD Summary Report",
        category: "MIS Reports",
        description: "YTD Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "ctc_breakup_report",
        name: "CTC Breakup Report",
        category: "MIS Reports",
        description: "CTC Breakup Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "it_declaration_revoked_employee_list",
        name: "IT declaration revoked employee list",
        category: "MIS Reports",
        description: "IT declaration revoked employee list - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "bonus_statement",
        name: "Bonus Statement",
        category: "MIS Reports",
        description: "Bonus Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "lic_statement",
        name: "LIC Statement",
        category: "MIS Reports",
        description: "LIC Statement - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "nomination_details_report",
        name: "Nomination Details Report",
        category: "MIS Reports",
        description: "Nomination Details Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "salary_payout_reconciliation_report",
        name: "Salary Payout Reconciliation Report",
        category: "MIS Reports",
        description: "Salary Payout Reconciliation Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "salary_summary_report",
        name: "Salary Summary Report",
        category: "MIS Reports",
        description: "Salary Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Leave",
    reports: [
      {
        id: "leave_availed_report",
        name: "Leave Availed Report",
        category: "Leave",
        description: "Leave Availed Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["dateRange","leaveType","employeeSelection","department"],
        isDraftStatutory: false
      },
      {
        id: "leave_backdated_report",
        name: "Leave Backdated Report",
        category: "Leave",
        description: "Leave Backdated Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["dateRange","leaveType","employeeSelection","department"],
        isDraftStatutory: false
      },
      {
        id: "leave_balance_as_on_a_day",
        name: "Leave Balance As On A Day",
        category: "Leave",
        description: "Leave Balance As On A Day - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["dateRange","leaveType","employeeSelection","department"],
        isDraftStatutory: false
      },
      {
        id: "day_wise_leave_transaction_report",
        name: "Day Wise Leave Transaction Report",
        category: "Leave",
        description: "Day Wise Leave Transaction Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["dateRange","leaveType","employeeSelection","department"],
        isDraftStatutory: false
      },
      {
        id: "leave_encashment_report",
        name: "Leave Encashment Report",
        category: "Leave",
        description: "Leave Encashment Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["dateRange","leaveType","employeeSelection","department"],
        isDraftStatutory: false
      },
      {
        id: "negative_leave_balance",
        name: "Negative Leave Balance",
        category: "Leave",
        description: "Negative Leave Balance - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["dateRange","leaveType","employeeSelection","department"],
        isDraftStatutory: false
      },
      {
        id: "leave_summary_report",
        name: "Leave Summary Report",
        category: "Leave",
        description: "Leave Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["dateRange","leaveType","employeeSelection","department"],
        isDraftStatutory: false
      },
      {
        id: "leave_transaction_report",
        name: "Leave Transaction Report",
        category: "Leave",
        description: "Leave Transaction Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["dateRange","leaveType","employeeSelection","department"],
        isDraftStatutory: false
      },
      {
        id: "year_wise_summary_report",
        name: "Year Wise Summary Report",
        category: "Leave",
        description: "Year Wise Summary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["dateRange","leaveType","employeeSelection","department"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Help Desk",
    reports: [
      {
        id: "response_time_report_help_desk_ticket",
        name: "Response Time Report (Help Desk Ticket)",
        category: "Help Desk",
        description: "Response Time Report (Help Desk Ticket) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "help_desk_tickets_report",
        name: "Help Desk Tickets Report",
        category: "Help Desk",
        description: "Help Desk Tickets Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Labour Welfare Fund Act - Karnataka",
    reports: [
      {
        id: "form_b_register_of_fines_and_unpaid_accumulations_labour_welfare_fund_act_karnataka",
        name: "Form B - Register Of Fines And Unpaid Accumulations - Labour Welfare Fund Act - Karnataka",
        category: "Labour Welfare Fund Act - Karnataka",
        description: "Form B - Register Of Fines And Unpaid Accumulations - Labour Welfare Fund Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_d_statement_of_employer_s_and_employee_s_contribution_labour_welfare_fund_act_karnataka",
        name: "FORM D - Statement of Employer's and Employee's Contribution - Labour Welfare Fund Act - Karnataka",
        category: "Labour Welfare Fund Act - Karnataka",
        description: "FORM D - Statement of Employer's and Employee's Contribution - Labour Welfare Fund Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Minimum Wages Rules - Karnataka",
    reports: [
      {
        id: "form_ii_register_of_deductions_for_absence_from_duty_or_for_damage_or_loss_caused_to_the_employee_by_the_neglect_or_default_of_the_employed_persons_minimum_wages_rules_karnataka",
        name: "Form II - Register of deductions for absence from duty or for damage or loss caused to the employee by the neglect or default of the employed persons - Minimum Wages Rules - Karnataka",
        category: "Minimum Wages Rules - Karnataka",
        description: "Form II - Register of deductions for absence from duty or for damage or loss caused to the employee by the neglect or default of the employed persons - Minimum Wages Rules - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
      {
        id: "form_iv_overtime_time_register_minimum_wages_rules_karnataka",
        name: "Form IV - Overtime Time Register - Minimum Wages Rules - Karnataka",
        category: "Minimum Wages Rules - Karnataka",
        description: "Form IV - Overtime Time Register - Minimum Wages Rules - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
      {
        id: "form_i_register_of_fines_minimum_wages_rules_karnataka",
        name: "Form I - Register of Fines - Minimum Wages Rules - Karnataka",
        category: "Minimum Wages Rules - Karnataka",
        description: "Form I - Register of Fines - Minimum Wages Rules - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
      {
        id: "form_vii_muster_roll_minimum_wages_rules_karnataka",
        name: "Form VII - Muster Roll - Minimum Wages Rules - Karnataka",
        category: "Minimum Wages Rules - Karnataka",
        description: "Form VII - Muster Roll - Minimum Wages Rules - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
      {
        id: "form_vi_wage_slip_minimum_wages_rules_karnataka",
        name: "Form VI - Wage slip - Minimum Wages Rules - Karnataka",
        category: "Minimum Wages Rules - Karnataka",
        description: "Form VI - Wage slip - Minimum Wages Rules - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
      {
        id: "form_v_register_of_wages_minimum_wages_rules_karnataka",
        name: "Form V - Register of wages - Minimum Wages Rules - Karnataka",
        category: "Minimum Wages Rules - Karnataka",
        description: "Form V - Register of wages - Minimum Wages Rules - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
      {
        id: "form_iii_annual_return_minimum_wages_rules_karnataka",
        name: "Form III - Annual Return - Minimum Wages Rules - Karnataka",
        category: "Minimum Wages Rules - Karnataka",
        description: "Form III - Annual Return - Minimum Wages Rules - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Factories Act - Karnataka",
    reports: [
      {
        id: "form_9_overtime_register_factories_act_karnataka",
        name: "Form 9 - Overtime Register - Factories Act - Karnataka",
        category: "Factories Act - Karnataka",
        description: "Form 9 - Overtime Register - Factories Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_20_combined_annual_return_factories_act_karnataka",
        name: "Form 20 - Combined annual return - Factories Act - Karnataka",
        category: "Factories Act - Karnataka",
        description: "Form 20 - Combined annual return - Factories Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_11_register_of_adult_workers_factories_act_karnataka",
        name: "Form 11 - Register of Adult workers - Factories Act - Karnataka",
        category: "Factories Act - Karnataka",
        description: "Form 11 - Register of Adult workers - Factories Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_14_register_of_leave_with_wages_factories_act_karnataka",
        name: "Form 14 - Register of leave with wages - Factories Act - Karnataka",
        category: "Factories Act - Karnataka",
        description: "Form 14 - Register of leave with wages - Factories Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_15_leave_book_factories_act_karnataka",
        name: "Form 15 - Leave book - Factories Act - Karnataka",
        category: "Factories Act - Karnataka",
        description: "Form 15 - Leave book - Factories Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_21_half_yearly_return_factories_act_karnataka",
        name: "Form 21 - Half Yearly Return - Factories Act - Karnataka",
        category: "Factories Act - Karnataka",
        description: "Form 21 - Half Yearly Return - Factories Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_22_muster_roll_cum_wage_register_factories_act_karnataka",
        name: "Form 22 - Muster Roll cum Wage register - Factories Act - Karnataka",
        category: "Factories Act - Karnataka",
        description: "Form 22 - Muster Roll cum Wage register - Factories Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Maternity Benefit Act - Central",
    reports: [
      {
        id: "form_a_muster_roll_nil_register_maternity_benefit_act_central",
        name: "Form A - Muster Roll - ( NIL Register ) - Maternity Benefit Act - Central",
        category: "Maternity Benefit Act - Central",
        description: "Form A - Muster Roll - ( NIL Register ) - Maternity Benefit Act - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "CLRA Act & Rules - Central",
    reports: [
      {
        id: "form_xiii_register_of_workmen_employed_by_contractor_clra_act_rules_central",
        name: "Form XIII - Register of Workmen Employed by Contractor - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XIII - Register of Workmen Employed by Contractor - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xii_register_of_contractors_clra_act_rules_central",
        name: "Form XII - Register of contractors - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XII - Register of contractors - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xiv_employment_card_clra_act_rules_central",
        name: "Form XIV - Employment Card - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XIV - Employment Card - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xix_wages_slip_clra_rules_central",
        name: "Form XIX - Wages Slip - CLRA Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XIX - Wages Slip - CLRA Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xvii_register_of_wages_clra_act_rules_central",
        name: "Form XVII - Register of Wages - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XVII - Register of Wages - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xvi_muster_roll_clra_act_rules_central",
        name: "Form XVI - Muster Roll - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XVI - Muster Roll - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xv_service_certificate_clra_act_rules_central",
        name: "Form XV - Service Certificate - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XV - Service Certificate - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xx_register_of_deductions_for_damage_or_loss_clra_act_rules_central",
        name: "Form XX - Register of Deductions for Damage or Loss - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XX - Register of Deductions for Damage or Loss - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xxi_register_of_fines_clra_act_rules_central",
        name: "Form XXI - Register of Fines - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XXI - Register of Fines - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xxii_register_of_advances_clra_act_rules_central",
        name: "Form XXII - Register of Advances - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XXII - Register of Advances - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_xxiii_register_of_overtime_clra_act_rules_central",
        name: "Form XXIII - Register of Overtime - CLRA Act & Rules - Central",
        category: "CLRA Act & Rules - Central",
        description: "Form XXIII - Register of Overtime - CLRA Act & Rules - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Payment of Bonus Act - Central",
    reports: [
      {
        id: "form_c_bonus_paid_to_employees_payment_of_bonus_act_central",
        name: "Form C - Bonus Paid To Employees - Payment of Bonus Act - Central",
        category: "Payment of Bonus Act - Central",
        description: "Form C - Bonus Paid To Employees - Payment of Bonus Act - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_d_annual_return_bonus_paid_to_employees_payment_of_bonus_act_central",
        name: "Form D - Annual Return bonus paid to employees - Payment of Bonus Act - Central",
        category: "Payment of Bonus Act - Central",
        description: "Form D - Annual Return bonus paid to employees - Payment of Bonus Act - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Equal Remuneration Act - Central",
    reports: [
      {
        id: "form_d_register_to_be_maintained_by_the_employer_equal_remuneration_act_central",
        name: "Form D - Register To Be Maintained By The Employer - Equal Remuneration Act - Central",
        category: "Equal Remuneration Act - Central",
        description: "Form D - Register To Be Maintained By The Employer - Equal Remuneration Act - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Workmen's Compensation Act",
    reports: [
      {
        id: "form_35_form_of_notice_book_workmen_s_compensation_act_central",
        name: "Form 35 - Form of Notice Book - Workmen's Compensation Act - Central",
        category: "Workmen's Compensation Act",
        description: "Form 35 - Form of Notice Book - Workmen's Compensation Act - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Ease of Compliance - Central",
    reports: [
      {
        id: "form_a_employee_register_ease_of_compliance_central",
        name: "Form A - Employee Register - Ease of Compliance - Central",
        category: "Ease of Compliance - Central",
        description: "Form A - Employee Register - Ease of Compliance - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
      {
        id: "form_b_wage_register_ease_of_compliance_central",
        name: "Form B - Wage Register - Ease of Compliance - Central",
        category: "Ease of Compliance - Central",
        description: "Form B - Wage Register - Ease of Compliance - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
      {
        id: "form_c_register_of_loan_recoveries_ease_of_compliance_central",
        name: "Form C - Register of Loan/Recoveries - Ease of Compliance - Central",
        category: "Ease of Compliance - Central",
        description: "Form C - Register of Loan/Recoveries - Ease of Compliance - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
      {
        id: "form_d_attendance_register_ease_of_compliance_central",
        name: "Form D - Attendance Register - Ease of Compliance - Central",
        category: "Ease of Compliance - Central",
        description: "Form D - Attendance Register - Ease of Compliance - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Shops & Est Act - Karnataka",
    reports: [
      {
        id: "form_u_combined_annual_return_shops_est_act_karnataka",
        name: "Form U - Combined annual return - Shops & Est. Act - Karnataka",
        category: "Shops & Est Act - Karnataka",
        description: "Form U - Combined annual return - Shops & Est. Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_q_appointment_order_shops_est_act_karnataka",
        name: "Form Q - Appointment Order - Shops & Est. Act - Karnataka",
        category: "Shops & Est Act - Karnataka",
        description: "Form Q - Appointment Order - Shops & Est. Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_t_combined_muster_roll_cum_register_of_wages_shops_est_act_karnataka",
        name: "Form T - Combined Muster Roll cum Register of Wages - Shops & Est. Act - Karnataka",
        category: "Shops & Est Act - Karnataka",
        description: "Form T - Combined Muster Roll cum Register of Wages - Shops & Est. Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_r_request_for_exemption_for_employing_women_in_night_shift_shops_est_act_karnataka",
        name: "Form R - Request for exemption for employing women in night shift - Shops & Est. Act - Karnataka",
        category: "Shops & Est Act - Karnataka",
        description: "Form R - Request for exemption for employing women in night shift - Shops & Est. Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_f_register_of_leave_with_wages_shops_est_act_karnataka",
        name: "Form F - Register of Leave with wages - Shops & Est. Act - Karnataka",
        category: "Shops & Est Act - Karnataka",
        description: "Form F - Register of Leave with wages - Shops & Est. Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
      {
        id: "form_h_leave_with_wages_book_shops_est_act_karnataka",
        name: "Form H - Leave with wages book - Shops & Est. Act - Karnataka",
        category: "Shops & Est Act - Karnataka",
        description: "Form H - Leave with wages book - Shops & Est. Act - Karnataka - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Tamil Nadu Labour Welfare Fund Act, 1972",
    reports: [
      {
        id: "form_a_statement_of_contributions_to_labour_welfare_fund_tamil_nadu",
        name: "Form A Statement of Contributions to Labour Welfare Fund Tamil Nadu",
        category: "Tamil Nadu Labour Welfare Fund Act, 1972",
        description: "Form A Statement of Contributions to Labour Welfare Fund Tamil Nadu - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "Labour Reports",
    reports: [
      {
        id: "form_10_overtime_muster_roll_for_persons_on_exempted_work_month_ending_himachal_pradesh",
        name: "Form 10 - Overtime muster-roll for persons on exempted work month ending(Himachal Pradesh)",
        category: "Labour Reports",
        description: "Form 10 - Overtime muster-roll for persons on exempted work month ending(Himachal Pradesh) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_10_overtime_muster_roll_for_persons_on_exempted_work_month_ending_uttar_pradesh",
        name: "Form 10 - Overtime muster-roll for persons on exempted work month ending (Uttar Pradesh)",
        category: "Labour Reports",
        description: "Form 10 - Overtime muster-roll for persons on exempted work month ending (Uttar Pradesh) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_16_register_of_leave_with_wages_rajasthan",
        name: "Form 16 - Register of Leave with Wages - Rajasthan",
        category: "Labour Reports",
        description: "Form 16 - Register of Leave with Wages - Rajasthan - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_25_muster_roll_and_register_of_compensatory_holiday_tamilnadu",
        name: "Form 25 - Muster roll and register of compensatory Holiday(Tamilnadu)",
        category: "Labour Reports",
        description: "Form 25 - Muster roll and register of compensatory Holiday(Tamilnadu) - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_28_muster_roll_gujarat",
        name: "Form 28 - Muster Roll - Gujarat",
        category: "Labour Reports",
        description: "Form 28 - Muster Roll - Gujarat - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_v_wages_slip_haryana",
        name: "Form V - Wages Slip - Haryana",
        category: "Labour Reports",
        description: "Form V - Wages Slip - Haryana - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_no_xxix_register_of_advances_deductions_for_damages_or_loss_and_fines",
        name: "Form No XXIX Register of Advances Deductions for Damages or Loss and Fines",
        category: "Labour Reports",
        description: "Form No XXIX Register of Advances Deductions for Damages or Loss and Fines - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_i_register_of_wages_overtime_fine_and_deduction_for_damage_and_loss",
        name: "Form I Register of Wages Overtime Fine and Deduction for damage and Loss",
        category: "Labour Reports",
        description: "Form I Register of Wages Overtime Fine and Deduction for damage and Loss - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_xxviii_wage_slip",
        name: "Form XXVIII - Wage slip",
        category: "Labour Reports",
        description: "Form XXVIII - Wage slip - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_x_identity_card",
        name: "Form X Identity Card",
        category: "Labour Reports",
        description: "Form X Identity Card - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_vi_contract_labour_regulation_abolition_central_rules",
        name: "Form VI Contract Labour (Regulation & Abolition) Central Rules",
        category: "Labour Reports",
        description: "Form VI Contract Labour (Regulation & Abolition) Central Rules - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_xxvi_register_of_employment_of_contract_labour",
        name: "Form XXVI Register Of Employment Of Contract Labour",
        category: "Labour Reports",
        description: "Form XXVI Register Of Employment Of Contract Labour - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_ii_muster_roll_cum_wage_register",
        name: "Form II - Muster Roll Cum Wage Register",
        category: "Labour Reports",
        description: "Form II - Muster Roll Cum Wage Register - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
      {
        id: "form_vi_wage_slip_karnataka_minimum_wages_rules",
        name: "Form VI - Wage Slip - Karnataka Minimum Wages Rules",
        category: "Labour Reports",
        description: "Form VI - Wage Slip - Karnataka Minimum Wages Rules - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: false
      },
    ]
  },
  {
    category: "Payment of Gratuity Act - Central",
    reports: [
      {
        id: "form_f_nomination_payment_of_gratuity_act_central",
        name: "Form F - Nomination - Payment of Gratuity Act - Central",
        category: "Payment of Gratuity Act - Central",
        description: "Form F - Nomination - Payment of Gratuity Act - Central - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX","CSV"],
        status: "VERIFIED",
        parameters: ["statutoryState","payrollMonth","establishmentCode"],
        isDraftStatutory: true
      },
    ]
  },
  {
    category: "HR Reports",
    reports: [
      {
        id: "anniversary_report",
        name: "Anniversary Report",
        category: "HR Reports",
        description: "Anniversary Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "employee_family_details",
        name: "Employee Family Details",
        category: "HR Reports",
        description: "Employee Family Details - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "transitionwise_head_count_report",
        name: "Transitionwise Head Count Report",
        category: "HR Reports",
        description: "Transitionwise Head Count Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
      {
        id: "user_access_rights_report",
        name: "User Access Rights Report",
        category: "HR Reports",
        description: "User Access Rights Report - comprehensive reporting, compliance audit, and operational tracking.",
        supportedFormats: ["PDF","XLSX"],
        status: "VERIFIED",
        parameters: ["payrollMonth","employeeSelection","department","location"],
        isDraftStatutory: false
      },
    ]
  },
];
