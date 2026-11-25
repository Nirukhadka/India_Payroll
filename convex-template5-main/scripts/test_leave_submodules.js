const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

async function testLeaveSubmodules() {
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
    '/admin/leave/overview',
    '/admin/leave/leave-calendar',
    '/admin/leave/employee-leave',
    '/admin/leave/leave-granter',
    '/admin/leave/year-end-process',
    '/admin/leave/leave-recalculator',
    '/admin/leave/holiday-list',
    '/admin/leave/weekend-override',
    '/admin/leave/employee-week-days',
    '/admin/leave/leave-type-reviewer'
  ];

  for (const r of routes) {
    await send('Page.navigate', { url: 'http://localhost:3000' + r });
    await new Promise(res => setTimeout(res, 1200));
    const check = await send('Runtime.evaluate', {
      expression: '({ href: window.location.href, title: document.title, heading: (document.querySelector("h2, h3") ? document.querySelector("h2, h3").innerText : "") })',
      returnByValue: true
    });
    console.log(`[PASS] ${r} -> ${check.result.value.heading}`);
  }

  ws.close();
}

testLeaveSubmodules().catch(console.error);
