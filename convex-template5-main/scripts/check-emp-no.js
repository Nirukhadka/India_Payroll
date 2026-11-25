const { getWsUrl, CDPClient } = require('./cdp-helper');

async function check() {
  const wsUrl = await getWsUrl();
  const client = new CDPClient(wsUrl);
  await client.connect();

  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/employee/emp-no-series' });
  await new Promise(r => setTimeout(r, 6000));

  const res = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const tables = Array.from(document.querySelectorAll('table')).map(t => ({
          headers: Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim()),
          rows: Array.from(t.querySelectorAll('tbody tr')).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim()))
        }));
        return { text: text.slice(0, 2000), tables };
      })()
    `,
    returnByValue: true
  });
  console.log(JSON.stringify(res.result.value, null, 2));
  client.close();
}
check().catch(console.error);
