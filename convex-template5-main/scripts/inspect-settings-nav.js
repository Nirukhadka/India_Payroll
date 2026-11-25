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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const tabs = await getTabs();
  const greythrTab = tabs.find((t) => t.url && t.url.includes('victorchasex.greythr.com'));
  if (!greythrTab) {
    console.error('No greytHR tab found!');
    process.exit(1);
  }

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
    console.log('Connected to inspect nav menu items...');

    // Extract all menu headers and hover/click triggers in the settings navbar
    const script = `
      (() => {
        const triggers = Array.from(document.querySelectorAll('header, nav, [role="navigation"], .navbar, .sub-nav, .secondary-nav, .gt-sub-nav, .gt-secondary-nav'))
          .map(c => ({
            html: c.innerHTML,
            text: c.innerText
          }));

        // Find all links and menu text in top horizontal bar
        const topLinks = Array.from(document.querySelectorAll('a, button, span, div'))
          .filter(el => {
            const t = el.innerText ? el.innerText.trim() : '';
            return ['General', 'Employee', 'Payroll', 'Income Tax', 'Leave', 'Integrations', 'More', 'System Settings'].includes(t);
          })
          .map(el => ({
            tag: el.tagName,
            text: el.innerText.trim(),
            className: el.className,
            parentHTML: el.parentElement ? el.parentElement.outerHTML.substring(0, 300) : ''
          }));

        return { triggers, topLinks };
      })()
    `;

    const res = await send('Runtime.evaluate', {
      expression: script,
      returnByValue: true,
    });

    fs.writeFileSync('docs/greythr-settings-nav-elements.json', JSON.stringify(res.result.value, null, 2));
    console.log('Nav elements saved to docs/greythr-settings-nav-elements.json');

    ws.close();
    process.exit(0);
  });
}

main().catch(console.error);
