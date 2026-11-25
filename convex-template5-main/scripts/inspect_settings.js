const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function inspectSettingsGear() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/65018565560D5CF271F5DD2BD60464E5');
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
        // Click on the settings gear icon in greytHR topbar
        const evalRes = await send('Runtime.evaluate', {
          expression: `(() => {
            // Find settings button in shadow DOM or main DOM
            const btn = document.querySelector('button[title*="Settings" i], button[aria-label*="Settings" i], .settings-icon, [class*="settings"]');
            return {
              foundBtn: Boolean(btn),
              btnHTML: btn?.outerHTML
            };
          })()`,
          returnByValue: true
        });
        console.log('Search for settings btn:', evalRes.result.value);

        // Check if there is a shadow root in navbar
        const shadowRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const navbar = document.querySelector('gt-nav-bar') || document.querySelector('header');
            if (!navbar) return { error: 'No navbar' };
            const root = navbar.shadowRoot || navbar;
            const gear = root.querySelector('button[title*="Settings" i], button[aria-label*="Settings" i], [class*="gear"], [class*="setting"], .gt-settings');
            if (gear) {
              gear.click();
              return { clicked: true, html: gear.outerHTML };
            }
            return { clicked: false, allBtns: Array.from(root.querySelectorAll('button')).map(b => ({ label: b.ariaLabel, title: b.title, class: b.className })) };
          })()`,
          returnByValue: true
        });
        console.log('Shadow root result:', shadowRes.result.value);

        await new Promise(r => setTimeout(r, 1000));

        // Now see if dropdown appeared
        const dropdownRes = await send('Runtime.evaluate', {
          expression: `(() => {
            return {
              bodyText: document.body.innerText.slice(0, 1000),
              dropdown: document.querySelector('.dropdown-menu, [class*="dropdown"], [class*="popover"]')?.outerHTML
            };
          })()`,
          returnByValue: true
        });
        console.log('Dropdown result:', dropdownRes.result.value);

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-settings-dropdown.png', Buffer.from(shot.data, 'base64'));
        console.log('Saved greythr-settings-dropdown.png');
      } catch (err) {
        console.error('Error:', err);
      } finally {
        ws.close();
      }
    })();
  });
}
inspectSettingsGear();
