const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function triggerClickAndCapture() {
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
      
      // Dispatch click event directly
      const clickRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.querySelector('button[aria-label="Settings"]');
          if (btn) {
            btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            return true;
          }
          return false;
        })()`,
        returnByValue: true
      });
      console.log('Clicked settings button:', clickRes.result.value);

      await new Promise(r => setTimeout(r, 600));

      const menuItems = await send('Runtime.evaluate', {
        expression: `Array.from(document.querySelectorAll('[role="menuitem"]')).map(el => el.innerText.trim())`,
        returnByValue: true
      });
      console.log('Menu items after click:', menuItems.result.value);

      await send('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
      });
      const shot1920 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/indiapay-settings-dropdown-1920x1080.png', Buffer.from(shot1920.data, 'base64'));
      console.log('Saved indiapay-settings-dropdown-1920x1080.png successfully!');

      await send('Emulation.setDeviceMetricsOverride', {
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        mobile: false
      });
      const shot1366 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/indiapay-settings-dropdown-1366x768.png', Buffer.from(shot1366.data, 'base64'));
      console.log('Saved indiapay-settings-dropdown-1366x768.png successfully!');

      ws.close();
      process.exit(0);
    })();
  });
}
triggerClickAndCapture();
