const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function inspectRepute() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/5F9B6E2B2C049CD45DCAF33A52E88E0F');
  ws.on('open', () => {
    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (data) => {
          const res = JSON.parse(data);
          if (res.id === id) {
            ws.off('message', handler);
            resolve(res.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    (async () => {
      await send('Page.enable');
      const dom = await send('Runtime.evaluate', {
        expression: `JSON.stringify({
          title: document.title,
          url: window.location.href,
          text: document.body.innerText.slice(0, 4000),
          headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, button, [role="tab"]')).map(el => el.innerText.trim()).filter(Boolean)
        })`,
        returnByValue: true
      });
      console.log('Repute Content:', dom.result.value);
      ws.close();
    })();
  });
}
inspectRepute();
