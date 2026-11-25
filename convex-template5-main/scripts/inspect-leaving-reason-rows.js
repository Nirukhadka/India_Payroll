const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const http = require('http');

async function main() {
  const tabs = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const tab = tabs.find(t => t.url.includes('greythr.com'));
  if (!tab) return;

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

      console.log('Navigating to leaving-reason...');
      await send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/employee/leaving-reason' });
      await new Promise(r => setTimeout(r, 4500));

      const data = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const scope = window.angular ? window.angular.element(document.querySelector('.table, form, [ng-repeat]')).scope() : null;
            const rows = Array.from(document.querySelectorAll('tr')).map(tr => Array.from(tr.querySelectorAll('td, th')).map(c => c.innerText.trim()));
            return {
              url: window.location.href,
              scopeData: scope ? (scope.leavingReasons || scope.reasons || scope.list || scope.items) : null,
              rows: rows.slice(0, 15),
              bodyText: document.body.innerText.substring(0, 1500)
            };
          })()
        `,
        returnByValue: true
      });

      console.log('Leaving Reason Data:', JSON.stringify(data.result.value, null, 2));

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
