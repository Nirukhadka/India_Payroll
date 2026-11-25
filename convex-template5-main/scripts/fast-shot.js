const WebSocket = require('../node_modules/ws');
const fs = require('fs');

async function shot(url, path1080, path768) {
  const ws = new WebSocket('ws://localhost:9222/devtools/page/D4375D5F586C394D1A869853CFC737FC');
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === msgId) {
        ws.off('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.on('open', r));

  console.log('Navigating to', url);
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2000));

  // 1920x1080
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 500));
  let s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path1080, Buffer.from(s.data, 'base64'));

  // 1366x768
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 500));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path768, Buffer.from(s.data, 'base64'));

  ws.close();
  console.log('Saved:', path1080, path768);
}

async function run() {
  await shot('http://localhost:3000/admin/settings/profile', 'docs/indiapay-myprofile-profile-1920x1080.png', 'docs/indiapay-myprofile-profile-1366x768.png');
  await shot('http://localhost:3000/admin/settings/profile?tab=login-history', 'docs/indiapay-myprofile-loginhistory-1920x1080.png', 'docs/indiapay-myprofile-loginhistory-1366x768.png');
}

run().catch(console.error);
