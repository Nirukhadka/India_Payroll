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
  if (!tab) return console.log('No greytHR tab');

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

      // Click on Salary Statement - Monthly or Salary Register to see how the workflow opens
      const clickScript = `
        (() => {
          const links = Array.from(document.querySelectorAll('a, li, tr'));
          const target = links.find(l => l.innerText.trim().includes('Salary Statement - Monthly') || l.innerText.trim().includes('Salary Register'));
          if (target) {
            target.click();
            return { found: true, text: target.innerText.trim() };
          }
          return { found: false };
        })()
      `;

      const clickRes = await send('Runtime.evaluate', { expression: clickScript, returnByValue: true });
      console.log('Click result:', clickRes.result.value);

      await new Promise(r => setTimeout(r, 4000));

      const afterUrl = await send('Runtime.evaluate', { expression: 'window.location.href' });
      console.log('URL after click:', afterUrl.result.value);

      const inspectPage = `
        (() => {
          // Check forms, inputs, buttons, modal or new view
          const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({
            name: i.name,
            id: i.id,
            type: i.type,
            placeholder: i.placeholder,
            value: i.value,
            className: i.className
          }));
          const buttons = Array.from(document.querySelectorAll('button, .btn')).map(b => b.innerText.trim());
          const title = document.querySelector('h1, h2, h3, .title, .page-title')?.innerText || '';
          
          return {
            title,
            url: window.location.href,
            inputs,
            buttons,
            bodySnippet: document.body.innerText.substring(0, 1000)
          };
        })()
      `;

      const pageRes = await send('Runtime.evaluate', { expression: inspectPage, returnByValue: true });
      console.log('Report workflow inspection:', JSON.stringify(pageRes.result.value, null, 2));

      // Navigate back to gallery
      await send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/reports/reports/reports-gallery' });
      await new Promise(r => setTimeout(r, 3000));

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
