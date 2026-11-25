const http = require('http');
const path = require('path');
const fs = require('fs');
const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');

async function main() {
  const tabs = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const tab = tabs.find(t => t.url.includes('greythr.com'));
  if (!tab) {
    console.log('No greytHR tab found');
    return;
  }
  console.log('Connecting to greytHR tab:', tab.id, tab.url);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.on('open', async () => {
    try {
      await send('Page.enable');
      console.log('Navigating to reports-gallery...');
      await send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/reports/reports/reports-gallery' });
      await new Promise(r => setTimeout(r, 7000));

      const urlRes = await send('Runtime.evaluate', { expression: 'window.location.href' });
      console.log('Navigated to:', urlRes.result.value);

      // Scrape complete structure of reports gallery
      const scrapeScript = `
        (() => {
          // Find all category panels or sections
          const results = [];
          
          // Let's inspect the page structure
          // greytHR reports gallery usually has panels with category headers
          // Let's find all cards/sections/headers
          const panels = document.querySelectorAll('.category-panel, .panel, .card, .report-category, [class*="category"], [class*="report-section"], gt-report-gallery-category');
          
          // Also let's inspect all text and elements with headers
          const headers = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .panel-heading, .category-title, .title, .card-header'));
          
          // Let's do a comprehensive inspection of all report links and headers
          const allElements = Array.from(document.querySelectorAll('*'));
          
          return {
            title: document.title,
            bodyLength: document.body.innerText.length,
            sampleText: document.body.innerText.substring(0, 1000),
            totalPanels: panels.length,
            headers: headers.map(h => ({ tag: h.tagName, text: h.innerText.trim(), class: h.className })),
          };
        })()
      `;

      const scrapeRes = await send('Runtime.evaluate', {
        expression: scrapeScript,
        returnByValue: true
      });

      console.log('Scrape result:', JSON.stringify(scrapeRes.result.value, null, 2));

      ws.close();
    } catch (err) {
      console.error('Error during scraping:', err);
      ws.close();
    }
  });

  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  });
}

main().catch(console.error);
