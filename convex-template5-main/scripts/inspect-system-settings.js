const WebSocket = require('../node_modules/ws');
const http = require('http');
const fs = require('fs');

async function getTabs() {
  return new Promise((resolve) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const tabs = await getTabs();
  const greythrTab = tabs.find((t) => t.url && t.url.includes('victorchasex.greythr.com'));
  if (!greythrTab) {
    console.error('No greytHR tab found!');
    process.exit(1);
  }

  console.log('Connecting to greytHR tab:', greythrTab.id, greythrTab.url);
  const ws = new WebSocket(greythrTab.webSocketDebuggerUrl);

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const msgId = id++;
      const handler = (data) => {
        const msg = JSON.parse(data);
        if (msg.id === msgId) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.send(JSON.stringify({ id: msgId, method, params }));
      ws.on('message', handler);
    });

  ws.on('open', async () => {
    console.log('Connected to greytHR CDP session.');
    
    // Navigate to reference starting route
    const startUrl = 'https://victorchasex.greythr.com/ngapp/settings/general/company-info';
    console.log('Navigating to:', startUrl);
    await send('Page.navigate', { url: startUrl });
    await sleep(4000);

    // 1920x1080
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(1000);
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('docs/greythr-settings-companyinfo-1920x1080.png', Buffer.from(shot.data, 'base64'));
    fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-settings-companyinfo-1920x1080.png', Buffer.from(shot.data, 'base64'));

    // 1366x768
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(1000);
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('docs/greythr-settings-companyinfo-1366x768.png', Buffer.from(shot.data, 'base64'));
    fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/greythr-settings-companyinfo-1366x768.png', Buffer.from(shot.data, 'base64'));

    // Inspect Navigation Bar, DOM, Submenus, Forms
    const inspectScript = `
      (() => {
        const title = document.title;
        const currentUrl = window.location.href;
        
        // Navigation items
        const navElements = Array.from(document.querySelectorAll('nav a, header a, .sub-nav a, ul li a, [role="menubar"] a, [role="menuitem"]'));
        const navLinks = navElements.map(el => ({
          text: el.innerText.trim(),
          href: el.getAttribute('href'),
          classes: el.className
        })).filter(l => l.text.length > 0 && l.text.length < 50);

        // Forms and fields
        const labels = Array.from(document.querySelectorAll('label, .form-label')).map(l => l.innerText.trim());
        const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(i => ({
          name: i.name,
          id: i.id,
          placeholder: i.placeholder,
          type: i.type,
          value: i.value,
          disabled: i.disabled,
          required: i.required
        }));

        // Buttons
        const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);

        // Header / Breadcrumb
        const breadcrumbs = Array.from(document.querySelectorAll('.breadcrumb, [aria-label="breadcrumb"]')).map(b => b.innerText.trim());

        // Body text snippet
        const bodyTextSnippet = document.body.innerText.substring(0, 2000);

        return {
          title,
          currentUrl,
          breadcrumbs,
          navLinks,
          labels,
          inputs,
          buttons,
          bodyTextSnippet
        };
      })()
    `;

    const res = await send('Runtime.evaluate', {
      expression: inspectScript,
      returnByValue: true,
    });

    fs.writeFileSync('docs/greythr-settings-inspection.json', JSON.stringify(res.result.value, null, 2));
    console.log('Inspection result saved to docs/greythr-settings-inspection.json');

    ws.close();
    process.exit(0);
  });
}

main().catch(console.error);
