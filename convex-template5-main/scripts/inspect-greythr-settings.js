const { getWsUrl, CDPClient } = require('./cdp-helper');
const fs = require('fs');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const TARGET_ROUTES = [
  { name: 'lov', url: 'https://victorchasex.greythr.com/ngapp/settings/general/lov' },
  { name: 'bank-branch', url: 'https://victorchasex.greythr.com/ngapp/settings/general/bank-branch' },
  { name: 'company-bank', url: 'https://victorchasex.greythr.com/ngapp/settings/general/company-bank' },
  { name: 'state', url: 'https://victorchasex.greythr.com/ngapp/settings/general/state' },
  { name: 'emp-no-series', url: 'https://victorchasex.greythr.com/ngapp/settings/employee/emp-no-series' },
  { name: 'transitiongroup', url: 'https://victorchasex.greythr.com/ngapp/settings/employee/transition-group' },
];

async function captureScreen(client, filePath, width, height) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sleep(1500);
  const screenshot = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
}

async function inspectPage(client, target) {
  console.log(`\n=============================================`);
  console.log(`Inspecting ${target.name}: ${target.url}`);
  await client.send('Page.navigate', { url: target.url });
  await sleep(4000);

  // Evaluate basic DOM structure
  const pageInfo = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const titleEl = document.querySelector('h1, h2, .page-title, .title, gt-heading, .heading');
        const breadcrumb = Array.from(document.querySelectorAll('.breadcrumb, .breadcrumbs, .breadcrumb-item, nav ol li')).map(e => e.innerText.trim()).filter(Boolean);
        const buttons = Array.from(document.querySelectorAll('button, .btn, a.btn, a[role="button"]')).map(b => b.innerText.trim()).filter(Boolean);
        const headers = Array.from(document.querySelectorAll('th, .table-header, .header-cell, [role="columnheader"]')).map(th => th.innerText.trim()).filter(Boolean);
        const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({
          name: i.name,
          placeholder: i.placeholder,
          type: i.type,
          id: i.id
        }));
        const bodyText = document.body.innerText.slice(0, 1500);
        return {
          currentUrl: window.location.href,
          title: titleEl ? titleEl.innerText.trim() : document.title,
          breadcrumb,
          buttons: Array.from(new Set(buttons)),
          headers: Array.from(new Set(headers)),
          inputCount: inputs.length,
          inputs: inputs.slice(0, 15),
          bodySnippet: bodyText
        };
      })()
    `,
    returnByValue: true
  });

  console.log('DOM Info:', JSON.stringify(pageInfo.result.value, null, 2));

  // Capture screenshots at 1920x1080 and 1366x768
  const baseDir = 'C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e';
  const file1080 = `${baseDir}/greythr-settings-${target.name}-1920x1080.png`;
  const file768 = `${baseDir}/greythr-settings-${target.name}-1366x768.png`;
  
  await captureScreen(client, file1080, 1920, 1080);
  console.log(`Saved 1920x1080 to ${file1080}`);
  await captureScreen(client, file768, 1366, 768);
  console.log(`Saved 1366x768 to ${file768}`);

  return pageInfo.result.value;
}

async function main() {
  const wsUrl = await getWsUrl();
  const client = new CDPClient(wsUrl);
  await client.connect();
  console.log('Connected to CDP for greytHR inspection');

  const inspectionResults = {};
  for (const target of TARGET_ROUTES) {
    try {
      inspectionResults[target.name] = await inspectPage(client, target);
    } catch(err) {
      console.error(`Failed inspecting ${target.name}:`, err.message);
    }
  }

  fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-phase18-2-inspection.json', JSON.stringify(inspectionResults, null, 2), 'utf8');
  console.log('\nInspection complete! Output saved to docs/greythr-phase18-2-inspection.json');

  client.close();
}

main().catch(console.error);
