const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function shot1366() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/D4375D5F586C394D1A869853CFC737FC');
  ws.on('open', () => {
    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (data) => {
          const res = JSON.parse(data);
          if (res.id === id) {
            ws.off('message', handler);
            resolve(res.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    (async () => {
      await send('Page.enable');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        mobile: false
      });
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/indiapay-unite-1366x768.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved 1366 shot.');
      ws.close();
      process.exit(0);
    })();
  });
}
shot1366();
