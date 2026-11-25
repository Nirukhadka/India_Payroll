const { getWsUrl, CDPClient } = require('./cdp-helper');

async function check() {
  const wsUrl = await getWsUrl();
  const client = new CDPClient(wsUrl);
  await client.connect();

  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/state' });
  await new Promise(r => setTimeout(r, 6000));

  const res = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const selects = Array.from(document.querySelectorAll('select')).map(s => Array.from(s.options).map(o => ({ value: o.value, text: o.text })));
        return { text: text.slice(0, 2000), selects };
      })()
    `,
    returnByValue: true
  });
  console.log('State info:', JSON.stringify(res.result.value, null, 2));

  // If select exists, choose India and check
  await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const sel = document.querySelector('select');
        if (sel) {
          const opt = Array.from(sel.options).find(o => o.text.includes('India'));
          if (opt) {
            sel.value = opt.value;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 3000));

  const afterRes = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return { text: text.slice(0, 2000) };
      })()
    `,
    returnByValue: true
  });
  console.log('After India select:', JSON.stringify(afterRes.result.value, null, 2));

  client.close();
}
check().catch(console.error);
