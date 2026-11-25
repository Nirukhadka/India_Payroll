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
  const greythrTab = tabs.find((t) => t.url && t.url.includes('victorchasex.greythr.com'));
  const indiapayTab = tabs.find((t) => t.url && t.url.includes('localhost:3000'));

  if (!greythrTab || !indiapayTab) {
    console.error('Both tabs required!');
    process.exit(1);
  }

  const brainDir = 'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e';

  // Helper to connect to tab and capture
  async function captureRoute(tab, routeUrl, prefix) {
    console.log(`Connecting to ${prefix}... URL: ${routeUrl}`);
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

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

    await new Promise((resolve) => ws.on('open', resolve));

    await send('Page.navigate', { url: routeUrl });
    await sleep(3000);

    // 1920x1080
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(800);
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`docs/${prefix}-1920x1080.png`, Buffer.from(shot.data, 'base64'));
    fs.writeFileSync(`${brainDir}/${prefix}-1920x1080.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Captured: docs/${prefix}-1920x1080.png`);

    // 1366x768
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(800);
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`docs/${prefix}-1366x768.png`, Buffer.from(shot.data, 'base64'));
    fs.writeFileSync(`${brainDir}/${prefix}-1366x768.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Captured: docs/${prefix}-1366x768.png`);

    ws.close();
  }

  // 1. Fresh GreytHR Reference Captures
  const greythrRoutes = [
    { url: 'https://victorchasex.greythr.com/ngapp/accountInfo/plan', prefix: 'greythr-audit-account-plan' },
    { url: 'https://victorchasex.greythr.com/ngapp/accountInfo/invoices', prefix: 'greythr-audit-account-invoices' },
    { url: 'https://victorchasex.greythr.com/ngapp/accountInfo/payments', prefix: 'greythr-audit-account-payments' },
    { url: 'https://victorchasex.greythr.com/nx/account/tickets', prefix: 'greythr-audit-account-tickets' },
    { url: 'https://victorchasex.greythr.com/ngapp/accountInfo/features', prefix: 'greythr-audit-account-features' },
  ];

  for (const g of greythrRoutes) {
    await captureRoute(greythrTab, g.url, g.prefix);
  }

  // 2. Fresh IndiaPay Captures
  const indiapayRoutes = [
    { url: 'http://localhost:3000/admin/account-settings/plan', prefix: 'indiapay-audit-account-plan' },
    { url: 'http://localhost:3000/admin/account-settings/invoices', prefix: 'indiapay-audit-account-invoices' },
    { url: 'http://localhost:3000/admin/account-settings/payments', prefix: 'indiapay-audit-account-payments' },
    { url: 'http://localhost:3000/admin/account-settings/tickets', prefix: 'indiapay-audit-account-tickets' },
    { url: 'http://localhost:3000/admin/account-settings/features', prefix: 'indiapay-audit-account-features' },
  ];

  for (const i of indiapayRoutes) {
    await captureRoute(indiapayTab, i.url, i.prefix);
  }

  console.log('All fresh audit screenshots captured successfully!');
  process.exit(0);
}

main().catch(console.error);
