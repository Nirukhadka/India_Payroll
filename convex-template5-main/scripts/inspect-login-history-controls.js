const WebSocket = require('../node_modules/ws');

async function inspectHtml() {
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
      "  inputs: Array.from(document.querySelectorAll('input, select, button')).map(el => ({\n" +
      "    tag: el.tagName,\n" +
      "    type: el.type,\n" +
      "    placeholder: el.placeholder,\n" +
      "    className: el.className,\n" +
      "    text: el.innerText.trim()\n" +
      "  })).filter(x => x.text || x.placeholder),\n" +
      "  table: {\n" +
      "    headers: Array.from(document.querySelectorAll('th')).map(th => th.innerText.trim()),\n" +
      "    sampleRows: Array.from(document.querySelectorAll('tbody tr')).slice(0, 3).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim()))\n" +
      "  }\n" +
      "}))()",
    returnByValue: true
  });
  console.log('DOM controls:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}
inspectHtml().catch(console.error);
