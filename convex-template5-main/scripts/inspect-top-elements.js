const WebSocket = require('../node_modules/ws');
const http = require('http');
const fs = require('fs');

async function getTabs() {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
}

async function main() {
  const tabs = await getTabs();
  const greythrTab = tabs.find((t) => t.url && t.url.includes('victorchasex.greythr.com'));
  const ws = new WebSocket(greythrTab.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const msgId = id++;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === msgId) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.send(JSON.stringify({ id: msgId, method, params }));
      ws.on('message', handler);
    });

  ws.on('open', async () => {
    const script = `
      (() => {
        // Collect all visible text nodes in top 200px
        const elements = Array.from(document.querySelectorAll('*')).filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 180 && el.children.length === 0 && el.innerText && el.innerText.trim();
        }).map(el => ({
          tag: el.tagName,
          text: el.innerText.trim(),
          top: el.getBoundingClientRect().top,
          left: el.getBoundingClientRect().left,
          className: el.className
        }));

        // Look for angular component tags or custom elements
        const customElements = Array.from(document.querySelectorAll('*'))
          .map(el => el.tagName.toLowerCase())
          .filter(t => t.includes('-') || t.startsWith('gt') || t.startsWith('ng'));

        return { elements, customElements: [...new Set(customElements)] };
      })()
    `;

    const res = await send('Runtime.evaluate', {
      expression: script,
      returnByValue: true,
    });

    console.log(JSON.stringify(res.result.value, null, 2));
    ws.close();
    process.exit(0);
  });
}

main().catch(console.error);
