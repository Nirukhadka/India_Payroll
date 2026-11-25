const fs = require('fs');

let content = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');

// Check if recordExecutionMutation is already there
if (!content.includes('recordReportExecution')) {
  content = content.replace(
    'const [isExporting, setIsExporting] = useState(false);',
    `const [isExporting, setIsExporting] = useState(false);

  // Mutation to record report execution for Recent Reports
  let recordReportExecutionMutation: any = null;
  try {
    recordReportExecutionMutation = useMutation(api.reports.recordReportExecution);
  } catch {
    recordReportExecutionMutation = null;
  }`
  );

  // In handleExecuteExport, record the execution
  const exportTarget = 'setActionSuccessMsg(`Report exported successfully as ${exportFormat}!`);';
  const exportReplacement = `// Record execution in Convex for Recent Reports
      if (recordReportExecutionMutation && effectiveWorkspaceId) {
        try {
          await recordReportExecutionMutation({
            workspaceId: effectiveWorkspaceId,
            reportId: selectedReport.id,
            reportName: selectedReport.name,
            category: selectedReport.category,
            parameters: JSON.stringify({
              periodMonth: reportPeriodMonth,
              department: reportDepartment,
            }),
            format: exportFormat,
            status: "completed",
            rowCount: rows.length,
            fileSizeKb: Math.max(1, Math.round(csvContent.length / 1024)),
          });
        } catch (recErr) {
          console.warn("Could not log report run:", recErr);
        }
      }

      setActionSuccessMsg(\`Report exported successfully as \${exportFormat}!\`);`;

  content = content.replace(exportTarget, exportReplacement);
  fs.writeFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', content, 'utf8');
  console.log('Successfully enhanced (dashboard)/reports/page.tsx with recordReportExecution');
} else {
  console.log('Already enhanced');
}
