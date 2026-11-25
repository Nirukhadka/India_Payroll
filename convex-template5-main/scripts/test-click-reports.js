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
      
      // Make sure launcher is open
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const isOpen = !!document.querySelector('div[style*=\"top left\"]');
            if (!isOpen) {
              const btn = document.querySelector('button[title=\"Apps\"], button[aria-label=\"Apps\"]');
              if (btn) btn.click();
            }
          })()
        `
      });
      await new Promise(r => setTimeout(r, 600));

      const links = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const dropdown = document.querySelector('div[style*=\"top left\"]');
            if (!dropdown) return { error: 'Dropdown not open' };
            const anchors = Array.from(dropdown.querySelectorAll('a'));
            return anchors.map(a => ({
              href: a.getAttribute('href'),
              text: a.innerText.replace(/\\s+/g, ' ').trim()
            }));
          })()
        `,
        returnByValue: true
      });
      console.log('Dropdown anchors:', JSON.stringify(links.result.value, null, 2));

      // Click on Reports link inside the dropdown
      console.log('Clicking Reports anchor...');
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const dropdown = document.querySelector('div[style*=\"top left\"]');
            const reportsAnchor = Array.from(dropdown.querySelectorAll('a')).find(a => a.getAttribute('href') === '/reports');
            if (reportsAnchor) {
              reportsAnchor.click();
              return { success: true };
            }
            return { success: false };
          })()
        `,
        returnByValue: true
      });

      await new Promise(r => setTimeout(r, 3000));
      const newUrl = await send('Runtime.evaluate', { expression: 'window.location.href' });
      console.log('URL after clicking Reports:', newUrl.result.value);

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
