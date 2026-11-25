const WebSocket = require('../node_modules/ws');
const http = require('http');
const fs = require('fs');

async function getTabs() {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const tabs = await getTabs();
  const indiapayTab = tabs.find((t) => t.url && t.url.includes('localhost:3000'));
  if (!indiapayTab) {
    console.error('No localhost:3000 tab found!');
    process.exit(1);
  }

  console.log('Connecting to tab:', indiapayTab.id, indiapayTab.url);
  const ws = new WebSocket(indiapayTab.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const msgId = id++;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === msgId) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.send(JSON.stringify({ id: msgId, method, params }));
      ws.on('message', handler);
    });

  ws.on('open', async () => {
    console.log('WebSocket connected!');
    const brainDir = 'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e';

    const routes = [
      {
        url: 'http://localhost:3000/admin/system-settings/general/company-info',
        prefix: 'indiapay-settings-companyinfo',
      },
      {
        url: 'http://localhost:3000/admin/system-settings/payroll/preferences',
        prefix: 'indiapay-settings-payroll',
      },
      {
        url: 'http://localhost:3000/admin/system-settings/integrations',
        prefix: 'indiapay-settings-integrations',
      },
    ];

    for (const r of routes) {
      console.log(`Navigating to ${r.url}...`);
      await send('Page.navigate', { url: r.url });
      await sleep(2500);

      // 1920x1080
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await sleep(600);
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`docs/${r.prefix}-1920x1080.png`, Buffer.from(shot.data, 'base64'));
      fs.writeFileSync(`${brainDir}/${r.prefix}-1920x1080.png`, Buffer.from(shot.data, 'base64'));
      console.log(`Saved ${r.prefix}-1920x1080.png`);

      // 1366x768
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await sleep(600);
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`docs/${r.prefix}-1366x768.png`, Buffer.from(shot.data, 'base64'));
      fs.writeFileSync(`${brainDir}/${r.prefix}-1366x768.png`, Buffer.from(shot.data, 'base64'));
      console.log(`Saved ${r.prefix}-1366x768.png`);
    }

    ws.close();
    console.log('All System Settings screenshots captured successfully!');
    process.exit(0);
  });
}

main().catch(console.error);
