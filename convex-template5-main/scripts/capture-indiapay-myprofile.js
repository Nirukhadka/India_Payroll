const WebSocket = require('../node_modules/ws');
const fs = require('fs');

async function captureIndiaPayScreenshots() {
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
  console.log('Connected to IndiaPay tab');

  // Navigate to /admin/settings/profile
  await send('Page.navigate', { url: 'http://localhost:3000/admin/settings/profile' });
  await new Promise(r => setTimeout(r, 4000));

  // Set viewport to 1920x1080
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-profile-1920x1080.png', Buffer.from(shot.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-myprofile-profile-1920x1080.png', Buffer.from(shot.data, 'base64'));
  console.log('Captured indiapay profile 1920x1080');

  // Set viewport to 1366x768
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-profile-1366x768.png', Buffer.from(shot.data, 'base64'));
  console.log('Captured indiapay profile 1366x768');

  // Switch to Login History tab
  await send('Page.navigate', { url: 'http://localhost:3000/admin/settings/profile?tab=login-history' });
  await new Promise(r => setTimeout(r, 3000));

  // Set viewport to 1920x1080
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-loginhistory-1920x1080.png', Buffer.from(shot.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-myprofile-loginhistory-1920x1080.png', Buffer.from(shot.data, 'base64'));
  console.log('Captured indiapay login history 1920x1080');

  // Set viewport to 1366x768
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-loginhistory-1366x768.png', Buffer.from(shot.data, 'base64'));
  console.log('Captured indiapay login history 1366x768');

  ws.close();
}

captureIndiaPayScreenshots().catch(console.error);
