const WebSocket = require('../node_modules/ws');

async function inspectProfileDetails() {
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

  await send('Page.navigate', { url: 'https://victorchasex.greythr.com/nx/account/my-profile/profile' });
  await new Promise(r => setTimeout(r, 4000));

  const res = await send('Runtime.evaluate', {
    expression: "(() => ({\n" +
      "  breadcrumb: document.querySelector('.breadcrumb, [class*=\"breadcrumb\"]')?.innerText?.trim(),\n" +
      "  tabs: Array.from(document.querySelectorAll('[role=\"tab\"], .nav-tab, a.tab, [class*=\"tab\"]')).map(t => ({ text: t.innerText.trim(), href: t.getAttribute('href'), class: t.className })).filter(x => x.text),\n" +
      "  buttons: Array.from(document.querySelectorAll('button')).map(b => ({ text: b.innerText.trim(), class: b.className })).filter(x => x.text)\n" +
      "}))()",
    returnByValue: true
  });
  console.log('Profile details:', JSON.stringify(res.result.value, null, 2));

  // Click Edit Info
  const editClick = await send('Runtime.evaluate', {
    expression: "(() => {\n" +
      "  const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Edit Info');\n" +
      "  if (btn) { btn.click(); return 'clicked'; }\n" +
      "  return 'not found';\n" +
      "})()",
    returnByValue: true
  });
  console.log('Edit Info click:', editClick.result.value);
  await new Promise(r => setTimeout(r, 2000));

  const modalRes = await send('Runtime.evaluate', {
    expression: "(() => ({\n" +
      "  dialog: document.querySelector('.modal, [role=\"dialog\"], [class*=\"modal\"], [class*=\"drawer\"], [class*=\"panel\"]')?.innerText?.slice(0, 1000),\n" +
      "  inputs: Array.from(document.querySelectorAll('input, textarea, select')).map(i => ({\n" +
      "    name: i.name,\n" +
      "    placeholder: i.placeholder,\n" +
      "    value: i.value,\n" +
      "    type: i.type,\n" +
      "    label: i.closest('label, .form-group, div')?.innerText?.trim()?.slice(0, 50)\n" +
      "  }))\n" +
      "}))()",
    returnByValue: true
  });
  console.log('Edit Info modal:', JSON.stringify(modalRes.result.value, null, 2));

  // Click Change Password
  await send('Page.navigate', { url: 'https://victorchasex.greythr.com/nx/account/my-profile/profile' });
  await new Promise(r => setTimeout(r, 4000));
  const pwClick = await send('Runtime.evaluate', {
    expression: "(() => {\n" +
      "  const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Change Password');\n" +
      "  if (btn) { btn.click(); return 'clicked'; }\n" +
      "  return 'not found';\n" +
      "})()",
    returnByValue: true
  });
  console.log('Change Password click:', pwClick.result.value);
  await new Promise(r => setTimeout(r, 2000));

  const pwModalRes = await send('Runtime.evaluate', {
    expression: "(() => ({\n" +
      "  dialog: document.querySelector('.modal, [role=\"dialog\"], [class*=\"modal\"], [class*=\"drawer\"], [class*=\"panel\"]')?.innerText?.slice(0, 1000),\n" +
      "  inputs: Array.from(document.querySelectorAll('input')).map(i => ({\n" +
      "    name: i.name,\n" +
      "    placeholder: i.placeholder,\n" +
      "    type: i.type,\n" +
      "    label: i.closest('label, .form-group, div')?.innerText?.trim()?.slice(0, 50)\n" +
      "  }))\n" +
      "}))()",
    returnByValue: true
  });
  console.log('Change Password modal:', JSON.stringify(pwModalRes.result.value, null, 2));

  ws.close();
}
inspectProfileDetails().catch(console.error);
