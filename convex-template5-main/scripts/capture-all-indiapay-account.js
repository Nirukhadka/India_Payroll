const WebSocket = require('../node_modules/ws');
const fs = require('fs');

async function shotAllTabs() {
  const ws = new WebSocket('ws://localhost:9222/devtools/page/D4375D5F586C394D1A869853CFC737FC');
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
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

  await new Promise(r => ws.on('open', r));

  const pages = [
    { name: 'plan', url: 'http://localhost:3000/admin/account-settings/plan' },
    { name: 'invoices', url: 'http://localhost:3000/admin/account-settings/invoices' },
    { name: 'payments', url: 'http://localhost:3000/admin/account-settings/payments' },
    { name: 'tickets', url: 'http://localhost:3000/admin/account-settings/tickets' },
    { name: 'features', url: 'http://localhost:3000/admin/account-settings/features' },
  ];

  for (const p of pages) {
    console.log('Capturing IndiaPay', p.name);
    await send('Page.navigate', { url: p.url });
    await new Promise(r => setTimeout(r, 2000));

    // 1920x1080
    await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 500));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`docs/indiapay-account-${p.name}-1920x1080.png`, Buffer.from(shot.data, 'base64'));
    fs.writeFileSync(`C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-account-${p.name}-1920x1080.png`, Buffer.from(shot.data, 'base64'));

    // 1366x768
    await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`docs/indiapay-account-${p.name}-1366x768.png`, Buffer.from(shot.data, 'base64'));
  }

  ws.close();
  console.log('Finished capturing all IndiaPay account settings screenshots!');
}

shotAllTabs().catch(console.error);
