const WebSocket = require('../node_modules/ws');

async function inspectAgGrid() {
  const ws = new WebSocket('ws://localhost:9222/devtools/page/65018565560D5CF271F5DD2BD60464E5');
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = id++;
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === msgId) {
        ws.off('message', handler);
        resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.on('open', r));

  const res = await send('Runtime.evaluate', {
    expression: "(() => ({\n" +
      "  gridHeaders: Array.from(document.querySelectorAll('.ag-header-cell-text')).map(el => el.innerText.trim()),\n" +
      "  gridRows: Array.from(document.querySelectorAll('.ag-row')).slice(0, 5).map(row => Array.from(row.querySelectorAll('.ag-cell')).map(cell => cell.innerText.trim())),\n" +
      "  toolbarIcons: Array.from(document.querySelectorAll('button, [role=\"button\"]')).map(b => ({ ariaLabel: b.getAttribute('aria-label'), title: b.getAttribute('title'), className: b.className, text: b.innerText.trim() })).filter(x => x.ariaLabel || x.title || x.text),\n" +
      "}))()",
    returnByValue: true
  });
  console.log('ag-grid details:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}
inspectAgGrid().catch(console.error);
