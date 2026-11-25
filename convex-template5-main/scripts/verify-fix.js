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
  const indiapayTab = tabs.find((t) => t.url && (t.url.includes('localhost:3000') || t.title.includes('localhost:3000')));
  if (!indiapayTab) {
    console.error('No localhost:3000 tab found');
    process.exit(1);
  }

  const ws = new WebSocket(indiapayTab.webSocketDebuggerUrl);

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
    console.log('Navigating tab to http://localhost:3000/admin/user-administration/users ...');
    await send('Page.navigate', { url: 'http://localhost:3000/admin/user-administration/users' });
    await sleep(3500);

    // Capture fresh screenshot to prove compilation success
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(600);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('docs/indiapay-useradmin-users-fixed-1920x1080.png', Buffer.from(shot.data, 'base64'));
    fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-useradmin-users-fixed-1920x1080.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved fixed screenshot!');

    // Check page text
    const res = await send('Runtime.evaluate', {
      expression: 'document.body.innerText.substring(0, 500)',
      returnByValue: true
    });
    console.log('Page Content Snippet:\n', res.result.value);

    ws.close();
    process.exit(0);
  });
}

main().catch(console.error);
