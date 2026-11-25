const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

async function run() {
  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const tabs = JSON.parse(data);
      const greytab = tabs.find(t => t.url && t.url.includes('victorchasex.greythr.com'));
      if (!greytab) {
        console.log('greytHR tab not found');
        return;
      }
      console.log('Found greytHR tab:', greytab.id, greytab.url);
      const ws = new WebSocket(greytab.webSocketDebuggerUrl);
      ws.on('open', () => {
        // Set 1920x1080 viewport
        ws.send(JSON.stringify({
          id: 1,
          method: 'Emulation.setDeviceMetricsOverride',
          params: { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false }
        }));
        // Navigate to feeds/all
        ws.send(JSON.stringify({
          id: 2,
          method: 'Page.navigate',
          params: { url: 'https://victorchasex.greythr.com/ngx/feeds/all' }
        }));
      });

      ws.on('message', (msg) => {
        const payload = JSON.parse(msg.toString());
        if (payload.id === 2) {
          console.log('Navigating to feeds/all, waiting 5s for render...');
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 3,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 5000);
        }
        if (payload.id === 3) {
          const buf = Buffer.from(payload.result.data, 'base64');
          const out1 = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-engage-feeds-1920x1080.png';
          const out2 = 'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-engage-feeds-1920x1080.png';
          fs.writeFileSync(out1, buf);
          fs.writeFileSync(out2, buf);
          console.log('Saved 1920x1080 greytHR screenshot to:', out1, 'Size:', buf.length);

          // Now capture 1366x768
          ws.send(JSON.stringify({
            id: 4,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false }
          }));
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 5,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 2000);
        }
        if (payload.id === 5) {
          const buf = Buffer.from(payload.result.data, 'base64');
          const out1 = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-engage-feeds-1366x768.png';
          fs.writeFileSync(out1, buf);
          console.log('Saved 1366x768 greytHR screenshot to:', out1, 'Size:', buf.length);
          ws.close();
          process.exit(0);
        }
      });
    });
  });
}

run();
