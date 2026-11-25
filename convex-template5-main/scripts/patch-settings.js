const fs = require('fs');

function patch(filePath, regex, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Patched:', filePath);
}

// 1. LOV
patch(
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/system-settings/general/lov/page.tsx',
  /const items = useQuery[\s\S]*?\|\| \[\];/,
  'let itemsData: any = undefined;\n  try { itemsData = useQuery(api.systemSettings.getListOfValues, { category: selectedCategory }); } catch (e) { itemsData = undefined; }\n  const items = itemsData || [];'
);

// 2. Bank Branch
patch(
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/system-settings/general/bank-branch/page.tsx',
  /const branches = useQuery[\s\S]*?\|\| \[\];/,
  'let branchesData: any = undefined;\n  try { branchesData = useQuery(api.systemSettings.getBankBranches, selectedBank === "All Banks" ? {} : { bankName: selectedBank }); } catch (e) { branchesData = undefined; }\n  const branches = branchesData || [];'
);

// 3. Employee No Series
patch(
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/emp-no-series/page.tsx',
  /const seriesList = useQuery[\s\S]*?\|\| \[\];/,
  'let seriesData: any = undefined;\n  try { seriesData = useQuery(api.systemSettings.getEmployeeNoSeries); } catch (e) { seriesData = undefined; }\n  const seriesList = seriesData || [];'
);

// 4. Company Bank
patch(
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/system-settings/general/company-bank/page.tsx',
  /const banks = useQuery[\s\S]*?\|\| \[\];/,
  'let banksData: any = undefined;\n  try { banksData = useQuery(api.systemSettings.getCompanyBanks); } catch (e) { banksData = undefined; }\n  const banks = banksData || [];'
);

// 5. State
patch(
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/system-settings/general/state/page.tsx',
  /const states = useQuery[\s\S]*?\|\| \[\];/,
  'let statesData: any = undefined;\n  try { statesData = useQuery(api.systemSettings.getStates, { country: selectedCountry }); } catch (e) { statesData = undefined; }\n  const states = statesData || [];'
);
