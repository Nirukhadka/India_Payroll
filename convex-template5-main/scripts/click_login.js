const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function clickLogin() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/9BE78206571C4B838AA7D7999D0E6AE9');
  await new Promise(r => ws.on('open', r));

  function send(method, params) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.id === id) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Click the submit button
  const res = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Login'));
        if (btn) {
          btn.click();
          return 'Clicked Login button';
        }
        return 'No button found';
      })()
    `,
    returnByValue: true
  });
  console.log('Click result:', res.result ? res.result.value : res);

  // Wait 5s and check url
  setTimeout(async () => {
    const loc = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
    console.log('New URL:', loc.result.value);

    // Navigate to feeds/all
    await send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngx/feeds/all' });
    setTimeout(async () => {
      const loc2 = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
      console.log('After nav URL:', loc2.result.value);

      const snap = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-engage-feeds-1920x1080.png', Buffer.from(snap.data, 'base64'));
      fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-engage-feeds-1920x1080.png', Buffer.from(snap.data, 'base64'));
      console.log('Saved authenticated feed screenshot');
      ws.close();
      process.exit(0);
    }, 6000);
  }, 4000);
}

clickLogin();
