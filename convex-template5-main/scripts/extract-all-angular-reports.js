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
      
      const inspectAll = `
        (() => {
          const el = document.querySelector('li[ng-repeat=\"r in g.reports\"] a.nav-item');
          const scope = window.angular ? window.angular.element(el).scope() : null;
          
          if (!scope) return { error: 'No scope' };
          
          // Let's inspect rootScope or parent scope for all groups and reports
          let current = scope;
          let allGroups = null;
          let showReportUIFn = null;
          
          while (current) {
            if (current.groups && !allGroups) allGroups = current.groups;
            if (current.reportGroups && !allGroups) allGroups = current.reportGroups;
            if (current.showReportUI && !showReportUIFn) showReportUIFn = current.showReportUI.toString();
            current = current.$parent;
          }

          return {
            hasGroups: !!allGroups,
            groupCount: allGroups ? allGroups.length : 0,
            allGroups: allGroups,
            showReportUIFn: showReportUIFn ? showReportUIFn.substring(0, 500) : null
          };
        })()
      `;

      const res = await send('Runtime.evaluate', { expression: inspectAll, returnByValue: true });
      
      fs.writeFileSync(
        'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-angular-reports-all.json',
        JSON.stringify(res.result.value, null, 2)
      );
      console.log('Saved greythr-angular-reports-all.json! Group count:', res.result.value.groupCount);
      console.log('showReportUI function snippet:', res.result.value.showReportUIFn);

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
