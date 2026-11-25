const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function extractFullCatalog() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/5F9B6E2B2C049CD45DCAF33A52E88E0F');
  ws.on('open', () => {
    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (data) => {
          const res = JSON.parse(data);
          if (res.id === id) {
            ws.off('message', handler);
            resolve(res.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    (async () => {
      await send('Page.enable');
      const data = await send('Runtime.evaluate', {
        expression: `(() => {
          // Extract banner info, categories, and apps
          const banner = {
            heading: document.querySelector('h1, h2, .banner-heading')?.innerText || '',
            subtext: document.querySelector('.banner-subtext, p')?.innerText || ''
          };
          
          const categories = Array.from(document.querySelectorAll('.category-chip, .badge, [class*=\"chip\"], [class*=\"category\"]')).map(c => c.innerText.trim()).filter(Boolean);
          
          // Cards
          const cards = Array.from(document.querySelectorAll('[class*=\"card\"], [class*=\"app-item\"], [class*=\"MuiCard\"]')).map(card => {
            return {
              text: card.innerText.trim(),
              imgs: Array.from(card.querySelectorAll('img')).map(img => img.src)
            };
          });

          return {
            url: window.location.href,
            categories: [...new Set(categories)],
            cardCount: cards.length,
            sampleCards: cards.slice(0, 15),
            fullText: document.body.innerText
          };
        })()`,
        returnByValue: true
      });
      
      fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/repute_marketplace_extracted.json', JSON.stringify(data.result.value, null, 2));
      console.log('Extracted Repute Marketplace data successfully.');
      ws.close();
    })();
  });
}
extractFullCatalog();
