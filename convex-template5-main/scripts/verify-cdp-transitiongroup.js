const WebSocket = require('ws');
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
      
      // Navigate to transitiongroup
      console.log('Navigating to transitiongroup...');
      await send('Page.navigate', { url: 'http://localhost:3000/admin/system-settings/employee/transitiongroup' });
      
      await new Promise(r => setTimeout(r, 3000));

      // Check for errors on page
      const evalRes = await send('Runtime.evaluate', {
        expression: 'document.body.innerText'
      });
      console.log('Page text preview:');
      const text = evalRes.result.value || '';
      console.log(text.substring(0, 300));

      const isError = text.includes('Something went wrong') || text.includes('Server Error');
      console.log('Is Error Boundary Present:', isError);

      // Capture screenshot at 1920x1080
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 500));
      const ss1920 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-settings-transitiongroup-verified-1920x1080.png',
        Buffer.from(ss1920.data, 'base64')
      );
      console.log('Saved 1920x1080 screenshot');

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
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-settings-transitiongroup-verified-1366x768.png',
        Buffer.from(ss1366.data, 'base64')
      );
      console.log('Saved 1366x768 screenshot');

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
