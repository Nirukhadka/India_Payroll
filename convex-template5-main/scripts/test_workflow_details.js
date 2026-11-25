const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

async function testWorkflowDetails() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/D4375D5F586C394D1A869853CFC737FC');
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

  await send('Page.navigate', { url: 'http://localhost:3000/admin/workflow/leave' });
  await new Promise(res => setTimeout(res, 2000));

  // Click Completed
  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Completed')?.click()`
  });
  await new Promise(res => setTimeout(res, 1000));

  // Click View Details
  await send('Runtime.evaluate', {
    expression: `Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('View Details'))?.click()`
  });
  await new Promise(res => setTimeout(res, 1000));

  const modalCheck = await send('Runtime.evaluate', {
    expression: `({ modalText: document.querySelector('.fixed, [class*="modal"], [role="dialog"]')?.innerText.slice(0, 300) })`,
    returnByValue: true
  });
  console.log('Modal test:', JSON.stringify(modalCheck.result.value, null, 2));

  ws.close();
}

testWorkflowDetails().catch(console.error);
