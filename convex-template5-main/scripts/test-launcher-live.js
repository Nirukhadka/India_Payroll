const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const http = require('http');
const fs = require('fs');

async function main() {
  const tabs = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  if (!tab) return console.log('No localhost:3000 tab');

  console.log('Attaching to tab:', tab.id, tab.url);
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.on('open', async () => {
    try {
      await send('Page.enable');
      
      console.log('Navigating to http://localhost:3000/admin/leave/overview...');
      await send('Page.navigate', { url: 'http://localhost:3000/admin/leave/overview' });
      await new Promise(r => setTimeout(r, 4000));

      // Click the 9-dot launcher button
      console.log('Clicking the 9-dot launcher button...');
      const clickRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const btn = document.querySelector('button[title=\"Apps\"], button[aria-label=\"Apps\"]');
            if (!btn) return { error: 'Launcher button not found' };
            btn.click();
            return { success: true };
          })()
        `,
        returnByValue: true
      });
      console.log('Click result:', clickRes.result.value);

      await new Promise(r => setTimeout(r, 1200));

      // Verify the Your Apps panel is visible and inspect items
      const inspectRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const panel = Array.from(document.querySelectorAll('div')).find(d => d.innerText.includes('Your Apps') && d.querySelector('p')?.innerText === 'Your Apps');
            if (!panel) return { isOpen: false };
            const links = Array.from(panel.querySelectorAll('a')).map(a => ({
              text: a.querySelector('span')?.innerText || a.innerText,
              sublabel: a.querySelector('p')?.innerText || '',
              href: a.getAttribute('href')
            }));
            return {
              isOpen: true,
              totalApps: links.length,
              apps: links
            };
          })()
        `,
        returnByValue: true
      });
      console.log('Launcher Panel Inspection:', JSON.stringify(inspectRes.result.value, null, 2));

      // Capture screenshot at 1920x1080
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 400));
      const ss1920 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-launcher-open-1920x1080.png',
        Buffer.from(ss1920.data, 'base64')
      );
      console.log('Saved indiapay-launcher-open-1920x1080.png');

      // Capture screenshot at 1366x768
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 400));
      const ss1366 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-launcher-open-1366x768.png',
        Buffer.from(ss1366.data, 'base64')
      );
      console.log('Saved indiapay-launcher-open-1366x768.png');

      // Test Escape Key Dismissal
      console.log('Testing Escape key dismissal...');
      await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', windowsVirtualKeyCode: 27, key: 'Escape' });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 27, key: 'Escape' });
      await new Promise(r => setTimeout(r, 600));

      const afterEscape = await send('Runtime.evaluate', {
        expression: `!!Array.from(document.querySelectorAll('div')).find(d => d.innerText.includes('Your Apps') && d.querySelector('p')?.innerText === 'Your Apps')`
      });
      console.log('Is Panel Open after Escape:', afterEscape.result.value);

      ws.close();
    } catch (err) {
      console.error(err);
      ws.close();
    }
  });

  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  });
}

main().catch(console.error);
