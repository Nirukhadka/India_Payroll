const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

async function inspectWorkflowDOM() {
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

  const expr = `(() => {
    return {
      buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean),
      links: Array.from(document.querySelectorAll('a')).map(a => a.innerText.trim()).filter(Boolean),
      headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, [class*="heading"], [class*="title"]')).map(h => h.innerText.trim()).filter(Boolean)
    };
  })()`;

  const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

inspectWorkflowDOM().catch(console.error);
