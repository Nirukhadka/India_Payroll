const WebSocket = require('../node_modules/ws');
const fs = require('fs');

async function testSingleShot() {
  const ws = new WebSocket('ws://localhost:9222/devtools/page/D4375D5F586C394D1A869853CFC737FC');
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const timer = setTimeout(() => reject(new Error('timeout ' + method)), 3000);
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === msgId) {
        clearTimeout(timer);
        ws.off('message', handler);
        resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.on('open', r));

  console.log('Sending captureScreenshot directly...');
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  console.log('Got shot, bytes:', shot.data.length);
  fs.writeFileSync('docs/indiapay-myprofile-profile-1366x768.png', Buffer.from(shot.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-myprofile-profile-1366x768.png', Buffer.from(shot.data, 'base64'));

  // Click login history tab
  await send('Runtime.evaluate', {
    expression: "document.querySelectorAll('button[role=\"tab\"]')[1].click()"
  });
  await new Promise(r => setTimeout(r, 600));

  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  console.log('Got shot2, bytes:', shot2.data.length);
  fs.writeFileSync('docs/indiapay-myprofile-loginhistory-1920x1080.png', Buffer.from(shot2.data, 'base64'));
  fs.writeFileSync('docs/indiapay-myprofile-loginhistory-1366x768.png', Buffer.from(shot2.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-myprofile-loginhistory-1920x1080.png', Buffer.from(shot2.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-myprofile-loginhistory-1366x768.png', Buffer.from(shot2.data, 'base64'));

  ws.close();
  console.log('All screenshots recorded without blocking!');
}

testSingleShot().catch(console.error);
