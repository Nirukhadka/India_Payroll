const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const targetPages = [
  { name: 'positions', url: 'http://localhost:3000/admin/system-settings/employee/positions' },
  { name: 'leaving-reason', url: 'http://localhost:3000/admin/system-settings/employee/leaving-reason' },
  { name: 'asset-group-settings', url: 'http://localhost:3000/admin/system-settings/employee/asset-group-settings' },
  { name: 'dirconfig', url: 'http://localhost:3000/admin/system-settings/employee/dirconfig' },
  { name: 'employee-hub', url: 'http://localhost:3000/admin/system-settings/employee' },
  { name: 'user-admin-users', url: 'http://localhost:3000/admin/user-administration/users' }
];

async function main() {
  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const tabs = JSON.parse(data);
      const tab = tabs.find(t => t.url.includes('localhost:3000'));
      if (!tab) {
        console.error('No localhost:3000 tab found');
        process.exit(1);
      }
      
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      let id = 1;
      
      function sendCommand(method, params = {}) {
        return new Promise((resolve) => {
          const reqId = id++;
          const handler = (msg) => {
            const parsed = JSON.parse(msg);
            if (parsed.id === reqId) {
              ws.removeListener('message', handler);
              resolve(parsed.result);
            }
          };
          ws.on('message', handler);
          ws.send(JSON.stringify({ id: reqId, method, params }));
        });
      }

      ws.on('open', async () => {
        console.log('Connected to Chrome tab CDP.');
        
        for (const page of targetPages) {
          console.log(`\nNavigating to: ${page.name} (${page.url})`);
          await sendCommand('Page.navigate', { url: page.url });
          await new Promise(r => setTimeout(r, 2500));
          
          const evalRes = await sendCommand('Runtime.evaluate', {
            expression: `({
              title: document.title,
              textSample: document.body.innerText.slice(0, 150).replace(/\\n+/g, ' '),
              hasBuildError: !!document.querySelector('.nextjs-container-build-error, [data-nextjs-dialog-header]') || document.body.innerText.includes('Build Error') || document.body.innerText.includes('Failed to compile'),
              hasConvexError: document.body.innerText.includes('Something went wrong') && document.body.innerText.includes('CONVEX')
            })`,
            returnByValue: true
          });
          
          const val = evalRes?.result?.value || {};
          console.log(`Result for ${page.name}:`, val);

          // Capture 1920x1080 screenshot
          await sendCommand('Emulation.setDeviceMetricsOverride', {
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
            mobile: false
          });
          await new Promise(r => setTimeout(r, 500));
          const shot1920 = await sendCommand('Page.captureScreenshot', { format: 'png' });
          if (shot1920 && shot1920.data) {
            fs.writeFileSync(
              `C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-employee-settings-${page.name}-1920x1080.png`,
              Buffer.from(shot1920.data, 'base64')
            );
            console.log(`Saved 1920 screenshot for ${page.name}`);
          }

          // Capture 1366x768 screenshot
          await sendCommand('Emulation.setDeviceMetricsOverride', {
            width: 1366,
            height: 768,
            deviceScaleFactor: 1,
            mobile: false
          });
          await new Promise(r => setTimeout(r, 500));
          const shot1366 = await sendCommand('Page.captureScreenshot', { format: 'png' });
          if (shot1366 && shot1366.data) {
            fs.writeFileSync(
              `C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-employee-settings-${page.name}-1366x768.png`,
              Buffer.from(shot1366.data, 'base64')
            );
            console.log(`Saved 1366 screenshot for ${page.name}`);
          }
        }
        
        ws.close();
        console.log('\nAll pages verified and screens captured successfully!');
        process.exit(0);
      });
    });
  });
}

main().catch(console.error);
