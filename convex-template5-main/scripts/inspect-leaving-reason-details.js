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

      const details = await send('Runtime.evaluate', {
        expression: `
          (() => {
            // Find table rows or lists in leaving-reason
            const rows = Array.from(document.querySelectorAll('tr, .row, .list-group-item, [ng-repeat]')).map(r => ({
              text: r.innerText.replace(/\\s+/g, ' ').trim(),
              html: r.outerHTML.substring(0, 300)
            })).filter(r => r.text.length > 2);

            const table = document.querySelector('table');
            return {
              url: window.location.href,
              tableFound: !!table,
              tableHTML: table ? table.outerHTML.substring(0, 1500) : null,
              sampleRows: rows.slice(0, 10)
            };
          })()
        `,
        returnByValue: true
      });

      console.log('Leaving Reason Detail:', JSON.stringify(details.result.value, null, 2));

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
