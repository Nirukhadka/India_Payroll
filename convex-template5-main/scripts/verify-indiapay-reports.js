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
  if (!tab) {
    console.log('No tab found on localhost:3000');
    return;
  }
  console.log('Attaching to tab:', tab.id, tab.url);

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
      
      console.log('Navigating to http://localhost:3000/reports...');
      await send('Page.navigate', { url: 'http://localhost:3000/reports' });
      await new Promise(r => setTimeout(r, 4000));

      // Check text and structure
      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            return {
              url: window.location.href,
              title: document.title,
              bodyLength: document.body.innerText.length,
              preview: document.body.innerText.substring(0, 500),
              hasReportsGallery: document.body.innerText.includes('Reports Gallery'),
              hasPayrollPayout: document.body.innerText.includes('Payroll Payout'),
              hasPF: document.body.innerText.includes('Provident Fund'),
              hasHelpBanner: document.body.innerText.includes('Explore the Reports Gallery page with Help-Doc')
            };
          })()
        `,
        returnByValue: true
      });
      console.log('Page Evaluation:', evalRes.result.value);

      // Capture screenshot at 1920x1080 (top)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 500));
      const ss1920 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-reports-gallery-1920x1080.png',
        Buffer.from(ss1920.data, 'base64')
      );
      console.log('Saved indiapay-reports-gallery-1920x1080.png');

      // Capture screenshot at 1366x768
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 500));
      const ss1366 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-reports-gallery-1366x768.png',
        Buffer.from(ss1366.data, 'base64')
      );
      console.log('Saved indiapay-reports-gallery-1366x768.png');

      ws.close();
    } catch (err) {
      console.error('CDP Error:', err);
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
