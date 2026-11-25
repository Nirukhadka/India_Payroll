const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

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
      
      function send(method, params = {}) {
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
        console.log('Connected to CDP for Unite Marketplace verification.');

        // Navigate to /admin/unite
        console.log('Navigating to http://localhost:3000/admin/unite ...');
        await send('Page.navigate', { url: 'http://localhost:3000/admin/unite' });
        await new Promise(r => setTimeout(r, 3500));

        // Evaluate page state
        const evalRes = await send('Runtime.evaluate', {
          expression: `({
            title: document.title,
            textSnippet: document.body.innerText.slice(0, 200).replace(/\\n+/g, ' '),
            hasError: document.body.innerText.includes('Something went wrong') || document.body.innerText.includes('Could not find public function'),
            hasMarketplaceHeader: document.body.innerText.includes('Unite Marketplace') || document.body.innerText.includes('Explore Apps')
          })`,
          returnByValue: true
        });

        console.log('Unite Marketplace DOM evaluation:', evalRes.result.value);

        // Capture 1920x1080 screenshot
        await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
        await new Promise(r => setTimeout(r, 500));
        const shot1920 = await send('Page.captureScreenshot', { format: 'png' });
        if (shot1920 && shot1920.data) {
          fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-unite-marketplace-verified-1920x1080.png', Buffer.from(shot1920.data, 'base64'));
          console.log('Saved indiapay-unite-marketplace-verified-1920x1080.png');
        }

        // Capture 1366x768 screenshot
        await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
        await new Promise(r => setTimeout(r, 500));
        const shot1366 = await send('Page.captureScreenshot', { format: 'png' });
        if (shot1366 && shot1366.data) {
          fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-unite-marketplace-verified-1366x768.png', Buffer.from(shot1366.data, 'base64'));
          console.log('Saved indiapay-unite-marketplace-verified-1366x768.png');
        }

        ws.close();
        process.exit(0);
      });
    });
  });
}

main().catch(console.error);
