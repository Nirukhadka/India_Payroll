// Automatically generated report-specific parameter schemas for all 192 reports
export interface ParameterFieldDefinition {
  name: string;
  label: string;
  type: "select" | "date" | "text" | "number";
  required: boolean;
  defaultValue: string;
  options?: { label: string; value: string }[];
}

export interface ReportParameterSchema {
  reportId: string;
  category: string;
  reportName: string;
  isDraftStatutory: boolean;
  supportedFormats: string[];
  fields: ParameterFieldDefinition[];
}

export const REPORT_PARAMETER_SCHEMAS: Record<string, ReportParameterSchema> = {
  "payroll_jv_reimbursements": {
    "reportId": "payroll_jv_reimbursements",
    "category": "Payroll Payout",
    "reportName": "Payroll JV - Reimbursements",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "payment_register": {
    "reportId": "payment_register",
    "category": "Payroll Payout",
    "reportName": "Payment Register",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "payroll_transfer_reconciliation_payment_type_wise": {
    "reportId": "payroll_transfer_reconciliation_payment_type_wise",
    "category": "Payroll Payout",
    "reportName": "Payroll Transfer Reconciliation (Payment Type-Wise)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "bank_transfer_advise": {
    "reportId": "bank_transfer_advise",
    "category": "Payroll Payout",
    "reportName": "Bank Transfer Advise",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "bank_transfer_statement": {
    "reportId": "bank_transfer_statement",
    "category": "Payroll Payout",
    "reportName": "Bank Transfer Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "payroll_jv": {
    "reportId": "payroll_jv",
    "category": "Payroll Payout",
    "reportName": "Payroll JV",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "other_payroll_transfer_statements": {
    "reportId": "other_payroll_transfer_statements",
    "category": "Payroll Payout",
    "reportName": "Other Payroll Transfer Statements",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "payroll_transfer_summaries": {
    "reportId": "payroll_transfer_summaries",
    "category": "Payroll Payout",
    "reportName": "Payroll Transfer Summaries",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "salary_bill_register": {
    "reportId": "salary_bill_register",
    "category": "Payroll Payout",
    "reportName": "Salary Bill Register",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "salary_register": {
    "reportId": "salary_register",
    "category": "Payroll Payout",
    "reportName": "Salary Register",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "salary_register_cash": {
    "reportId": "salary_register_cash",
    "category": "Payroll Payout",
    "reportName": "Salary Register (Cash)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "salary_statement_monthly": {
    "reportId": "salary_statement_monthly",
    "category": "Payroll Payout",
    "reportName": "Salary Statement - Monthly",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "duplicate_report": {
    "reportId": "duplicate_report",
    "category": "Payroll Control",
    "reportName": "Duplicate Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "hold_release_salary_report": {
    "reportId": "hold_release_salary_report",
    "category": "Payroll Control",
    "reportName": "Hold-Release Salary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "employee_reconciliation_report": {
    "reportId": "employee_reconciliation_report",
    "category": "Payroll Control",
    "reportName": "Employee Reconciliation Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "negative_cost_report": {
    "reportId": "negative_cost_report",
    "category": "Payroll Control",
    "reportName": "Negative Cost Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "payroll_reconciliation_consolidated": {
    "reportId": "payroll_reconciliation_consolidated",
    "category": "Payroll Control",
    "reportName": "Payroll Reconciliation-Consolidated",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "payroll_reconciliation": {
    "reportId": "payroll_reconciliation",
    "category": "Payroll Control",
    "reportName": "Payroll Reconciliation",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "esi_form_1_declaration_form": {
    "reportId": "esi_form_1_declaration_form",
    "category": "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "reportName": "ESI Form 1 Declaration Form",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_11_accident_book": {
    "reportId": "form_11_accident_book",
    "category": "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "reportName": "Form 11 Accident Book",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "esi_arrear_report": {
    "reportId": "esi_arrear_report",
    "category": "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "reportName": "ESI Arrear Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "esi_challan_report": {
    "reportId": "esi_challan_report",
    "category": "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "reportName": "ESI - Challan Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "esi_monthly_report_upload_format": {
    "reportId": "esi_monthly_report_upload_format",
    "category": "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "reportName": "ESI Monthly Report Upload Format",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "esi_monthly_statement": {
    "reportId": "esi_monthly_statement",
    "category": "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "reportName": "ESI - Monthly Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "esi_monthly_summary_report": {
    "reportId": "esi_monthly_summary_report",
    "category": "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "reportName": "ESI - Monthly Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "esi_form_6_half_yearly_statement": {
    "reportId": "esi_form_6_half_yearly_statement",
    "category": "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "reportName": "ESI - Form 6 - Half Yearly Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "esi_form_7_half_yearly_statement": {
    "reportId": "esi_form_7_half_yearly_statement",
    "category": "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "reportName": "ESI - Form 7 - Half Yearly Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "epf_form_11_declaration_form": {
    "reportId": "epf_form_11_declaration_form",
    "category": "PF - Provident Fund",
    "reportName": "EPF Form 11 - Declaration Form",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "epf_form_2": {
    "reportId": "epf_form_2",
    "category": "PF - Provident Fund",
    "reportName": "EPF Form 2",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_aadhaar_details_of_members_annexure_i": {
    "reportId": "pf_aadhaar_details_of_members_annexure_i",
    "category": "PF - Provident Fund",
    "reportName": "PF - AADHAAR DETAILS OF MEMBERS (ANNEXURE - I)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_combined_challan_report": {
    "reportId": "pf_combined_challan_report",
    "category": "PF - Provident Fund",
    "reportName": "PF - Combined Challan Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_combined_challan_report_v1": {
    "reportId": "pf_combined_challan_report_v1",
    "category": "PF - Provident Fund",
    "reportName": "PF - Combined Challan Report V1",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_10c_employee_pension_scheme": {
    "reportId": "pf_form_10c_employee_pension_scheme",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form 10C - Employee Pension Scheme",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_10_consolidated_statement_of_members_leaving_pf": {
    "reportId": "pf_form_10_consolidated_statement_of_members_leaving_pf",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form 10 - Consolidated statement of members leaving PF",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_12a_pf_monthly_statement_of_consolidation_paid": {
    "reportId": "pf_form_12a_pf_monthly_statement_of_consolidation_paid",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form 12A - PF Monthly Statement of Consolidation paid",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_12a_pf_monthly_statement_of_consolidation_paid_v1": {
    "reportId": "pf_form_12a_pf_monthly_statement_of_consolidation_paid_v1",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form 12A - PF Monthly Statement of Consolidation paid V1",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_19_employee_pf_claim_form": {
    "reportId": "pf_form_19_employee_pf_claim_form",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form 19 - Employee PF Claim Form",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_19_pf_composite_claim_form_aadhar": {
    "reportId": "form_19_pf_composite_claim_form_aadhar",
    "category": "PF - Provident Fund",
    "reportName": "Form 19 - PF Composite Claim form ( Aadhar )",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_3a": {
    "reportId": "pf_form_3a",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form 3A",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_5_consolidated_statement_of_members_joining_pf": {
    "reportId": "pf_form_5_consolidated_statement_of_members_joining_pf",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form 5 - Consolidated statement of members joining PF",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_6a_consolidated_statement_for_contribution_card": {
    "reportId": "pf_form_6a_consolidated_statement_for_contribution_card",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form 6A - Consolidated Statement For Contribution Card",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_r1_monthly_return_for_employees": {
    "reportId": "pf_form_r1_monthly_return_for_employees",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form R1 - Monthly Return for Employees",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_form_r1_monthly_return_for_employees_v1": {
    "reportId": "pf_form_r1_monthly_return_for_employees_v1",
    "category": "PF - Provident Fund",
    "reportName": "PF - Form R1 - Monthly Return for Employees V1",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "nps_contribution_report": {
    "reportId": "nps_contribution_report",
    "category": "PF - Provident Fund",
    "reportName": "NPS Contribution Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_wage_ceiling_increase_analysis_report": {
    "reportId": "pf_wage_ceiling_increase_analysis_report",
    "category": "PF - Provident Fund",
    "reportName": "PF Wage Ceiling Increase - Analysis Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_and_pension_contribution": {
    "reportId": "pf_and_pension_contribution",
    "category": "PF - Provident Fund",
    "reportName": "PF And Pension Contribution",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_arrear_report": {
    "reportId": "pf_arrear_report",
    "category": "PF - Provident Fund",
    "reportName": "PF Arrear Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_monthly_statement": {
    "reportId": "pf_monthly_statement",
    "category": "PF - Provident Fund",
    "reportName": "PF - Monthly Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_monthly_statementv1": {
    "reportId": "pf_monthly_statementv1",
    "category": "PF - Provident Fund",
    "reportName": "PF - Monthly StatementV1",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_summary_report": {
    "reportId": "pf_summary_report",
    "category": "PF - Provident Fund",
    "reportName": "PF - Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_summary_report_v1": {
    "reportId": "pf_summary_report_v1",
    "category": "PF - Provident Fund",
    "reportName": "PF - Summary Report V1",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "pf_ecr_format": {
    "reportId": "pf_ecr_format",
    "category": "PF - Provident Fund",
    "reportName": "PF - ECR Format",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "statement_of_international_workers_iw_1_with_cover_letter": {
    "reportId": "statement_of_international_workers_iw_1_with_cover_letter",
    "category": "PF - Provident Fund",
    "reportName": "Statement of International Workers (IW) - 1 with cover letter",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "profession_tax_monthly_statement_any_state": {
    "reportId": "profession_tax_monthly_statement_any_state",
    "category": "PT - Profession Tax",
    "reportName": "Profession Tax Monthly Statement (Any State)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_5_profession_tax_annual_return_karnataka": {
    "reportId": "form_5_profession_tax_annual_return_karnataka",
    "category": "PT - Profession Tax",
    "reportName": "FORM 5 - Profession Tax Annual Return - Karnataka",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_5a_profession_tax_monthly_statement_karnataka": {
    "reportId": "form_5a_profession_tax_monthly_statement_karnataka",
    "category": "PT - Profession Tax",
    "reportName": "FORM 5A - Profession Tax Monthly Statement - Karnataka",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "attrition_report": {
    "reportId": "attrition_report",
    "category": "Workforce Attrition Reports",
    "reportName": "Attrition Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "monthly_tds_challan": {
    "reportId": "monthly_tds_challan",
    "category": "Income Tax",
    "reportName": "Monthly TDS Challan",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "income_tax_statement_consolidated": {
    "reportId": "income_tax_statement_consolidated",
    "category": "Income Tax",
    "reportName": "Income Tax Statement - Consolidated",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "income_tax_worksheet": {
    "reportId": "income_tax_worksheet",
    "category": "Income Tax",
    "reportName": "Income Tax Worksheet",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "annual_tax_report": {
    "reportId": "annual_tax_report",
    "category": "Income Tax",
    "reportName": "Annual Tax Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "form_12bb_it_savings": {
    "reportId": "form_12bb_it_savings",
    "category": "Income Tax",
    "reportName": "Form 12BB - IT Savings",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "income_tax_form_16a": {
    "reportId": "income_tax_form_16a",
    "category": "Income Tax",
    "reportName": "Income Tax - Form 16A",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "income_tax_monthly_statement": {
    "reportId": "income_tax_monthly_statement",
    "category": "Income Tax",
    "reportName": "Income Tax - Monthly Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "income_tax_statement": {
    "reportId": "income_tax_statement",
    "category": "Income Tax",
    "reportName": "Income Tax Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "it_landlord_details": {
    "reportId": "it_landlord_details",
    "category": "Income Tax",
    "reportName": "IT Landlord Details",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "it_savings_chapter6_report": {
    "reportId": "it_savings_chapter6_report",
    "category": "Income Tax",
    "reportName": "IT Savings Chapter6 Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "it_savings_other_reports": {
    "reportId": "it_savings_other_reports",
    "category": "Income Tax",
    "reportName": "IT Savings Other Reports",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "it_savings_previous_employement_report": {
    "reportId": "it_savings_previous_employement_report",
    "category": "Income Tax",
    "reportName": "IT Savings Previous Employement Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "it_savings_reports": {
    "reportId": "it_savings_reports",
    "category": "Income Tax",
    "reportName": "IT Savings Reports",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "monthly_tds_challan_report_tds_bank_payment_file": {
    "reportId": "monthly_tds_challan_report_tds_bank_payment_file",
    "category": "Income Tax",
    "reportName": "Monthly TDS challan report - TDS Bank Payment File",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "proof_of_investment_declaration": {
    "reportId": "proof_of_investment_declaration",
    "category": "Income Tax",
    "reportName": "Proof Of Investment Declaration",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "income_tax_liability_report": {
    "reportId": "income_tax_liability_report",
    "category": "Income Tax",
    "reportName": "Income Tax Liability Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "assessmentYear",
        "label": "Assessment Year",
        "type": "select",
        "required": true,
        "defaultValue": "2027-2028",
        "options": [
          {
            "label": "AY 2027-2028",
            "value": "2027-2028"
          },
          {
            "label": "AY 2026-2027",
            "value": "2026-2027"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      }
    ]
  },
  "reimbursement_balance_report": {
    "reportId": "reimbursement_balance_report",
    "category": "Reimbursement",
    "reportName": "Reimbursement Balance Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "claimType",
        "label": "Expense Category",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Categories",
            "value": "ALL"
          },
          {
            "label": "Travel & Conveyance",
            "value": "TRAVEL"
          },
          {
            "label": "Meals & Entertainment",
            "value": "MEALS"
          },
          {
            "label": "Mobile / Internet",
            "value": "TELECOM"
          },
          {
            "label": "Medical Reimbursement",
            "value": "MEDICAL"
          },
          {
            "label": "Fuel Expenses",
            "value": "FUEL"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "reimbursement_claim_report": {
    "reportId": "reimbursement_claim_report",
    "category": "Reimbursement",
    "reportName": "Reimbursement Claim Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "claimType",
        "label": "Expense Category",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Categories",
            "value": "ALL"
          },
          {
            "label": "Travel & Conveyance",
            "value": "TRAVEL"
          },
          {
            "label": "Meals & Entertainment",
            "value": "MEALS"
          },
          {
            "label": "Mobile / Internet",
            "value": "TELECOM"
          },
          {
            "label": "Medical Reimbursement",
            "value": "MEDICAL"
          },
          {
            "label": "Fuel Expenses",
            "value": "FUEL"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "detailed_reimbursement_summary_report": {
    "reportId": "detailed_reimbursement_summary_report",
    "category": "Reimbursement",
    "reportName": "Detailed Reimbursement Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "claimType",
        "label": "Expense Category",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Categories",
            "value": "ALL"
          },
          {
            "label": "Travel & Conveyance",
            "value": "TRAVEL"
          },
          {
            "label": "Meals & Entertainment",
            "value": "MEALS"
          },
          {
            "label": "Mobile / Internet",
            "value": "TELECOM"
          },
          {
            "label": "Medical Reimbursement",
            "value": "MEDICAL"
          },
          {
            "label": "Fuel Expenses",
            "value": "FUEL"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "reimbursement_overall_entitlement_summary_report": {
    "reportId": "reimbursement_overall_entitlement_summary_report",
    "category": "Reimbursement",
    "reportName": "Reimbursement Overall Entitlement Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "claimType",
        "label": "Expense Category",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Categories",
            "value": "ALL"
          },
          {
            "label": "Travel & Conveyance",
            "value": "TRAVEL"
          },
          {
            "label": "Meals & Entertainment",
            "value": "MEALS"
          },
          {
            "label": "Mobile / Internet",
            "value": "TELECOM"
          },
          {
            "label": "Medical Reimbursement",
            "value": "MEDICAL"
          },
          {
            "label": "Fuel Expenses",
            "value": "FUEL"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "reimbursement_summary_report": {
    "reportId": "reimbursement_summary_report",
    "category": "Reimbursement",
    "reportName": "Reimbursement Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "claimType",
        "label": "Expense Category",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Categories",
            "value": "ALL"
          },
          {
            "label": "Travel & Conveyance",
            "value": "TRAVEL"
          },
          {
            "label": "Meals & Entertainment",
            "value": "MEALS"
          },
          {
            "label": "Mobile / Internet",
            "value": "TELECOM"
          },
          {
            "label": "Medical Reimbursement",
            "value": "MEDICAL"
          },
          {
            "label": "Fuel Expenses",
            "value": "FUEL"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "reimbursement_transaction_report": {
    "reportId": "reimbursement_transaction_report",
    "category": "Reimbursement",
    "reportName": "Reimbursement Transaction Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "claimType",
        "label": "Expense Category",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Categories",
            "value": "ALL"
          },
          {
            "label": "Travel & Conveyance",
            "value": "TRAVEL"
          },
          {
            "label": "Meals & Entertainment",
            "value": "MEALS"
          },
          {
            "label": "Mobile / Internet",
            "value": "TELECOM"
          },
          {
            "label": "Medical Reimbursement",
            "value": "MEDICAL"
          },
          {
            "label": "Fuel Expenses",
            "value": "FUEL"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "reimbursement_ytd_report": {
    "reportId": "reimbursement_ytd_report",
    "category": "Reimbursement",
    "reportName": "Reimbursement YTD Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "claimType",
        "label": "Expense Category",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Categories",
            "value": "ALL"
          },
          {
            "label": "Travel & Conveyance",
            "value": "TRAVEL"
          },
          {
            "label": "Meals & Entertainment",
            "value": "MEALS"
          },
          {
            "label": "Mobile / Internet",
            "value": "TELECOM"
          },
          {
            "label": "Medical Reimbursement",
            "value": "MEDICAL"
          },
          {
            "label": "Fuel Expenses",
            "value": "FUEL"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "loan_balance_report": {
    "reportId": "loan_balance_report",
    "category": "Loan",
    "reportName": "Loan Balance Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "loanType",
        "label": "Loan Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Loan Types",
            "value": "ALL"
          },
          {
            "label": "Personal Loan",
            "value": "PERSONAL"
          },
          {
            "label": "Salary Advance",
            "value": "SALARY_ADVANCE"
          },
          {
            "label": "Emergency Medical Loan",
            "value": "EMERGENCY_LOAN"
          },
          {
            "label": "Home Computer Loan",
            "value": "EQUIPMENT_LOAN"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "loan_summary_report": {
    "reportId": "loan_summary_report",
    "category": "Loan",
    "reportName": "Loan Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "loanType",
        "label": "Loan Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Loan Types",
            "value": "ALL"
          },
          {
            "label": "Personal Loan",
            "value": "PERSONAL"
          },
          {
            "label": "Salary Advance",
            "value": "SALARY_ADVANCE"
          },
          {
            "label": "Emergency Medical Loan",
            "value": "EMERGENCY_LOAN"
          },
          {
            "label": "Home Computer Loan",
            "value": "EQUIPMENT_LOAN"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "loan_transaction_report": {
    "reportId": "loan_transaction_report",
    "category": "Loan",
    "reportName": "Loan Transaction Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "loanType",
        "label": "Loan Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Loan Types",
            "value": "ALL"
          },
          {
            "label": "Personal Loan",
            "value": "PERSONAL"
          },
          {
            "label": "Salary Advance",
            "value": "SALARY_ADVANCE"
          },
          {
            "label": "Emergency Medical Loan",
            "value": "EMERGENCY_LOAN"
          },
          {
            "label": "Home Computer Loan",
            "value": "EQUIPMENT_LOAN"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "loan_details_report": {
    "reportId": "loan_details_report",
    "category": "Loan",
    "reportName": "Loan Details Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "loanType",
        "label": "Loan Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Loan Types",
            "value": "ALL"
          },
          {
            "label": "Personal Loan",
            "value": "PERSONAL"
          },
          {
            "label": "Salary Advance",
            "value": "SALARY_ADVANCE"
          },
          {
            "label": "Emergency Medical Loan",
            "value": "EMERGENCY_LOAN"
          },
          {
            "label": "Home Computer Loan",
            "value": "EQUIPMENT_LOAN"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "claim_bank_transfer_statement": {
    "reportId": "claim_bank_transfer_statement",
    "category": "Claims",
    "reportName": "Claim bank transfer statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "claimType",
        "label": "Expense Category",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Categories",
            "value": "ALL"
          },
          {
            "label": "Travel & Conveyance",
            "value": "TRAVEL"
          },
          {
            "label": "Meals & Entertainment",
            "value": "MEALS"
          },
          {
            "label": "Mobile / Internet",
            "value": "TELECOM"
          },
          {
            "label": "Medical Reimbursement",
            "value": "MEDICAL"
          },
          {
            "label": "Fuel Expenses",
            "value": "FUEL"
          }
        ]
      },
      {
        "name": "statusFilter",
        "label": "Processing Status",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Statuses",
            "value": "ALL"
          },
          {
            "label": "Approved / Disbursed",
            "value": "APPROVED"
          },
          {
            "label": "Pending Review",
            "value": "PENDING"
          },
          {
            "label": "Settled in Payroll",
            "value": "SETTLED"
          }
        ]
      }
    ]
  },
  "lop_reversal_report": {
    "reportId": "lop_reversal_report",
    "category": "MIS Reports",
    "reportName": "LOP Reversal Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "arrear_report": {
    "reportId": "arrear_report",
    "category": "MIS Reports",
    "reportName": "Arrear Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "compensation_item_statement_monthly": {
    "reportId": "compensation_item_statement_monthly",
    "category": "MIS Reports",
    "reportName": "Compensation Item Statement - Monthly",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "compensation_item_statement_consolidated": {
    "reportId": "compensation_item_statement_consolidated",
    "category": "MIS Reports",
    "reportName": "Compensation Item Statement - Consolidated",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "reimbursement_duplicate_bills_report": {
    "reportId": "reimbursement_duplicate_bills_report",
    "category": "MIS Reports",
    "reportName": "Reimbursement Duplicate bills Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "employee_bio_data": {
    "reportId": "employee_bio_data",
    "category": "MIS Reports",
    "reportName": "Employee Bio data",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "employee_filter_configuration_report": {
    "reportId": "employee_filter_configuration_report",
    "category": "MIS Reports",
    "reportName": "Employee Filter Configuration Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "employee_master_information_report": {
    "reportId": "employee_master_information_report",
    "category": "MIS Reports",
    "reportName": "Employee Master information Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "excel_import_log_report": {
    "reportId": "excel_import_log_report",
    "category": "MIS Reports",
    "reportName": "Excel Import Log Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "exit_interview_checklist": {
    "reportId": "exit_interview_checklist",
    "category": "MIS Reports",
    "reportName": "Exit Interview Checklist",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_12b": {
    "reportId": "form_12b",
    "category": "MIS Reports",
    "reportName": "FORM 12B",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_25_gratuity_nomination_form": {
    "reportId": "form_25_gratuity_nomination_form",
    "category": "MIS Reports",
    "reportName": "Form 25 - Gratuity Nomination Form",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "salary_input_history": {
    "reportId": "salary_input_history",
    "category": "MIS Reports",
    "reportName": "Salary Input History",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "implementation_verification_report": {
    "reportId": "implementation_verification_report",
    "category": "MIS Reports",
    "reportName": "Implementation Verification Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "monthly_change_tracking_report_for_employee_info_updates": {
    "reportId": "monthly_change_tracking_report_for_employee_info_updates",
    "category": "MIS Reports",
    "reportName": "Monthly Change Tracking Report for Employee Info Updates",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "overrides_report_employeewise": {
    "reportId": "overrides_report_employeewise",
    "category": "MIS Reports",
    "reportName": "Overrides Report (EmployeeWise)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "overrides_report_itemwise": {
    "reportId": "overrides_report_itemwise",
    "category": "MIS Reports",
    "reportName": "Overrides Report (ItemWise)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "payroll_anomalies_report": {
    "reportId": "payroll_anomalies_report",
    "category": "MIS Reports",
    "reportName": "Payroll Anomalies Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "resettlement_report": {
    "reportId": "resettlement_report",
    "category": "MIS Reports",
    "reportName": "ReSettlement Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "reversal_transaction_report": {
    "reportId": "reversal_transaction_report",
    "category": "MIS Reports",
    "reportName": "Reversal transaction Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "salary_revision_history": {
    "reportId": "salary_revision_history",
    "category": "MIS Reports",
    "reportName": "Salary Revision History",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "salary_structure_report": {
    "reportId": "salary_structure_report",
    "category": "MIS Reports",
    "reportName": "Salary Structure Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "settlement_report": {
    "reportId": "settlement_report",
    "category": "MIS Reports",
    "reportName": "Settlement Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "user_activity_log_report": {
    "reportId": "user_activity_log_report",
    "category": "MIS Reports",
    "reportName": "User Activity Log Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "ytd_statement": {
    "reportId": "ytd_statement",
    "category": "MIS Reports",
    "reportName": "YTD Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "ytd_statement_consolidated_report": {
    "reportId": "ytd_statement_consolidated_report",
    "category": "MIS Reports",
    "reportName": "YTD Statement Consolidated Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "ytd_summary_report": {
    "reportId": "ytd_summary_report",
    "category": "MIS Reports",
    "reportName": "YTD Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "ctc_breakup_report": {
    "reportId": "ctc_breakup_report",
    "category": "MIS Reports",
    "reportName": "CTC Breakup Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "it_declaration_revoked_employee_list": {
    "reportId": "it_declaration_revoked_employee_list",
    "category": "MIS Reports",
    "reportName": "IT declaration revoked employee list",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "bonus_statement": {
    "reportId": "bonus_statement",
    "category": "MIS Reports",
    "reportName": "Bonus Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "lic_statement": {
    "reportId": "lic_statement",
    "category": "MIS Reports",
    "reportName": "LIC Statement",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "nomination_details_report": {
    "reportId": "nomination_details_report",
    "category": "MIS Reports",
    "reportName": "Nomination Details Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "salary_payout_reconciliation_report": {
    "reportId": "salary_payout_reconciliation_report",
    "category": "MIS Reports",
    "reportName": "Salary Payout Reconciliation Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "salary_summary_report": {
    "reportId": "salary_summary_report",
    "category": "MIS Reports",
    "reportName": "Salary Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "leave_availed_report": {
    "reportId": "leave_availed_report",
    "category": "Leave",
    "reportName": "Leave Availed Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      },
      {
        "name": "leaveType",
        "label": "Leave Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Leave Types",
            "value": "ALL"
          },
          {
            "label": "Earned Leave (EL / PL)",
            "value": "EARNED"
          },
          {
            "label": "Casual Leave (CL)",
            "value": "CASUAL"
          },
          {
            "label": "Sick Leave (SL)",
            "value": "SICK"
          },
          {
            "label": "Compensatory Off",
            "value": "COMP_OFF"
          },
          {
            "label": "Loss of Pay (LOP)",
            "value": "LOP"
          }
        ]
      }
    ]
  },
  "leave_backdated_report": {
    "reportId": "leave_backdated_report",
    "category": "Leave",
    "reportName": "Leave Backdated Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      },
      {
        "name": "leaveType",
        "label": "Leave Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Leave Types",
            "value": "ALL"
          },
          {
            "label": "Earned Leave (EL / PL)",
            "value": "EARNED"
          },
          {
            "label": "Casual Leave (CL)",
            "value": "CASUAL"
          },
          {
            "label": "Sick Leave (SL)",
            "value": "SICK"
          },
          {
            "label": "Compensatory Off",
            "value": "COMP_OFF"
          },
          {
            "label": "Loss of Pay (LOP)",
            "value": "LOP"
          }
        ]
      }
    ]
  },
  "leave_balance_as_on_a_day": {
    "reportId": "leave_balance_as_on_a_day",
    "category": "Leave",
    "reportName": "Leave Balance As On A Day",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      },
      {
        "name": "leaveType",
        "label": "Leave Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Leave Types",
            "value": "ALL"
          },
          {
            "label": "Earned Leave (EL / PL)",
            "value": "EARNED"
          },
          {
            "label": "Casual Leave (CL)",
            "value": "CASUAL"
          },
          {
            "label": "Sick Leave (SL)",
            "value": "SICK"
          },
          {
            "label": "Compensatory Off",
            "value": "COMP_OFF"
          },
          {
            "label": "Loss of Pay (LOP)",
            "value": "LOP"
          }
        ]
      }
    ]
  },
  "day_wise_leave_transaction_report": {
    "reportId": "day_wise_leave_transaction_report",
    "category": "Leave",
    "reportName": "Day Wise Leave Transaction Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      },
      {
        "name": "leaveType",
        "label": "Leave Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Leave Types",
            "value": "ALL"
          },
          {
            "label": "Earned Leave (EL / PL)",
            "value": "EARNED"
          },
          {
            "label": "Casual Leave (CL)",
            "value": "CASUAL"
          },
          {
            "label": "Sick Leave (SL)",
            "value": "SICK"
          },
          {
            "label": "Compensatory Off",
            "value": "COMP_OFF"
          },
          {
            "label": "Loss of Pay (LOP)",
            "value": "LOP"
          }
        ]
      }
    ]
  },
  "leave_encashment_report": {
    "reportId": "leave_encashment_report",
    "category": "Leave",
    "reportName": "Leave Encashment Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      },
      {
        "name": "leaveType",
        "label": "Leave Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Leave Types",
            "value": "ALL"
          },
          {
            "label": "Earned Leave (EL / PL)",
            "value": "EARNED"
          },
          {
            "label": "Casual Leave (CL)",
            "value": "CASUAL"
          },
          {
            "label": "Sick Leave (SL)",
            "value": "SICK"
          },
          {
            "label": "Compensatory Off",
            "value": "COMP_OFF"
          },
          {
            "label": "Loss of Pay (LOP)",
            "value": "LOP"
          }
        ]
      }
    ]
  },
  "negative_leave_balance": {
    "reportId": "negative_leave_balance",
    "category": "Leave",
    "reportName": "Negative Leave Balance",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      },
      {
        "name": "leaveType",
        "label": "Leave Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Leave Types",
            "value": "ALL"
          },
          {
            "label": "Earned Leave (EL / PL)",
            "value": "EARNED"
          },
          {
            "label": "Casual Leave (CL)",
            "value": "CASUAL"
          },
          {
            "label": "Sick Leave (SL)",
            "value": "SICK"
          },
          {
            "label": "Compensatory Off",
            "value": "COMP_OFF"
          },
          {
            "label": "Loss of Pay (LOP)",
            "value": "LOP"
          }
        ]
      }
    ]
  },
  "leave_summary_report": {
    "reportId": "leave_summary_report",
    "category": "Leave",
    "reportName": "Leave Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      },
      {
        "name": "leaveType",
        "label": "Leave Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Leave Types",
            "value": "ALL"
          },
          {
            "label": "Earned Leave (EL / PL)",
            "value": "EARNED"
          },
          {
            "label": "Casual Leave (CL)",
            "value": "CASUAL"
          },
          {
            "label": "Sick Leave (SL)",
            "value": "SICK"
          },
          {
            "label": "Compensatory Off",
            "value": "COMP_OFF"
          },
          {
            "label": "Loss of Pay (LOP)",
            "value": "LOP"
          }
        ]
      }
    ]
  },
  "leave_transaction_report": {
    "reportId": "leave_transaction_report",
    "category": "Leave",
    "reportName": "Leave Transaction Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      },
      {
        "name": "leaveType",
        "label": "Leave Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Leave Types",
            "value": "ALL"
          },
          {
            "label": "Earned Leave (EL / PL)",
            "value": "EARNED"
          },
          {
            "label": "Casual Leave (CL)",
            "value": "CASUAL"
          },
          {
            "label": "Sick Leave (SL)",
            "value": "SICK"
          },
          {
            "label": "Compensatory Off",
            "value": "COMP_OFF"
          },
          {
            "label": "Loss of Pay (LOP)",
            "value": "LOP"
          }
        ]
      }
    ]
  },
  "year_wise_summary_report": {
    "reportId": "year_wise_summary_report",
    "category": "Leave",
    "reportName": "Year Wise Summary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "fromDate",
        "label": "From Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-01"
      },
      {
        "name": "toDate",
        "label": "To Date",
        "type": "date",
        "required": true,
        "defaultValue": "2026-11-30"
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      },
      {
        "name": "leaveType",
        "label": "Leave Type",
        "type": "select",
        "required": false,
        "defaultValue": "ALL",
        "options": [
          {
            "label": "All Leave Types",
            "value": "ALL"
          },
          {
            "label": "Earned Leave (EL / PL)",
            "value": "EARNED"
          },
          {
            "label": "Casual Leave (CL)",
            "value": "CASUAL"
          },
          {
            "label": "Sick Leave (SL)",
            "value": "SICK"
          },
          {
            "label": "Compensatory Off",
            "value": "COMP_OFF"
          },
          {
            "label": "Loss of Pay (LOP)",
            "value": "LOP"
          }
        ]
      }
    ]
  },
  "response_time_report_help_desk_ticket": {
    "reportId": "response_time_report_help_desk_ticket",
    "category": "Help Desk",
    "reportName": "Response Time Report (Help Desk Ticket)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "help_desk_tickets_report": {
    "reportId": "help_desk_tickets_report",
    "category": "Help Desk",
    "reportName": "Help Desk Tickets Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_b_register_of_fines_and_unpaid_accumulations_labour_welfare_fund_act_karnataka": {
    "reportId": "form_b_register_of_fines_and_unpaid_accumulations_labour_welfare_fund_act_karnataka",
    "category": "Labour Welfare Fund Act - Karnataka",
    "reportName": "Form B - Register Of Fines And Unpaid Accumulations - Labour Welfare Fund Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_d_statement_of_employer_s_and_employee_s_contribution_labour_welfare_fund_act_karnataka": {
    "reportId": "form_d_statement_of_employer_s_and_employee_s_contribution_labour_welfare_fund_act_karnataka",
    "category": "Labour Welfare Fund Act - Karnataka",
    "reportName": "FORM D - Statement of Employer's and Employee's Contribution - Labour Welfare Fund Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_ii_register_of_deductions_for_absence_from_duty_or_for_damage_or_loss_caused_to_the_employee_by_the_neglect_or_default_of_the_employed_persons_minimum_wages_rules_karnataka": {
    "reportId": "form_ii_register_of_deductions_for_absence_from_duty_or_for_damage_or_loss_caused_to_the_employee_by_the_neglect_or_default_of_the_employed_persons_minimum_wages_rules_karnataka",
    "category": "Minimum Wages Rules - Karnataka",
    "reportName": "Form II - Register of deductions for absence from duty or for damage or loss caused to the employee by the neglect or default of the employed persons - Minimum Wages Rules - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_iv_overtime_time_register_minimum_wages_rules_karnataka": {
    "reportId": "form_iv_overtime_time_register_minimum_wages_rules_karnataka",
    "category": "Minimum Wages Rules - Karnataka",
    "reportName": "Form IV - Overtime Time Register - Minimum Wages Rules - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_i_register_of_fines_minimum_wages_rules_karnataka": {
    "reportId": "form_i_register_of_fines_minimum_wages_rules_karnataka",
    "category": "Minimum Wages Rules - Karnataka",
    "reportName": "Form I - Register of Fines - Minimum Wages Rules - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_vii_muster_roll_minimum_wages_rules_karnataka": {
    "reportId": "form_vii_muster_roll_minimum_wages_rules_karnataka",
    "category": "Minimum Wages Rules - Karnataka",
    "reportName": "Form VII - Muster Roll - Minimum Wages Rules - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_vi_wage_slip_minimum_wages_rules_karnataka": {
    "reportId": "form_vi_wage_slip_minimum_wages_rules_karnataka",
    "category": "Minimum Wages Rules - Karnataka",
    "reportName": "Form VI - Wage slip - Minimum Wages Rules - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_v_register_of_wages_minimum_wages_rules_karnataka": {
    "reportId": "form_v_register_of_wages_minimum_wages_rules_karnataka",
    "category": "Minimum Wages Rules - Karnataka",
    "reportName": "Form V - Register of wages - Minimum Wages Rules - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_iii_annual_return_minimum_wages_rules_karnataka": {
    "reportId": "form_iii_annual_return_minimum_wages_rules_karnataka",
    "category": "Minimum Wages Rules - Karnataka",
    "reportName": "Form III - Annual Return - Minimum Wages Rules - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_9_overtime_register_factories_act_karnataka": {
    "reportId": "form_9_overtime_register_factories_act_karnataka",
    "category": "Factories Act - Karnataka",
    "reportName": "Form 9 - Overtime Register - Factories Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_20_combined_annual_return_factories_act_karnataka": {
    "reportId": "form_20_combined_annual_return_factories_act_karnataka",
    "category": "Factories Act - Karnataka",
    "reportName": "Form 20 - Combined annual return - Factories Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_11_register_of_adult_workers_factories_act_karnataka": {
    "reportId": "form_11_register_of_adult_workers_factories_act_karnataka",
    "category": "Factories Act - Karnataka",
    "reportName": "Form 11 - Register of Adult workers - Factories Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_14_register_of_leave_with_wages_factories_act_karnataka": {
    "reportId": "form_14_register_of_leave_with_wages_factories_act_karnataka",
    "category": "Factories Act - Karnataka",
    "reportName": "Form 14 - Register of leave with wages - Factories Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_15_leave_book_factories_act_karnataka": {
    "reportId": "form_15_leave_book_factories_act_karnataka",
    "category": "Factories Act - Karnataka",
    "reportName": "Form 15 - Leave book - Factories Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_21_half_yearly_return_factories_act_karnataka": {
    "reportId": "form_21_half_yearly_return_factories_act_karnataka",
    "category": "Factories Act - Karnataka",
    "reportName": "Form 21 - Half Yearly Return - Factories Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_22_muster_roll_cum_wage_register_factories_act_karnataka": {
    "reportId": "form_22_muster_roll_cum_wage_register_factories_act_karnataka",
    "category": "Factories Act - Karnataka",
    "reportName": "Form 22 - Muster Roll cum Wage register - Factories Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_a_muster_roll_nil_register_maternity_benefit_act_central": {
    "reportId": "form_a_muster_roll_nil_register_maternity_benefit_act_central",
    "category": "Maternity Benefit Act - Central",
    "reportName": "Form A - Muster Roll - ( NIL Register ) - Maternity Benefit Act - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xiii_register_of_workmen_employed_by_contractor_clra_act_rules_central": {
    "reportId": "form_xiii_register_of_workmen_employed_by_contractor_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XIII - Register of Workmen Employed by Contractor - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xii_register_of_contractors_clra_act_rules_central": {
    "reportId": "form_xii_register_of_contractors_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XII - Register of contractors - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xiv_employment_card_clra_act_rules_central": {
    "reportId": "form_xiv_employment_card_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XIV - Employment Card - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xix_wages_slip_clra_rules_central": {
    "reportId": "form_xix_wages_slip_clra_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XIX - Wages Slip - CLRA Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xvii_register_of_wages_clra_act_rules_central": {
    "reportId": "form_xvii_register_of_wages_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XVII - Register of Wages - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xvi_muster_roll_clra_act_rules_central": {
    "reportId": "form_xvi_muster_roll_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XVI - Muster Roll - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xv_service_certificate_clra_act_rules_central": {
    "reportId": "form_xv_service_certificate_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XV - Service Certificate - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xx_register_of_deductions_for_damage_or_loss_clra_act_rules_central": {
    "reportId": "form_xx_register_of_deductions_for_damage_or_loss_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XX - Register of Deductions for Damage or Loss - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xxi_register_of_fines_clra_act_rules_central": {
    "reportId": "form_xxi_register_of_fines_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XXI - Register of Fines - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xxii_register_of_advances_clra_act_rules_central": {
    "reportId": "form_xxii_register_of_advances_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XXII - Register of Advances - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xxiii_register_of_overtime_clra_act_rules_central": {
    "reportId": "form_xxiii_register_of_overtime_clra_act_rules_central",
    "category": "CLRA Act & Rules - Central",
    "reportName": "Form XXIII - Register of Overtime - CLRA Act & Rules - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_c_bonus_paid_to_employees_payment_of_bonus_act_central": {
    "reportId": "form_c_bonus_paid_to_employees_payment_of_bonus_act_central",
    "category": "Payment of Bonus Act - Central",
    "reportName": "Form C - Bonus Paid To Employees - Payment of Bonus Act - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_d_annual_return_bonus_paid_to_employees_payment_of_bonus_act_central": {
    "reportId": "form_d_annual_return_bonus_paid_to_employees_payment_of_bonus_act_central",
    "category": "Payment of Bonus Act - Central",
    "reportName": "Form D - Annual Return bonus paid to employees - Payment of Bonus Act - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_d_register_to_be_maintained_by_the_employer_equal_remuneration_act_central": {
    "reportId": "form_d_register_to_be_maintained_by_the_employer_equal_remuneration_act_central",
    "category": "Equal Remuneration Act - Central",
    "reportName": "Form D - Register To Be Maintained By The Employer - Equal Remuneration Act - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_35_form_of_notice_book_workmen_s_compensation_act_central": {
    "reportId": "form_35_form_of_notice_book_workmen_s_compensation_act_central",
    "category": "Workmen's Compensation Act",
    "reportName": "Form 35 - Form of Notice Book - Workmen's Compensation Act - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_a_employee_register_ease_of_compliance_central": {
    "reportId": "form_a_employee_register_ease_of_compliance_central",
    "category": "Ease of Compliance - Central",
    "reportName": "Form A - Employee Register - Ease of Compliance - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_b_wage_register_ease_of_compliance_central": {
    "reportId": "form_b_wage_register_ease_of_compliance_central",
    "category": "Ease of Compliance - Central",
    "reportName": "Form B - Wage Register - Ease of Compliance - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_c_register_of_loan_recoveries_ease_of_compliance_central": {
    "reportId": "form_c_register_of_loan_recoveries_ease_of_compliance_central",
    "category": "Ease of Compliance - Central",
    "reportName": "Form C - Register of Loan/Recoveries - Ease of Compliance - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_d_attendance_register_ease_of_compliance_central": {
    "reportId": "form_d_attendance_register_ease_of_compliance_central",
    "category": "Ease of Compliance - Central",
    "reportName": "Form D - Attendance Register - Ease of Compliance - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "form_u_combined_annual_return_shops_est_act_karnataka": {
    "reportId": "form_u_combined_annual_return_shops_est_act_karnataka",
    "category": "Shops & Est Act - Karnataka",
    "reportName": "Form U - Combined annual return - Shops & Est. Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "financialYear",
        "label": "Financial Year",
        "type": "select",
        "required": true,
        "defaultValue": "2026-2027",
        "options": [
          {
            "label": "FY 2026-2027 (Current)",
            "value": "2026-2027"
          },
          {
            "label": "FY 2025-2026",
            "value": "2025-2026"
          },
          {
            "label": "FY 2024-2025",
            "value": "2024-2025"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_q_appointment_order_shops_est_act_karnataka": {
    "reportId": "form_q_appointment_order_shops_est_act_karnataka",
    "category": "Shops & Est Act - Karnataka",
    "reportName": "Form Q - Appointment Order - Shops & Est. Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_t_combined_muster_roll_cum_register_of_wages_shops_est_act_karnataka": {
    "reportId": "form_t_combined_muster_roll_cum_register_of_wages_shops_est_act_karnataka",
    "category": "Shops & Est Act - Karnataka",
    "reportName": "Form T - Combined Muster Roll cum Register of Wages - Shops & Est. Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_r_request_for_exemption_for_employing_women_in_night_shift_shops_est_act_karnataka": {
    "reportId": "form_r_request_for_exemption_for_employing_women_in_night_shift_shops_est_act_karnataka",
    "category": "Shops & Est Act - Karnataka",
    "reportName": "Form R - Request for exemption for employing women in night shift - Shops & Est. Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_f_register_of_leave_with_wages_shops_est_act_karnataka": {
    "reportId": "form_f_register_of_leave_with_wages_shops_est_act_karnataka",
    "category": "Shops & Est Act - Karnataka",
    "reportName": "Form F - Register of Leave with wages - Shops & Est. Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_h_leave_with_wages_book_shops_est_act_karnataka": {
    "reportId": "form_h_leave_with_wages_book_shops_est_act_karnataka",
    "category": "Shops & Est Act - Karnataka",
    "reportName": "Form H - Leave with wages book - Shops & Est. Act - Karnataka",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Karnataka",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_a_statement_of_contributions_to_labour_welfare_fund_tamil_nadu": {
    "reportId": "form_a_statement_of_contributions_to_labour_welfare_fund_tamil_nadu",
    "category": "Tamil Nadu Labour Welfare Fund Act, 1972",
    "reportName": "Form A Statement of Contributions to Labour Welfare Fund Tamil Nadu",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Tamil Nadu",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_10_overtime_muster_roll_for_persons_on_exempted_work_month_ending_himachal_pradesh": {
    "reportId": "form_10_overtime_muster_roll_for_persons_on_exempted_work_month_ending_himachal_pradesh",
    "category": "Labour Reports",
    "reportName": "Form 10 - Overtime muster-roll for persons on exempted work month ending(Himachal Pradesh)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_10_overtime_muster_roll_for_persons_on_exempted_work_month_ending_uttar_pradesh": {
    "reportId": "form_10_overtime_muster_roll_for_persons_on_exempted_work_month_ending_uttar_pradesh",
    "category": "Labour Reports",
    "reportName": "Form 10 - Overtime muster-roll for persons on exempted work month ending (Uttar Pradesh)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_16_register_of_leave_with_wages_rajasthan": {
    "reportId": "form_16_register_of_leave_with_wages_rajasthan",
    "category": "Labour Reports",
    "reportName": "Form 16 - Register of Leave with Wages - Rajasthan",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_25_muster_roll_and_register_of_compensatory_holiday_tamilnadu": {
    "reportId": "form_25_muster_roll_and_register_of_compensatory_holiday_tamilnadu",
    "category": "Labour Reports",
    "reportName": "Form 25 - Muster roll and register of compensatory Holiday(Tamilnadu)",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_28_muster_roll_gujarat": {
    "reportId": "form_28_muster_roll_gujarat",
    "category": "Labour Reports",
    "reportName": "Form 28 - Muster Roll - Gujarat",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_v_wages_slip_haryana": {
    "reportId": "form_v_wages_slip_haryana",
    "category": "Labour Reports",
    "reportName": "Form V - Wages Slip - Haryana",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_no_xxix_register_of_advances_deductions_for_damages_or_loss_and_fines": {
    "reportId": "form_no_xxix_register_of_advances_deductions_for_damages_or_loss_and_fines",
    "category": "Labour Reports",
    "reportName": "Form No XXIX Register of Advances Deductions for Damages or Loss and Fines",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_i_register_of_wages_overtime_fine_and_deduction_for_damage_and_loss": {
    "reportId": "form_i_register_of_wages_overtime_fine_and_deduction_for_damage_and_loss",
    "category": "Labour Reports",
    "reportName": "Form I Register of Wages Overtime Fine and Deduction for damage and Loss",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xxviii_wage_slip": {
    "reportId": "form_xxviii_wage_slip",
    "category": "Labour Reports",
    "reportName": "Form XXVIII - Wage slip",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_x_identity_card": {
    "reportId": "form_x_identity_card",
    "category": "Labour Reports",
    "reportName": "Form X Identity Card",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_vi_contract_labour_regulation_abolition_central_rules": {
    "reportId": "form_vi_contract_labour_regulation_abolition_central_rules",
    "category": "Labour Reports",
    "reportName": "Form VI Contract Labour (Regulation & Abolition) Central Rules",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_xxvi_register_of_employment_of_contract_labour": {
    "reportId": "form_xxvi_register_of_employment_of_contract_labour",
    "category": "Labour Reports",
    "reportName": "Form XXVI Register Of Employment Of Contract Labour",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_ii_muster_roll_cum_wage_register": {
    "reportId": "form_ii_muster_roll_cum_wage_register",
    "category": "Labour Reports",
    "reportName": "Form II - Muster Roll Cum Wage Register",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_vi_wage_slip_karnataka_minimum_wages_rules": {
    "reportId": "form_vi_wage_slip_karnataka_minimum_wages_rules",
    "category": "Labour Reports",
    "reportName": "Form VI - Wage Slip - Karnataka Minimum Wages Rules",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "form_f_nomination_payment_of_gratuity_act_central": {
    "reportId": "form_f_nomination_payment_of_gratuity_act_central",
    "category": "Payment of Gratuity Act - Central",
    "reportName": "Form F - Nomination - Payment of Gratuity Act - Central",
    "isDraftStatutory": true,
    "supportedFormats": [
      "PDF",
      "XLSX",
      "CSV"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "statutoryState",
        "label": "Statutory Jurisdiction / State",
        "type": "select",
        "required": true,
        "defaultValue": "Central",
        "options": [
          {
            "label": "Central Jurisdiction",
            "value": "Central"
          },
          {
            "label": "Karnataka",
            "value": "Karnataka"
          },
          {
            "label": "Tamil Nadu",
            "value": "Tamil Nadu"
          },
          {
            "label": "Maharashtra",
            "value": "Maharashtra"
          },
          {
            "label": "All States",
            "value": "All"
          }
        ]
      },
      {
        "name": "establishmentCode",
        "label": "Establishment / Unit Code",
        "type": "select",
        "required": false,
        "defaultValue": "ALL_UNITS",
        "options": [
          {
            "label": "All Units (Consolidated)",
            "value": "ALL_UNITS"
          },
          {
            "label": "BLR-HQ-001 (Bangalore Main)",
            "value": "BLR-HQ-001"
          },
          {
            "label": "MUM-BR-002 (Mumbai Tech Hub)",
            "value": "MUM-BR-002"
          },
          {
            "label": "CHN-BR-003 (Chennai Branch)",
            "value": "CHN-BR-003"
          }
        ]
      }
    ]
  },
  "anniversary_report": {
    "reportId": "anniversary_report",
    "category": "HR Reports",
    "reportName": "Anniversary Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "employee_family_details": {
    "reportId": "employee_family_details",
    "category": "HR Reports",
    "reportName": "Employee Family Details",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "transitionwise_head_count_report": {
    "reportId": "transitionwise_head_count_report",
    "category": "HR Reports",
    "reportName": "Transitionwise Head Count Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  },
  "user_access_rights_report": {
    "reportId": "user_access_rights_report",
    "category": "HR Reports",
    "reportName": "User Access Rights Report",
    "isDraftStatutory": false,
    "supportedFormats": [
      "PDF",
      "XLSX"
    ],
    "fields": [
      {
        "name": "payrollMonth",
        "label": "Payroll Period / Month",
        "type": "select",
        "required": true,
        "defaultValue": "2026-11",
        "options": [
          {
            "label": "November 2026",
            "value": "2026-11"
          },
          {
            "label": "October 2026",
            "value": "2026-10"
          },
          {
            "label": "September 2026",
            "value": "2026-09"
          },
          {
            "label": "August 2026",
            "value": "2026-08"
          }
        ]
      },
      {
        "name": "employeeFilter",
        "label": "Employee Scope",
        "type": "select",
        "required": false,
        "defaultValue": "ACTIVE",
        "options": [
          {
            "label": "All Active Employees",
            "value": "ACTIVE"
          },
          {
            "label": "Active & Separated Employees",
            "value": "ALL"
          },
          {
            "label": "Specific Employee",
            "value": "SPECIFIC"
          }
        ]
      },
      {
        "name": "department",
        "label": "Department",
        "type": "select",
        "required": false,
        "defaultValue": "All",
        "options": [
          {
            "label": "All Departments",
            "value": "All"
          },
          {
            "label": "Engineering",
            "value": "Engineering"
          },
          {
            "label": "Customer Operations",
            "value": "Customer Operations"
          },
          {
            "label": "Human Resources",
            "value": "Human Resources"
          },
          {
            "label": "Finance & Accounts",
            "value": "Finance & Accounts"
          }
        ]
      }
    ]
  }
};
