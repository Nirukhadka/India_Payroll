const WebSocket = require('../node_modules/ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:9222/devtools/page/D4375D5F586C394D1A869853CFC737FC');
let id = 1;
const send = (method, params = {}) => new Promise((resolve) => {
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
  // 1920x1080
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-profile-1920x1080.png', Buffer.from(shot.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-myprofile-profile-1920x1080.png', Buffer.from(shot.data, 'base64'));

  // 1366x768
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-profile-1366x768.png', Buffer.from(shot.data, 'base64'));

  // Click login history
  await send('Runtime.evaluate', {
    expression: 'document.querySelectorAll("button[role=tab]")[1].click()'
  });

  setTimeout(async () => {
    // 1920x1080
    await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    let s2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('docs/indiapay-myprofile-loginhistory-1920x1080.png', Buffer.from(s2.data, 'base64'));
    fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-myprofile-loginhistory-1920x1080.png', Buffer.from(s2.data, 'base64'));

    // 1366x768
    await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
    s2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('docs/indiapay-myprofile-loginhistory-1366x768.png', Buffer.from(s2.data, 'base64'));

    ws.close();
    console.log('Done captures successfully!');
    process.exit(0);
  }, 1000);
});
