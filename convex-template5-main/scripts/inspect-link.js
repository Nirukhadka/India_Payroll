const http = require('http');
const fs = require('fs');
const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

async function main() {
  const tabs = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const tab = tabs.find(t => t.url.includes('greythr.com'));
  if (!tab) return;

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.on('open', async () => {
    try {
      await send('Page.enable');
      
      const inspectItem = `
        (() => {
          const links = Array.from(document.querySelectorAll('a, span, li'));
          const target = links.find(l => l.innerText && l.innerText.trim() === 'Salary Register');
          if (!target) return { found: false };
          
          return {
            found: true,
            tagName: target.tagName,
            href: target.getAttribute('href'),
            className: target.className,
            attributes: Array.from(target.attributes).map(a => ({ name: a.name, value: a.value })),
            parentHTML: target.parentElement ? target.parentElement.outerHTML : ''
          };
        })()
      `;

      const res = await send('Runtime.evaluate', { expression: inspectItem, returnByValue: true });
      console.log('Target item details:', JSON.stringify(res.result.value, null, 2));

      ws.close();
    } catch (err) {
      console.error(err);
      ws.close();
    }
  });

  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  });
}

main().catch(console.error);
