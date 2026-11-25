const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/F9A51BC9318EED2E5198A7CB3401D0FB');

ws.on('open', () => {
  // First evaluate clicking the Welcome tab
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const welcomeTab = Array.from(document.querySelectorAll('a, button, li, span, div')).find(el => el.textContent.trim() === 'Welcome');
        if (welcomeTab) {
          welcomeTab.click();
          return 'clicked welcome';
        }
        return 'not found';
      })()`,
      returnByValue: true
    }
  }));
});

let step = 1;
ws.on('message', (data) => {
  const res = JSON.parse(data);
  if (res.id === 1) {
    console.log('Click result:', res.result.result.value);
    setTimeout(() => {
      ws.send(JSON.stringify({
        id: 2,
        method: 'Page.captureScreenshot',
        params: { format: 'png' }
      }));
    }, 1500);
  } else if (res.id === 2) {
    fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr_admin_welcome_current.png', Buffer.from(res.result.data, 'base64'));
    console.log('Saved greythr_admin_welcome_current.png');
    process.exit(0);
  }
});
