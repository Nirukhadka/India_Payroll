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
      
      const inspectReportUI = `
        (() => {
          return {
            url: window.location.href,
            title: document.title,
            bodyText: document.body.innerText.substring(0, 2000),
            formHTML: document.querySelector('form')?.outerHTML || '',
            buttons: Array.from(document.querySelectorAll('button, .btn, input[type=\"button\"], input[type=\"submit\"]')).map(b => ({
              text: b.innerText || b.value,
              className: b.className
            })),
            inputs: Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({
              name: i.name,
              id: i.id,
              type: i.type,
              label: i.closest('.control-group, .form-group, .field')?.querySelector('label')?.innerText || ''
            }))
          };
        })()
      `;

      const res = await send('Runtime.evaluate', { expression: inspectReportUI, returnByValue: true });
      console.log('Report UI inspection:', JSON.stringify(res.result.value, null, 2));

      // Capture screenshot of the report UI
      const ss = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-report-ui-reference.png',
        Buffer.from(ss.data, 'base64')
      );
      console.log('Saved greythr-report-ui-reference.png');

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
