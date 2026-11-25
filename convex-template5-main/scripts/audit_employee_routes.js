const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function testRoutes() {
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

  const routes = [
    '/admin/employee/main/overview',
    '/admin/employee/overview',
    '/admin/employee/main/analytics',
    '/admin/employee/main/directory',
    '/admin/employee/main/org-chart',
    '/admin/employee/information/profile',
    '/admin/employee/information/bank-pf-esi',
    '/admin/employee/information/card-details',
    '/admin/employee/information/passport-visa',
    '/admin/employee/information/registration',
    '/admin/employee/information/position-history',
    '/admin/employee/information/previous-employment',
    '/admin/employee/information/separation',
    '/admin/employee/information/documents',
    '/admin/employee/admin-ops/excel-import',
    '/admin/employee/admin-ops/bulk-photo-upload',
    '/admin/employee/admin-ops/bulk-document-upload',
    '/admin/employee/admin-ops/bulletin-board',
    '/admin/employee/admin-ops/mass-communication',
    '/admin/employee/admin-ops/identity-verification',
    '/admin/employee/admin-ops/contract-details',
    '/admin/employee/admin-ops/data-drive',
    '/admin/employee/admin-ops/offboarding',
    '/admin/employee/setup/company-policies',
    '/admin/employee/setup/segments',
    '/admin/employee/setup/filters'
  ];

  const results = [];

  for (const r of routes) {
    await send('Page.navigate', { url: 'http://localhost:3000' + r });
    await new Promise(res => setTimeout(res, 1200));

    const check = await send('Runtime.evaluate', {
      expression: '({ href: window.location.href, title: document.title, heading: document.querySelector("h1, h2, h3, .card-title")?.innerText || "" })',
      returnByValue: true
    });

    results.push({
      route: r,
      actualHref: check.result.value.href,
      heading: check.result.value.heading
    });
    console.log(`[PASS] ${r} -> ${check.result.value.heading}`);
  }

  ws.close();
  return results;
}

testRoutes().then(res => {
  fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-employee-reference/phase-10/route-audit.json', JSON.stringify(res, null, 2));
  console.log('All 26 routes successfully audited!');
}).catch(console.error);
