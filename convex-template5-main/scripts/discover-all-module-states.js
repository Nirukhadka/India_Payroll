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

const modules = [
  'settings',
  'employee',
  'payroll',
  'leave',
  'attendance',
  'workflow',
  'reports',
  'engage',
  'unite',
  'account',
  'home',
  'dashboard',
  'admin'
];

async function main() {
  const tabs = await getTabs();
  const greythrTab = tabs.find((t) => t.url && t.url.includes('victorchasex.greythr.com'));
  const ws = new WebSocket(greythrTab.webSocketDebuggerUrl);

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
    console.log('Connected to greytHR tab. Testing /v2/ng/states endpoints...');

    const discovered = {};

    for (const mod of modules) {
      const res = await send('Runtime.evaluate', {
        expression: `
          (async () => {
            try {
              const r = await fetch('/v2/ng/states/${mod}');
              if (r.ok) {
                const text = await r.text();
                return { status: r.status, length: text.length, content: text };
              }
              return { status: r.status };
            } catch(e) {
              return { error: e.message };
            }
          })()
        `,
        awaitPromise: true,
        returnByValue: true,
      });

      const val = res.result?.value;
      if (val && val.status === 200 && val.length > 50) {
        console.log(`[FOUND] /v2/ng/states/${mod} -> ${val.length} bytes`);
        discovered[mod] = val.content;
      } else {
        console.log(`[NOT FOUND] /v2/ng/states/${mod} -> Status: ${val?.status || 'Error'}`);
      }
    }

    fs.writeFileSync(
      'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-all-v2-states-dump.json',
      JSON.stringify(discovered, null, 2),
      'utf8'
    );
    console.log('Finished probing states endpoints.');
    ws.close();
    process.exit(0);
  });
}

main().catch(console.error);
