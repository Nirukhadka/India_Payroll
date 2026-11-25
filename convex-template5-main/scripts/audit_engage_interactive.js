const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

async function checkEngageInteractive() {
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

  await send('Page.navigate', { url: 'http://localhost:3000/engage' });
  await new Promise(r => setTimeout(r, 2500));

  const evalRes = await send('Runtime.evaluate', {
    expression: `({
      greeting: document.querySelector('h1')?.innerText,
      tiles: Array.from(document.querySelectorAll('[data-testid*="tile"]')).map(t => t.innerText.replace(/\\n/g, ' ')),
      cardsCount: document.querySelectorAll('.rounded-xl.border').length,
      firstCardText: document.querySelector('.p-5')?.innerText.slice(0, 100)
    })`,
    returnByValue: true
  });
  console.log('Engage Interactive audit:', JSON.stringify(evalRes.result.value, null, 2));

  ws.close();
}

checkEngageInteractive();
