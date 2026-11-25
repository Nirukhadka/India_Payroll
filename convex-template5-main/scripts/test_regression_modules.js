const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

async function testRegression() {
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

  const modules = [
    { name: 'Admin Welcome & Dashboard', url: 'http://localhost:3000/admin' },
    { name: 'Payroll Overview', url: 'http://localhost:3000/admin/payroll' },
    { name: 'Employee ESS Portal', url: 'http://localhost:3000/my-portal' },
    { name: 'Employee Overview', url: 'http://localhost:3000/admin/employee/main/overview' },
    { name: 'Employee Directory', url: 'http://localhost:3000/admin/employee/main/directory' }
  ];

  for (const m of modules) {
    await send('Page.navigate', { url: m.url });
    await new Promise(res => setTimeout(res, 1800));

    const check = await send('Runtime.evaluate', {
      expression: '({ href: window.location.href, title: document.title, bodyLength: document.body.innerText.length })',
      returnByValue: true
    });
    console.log(`[PASS] ${m.name}: ${check.result.value.href} (Text length: ${check.result.value.bodyLength})`);
  }

  ws.close();
}

testRegression().catch(console.error);
