const http = require('http');
const fs = require('fs');
const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

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
      
      const inspectScope = `
        (() => {
          // Angular 1.x scope extraction
          const el = document.querySelector('li[ng-repeat=\"r in g.reports\"] a.nav-item');
          if (!el) return { error: 'Element not found' };
          
          let scope = window.angular ? window.angular.element(el).scope() : null;
          let reportObj = null;
          let groups = null;
          
          if (scope) {
            reportObj = scope.r;
            groups = scope.groups || scope.reportGroups || (scope.$parent ? scope.$parent.groups : null);
          }
          
          // Let's trigger a click via angular or dispatchEvent
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

          return {
            hasAngular: !!window.angular,
            sampleReport: reportObj,
            hasScope: !!scope
          };
        })()
      `;

      const res = await send('Runtime.evaluate', { expression: inspectScope, returnByValue: true });
      console.log('Angular Scope result:', JSON.stringify(res.result.value, null, 2));

      await new Promise(r => setTimeout(r, 2000));

      // Check modal or dialog appearance
      const modalCheck = `
        (() => {
          const modals = Array.from(document.querySelectorAll('.modal, [class*=\"modal\"], [class*=\"dialog\"], [class*=\"popup\"], gt-modal'));
          const visibleModals = modals.filter(m => m.offsetWidth > 0 && m.offsetHeight > 0);
          
          return {
            totalModals: modals.length,
            visibleModals: visibleModals.map(m => ({
              className: m.className,
              htmlSnippet: m.outerHTML.substring(0, 500)
            }))
          };
        })()
      `;

      const mRes = await send('Runtime.evaluate', { expression: modalCheck, returnByValue: true });
      console.log('Modal check:', JSON.stringify(mRes.result.value, null, 2));

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
