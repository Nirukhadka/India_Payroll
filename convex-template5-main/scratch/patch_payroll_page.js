const fs = require('fs');
const file = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/payroll/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Ensure useMutation is imported
if (!content.includes('useMutation,')) {
  content = content.replace('useQuery', 'useMutation, useQuery');
}

// 2. Add Loader2 to lucide imports
if (!content.includes('Loader2,')) {
  content = content.replace('Unlock,', 'Unlock,\n  Loader2,');
}

// 3. Replace local state with Convex persistent queries & mutations
const oldStateBlock = `  // Interactive control states matching greytHR operational toggles
  const [payrollInputsLocked, setPayrollInputsLocked] = useState(true);
  const [employeeViewReleased, setEmployeeViewReleased] = useState(true);
  const [itStatementReleased, setItStatementReleased] = useState(true);
  const [payrollLocked, setPayrollLocked] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);`;

const newStateBlock = `  // Active month period format (e.g., "2026-11")
  const periodMonth = "2026-11";

  // Real Convex query for persistent payroll controls
  const controls = useQuery(
    api.payrollLifecycle.getPayrollControls,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId, periodMonth } : "skip"
  );

  // Real Convex query for operational exceptions & payout pending
  const exceptions = useQuery(
    api.payrollLifecycle.getPayrollOperationalExceptions,
    effectiveWorkspaceId ? { workspaceId: effectiveWorkspaceId, periodMonth } : "skip"
  );

  const updateControl = useMutation(api.payrollLifecycle.updatePayrollControl);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const payrollInputsLocked = controls?.payrollInputsLocked ?? true;
  const employeeViewReleased = controls?.employeeViewReleased ?? true;
  const itStatementReleased = controls?.itStatementReleased ?? true;
  const payrollLocked = controls?.payrollLocked ?? true;

  const handleToggle = async (
    field: "payrollInputsLocked" | "employeeViewReleased" | "itStatementReleased" | "payrollLocked",
    val: boolean,
    label: string
  ) => {
    if (!effectiveWorkspaceId) return;
    try {
      await updateControl({
        workspaceId: effectiveWorkspaceId,
        periodMonth,
        field,
        value: val,
      });
      showToast(label);
    } catch (err: unknown) {
      showToast((err as Error)?.message || "Failed to update control");
    }
  };`;

if (content.includes(oldStateBlock)) {
  content = content.replace(oldStateBlock, newStateBlock);
} else {
  console.log("oldStateBlock not found in page.tsx");
}

// 4. Update the toggle click handlers
content = content.replace(
  `onClick={() => {
                      setPayrollInputsLocked(false);
                      showToast("Payroll inputs unlocked");
                    }}`,
  `onClick={() => handleToggle("payrollInputsLocked", false, "Payroll inputs unlocked")}`
);
content = content.replace(
  `onClick={() => {
                      setPayrollInputsLocked(true);
                      showToast("Payroll inputs locked");
                    }}`,
  `onClick={() => handleToggle("payrollInputsLocked", true, "Payroll inputs locked")}`
);

content = content.replace(
  `onClick={() => {
                      setEmployeeViewReleased(true);
                      showToast("Employee payslip view released");
                    }}`,
  `onClick={() => handleToggle("employeeViewReleased", true, "Employee payslip view released")}`
);
content = content.replace(
  `onClick={() => {
                      setEmployeeViewReleased(false);
                      showToast("Employee payslip view held");
                    }}`,
  `onClick={() => handleToggle("employeeViewReleased", false, "Employee payslip view held")}`
);

content = content.replace(
  `onClick={() => {
                      setItStatementReleased(true);
                      showToast("IT statement employee view released");
                    }}`,
  `onClick={() => handleToggle("itStatementReleased", true, "IT statement employee view released")}`
);
content = content.replace(
  `onClick={() => {
                      setItStatementReleased(false);
                      showToast("IT statement employee view held");
                    }}`,
  `onClick={() => handleToggle("itStatementReleased", false, "IT statement employee view held")}`
);

content = content.replace(
  `onClick={() => {
                      setPayrollLocked(false);
                      showToast("Payroll unlocked");
                    }}`,
  `onClick={() => handleToggle("payrollLocked", false, "Payroll unlocked")}`
);
content = content.replace(
  `onClick={() => {
                      setPayrollLocked(true);
                      showToast("Payroll locked");
                    }}`,
  `onClick={() => handleToggle("payrollLocked", true, "Payroll locked")}`
);

// 5. Wire up the Lower 6-Card Operational Grid to dynamic exceptions data
const oldLowerGrid = `{/* Lower 6-Card Operational Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Negative Salary */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Negative Salary
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              No Records
            </div>
          </div>

          {/* Card 2: Hold Salary Payout */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Hold Salary Payout
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              No Records
            </div>
          </div>

          {/* Card 3: Stop Salary Processing */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Stop Salary Processing
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              No Records
            </div>
          </div>

          {/* Card 4: Payout Pending */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Payout Pending
            </h4>
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-baseline justify-between border-b border-slate-50 pb-1.5">
                <span className="text-[12px] text-[#5A6A7C]">
                  Bank Transfer(Net Pay)
                </span>
                <span className="text-base font-bold text-[#0d6efd]">31</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-[#5A6A7C]">Cash</span>
                <span className="text-base font-bold text-[#0d6efd]">2</span>
              </div>
            </div>
          </div>

          {/* Card 5: Settled Employees */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Settled Employees
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              No Records
            </div>
          </div>

          {/* Card 6: Locations Without PT State */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Locations Without PT State
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              No Records
            </div>
          </div>
        </div>`;

const newLowerGrid = `{/* Lower 6-Card Operational Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Negative Salary */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Negative Salary
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              {exceptions === undefined ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : exceptions.negativeSalaryCount > 0 ? (
                <span className="text-base font-bold text-red-600">
                  {exceptions.negativeSalaryCount} Records
                </span>
              ) : (
                "No Records"
              )}
            </div>
          </div>

          {/* Card 2: Hold Salary Payout */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Hold Salary Payout
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              {exceptions === undefined ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : exceptions.holdSalaryCount > 0 ? (
                <span className="text-base font-bold text-amber-600">
                  {exceptions.holdSalaryCount} Records
                </span>
              ) : (
                "No Records"
              )}
            </div>
          </div>

          {/* Card 3: Stop Salary Processing */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Stop Salary Processing
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              {exceptions === undefined ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : exceptions.stopProcessingCount > 0 ? (
                <span className="text-base font-bold text-red-500">
                  {exceptions.stopProcessingCount} Records
                </span>
              ) : (
                "No Records"
              )}
            </div>
          </div>

          {/* Card 4: Payout Pending */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Payout Pending
            </h4>
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-baseline justify-between border-b border-slate-50 pb-1.5">
                <span className="text-[12px] text-[#5A6A7C]">
                  Bank Transfer(Net Pay)
                </span>
                <span className="text-base font-bold text-[#0d6efd]">
                  {exceptions === undefined ? "—" : exceptions.payoutPendingBankCount}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-[#5A6A7C]">Cash</span>
                <span className="text-base font-bold text-[#0d6efd]">
                  {exceptions === undefined ? "—" : exceptions.payoutPendingCashCount}
                </span>
              </div>
            </div>
          </div>

          {/* Card 5: Settled Employees */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Settled Employees
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              {exceptions === undefined ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : exceptions.settledEmployeesCount > 0 ? (
                <span className="text-base font-bold text-slate-700">
                  {exceptions.settledEmployeesCount} Settled
                </span>
              ) : (
                "No Records"
              )}
            </div>
          </div>

          {/* Card 6: Locations Without PT State */}
          <div className="rounded border border-[#E4E9F0] bg-white p-4 shadow-2xs min-h-[140px] flex flex-col">
            <h4 className="text-xs font-semibold text-[#5A6A7C] border-b border-[#F0F2F5] pb-2">
              Locations Without PT State
            </h4>
            <div className="flex-1 flex items-center justify-center text-xs text-[#7F8FA4]">
              No Records
            </div>
          </div>
        </div>`;

if (content.includes(oldLowerGrid)) {
  content = content.replace(oldLowerGrid, newLowerGrid);
} else {
  console.log("oldLowerGrid not found in page.tsx");
}

fs.writeFileSync(file, content, 'utf8');
console.log("Successfully updated admin/payroll/page.tsx with Convex controls and dynamic exceptions!");
