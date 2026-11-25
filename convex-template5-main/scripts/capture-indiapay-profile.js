const WebSocket = require('../node_modules/ws');
const fs = require('fs');

async function shotDirect() {
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
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.on('open', r));

  // 1. Profile 1920x1080
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 800));
  let s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-profile-1920x1080.png', Buffer.from(s.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-myprofile-profile-1920x1080.png', Buffer.from(s.data, 'base64'));

  // 2. Profile 1366x768
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 800));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-profile-1366x768.png', Buffer.from(s.data, 'base64'));

  // Click Login History tab in page
  await send('Runtime.evaluate', {
    expression: "(() => { const b = Array.from(document.querySelectorAll('button')).find(el => el.innerText.includes('Login History')); if (b) b.click(); })()"
  });
  await new Promise(r => setTimeout(r, 1500));

  // 3. Login History 1920x1080
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 800));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-loginhistory-1920x1080.png', Buffer.from(s.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-myprofile-loginhistory-1920x1080.png', Buffer.from(s.data, 'base64'));

  // 4. Login History 1366x768
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 800));
  s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/indiapay-myprofile-loginhistory-1366x768.png', Buffer.from(s.data, 'base64'));

  ws.close();
  console.log('Successfully captured all 4 IndiaPay screenshots!');
}

shotDirect().catch(console.error);
