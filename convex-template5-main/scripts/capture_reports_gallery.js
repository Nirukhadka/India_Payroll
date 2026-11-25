const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

async function run() {
  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const tabs = JSON.parse(data);
      const indiapayTab = tabs.find(t => t.url && t.url.includes('localhost:3000'));
      if (!indiapayTab) {
        console.log('No indiapay tab found');
        return;
      }
      console.log('Target tab:', indiapayTab.id, indiapayTab.url);
      const ws = new WebSocket(indiapayTab.webSocketDebuggerUrl);
      ws.on('open', () => {
        // Set 1920x1080 viewport
        ws.send(JSON.stringify({
          id: 1,
          method: 'Emulation.setDeviceMetricsOverride',
          params: { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false }
        }));
        // Navigate
        ws.send(JSON.stringify({
          id: 2,
          method: 'Page.navigate',
          params: { url: 'http://localhost:3000/admin/reports' }
        }));
      });

      ws.on('message', (msg) => {
        const payload = JSON.parse(msg.toString());
        if (payload.id === 2) {
          console.log('Navigated. Waiting 4s for Next.js compilation & render...');
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 3,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 4000);
        }
        if (payload.id === 3) {
          const buf = Buffer.from(payload.result.data, 'base64');
          const out1 = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/indiapay-reports-gallery-1920x1080.png';
          const out2 = 'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-reports-gallery-1920x1080.png';
          fs.writeFileSync(out1, buf);
          fs.writeFileSync(out2, buf);
          console.log('Saved 1920x1080 screenshot to:', out1, 'and artifact dir. Size:', buf.length);
          ws.close();
          process.exit(0);
        }
      });
    });
  });
}

run();
