const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

async function checkSeparation() {
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

  console.log('Navigating to separation page...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/employee/information/separation' });
  await new Promise(res => setTimeout(res, 6000));

  const check = await send('Runtime.evaluate', {
    expression: '({ href: window.location.href, title: document.title, text: document.body.innerText.slice(0, 400) })',
    returnByValue: true
  });

  console.log('Result:', JSON.stringify(check.result.value, null, 2));
  ws.close();
}

checkSeparation().catch(console.error);
