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

  const tab = tabs.find(t => t.url.includes('greythr.com'));
  if (!tab) return console.log('No greytHR tab found');

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

  const routes = [
    { name: 'employee-position', url: 'https://victorchasex.greythr.com/ngapp/settings/employee/employee-categories' },
    { name: 'leaving-reason', url: 'https://victorchasex.greythr.com/ngapp/settings/employee/leaving-reason' },
    { name: 'asset-group-settings', url: 'https://victorchasex.greythr.com/ngapp/settings/employee/asset-group-settings' },
    { name: 'dirconfig', url: 'https://victorchasex.greythr.com/ngapp/settings/employee/employee-directory-config' },
  ];

  ws.on('open', async () => {
    try {
      await send('Page.enable');

      for (const route of routes) {
        console.log(`Navigating to ${route.name} (${route.url})...`);
        await send('Page.navigate', { url: route.url });
        await new Promise(r => setTimeout(r, 4500));

        const inspection = await send('Runtime.evaluate', {
          expression: `
            (() => {
              return {
                url: window.location.href,
                title: document.title,
                breadcrumb: Array.from(document.querySelectorAll('.breadcrumb, [class*=\"breadcrumb\"], gt-breadcrumb')).map(b => b.innerText.replace(/\\s+/g, ' ').trim()),
                heading: document.querySelector('h1, h2, h3, h4, .page-title, .title')?.innerText || '',
                bodySnippet: document.body.innerText.substring(0, 1000),
                tableHeaders: Array.from(document.querySelectorAll('th')).map(th => th.innerText.trim()).filter(Boolean),
                buttons: Array.from(document.querySelectorAll('button, .btn')).map(b => b.innerText.trim()).filter(Boolean),
                inputs: Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({
                  name: i.name,
                  id: i.id,
                  type: i.type,
                  placeholder: i.placeholder,
                  label: i.closest('.form-group, .field, label')?.innerText?.replace(/\\s+/g, ' ').trim() || ''
                })).slice(0, 10)
              };
            })()
          `,
          returnByValue: true
        });

        console.log(`--- ${route.name} Inspection ---:`, JSON.stringify(inspection.result.value, null, 2));

        // Capture screenshot at 1920x1080
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          mobile: false
        });
        await new Promise(r => setTimeout(r, 400));
        const ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(
          `C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-employee-settings-${route.name}-1920x1080.png`,
          Buffer.from(ss.data, 'base64')
        );
        console.log(`Saved screenshot for ${route.name}`);
      }

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
