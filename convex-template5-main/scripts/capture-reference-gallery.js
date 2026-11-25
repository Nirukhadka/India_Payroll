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
      
      // Navigate back to reports-gallery
      await send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/reports/reports/reports-gallery' });
      await new Promise(r => setTimeout(r, 4000));

      // Capture screenshot at 1920x1080 (top)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 500));
      const ss1 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-reports-gallery-top-1920x1080.png',
        Buffer.from(ss1.data, 'base64')
      );
      console.log('Saved greythr-reports-gallery-top-1920x1080.png');

      // Scroll to mid
      await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1000)' });
      await new Promise(r => setTimeout(r, 500));
      const ss2 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-reports-gallery-mid-1920x1080.png',
        Buffer.from(ss2.data, 'base64')
      );
      console.log('Saved greythr-reports-gallery-mid-1920x1080.png');

      // Scroll to bottom
      await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 2500)' });
      await new Promise(r => setTimeout(r, 500));
      const ss3 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-reports-gallery-bottom-1920x1080.png',
        Buffer.from(ss3.data, 'base64')
      );
      console.log('Saved greythr-reports-gallery-bottom-1920x1080.png');

      // Scroll back to top
      await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });

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
