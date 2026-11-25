const WebSocket = require('ws');
const fs = require('fs');

async function scrapeFullCatalog() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/9BE78206571C4B838AA7D7999D0E6AE9');
  await new Promise(r => ws.on('open', r));

  function send(method, params) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.id === id) {
          ws.off('message', handler);
          resolve(msg.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const expr = `(function() {
    // Parse the actual category cards and their reports from the DOM
    const data = [];
    
    // In Angular greytHR reports gallery, let's find the category containers
    const categoryEls = document.querySelectorAll('.category-card, .category-box, .report-category, .card, [class*="category-container"]');
    
    // If not matching specific class, inspect all headers and following lists
    const allHeaders = Array.from(document.querySelectorAll('h3, h4, h5, .card-header, strong.category-title'));
    
    // Alternatively, parse text directly by splitting categories
    const fullText = document.body.innerText;
    
    // Let's also look for list items inside cards
    const cardNodes = document.querySelectorAll('.card, mat-card, .report-group, .category-section');
    cardNodes.forEach(c => {
      const h = c.querySelector('h3, h4, h5, .card-title, header');
      if (h) {
        const catName = h.innerText.trim();
        const items = Array.from(c.querySelectorAll('a, li, .report-title, .report-name'))
          .map(i => i.innerText.trim())
          .filter(t => t && t !== catName && !t.includes('\\n'));
        if (catName && items.length > 0) {
          data.push({ category: catName, reports: items });
        }
      }
    });

    return {
      cardCount: cardNodes.length,
      structuredData: data,
      fullBodyText: fullText
    };
  })()`;

  const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  fs.writeFileSync('scripts/gallery_full_text.txt', res.result.value.fullBodyText);
  fs.writeFileSync('scripts/gallery_structured.json', JSON.stringify(res.result.value.structuredData, null, 2));
  console.log('Saved full catalog text (length: ' + res.result.value.fullBodyText.length + ')');
  ws.close();
}

scrapeFullCatalog().catch(console.error);
