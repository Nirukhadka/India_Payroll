const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function inspectMonitorAndCompleted() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/9BE78206571C4B838AA7D7999D0E6AE9');
  await new Promise(r => ws.on('open', r));

  function send(method, params) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.id === id) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Click Completed
  console.log('Clicking Completed tab...');
  const clickCompleted = `(() => {
    const completedTab = Array.from(document.querySelectorAll('button, div, span, a')).find(el => el.innerText.trim() === 'Completed');
    if (completedTab) {
      completedTab.click();
      return true;
    }
    return false;
  })()`;
  const res1 = await send('Runtime.evaluate', { expression: clickCompleted });
  await new Promise(r => setTimeout(r, 2000));

  const completedCheck = await send('Runtime.evaluate', {
    expression: '({ href: window.location.href, text: document.body.innerText.slice(0, 800) })',
    returnByValue: true
  });
  console.log('Completed state:', JSON.stringify(completedCheck.result.value, null, 2));

  // Click Monitor
  console.log('Clicking Monitor button...');
  const clickMonitor = `(() => {
    const monitorBtn = Array.from(document.querySelectorAll('button, div, span, a')).find(el => el.innerText.trim() === 'Monitor');
    if (monitorBtn) {
      monitorBtn.click();
      return true;
    }
    return false;
  })()`;
  await send('Runtime.evaluate', { expression: clickMonitor });
  await new Promise(r => setTimeout(r, 2000));

  const monitorCheck = await send('Runtime.evaluate', {
    expression: '({ href: window.location.href, text: document.body.innerText.slice(0, 800) })',
    returnByValue: true
  });
  console.log('Monitor state:', JSON.stringify(monitorCheck.result.value, null, 2));

  // Capture Monitor screenshot
  const dir = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-workflow-reference';
  const monRes = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(dir + '/reference-greythr-workflow-monitor-1920x1080.png', Buffer.from(monRes.data, 'base64'));
  console.log('Captured Monitor screenshot!');

  ws.close();
}

inspectMonitorAndCompleted().catch(console.error);
