const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function testRender() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/D4375D5F586C394D1A869853CFC737FC');
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
        console.log('Navigating IndiaPay tab to /admin/unite...');
        await send('Page.navigate', { url: 'http://localhost:3000/admin/unite' });
        await new Promise(r => setTimeout(r, 3500));

        await send('Emulation.setDeviceMetricsOverride', {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          mobile: false
        });
        await new Promise(r => setTimeout(r, 1500));
        const shot1920 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/indiapay-unite-1920x1080.png', Buffer.from(shot1920.data, 'base64'));
        console.log('Saved indiapay-unite-1920x1080.png successfully!');

        await send('Emulation.setDeviceMetricsOverride', {
          width: 1366,
          height: 768,
          deviceScaleFactor: 1,
          mobile: false
        });
        await new Promise(r => setTimeout(r, 1000));
        const shot1366 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/indiapay-unite-1366x768.png', Buffer.from(shot1366.data, 'base64'));
        console.log('Saved indiapay-unite-1366x768.png successfully!');

        const evaluation = await send('Runtime.evaluate', {
          expression: `JSON.stringify({
            title: document.title,
            url: window.location.href,
            heading: document.querySelector('h1')?.innerText,
            allAppsText: document.body.innerText.slice(0, 1000)
          })`,
          returnByValue: true
        });
        console.log('Evaluation:', evaluation.result.value);
      } catch (err) {
        console.error('Error during test render:', err);
      } finally {
        ws.close();
      }
    })();
  });
}
testRender();
