const fs = require('fs');
const WebSocket = require('../node_modules/ws');

async function inspectFeaturesList() {
  const ws = new WebSocket('ws://localhost:9222/devtools/page/65018565560D5CF271F5DD2BD60464E5');
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
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
    expression: "(() => {\n" +
      "  const items = Array.from(document.querySelectorAll('.feature-item, [class*=\"feature\"], tr, .panel')).map(el => ({\n" +
      "    text: el.innerText.trim(),\n" +
      "    checked: !!el.querySelector('input[type=\"checkbox\"]:checked')\n" +
      "  })).filter(x => x.text && x.text.includes('Enable this feature'));\n" +
      "  return { count: items.length, items: items.slice(0, 30) };\n" +
      "})()",
    returnByValue: true
  });

  console.log('Features count & items:', JSON.stringify(res.result.value, null, 2));
  ws.close();
}

inspectFeaturesList().catch(console.error);
