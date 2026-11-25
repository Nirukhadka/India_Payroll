const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function testAllInteractiveFeatures() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/D4375D5F586C394D1A869853CFC737FC');
  await new Promise(r => ws.on('open', r));

  function send(method, params) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.id === id) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const reports = [];

  // 1. Test Overview interactions
  console.log('Testing Employee Overview...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/employee/main/overview' });
  await new Promise(r => setTimeout(r, 2000));
  const overviewRes = await send('Runtime.evaluate', {
    expression: '(() => {' +
      'const hideHelpBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Hide Help") || b.innerText.includes("Show Help"));' +
      'const hasHelpBanner = Boolean(document.querySelector(".bg-sky-50, [class*=\"help\"]"));' +
      'const monthPicker = document.querySelector("select, [class*=\"month\"]");' +
      'return { hasHelpBanner, hasHideHelpBtn: Boolean(hideHelpBtn), hasMonthPicker: Boolean(monthPicker) };' +
    '})()',
    returnByValue: true
  });
  reports.push({ test: 'Overview Interactions', result: overviewRes.result.value });

  // 2. Test Directory search & filter
  console.log('Testing Directory search & filter...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/employee/main/directory' });
  await new Promise(r => setTimeout(r, 2000));
  const dirRes = await send('Runtime.evaluate', {
    expression: '(() => {' +
      'const searchInput = document.querySelector("input[placeholder*=\\\"Search\\\"]");' +
      'const deptSelect = Array.from(document.querySelectorAll("select, button")).find(el => el.innerText?.includes("Departments") || el.value?.includes("Departments"));' +
      'const tableRows = document.querySelectorAll("tbody tr, [class*=\\\"employee-card\\\"], .border.rounded-lg");' +
      'return { hasSearch: Boolean(searchInput), hasDeptFilter: Boolean(deptSelect), rowsCount: tableRows.length };' +
    '})()',
    returnByValue: true
  });
  reports.push({ test: 'Directory Search & Filter', result: dirRes.result.value });

  // 3. Test Profile tabs & edit
  console.log('Testing Employee Profile...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/employee/information/profile' });
  await new Promise(r => setTimeout(r, 2000));
  const profRes = await send('Runtime.evaluate', {
    expression: '(() => {' +
      'const editBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Edit") || b.innerText.includes("Save"));' +
      'const tabs = Array.from(document.querySelectorAll("button, a")).filter(b => ["Overview", "Personal Details", "Employment", "Statutory"].includes(b.innerText.trim()));' +
      'return { hasEditButton: Boolean(editBtn), tabsCount: tabs.length };' +
    '})()',
    returnByValue: true
  });
  reports.push({ test: 'Profile Tabs & Edit', result: profRes.result.value });

  // 4. Test Bank/PF/ESI masking toggle
  console.log('Testing Bank/PF/ESI masking toggle...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/employee/information/bank-pf-esi' });
  await new Promise(r => setTimeout(r, 2000));
  const bankRes = await send('Runtime.evaluate', {
    expression: '(() => {' +
      'const toggleMaskBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Mask") || b.innerText.includes("Show") || b.innerText.includes("Hide"));' +
      'return { hasToggleMask: Boolean(toggleMaskBtn) };' +
    '})()',
    returnByValue: true
  });
  reports.push({ test: 'Bank/PF/ESI Masking', result: bankRes.result.value });

  // 5. Test Excel Import simulation
  console.log('Testing Excel Import...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/employee/admin-ops/excel-import' });
  await new Promise(r => setTimeout(r, 2000));
  const excelRes = await send('Runtime.evaluate', {
    expression: '(() => {' +
      'const uploadArea = document.querySelector("input[type=\\\"file\\\"], [class*=\\\"upload\\\"], [class*=\\\"drop\\\"]");' +
      'const importBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Validate") || b.innerText.includes("Import"));' +
      'return { hasUploadArea: Boolean(uploadArea), hasImportBtn: Boolean(importBtn) };' +
    '})()',
    returnByValue: true
  });
  reports.push({ test: 'Excel Import Workflow', result: excelRes.result.value });

  console.log('Interactive Functional Report:', JSON.stringify(reports, null, 2));
  fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-employee-reference/phase-10/interactive-test-results.json', JSON.stringify(reports, null, 2));
  ws.close();
}

testAllInteractiveFeatures().catch(console.error);
