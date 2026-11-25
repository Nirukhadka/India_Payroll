const fs = require('fs');

const schemas = JSON.parse(fs.readFileSync('docs/REPORTS-GALLERY-R2-PARAMETER-SCHEMAS.json', 'utf8'));

const tsContent = `// Automatically generated report-specific parameter schemas for all 192 reports
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

export const REPORT_PARAMETER_SCHEMAS: Record<string, ReportParameterSchema> = ${JSON.stringify(schemas, null, 2)};
`;

fs.writeFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/report-parameter-schemas.ts', tsContent, 'utf8');
console.log('Saved apps/app/src/app/[locale]/(admin)/admin/reports/report-parameter-schemas.ts');
