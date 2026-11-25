const fs = require('fs');
const path = require('path');

const base = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/leave';

const submodules = [
  { dir: 'leave-calendar', fn: 'LeaveCalendarPage', title: 'Leave Calendar', category: 'leave', desc: 'Organization-wide employee leave calendar view' },
  { dir: 'employee-leave', fn: 'EmployeeLeavePage', title: 'Employee Leave', category: 'leave', desc: 'Employee leave application, balance records and approval history' },
  { dir: 'leave-granter', fn: 'LeaveGranterPage', title: 'Leave Granter', category: 'leave', desc: 'Periodic leave allotment, quota grant rules and accrual processing' },
  { dir: 'year-end-process', fn: 'YearEndProcessPage', title: 'Year End Process', category: 'leave', desc: 'Annual leave lapse, carry forward calculations and encashment processing' },
  { dir: 'leave-recalculator', fn: 'LeaveRecalculatorPage', title: 'Leave Recalculator', category: 'leave', desc: 'Leave balance adjustment and attendance recalculation engine' },
  { dir: 'holiday-list', fn: 'HolidayListPage', title: 'Holiday List', category: 'admin-tools', desc: 'Public holidays, national holidays and optional festival calendar' },
  { dir: 'weekend-override', fn: 'WeekendOverridePage', title: 'Weekend Override', category: 'admin-tools', desc: 'Custom working weekends and company holiday adjustments' },
  { dir: 'employee-week-days', fn: 'EmployeeWeekDaysPage', title: 'Employee Week Days', category: 'admin-tools', desc: 'Work week schedules, general shifts and weekly off configurations' },
  { dir: 'leave-type-reviewer', fn: 'LeaveTypeReviewerPage', title: 'Leave Type Reviewer', category: 'admin-tools', desc: 'Statutory leave category audit and policy definition reviewer' }
];

submodules.forEach(sub => {
  const subDir = path.join(base, sub.dir);
  if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });

  const content = `"use client";

import { GenericLeaveTemplate } from "../generic-leave-template";

export default function ${sub.fn}() {
  return (
    <GenericLeaveTemplate
      category="${sub.category}"
      title="${sub.title}"
      description="${sub.desc}"
    />
  );
}
`;
  fs.writeFileSync(path.join(subDir, 'page.tsx'), content);
  console.log('Fixed page for:', sub.fn);
});
