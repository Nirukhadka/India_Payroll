const fs = require('fs');

let content = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');

// 1. Add import for REPORT_PARAMETER_SCHEMAS
if (!content.includes('REPORT_PARAMETER_SCHEMAS')) {
  content = content.replace(
    'import {\n  type ReportCategoryDefinition,\n  type ReportItemDefinition,\n  REPORTS_REGISTRY,\n} from "@/app/[locale]/(admin)/admin/reports/reports-registry";',
    `import {
  type ReportCategoryDefinition,
  type ReportItemDefinition,
  REPORTS_REGISTRY,
} from "@/app/[locale]/(admin)/admin/reports/reports-registry";
import {
  REPORT_PARAMETER_SCHEMAS,
  type ReportParameterSchema,
} from "@/app/[locale]/(admin)/admin/reports/report-parameter-schemas";`
  );

  // 2. Add state for dynamic parameters and saved options
  const stateInsertPoint = 'const [reportDepartment, setReportDepartment] = useState("All");';
  const stateAdditions = `const [reportDepartment, setReportDepartment] = useState("All");
  const [reportFormValues, setReportFormValues] = useState<Record<string, string>>({});
  const [paramValidationErrors, setParamValidationErrors] = useState<Record<string, string>>({});
  const [isOptionsSaved, setIsOptionsSaved] = useState(false);`;

  content = content.replace(stateInsertPoint, stateAdditions);

  // 3. When selectedReport changes, initialize parameter defaults from schema and localStorage
  const effectInsertPoint = 'useEffect(() => {\n    try {\n      const saved = localStorage.getItem("indiapay_reports_help_open");';
  const effectAdditions = `// Synchronize dynamic parameters when selected report changes
  useEffect(() => {
    if (!selectedReport) {
      setReportFormValues({});
      setParamValidationErrors({});
      setIsOptionsSaved(false);
      return;
    }

    const schema = REPORT_PARAMETER_SCHEMAS[selectedReport.id];
    const initialVals: Record<string, string> = {};

    // Check localStorage for saved options for this report
    let savedOpts: Record<string, string> = {};
    try {
      const stored = localStorage.getItem(\`indiapay_report_opts_\${selectedReport.id}\`);
      if (stored) savedOpts = JSON.parse(stored);
    } catch {}

    if (schema && schema.fields) {
      schema.fields.forEach((f) => {
        initialVals[f.name] = savedOpts[f.name] ?? f.defaultValue;
      });
    } else {
      initialVals["payrollMonth"] = savedOpts["payrollMonth"] ?? reportPeriodMonth;
      initialVals["department"] = savedOpts["department"] ?? reportDepartment;
    }

    setReportFormValues(initialVals);
    setParamValidationErrors({});
    setIsOptionsSaved(Object.keys(savedOpts).length > 0);
  }, [selectedReport]);

  const handleFieldChange = (name: string, val: string) => {
    setReportFormValues((prev) => ({ ...prev, [name]: val }));
    if (paramValidationErrors[name]) {
      setParamValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (name === "payrollMonth") setReportPeriodMonth(val);
    if (name === "department") setReportDepartment(val);
  };

  const handleSaveOptions = () => {
    if (!selectedReport) return;
    try {
      localStorage.setItem(
        \`indiapay_report_opts_\${selectedReport.id}\`,
        JSON.stringify(reportFormValues)
      );
      setIsOptionsSaved(true);
      setActionSuccessMsg("Report options saved successfully!");
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (err) {
      console.warn("Could not save options:", err);
    }
  };

  const handleResetOptions = () => {
    if (!selectedReport) return;
    try {
      localStorage.removeItem(\`indiapay_report_opts_\${selectedReport.id}\`);
      const schema = REPORT_PARAMETER_SCHEMAS[selectedReport.id];
      const defaults: Record<string, string> = {};
      if (schema && schema.fields) {
        schema.fields.forEach((f) => {
          defaults[f.name] = f.defaultValue;
        });
      }
      setReportFormValues(defaults);
      setIsOptionsSaved(false);
      setActionSuccessMsg("Report options reset to defaults.");
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch {}
  };

  `;

  content = content.replace(effectInsertPoint, effectAdditions + effectInsertPoint);

  // 4. Replace static filter bar with dynamic parameter form
  const oldFilterBar = `<div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Payroll Month:</span>
                    <select
                      value={reportPeriodMonth}
                      onChange={(e) => setReportPeriodMonth(e.target.value)}
                      className="rounded border border-slate-200 p-1.5 font-semibold text-slate-800 outline-none"
                    >
                      <option value="2026-11">November 2026</option>
                      <option value="2026-10">October 2026</option>
                      <option value="2026-09">September 2026</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Department:</span>
                    <select
                      value={reportDepartment}
                      onChange={(e) => setReportDepartment(e.target.value)}
                      className="rounded border border-slate-200 p-1.5 font-medium text-slate-800 outline-none"
                    >
                      <option value="All">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Customer Operations">Customer Operations</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>
                </div>`;

  const newFilterBar = `{/* Report-Specific Parameter Form */}
              <div className="px-6 py-4 border-b border-slate-200 bg-white space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Report Parameters & Filters
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveOptions}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    >
                      Save Options
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleResetOptions}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 underline cursor-pointer"
                    >
                      Reset Options
                    </button>
                  </div>
                </div>

                {/* Dynamic Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {REPORT_PARAMETER_SCHEMAS[selectedReport.id]?.fields.map((field) => (
                    <div key={field.name} className="flex flex-col gap-1">
                      <label className="text-slate-600 font-semibold text-[11px]">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      {field.type === "select" ? (
                        <select
                          value={reportFormValues[field.name] ?? field.defaultValue}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          className="w-full rounded border border-slate-200 bg-slate-50 p-1.5 font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={reportFormValues[field.name] ?? field.defaultValue}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          className="w-full rounded border border-slate-200 bg-slate-50 p-1.5 font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Output Actions & Format Bar */}
              <div className="px-6 py-2.5 border-b border-slate-100 bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-500 text-[11px]">
                  {isOptionsSaved && (
                    <span className="text-emerald-600 font-semibold">
                      ✓ Custom options loaded
                    </span>
                  )}
                </div>`;

  content = content.replace(oldFilterBar, newFilterBar);

  fs.writeFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', content, 'utf8');
  console.log('Successfully updated dashboard reports page with report-specific parameter forms');
} else {
  console.log('Already updated');
}
