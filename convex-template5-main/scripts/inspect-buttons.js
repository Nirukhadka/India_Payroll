const WebSocket = require('../node_modules/ws');

async function inspectProfileButtons() {
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

  const allElements = await send('Runtime.evaluate', {
    expression: "(() => ({\n" +
      "  elements: Array.from(document.querySelectorAll('*')).filter(el => el.children.length === 0 && (el.innerText === 'Edit Info' || el.innerText === 'Change Password' || el.innerText === 'Upload')).map(el => ({\n" +
      "    tag: el.tagName,\n" +
      "    text: el.innerText,\n" +
      "    className: el.className,\n" +
      "    parentTag: el.parentElement?.tagName,\n" +
      "    parentClass: el.parentElement?.className\n" +
      "  }))\n" +
      "}))()",
    returnByValue: true
  });
  console.log('Action elements:', JSON.stringify(allElements.result.value, null, 2));

  // Click whatever has Edit Info text
  const clickEdit = await send('Runtime.evaluate', {
    expression: "(() => {\n" +
      "  const el = Array.from(document.querySelectorAll('*')).find(e => e.children.length === 0 && e.innerText === 'Edit Info');\n" +
      "  if (el) { el.click(); (el.parentElement || el).click(); return 'clicked ' + el.tagName; }\n" +
      "  return 'not found';\n" +
      "})()",
    returnByValue: true
  });
  console.log('Click edit result:', clickEdit.result.value);
  await new Promise(r => setTimeout(r, 2000));

  const afterEdit = await send('Runtime.evaluate', {
    expression: "(() => ({\n" +
      "  visibleInputs: Array.from(document.querySelectorAll('input:not([type=\"hidden\"]), textarea, select')).map(i => ({\n" +
      "    placeholder: i.placeholder,\n" +
      "    value: i.value,\n" +
      "    type: i.type\n" +
      "  })),\n" +
      "  modalHeadings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, .modal-title, [class*=\"title\"]')).map(h => h.innerText.trim()).filter(Boolean)\n" +
      "}))()",
    returnByValue: true
  });
  console.log('After edit dialog:', JSON.stringify(afterEdit.result.value, null, 2));

  ws.close();
}
inspectProfileButtons().catch(console.error);
