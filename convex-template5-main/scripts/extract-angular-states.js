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
    const script = `
      (() => {
        const links = Array.from(document.querySelectorAll('a[href]')).map(a => ({
          href: a.getAttribute('href'),
          text: a.innerText.trim()
        })).filter(a => a.href && (a.href.includes('settings') || a.href.includes('ngapp')));

        // Check window.location, and look for angular scope states if available
        let states = [];
        try {
          const el = document.querySelector('[ng-app]') || document.body;
          if (window.angular) {
            const injector = window.angular.element(el).injector();
            if (injector) {
              const stateService = injector.get('$state');
              if (stateService) {
                states = stateService.get().map(s => ({
                  name: s.name,
                  url: s.url,
                  abstract: s.abstract
                }));
              }
            }
          }
        } catch(e) {
          states = ['error: ' + e.message];
        }

        return { links, states };
      })()
    `;

    const res = await send('Runtime.evaluate', {
      expression: script,
      returnByValue: true,
    });

    console.log('Results:', JSON.stringify(res.result.value, null, 2));
    ws.close();
    process.exit(0);
  });
}

main().catch(console.error);
