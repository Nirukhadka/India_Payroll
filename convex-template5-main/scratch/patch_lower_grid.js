const fs = require('fs');
const file = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/payroll/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const startTag = "{/* Lower 6-Card Operational Grid */}";
const endTag = "{/* 7. Floating Purple";

const startIdx = content.indexOf(startTag);
const endIdx = content.indexOf(endTag);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `{/* Lower 6-Card Operational Grid */}
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
                  {exceptions === undefined ? (
                    <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                  ) : (
                    exceptions.payoutPendingBankCount
                  )}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-[#5A6A7C]">Cash</span>
                <span className="text-base font-bold text-[#0d6efd]">
                  {exceptions === undefined ? (
                    <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                  ) : (
                    exceptions.payoutPendingCashCount
                  )}
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
        </div>
      </main>

      `;
  content = content.slice(0, startIdx) + replacement + content.slice(endIdx);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Successfully replaced lower grid with dynamic exception cards!");
} else {
  console.error("Could not find startIdx or endIdx");
}
