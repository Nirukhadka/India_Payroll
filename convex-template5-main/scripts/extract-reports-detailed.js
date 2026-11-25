const http = require('http');
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
  if (!tab) return console.log('No greytHR tab');

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

      // Comprehensive extraction of categories, reports, star state, links, state dropdown options
      const extractScript = `
        (() => {
          // Find the container holding the cards/panels
          // In greytHR angular, check for containers or query h4 headers
          const h4Elements = Array.from(document.querySelectorAll('h4'));
          
          const categories = [];

          h4Elements.forEach(h4 => {
            const categoryTitle = h4.innerText.trim();
            if (!categoryTitle) return;

            // Find parent card or container
            // Walk up to find the enclosing box
            let card = h4.closest('.card') || h4.closest('.panel') || h4.closest('[class*=\"category\"]') || h4.parentElement;
            
            // Look for report items inside or following
            // Often reports are <li> or <a> or <div> elements inside the card
            let reportElements = [];
            if (card) {
              reportElements = Array.from(card.querySelectorAll('a, li, tr, [class*=\"report-item\"], [class*=\"list-item\"]'));
            }
            
            // If card doesn't have child links, walk siblings
            if (reportElements.length === 0 && h4.parentElement) {
              reportElements = Array.from(h4.parentElement.querySelectorAll('a, li'));
            }

            // Clean report list
            const reports = [];
            reportElements.forEach(el => {
              const text = el.innerText.trim();
              const href = el.getAttribute('href') || el.getAttribute('ng-reflect-router-link') || el.getAttribute('routerlink') || '';
              const onclick = el.getAttribute('onclick') || el.getAttribute('(click)') || '';
              // Exclude the header itself or empty text or star icon text
              if (text && text !== categoryTitle && !reports.some(r => r.name === text) && text.length > 2) {
                // Check if favorite star exists
                const hasStar = !!el.querySelector('[class*=\"star\"], i, span.fa-star, .gt-star');
                reports.push({
                  name: text,
                  href,
                  onclick,
                  hasStar
                });
              }
            });

            categories.push({
              category: categoryTitle,
              reportsCount: reports.length,
              reports: reports,
              outerHTMLSnippet: card ? card.outerHTML.substring(0, 300) : ''
            });
          });

          // Also check state selector dropdown
          const selects = Array.from(document.querySelectorAll('select, [class*=\"select\"], [class*=\"dropdown\"]'));
          const stateOptions = Array.from(document.querySelectorAll('option')).map(o => ({ value: o.value, text: o.innerText.trim() }));

          return {
            categories,
            stateOptions
          };
        })()
      `;

      const res = await send('Runtime.evaluate', {
        expression: extractScript,
        returnByValue: true
      });

      fs.writeFileSync(
        'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/raw-scraped-reports.json',
        JSON.stringify(res.result.value, null, 2)
      );
      console.log('Successfully saved raw-scraped-reports.json! Categories found:', res.result.value.categories.length);

      ws.close();
    } catch (err) {
      console.error(err);
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
