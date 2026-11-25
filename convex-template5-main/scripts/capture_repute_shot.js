const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function captureRepute() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/5F9B6E2B2C049CD45DCAF33A52E88E0F');
  ws.on('open', () => {
    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (data) => {
          const res = JSON.parse(data);
          if (res.id === id) {
            ws.off('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    (async () => {
      try {
        await send('Page.enable');
        const res = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/repute-marketplace-1920x1080.png', Buffer.from(res.data, 'base64'));
        console.log('Saved repute-marketplace-1920x1080.png successfully!');
      } catch (err) {
        console.error('Error in capture:', err);
      } finally {
        ws.close();
      }
    })();
  });
}
captureRepute();
