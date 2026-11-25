const fs = require('fs');
const path = require('path');

const base = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/workflow';

const modules = [
  { dir: 'leave-comp-off', fn: 'LeaveCompOffWorkflowPage', name: 'Leave Comp Off', id: 'leave-comp-off', desc: 'Compensatory off grant and approval workflow' },
  { dir: 'leave-cancel', fn: 'LeaveCancelWorkflowPage', name: 'Leave Cancel', id: 'leave-cancel', desc: 'Employee leave cancellation requests and approval rules' },
  { dir: 'help-desk', fn: 'HelpDeskWorkflowPage', name: 'Help Desk', id: 'help-desk', desc: 'Internal HR and employee query escalation tickets' },
  { dir: 'rh-leave', fn: 'RestrictedHolidayWorkflowPage', name: 'Restricted Holiday Leave', id: 'rh-leave', desc: 'Restricted holiday request and allocation review' },
  { dir: 'employee-onboarding', fn: 'EmployeeOnboardingWorkflowPage', name: 'Employee Onboarding', id: 'employee-onboarding', desc: 'New hire task checklist and documentation approval' },
  { dir: 'resignation', fn: 'ResignationWorkflowPage', name: 'Resignation', id: 'resignation', desc: 'Employee exit, resignation submissions, and notice period review' },
  { dir: 'confirmation', fn: 'ConfirmationWorkflowPage', name: 'Confirmation', id: 'confirmation', desc: 'Probation assessment, performance review, and confirmation sign-off' }
];

modules.forEach(sub => {
  const subDir = path.join(base, sub.dir);
  if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });

  const content = `"use client";

import { GenericWorkflowTemplate } from "../generic-workflow-template";

export default function ${sub.fn}() {
  return (
    <GenericWorkflowTemplate
      moduleName="${sub.name}"
      moduleId="${sub.id}"
      description="${sub.desc}"
    />
  );
}
`;
  fs.writeFileSync(path.join(subDir, 'page.tsx'), content);
  console.log('Created workflow page for:', sub.fn);
});

// Setup submodules
const setupModules = [
  { dir: 'setup/delegates', fn: 'WorkflowDelegatesPage', name: 'Workflow Delegates', desc: 'Assign delegate approvers during manager absence' },
  { dir: 'setup/reviewer-types', fn: 'WorkflowReviewerTypesPage', name: 'Workflow Reviewers Types', desc: 'Configure reviewer roles: Manager, Dept Head, HR Admin' },
  { dir: 'setup/levels', fn: 'WorkflowLevelsPage', name: 'Workflow Levels', desc: 'Define multi-level escalation thresholds and approval steps' }
];

setupModules.forEach(sub => {
  const subDir = path.join(base, sub.dir);
  if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });

  const content = `"use client";

import { GenericWorkflowTemplate } from "../../generic-workflow-template";

export default function ${sub.fn}() {
  return (
    <GenericWorkflowTemplate
      moduleName="${sub.name}"
      moduleId="setup"
      description="${sub.desc}"
    />
  );
}
`;
  fs.writeFileSync(path.join(subDir, 'page.tsx'), content);
  console.log('Created workflow setup page for:', sub.fn);
});
