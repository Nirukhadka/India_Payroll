const WebSocket = require('../node_modules/ws');
const fs = require('fs');

async function inspectLoginHistory() {
  const ws = new WebSocket('ws://localhost:9222/devtools/page/65018565560D5CF271F5DD2BD60464E5');
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

  console.log('Navigating to login history in greytHR...');
  await send('Page.navigate', { url: 'https://victorchasex.greythr.com/nx/account/my-profile/login-history' });
  await new Promise(r => setTimeout(r, 6000));

  const details = await send('Runtime.evaluate', {
    expression: "(() => ({ url: window.location.href, bodyText: document.body.innerText.slice(0, 2000), htmlSnippet: document.querySelector('.main-content, main, [class*=\"content\"], [class*=\"page\"]')?.innerHTML?.slice(0, 2000) }))()",
    returnByValue: true
  });
  console.log('Login History Data:', JSON.stringify(details.result.value, null, 2));

  // Take fresh high-res screenshots
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/greythr-myprofile-loginhistory-1920x1080.png', Buffer.from(shot.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-myprofile-loginhistory-1920x1080.png', Buffer.from(shot.data, 'base64'));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 1000));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/greythr-myprofile-loginhistory-1366x768.png', Buffer.from(shot.data, 'base64'));

  // Also navigate to profile and take fresh 1920 & 1366
  await send('Page.navigate', { url: 'https://victorchasex.greythr.com/nx/account/my-profile/profile' });
  await new Promise(r => setTimeout(r, 5000));
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/greythr-myprofile-profile-1920x1080.png', Buffer.from(shot.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-myprofile-profile-1920x1080.png', Buffer.from(shot.data, 'base64'));

  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/greythr-myprofile-profile-1366x768.png', Buffer.from(shot.data, 'base64'));

  ws.close();
  console.log('Finished capturing My Profile tabs.');
}

inspectLoginHistory().catch(console.error);
