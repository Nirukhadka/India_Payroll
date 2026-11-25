const WebSocket = require('../node_modules/ws');
const fs = require('fs');

const greytWsUrl = 'ws://localhost:9222/devtools/page/65018565560D5CF271F5DD2BD60464E5';

async function captureAllPages() {
  const ws = new WebSocket(greytWsUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const timer = setTimeout(() => reject(new Error('timeout ' + method)), 10000);
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === msgId) {
        clearTimeout(timer);
        ws.off('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.on('open', r));
  console.log('Connected to greytHR tab');

  const targets = [
    { name: 'plan', url: 'https://victorchasex.greythr.com/ngapp/accountInfo/plan' },
    { name: 'invoices', url: 'https://victorchasex.greythr.com/ngapp/accountInfo/invoices' },
    { name: 'payments', url: 'https://victorchasex.greythr.com/ngapp/accountInfo/payments' },
    { name: 'tickets', url: 'https://victorchasex.greythr.com/nx/account/tickets' },
    { name: 'features', url: 'https://victorchasex.greythr.com/ngapp/accountInfo/features' },
  ];

  const results = {};

  for (const t of targets) {
    console.log(`Navigating to ${t.name} (${t.url})...`);
    await send('Page.navigate', { url: t.url });
    await new Promise(r => setTimeout(r, 4500));

    // 1920x1080
    await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 1000));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`docs/greythr-account-${t.name}-1920x1080.png`, Buffer.from(shot.data, 'base64'));
    fs.writeFileSync(`C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-account-${t.name}-1920x1080.png`, Buffer.from(shot.data, 'base64'));

    // 1366x768
    await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 1000));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`docs/greythr-account-${t.name}-1366x768.png`, Buffer.from(shot.data, 'base64'));

    // Inspect DOM text
    const evalRes = await send('Runtime.evaluate', {
      expression: "(() => ({\n" +
        "  url: window.location.href,\n" +
        "  title: document.title,\n" +
        "  headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, th, .nav-tab, [role=\"tab\"], button')).map(el => el.innerText.trim()).filter(Boolean).slice(0, 30),\n" +
        "  textSnippet: document.body.innerText.slice(0, 1500)\n" +
        "}))()",
      returnByValue: true
    });
    results[t.name] = evalRes.result.value;
    console.log(`Captured ${t.name}! URL:`, evalRes.result.value?.url);
  }

  fs.writeFileSync('docs/greythr-account-settings-dom.json', JSON.stringify(results, null, 2));
  console.log('Saved all 5 pages DOM to docs/greythr-account-settings-dom.json');
  ws.close();
}

captureAllPages().catch(console.error);
