const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function inspectGreytHR() {
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

  // Look for dropdown triggers or menu links
  const expr = `(() => {
    // Find More button
    const moreBtn = Array.from(document.querySelectorAll('button, a, span, div')).find(el => (el.innerText || '').trim() === 'More');
    return {
      currentUrl: window.location.href,
      hasMoreBtn: Boolean(moreBtn),
      moreTag: moreBtn ? moreBtn.tagName : null,
      moreClass: moreBtn ? moreBtn.className : null,
      links: Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') })).filter(x => x.text && x.href)
    };
  })()`;

  const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

inspectGreytHR().catch(console.error);
