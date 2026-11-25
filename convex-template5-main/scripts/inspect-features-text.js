const fs = require('fs');
const WebSocket = require('../node_modules/ws');

async function inspectFeaturesText() {
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
      "  return document.body.innerText;\n" +
      "})()",
    returnByValue: true
  });

  fs.writeFileSync('docs/greythr-features-full-text.txt', res.result.value);
  console.log('Saved full features text, length:', res.result.value.length);
  ws.close();
}

inspectFeaturesText().catch(console.error);
