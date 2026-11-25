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
      
      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            return {
              url: window.location.href,
              title: document.title,
              textSnippet: document.body.innerText.substring(0, 600),
              cardsCount: document.querySelectorAll('h3').length,
              categoriesFound: Array.from(document.querySelectorAll('h3')).map(h => h.innerText.trim()).slice(0, 10)
            };
          })()
        `,
        returnByValue: true
      });
      console.log('Tab Evaluation:', JSON.stringify(evalRes.result.value, null, 2));

      // Capture screenshot at 1920x1080 (top)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 600));
      const ss1920 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-reports-gallery-1920x1080.png',
        Buffer.from(ss1920.data, 'base64')
      );
      console.log('Saved indiapay-reports-gallery-1920x1080.png');

      // Capture screenshot at 1366x768
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 600));
      const ss1366 = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(
        'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-reports-gallery-1366x768.png',
        Buffer.from(ss1366.data, 'base64')
      );
      console.log('Saved indiapay-reports-gallery-1366x768.png');

      ws.close();
    } catch (err) {
      console.error('CDP Error:', err);
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
