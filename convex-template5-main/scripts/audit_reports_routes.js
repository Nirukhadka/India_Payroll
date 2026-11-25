const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

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
    '/admin/reports',
    '/admin/reports/recent',
    '/admin/reports/querybuilder',
    '/admin/reports/analytics',
    '/reports'
  ];

  for (const r of routes) {
    await send('Page.navigate', { url: 'http://localhost:3000' + r });
    await new Promise(res => setTimeout(res, 2500));
    const evalRes = await send('Runtime.evaluate', {
      expression: `({
        url: window.location.href,
        title: document.title,
        heading: (document.querySelector('h1, h2, h3')?.innerText || 'None')
      })`,
      returnByValue: true
    });
    console.log(r, '=>', JSON.stringify(evalRes.result.value));
  }

  ws.close();
}

testRoutes();
