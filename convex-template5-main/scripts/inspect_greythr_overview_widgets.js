const fs = require('fs');
const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

async function inspectDOM() {
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
    // Collect all card titles or headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .card-title, .title, [class*="heading"], [class*="title"]'))
      .map(h => ({ tag: h.tagName, text: h.innerText.trim(), class: h.className }))
      .filter(x => x.text.length > 0 && x.text.length < 60);

    // Collect top level cards/widgets
    const widgets = Array.from(document.querySelectorAll('[class*="card"], [class*="widget"], [class*="panel"], [class*="dashlet"], gt-card'))
      .map(w => ({
        class: w.className,
        text: w.innerText.trim().slice(0, 100)
      })).slice(0, 30);

    return {
      headings: headings.slice(0, 30),
      widgets: widgets
    };
  })()`;

  const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

inspectDOM().catch(console.error);
