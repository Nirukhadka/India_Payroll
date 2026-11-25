const WebSocket = require('../node_modules/ws');

async function inspectDom() {
  const ws = new WebSocket('ws://localhost:9222/devtools/page/65018565560D5CF271F5DD2BD60464E5');
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === msgId) {
        ws.off('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.on('open', r));

  // Current page
  const eval1 = await send('Runtime.evaluate', {
    expression: "(() => ({ url: window.location.href, title: document.title, headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, th, [role=\"tab\"], button')).map(el => el.innerText.trim()).filter(Boolean).slice(0, 30), bodyText: document.body.innerText.slice(0, 1500) }))()",
    returnByValue: true
  });
  console.log('Current Page DOM:', JSON.stringify(eval1.result.value, null, 2));

  // Navigate to profile
  await send('Page.navigate', { url: 'https://victorchasex.greythr.com/nx/account/my-profile/profile' });
  await new Promise(r => setTimeout(r, 4000));
  const eval2 = await send('Runtime.evaluate', {
    expression: "(() => ({ url: window.location.href, title: document.title, headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, label, [role=\"tab\"], button')).map(el => el.innerText.trim()).filter(Boolean).slice(0, 30), bodyText: document.body.innerText.slice(0, 1500) }))()",
    returnByValue: true
  });
  console.log('Profile DOM:', JSON.stringify(eval2.result.value, null, 2));

  ws.close();
}
inspectDom().catch(console.error);
