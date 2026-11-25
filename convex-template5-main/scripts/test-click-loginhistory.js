const WebSocket = require('../node_modules/ws');
const fs = require('fs');

async function testClick() {
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

  await send('Page.navigate', { url: 'https://victorchasex.greythr.com/nx/account/my-profile/profile' });
  await new Promise(r => setTimeout(r, 4000));

  const clickRes = await send('Runtime.evaluate', {
    expression: "(() => {\n" +
      "  const el = Array.from(document.querySelectorAll('a, button, li, span, div')).find(el => el.innerText.trim() === 'Login History');\n" +
      "  if (el) {\n" +
      "    el.click();\n" +
      "    return 'clicked: ' + el.tagName + ' href=' + el.getAttribute('href');\n" +
      "  }\n" +
      "  return 'not found';\n" +
      "})()",
    returnByValue: true
  });
  console.log('Click result:', clickRes.result.value);

  await new Promise(r => setTimeout(r, 4000));

  const pageText = await send('Runtime.evaluate', {
    expression: "(() => ({\n" +
      "  url: window.location.href,\n" +
      "  bodyText: document.body.innerText.slice(0, 2000),\n" +
      "  cards: Array.from(document.querySelectorAll('div, section, p, span')).filter(e => e.innerText.includes('Last Login') || e.innerText.includes('IP Address')).map(e => e.innerText.trim()).slice(0, 10)\n" +
      "}))()",
    returnByValue: true
  });
  console.log('After click page:', JSON.stringify(pageText.result.value, null, 2));

  // Capture screenshot after click!
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 1000));
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/greythr-myprofile-loginhistory-1920x1080.png', Buffer.from(shot.data, 'base64'));
  fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-myprofile-loginhistory-1920x1080.png', Buffer.from(shot.data, 'base64'));

  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  await new Promise(r => setTimeout(r, 1000));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/greythr-myprofile-loginhistory-1366x768.png', Buffer.from(shot.data, 'base64'));

  console.log('Successfully captured actual Login History screenshots!');
  ws.close();
}
testClick().catch(console.error);
