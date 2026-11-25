const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function captureSettingsDropdown() {
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
        console.log('Navigating to /admin...');
        await send('Page.navigate', { url: 'http://localhost:3000/admin' });
        await new Promise(r => setTimeout(r, 2500));

        // Click on the settings gear button
        await send('Runtime.evaluate', {
          expression: `(() => {
            const btn = document.querySelector('button[aria-label="Settings"]');
            if (btn) btn.click();
          })()`
        });
        await new Promise(r => setTimeout(r, 500));

        // Capture 1920x1080 screenshot
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          mobile: false
        });
        const shot1920 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/indiapay-settings-dropdown-1920x1080.png', Buffer.from(shot1920.data, 'base64'));
        console.log('Saved indiapay-settings-dropdown-1920x1080.png');

        // Capture 1366x768 screenshot
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1366,
          height: 768,
          deviceScaleFactor: 1,
          mobile: false
        });
        const shot1366 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/indiapay-settings-dropdown-1366x768.png', Buffer.from(shot1366.data, 'base64'));
        console.log('Saved indiapay-settings-dropdown-1366x768.png');

        const menuItems = await send('Runtime.evaluate', {
          expression: `Array.from(document.querySelectorAll('[role="menuitem"]')).map(el => el.innerText.trim())`,
          returnByValue: true
        });
        console.log('Dropdown Menu Items:', menuItems.result.value);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        ws.close();
      }
    })();
  });
}
captureSettingsDropdown();
