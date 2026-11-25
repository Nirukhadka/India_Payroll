const path = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/scripts/cdp-indiapay';
const { getIndiaPayTab, CDPClient } = require(path);

async function checkPages() {
  const wsUrl = await getIndiaPayTab();
  const client = new CDPClient(wsUrl);
  await client.connect();

  const pages = [
    '/admin/system-settings/general/lov',
    '/admin/system-settings/general/bank-branch',
    '/admin/system-settings/general/company-bank',
    '/admin/system-settings/general/state',
    '/admin/system-settings/employee/emp-no-series'
  ];

  for (const p of pages) {
    await client.send('Page.navigate', { url: 'http://localhost:3000' + p });
    await new Promise(r => setTimeout(r, 3000));
    const res = await client.send('Runtime.evaluate', {
      expression: 'document.body.innerText.slice(0, 200).replace(/\\n+/g, " ")',
      returnByValue: true
    });
    console.log(p, '->', res.result.value);
  }
  client.close();
}

checkPages().catch(console.error);
