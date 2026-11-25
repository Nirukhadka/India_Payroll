const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function capture() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/65018565560D5CF271F5DD2BD60464E5');
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
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 1500));
      const shot1920 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-unite-1920x1080.png', Buffer.from(shot1920.data, 'base64'));
      console.log('Saved greythr-unite-1920x1080.png');

      await send('Emulation.setDeviceMetricsOverride', {
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 1000));
      const shot1366 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-unite-1366x768.png', Buffer.from(shot1366.data, 'base64'));
      console.log('Saved greythr-unite-1366x768.png');

      const dom = await send('Runtime.evaluate', {
        expression: `JSON.stringify({
          title: document.title,
          url: window.location.href,
          bodyText: document.body.innerText.slice(0, 3000),
          iframes: Array.from(document.querySelectorAll("iframe")).map(f => ({ src: f.src, id: f.id, className: f.className }))
        })`,
        returnByValue: true
      });
      console.log('DOM Evaluation:', dom.result.value);

      ws.close();
    })();
  });
}
capture();
