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

  const tab = tabs.find(t => t.url.includes('localhost:3000'));
  if (!tab) return console.log('No localhost:3000 tab');

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
      
      console.log('Testing Launcher navigation: Click Launcher -> Click Reports...');
      await send('Runtime.evaluate', {
        expression: `document.querySelector('button[title=\"Apps\"], button[aria-label=\"Apps\"]').click()`
      });
      await new Promise(r => setTimeout(r, 600));

      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const links = Array.from(document.querySelectorAll('a'));
            const reportsLink = links.find(a => a.getAttribute('href') === '/reports');
            if (reportsLink) reportsLink.click();
          })()
        `
      });

      await new Promise(r => setTimeout(r, 3000));
      const res1 = await send('Runtime.evaluate', { expression: 'window.location.pathname' });
      console.log('Navigated to:', res1.result.value);

      console.log('Now opening launcher on /reports and clicking Payroll...');
      await send('Runtime.evaluate', {
        expression: `document.querySelector('button[title=\"Apps\"], button[aria-label=\"Apps\"]').click()`
      });
      await new Promise(r => setTimeout(r, 600));

      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const links = Array.from(document.querySelectorAll('a'));
            const payrollLink = links.find(a => a.getAttribute('href') === '/admin/payroll');
            if (payrollLink) payrollLink.click();
          })()
        `
      });

      await new Promise(r => setTimeout(r, 3000));
      const res2 = await send('Runtime.evaluate', { expression: 'window.location.pathname' });
      console.log('Navigated to:', res2.result.value);

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
