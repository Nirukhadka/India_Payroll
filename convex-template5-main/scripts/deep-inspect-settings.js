const { getWsUrl, CDPClient } = require('./cdp-helper');
const fs = require('fs');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const wsUrl = await getWsUrl();
  const client = new CDPClient(wsUrl);
  await client.connect();

  const details = {};

  // 1. LOV: check dropdown options
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/lov' });
  await sleep(4000);
  const lovData = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const select = document.querySelector('select');
        const options = select ? Array.from(select.options).map(o => ({ value: o.value, text: o.text })) : [];
        const table = document.querySelector('table');
        const headers = table ? Array.from(table.querySelectorAll('th')).map(t => t.innerText.trim()) : [];
        const rows = table ? Array.from(table.querySelectorAll('tbody tr')).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())) : [];
        return { options, headers, rowsCount: rows.length, rows: rows.slice(0, 10) };
      })()
    `,
    returnByValue: true
  });
  details.lov = lovData.result.value;

  // 2. Bank Branch: check dropdown options and table
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/bank-branch' });
  await sleep(4000);
  const bankData = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const select = document.querySelector('select');
        const options = select ? Array.from(select.options).map(o => ({ value: o.value, text: o.text })) : [];
        const table = document.querySelector('table');
        const headers = table ? Array.from(table.querySelectorAll('th')).map(t => t.innerText.trim()) : [];
        const helpText = document.querySelector('.help-text, .alert, p')?.innerText || '';
        return { options: options.slice(0, 20), headers, helpText };
      })()
    `,
    returnByValue: true
  });
  details.bankBranch = bankData.result.value;

  // 3. Company Bank: check table columns, company select
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/company-bank' });
  await sleep(4000);
  const compBankData = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const select = document.querySelector('select[name="company"], select');
        const options = select ? Array.from(select.options).map(o => ({ value: o.value, text: o.text })) : [];
        const table = document.querySelector('table');
        const headers = table ? Array.from(table.querySelectorAll('th')).map(t => t.innerText.trim()) : [];
        const rows = table ? Array.from(table.querySelectorAll('tbody tr')).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())) : [];
        return { options, headers, rowsCount: rows.length, rows: rows.slice(0, 10) };
      })()
    `,
    returnByValue: true
  });
  details.companyBank = compBankData.result.value;

  // 4. State: check if state page loaded or needs extra wait
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/state' });
  await sleep(5000);
  const stateData = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const table = document.querySelector('table');
        const headers = table ? Array.from(table.querySelectorAll('th')).map(t => t.innerText.trim()) : [];
        const rows = table ? Array.from(table.querySelectorAll('tbody tr')).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())) : [];
        const content = document.body.innerText.slice(0, 1000);
        return { headers, rowsCount: rows.length, rows: rows.slice(0, 15), content };
      })()
    `,
    returnByValue: true
  });
  details.state = stateData.result.value;

  // 5. Emp No Series: check why loading
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/employee/emp-no-series' });
  await sleep(6000);
  const empNoData = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const table = document.querySelector('table');
        const headers = table ? Array.from(table.querySelectorAll('th')).map(t => t.innerText.trim()) : [];
        const rows = table ? Array.from(table.querySelectorAll('tbody tr')).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())) : [];
        const buttons = Array.from(document.querySelectorAll('button, a.btn')).map(b => b.innerText.trim());
        const content = document.body.innerText.slice(0, 1000);
        return { headers, rowsCount: rows.length, rows: rows.slice(0, 10), buttons, content };
      })()
    `,
    returnByValue: true
  });
  details.empNoSeries = empNoData.result.value;

  // 6. Transition Group
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/employee/transition-group' });
  await sleep(4000);
  const transData = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const select = document.querySelector('select');
        const options = select ? Array.from(select.options).map(o => ({ value: o.value, text: o.text })) : [];
        const content = document.body.innerText.slice(0, 1000);
        return { options, content };
      })()
    `,
    returnByValue: true
  });
  details.transitionGroup = transData.result.value;

  fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-phase18-2-deep-inspection.json', JSON.stringify(details, null, 2), 'utf8');
  console.log('Saved deep inspection results.');
  client.close();
}

main().catch(console.error);
