const { getWsUrl, CDPClient } = require('./cdp-helper');
const fs = require('fs');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const wsUrl = await getWsUrl();
  const client = new CDPClient(wsUrl);
  await client.connect();

  const results = {};

  // 1. LOV: Select 'Blood Group' and see what table renders
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/lov' });
  await sleep(4000);
  await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const sel = document.querySelector('select');
        if (sel) {
          sel.value = 'G_EMPLOYEE_BLOODGROUP';
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()
    `
  });
  await sleep(2000);
  const lovDetail = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const body = document.body.innerText;
        const inputs = Array.from(document.querySelectorAll('input, select, button')).map(el => ({ tag: el.tagName, type: el.type, name: el.name, placeholder: el.placeholder, text: el.innerText }));
        const table = document.querySelector('table');
        const rows = table ? Array.from(table.querySelectorAll('tr')).map(r => Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim())) : [];
        return { bodySnippet: body.slice(0, 1500), inputs, rows };
      })()
    `,
    returnByValue: true
  });
  results.lov = lovDetail.result.value;

  // 2. Bank Branch: check DOM structure & any select elements
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/bank-branch' });
  await sleep(4000);
  const bankBranchDetail = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const body = document.body.innerText;
        const selects = Array.from(document.querySelectorAll('select, .dropdown, [role="listbox"]')).map(s => s.outerHTML.slice(0, 300));
        const inputs = Array.from(document.querySelectorAll('input, select, button')).map(el => ({ tag: el.tagName, type: el.type, name: el.name, placeholder: el.placeholder, text: el.innerText }));
        const table = document.querySelector('table');
        const rows = table ? Array.from(table.querySelectorAll('tr')).map(r => Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim())) : [];
        return { bodySnippet: body.slice(0, 1500), selects, inputs, rows };
      })()
    `,
    returnByValue: true
  });
  results.bankBranch = bankBranchDetail.result.value;

  // 3. Company Bank: check company select & Add Bank button
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/company-bank' });
  await sleep(5000);
  const companyBankDetail = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const body = document.body.innerText;
        const buttons = Array.from(document.querySelectorAll('button, a.btn')).map(b => b.innerText.trim());
        const table = document.querySelector('table');
        const rows = table ? Array.from(table.querySelectorAll('tr')).map(r => Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim())) : [];
        const selects = Array.from(document.querySelectorAll('select')).map(s => Array.from(s.options).map(o => o.text));
        return { bodySnippet: body.slice(0, 1500), buttons, rows, selects };
      })()
    `,
    returnByValue: true
  });
  results.companyBank = companyBankDetail.result.value;

  // 4. State: inspect Country dropdown & table
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/state' });
  await sleep(5000);
  const stateDetail = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const body = document.body.innerText;
        const selects = Array.from(document.querySelectorAll('select')).map(s => Array.from(s.options).map(o => o.text));
        const table = document.querySelector('table');
        const rows = table ? Array.from(table.querySelectorAll('tr')).map(r => Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim())) : [];
        return { bodySnippet: body.slice(0, 1500), selects, rows };
      })()
    `,
    returnByValue: true
  });
  results.state = stateDetail.result.value;

  // 5. Emp No Series: check full content after wait
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/employee/emp-no-series' });
  await sleep(6000);
  const empNoDetail = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const body = document.body.innerText;
        const buttons = Array.from(document.querySelectorAll('button, a.btn')).map(b => b.innerText.trim());
        const table = document.querySelector('table');
        const rows = table ? Array.from(table.querySelectorAll('tr')).map(r => Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim())) : [];
        return { bodySnippet: body.slice(0, 1500), buttons, rows };
      })()
    `,
    returnByValue: true
  });
  results.empNoSeries = empNoDetail.result.value;

  // 6. Transition Group
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/employee/transition-group' });
  await sleep(4000);
  const transDetail = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const sel = document.querySelector('select');
        if (sel && sel.options.length > 1) {
          sel.selectedIndex = 1;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()
    `
  });
  await sleep(2000);
  const transAfter = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const body = document.body.innerText;
        const buttons = Array.from(document.querySelectorAll('button, a.btn')).map(b => b.innerText.trim());
        const lists = Array.from(document.querySelectorAll('ul, ol, select[multiple]')).map(l => l.innerText.slice(0, 200));
        return { bodySnippet: body.slice(0, 1500), buttons, lists };
      })()
    `,
    returnByValue: true
  });
  results.transitionGroup = transAfter.result.value;

  fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-phase18-2-detailed-analysis.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved detailed analysis!');
  client.close();
}

main().catch(console.error);
