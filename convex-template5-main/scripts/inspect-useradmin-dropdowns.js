const WebSocket = require('../node_modules/ws');

async function inspectDropdowns() {
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

  const navs = await send('Runtime.evaluate', {
    expression: "(() => {\n" +
      "  const headerNav = document.querySelectorAll('nav, .navbar, .sub-nav, [class*=\"header\"], [class*=\"nav\"]');\n" +
      "  return Array.from(document.querySelectorAll('a, button, li')).map(el => ({\n" +
      "    text: el.innerText.trim(),\n" +
      "    href: el.getAttribute('href'),\n" +
      "    class: el.className\n" +
      "  })).filter(x => x.text && (x.text.includes('User') || x.text.includes('Role') || x.text.includes('Linked')));\n" +
      "})()",
    returnByValue: true
  });
  console.log('Nav elements:', JSON.stringify(navs.result.value.slice(0, 20), null, 2));

  // Also inspect Add Role modal/page
  const addRoleClick = await send('Runtime.evaluate', {
    expression: "(() => {\n" +
      "  const b = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.trim() === 'Add Role');\n" +
      "  if (b) { b.click(); return 'clicked'; }\n" +
      "  return 'not found';\n" +
      "})()",
    returnByValue: true
  });
  console.log('Add Role click:', addRoleClick.result.value);

  await new Promise(r => setTimeout(r, 2000));
  const afterClick = await send('Runtime.evaluate', {
    expression: "(() => ({\n" +
      "  url: window.location.href,\n" +
      "  bodySnippet: document.body.innerText.slice(0, 1000),\n" +
      "  inputs: Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({ placeholder: i.placeholder, name: i.name, type: i.type, label: i.closest('label, div')?.innerText?.slice(0, 40) }))\n" +
      "}))()",
    returnByValue: true
  });
  console.log('After Add Role click:', JSON.stringify(afterClick.result.value, null, 2));

  ws.close();
}

inspectDropdowns().catch(console.error);
