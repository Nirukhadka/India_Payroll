const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const http = require('http');
const fs = require('fs');

async function main() {
  const tabs = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  if (!tab) return console.log('No localhost:3000 tab');

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
      
      // Click on Salary Statement - Monthly to open workflow
      console.log('Clicking on Salary Statement - Monthly...');
      const clickRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const items = Array.from(document.querySelectorAll('li'));
            const target = items.find(li => li.innerText.includes('Salary Statement - Monthly') || li.innerText.includes('Salary Register'));
            if (target) {
              target.click();
              return { success: true, text: target.innerText.trim() };
            }
            return { success: false };
          })()
        `,
        returnByValue: true
      });
      console.log('Click result:', clickRes.result.value);

      await new Promise(r => setTimeout(r, 1500));

      // Inspect open modal
      const modalEval = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const modal = document.querySelector('.fixed.inset-0');
            return {
              isModalOpen: !!modal,
              modalTitle: modal?.querySelector('h3')?.innerText || '',
              inputsCount: modal?.querySelectorAll('select, button, table').length || 0,
              recordsCount: modal?.querySelectorAll('tbody tr').length || 0
            };
          })()
        `,
        returnByValue: true
      });
      console.log('Modal Eval:', modalEval.result.value);

      // Capture screenshot of the open modal
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 400));
      const ssModal = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-reports-workflow-modal-1920x1080.png',
        Buffer.from(ssModal.data, 'base64')
      );
      console.log('Saved indiapay-reports-workflow-modal-1920x1080.png');

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
