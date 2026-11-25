const WebSocket = require('ws');
const fs = require('fs');

async function inspectEngageDOM() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/9BE78206571C4B838AA7D7999D0E6AE9');
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

  const expr = `(function() {
    return {
      currentUrl: window.location.href,
      title: document.title,
      bodyText: document.body.innerText.slice(0, 3000),
      buttons: Array.from(document.querySelectorAll('button, a, [role="button"]')).map(b => b.innerText.trim()).filter(Boolean).slice(0, 50),
      headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .title')).map(h => h.innerText.trim()).filter(Boolean),
    };
  })()`;

  const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  console.log('Result:', JSON.stringify(res.result.value, null, 2));
  fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/scripts/greythr_engage_dom.json', JSON.stringify(res.result.value, null, 2));
  ws.close();
}

inspectEngageDOM();
