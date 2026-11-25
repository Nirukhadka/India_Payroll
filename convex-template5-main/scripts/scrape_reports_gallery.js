const WebSocket = require('ws');
const fs = require('fs');

async function scrapeReports() {
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

  // Navigate to reports gallery
  await send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/reports/reports/reports-gallery' });
  await new Promise(r => setTimeout(r, 6000));

  // Scrape all categories and reports
  const expr = `(function() {
    // Scroll down to load everything
    window.scrollTo(0, document.body.scrollHeight);
    
    const results = [];
    // Select category cards or blocks
    const cards = document.querySelectorAll('.card, .category-card, [class*="category"], [class*="report"]');
    
    // Let's inspect the entire DOM tree for headings and reports
    const categories = [];
    document.querySelectorAll('h3, h4, h5, .card-title, .category-header').forEach(h => {
      const title = h.innerText.trim();
      if (title && title.length < 50) {
        categories.push(title);
      }
    });

    // Also get all report items
    const reports = [];
    document.querySelectorAll('a, li, tr, .report-item, [class*="report-name"]').forEach(el => {
      const txt = el.innerText.trim();
      if (txt && txt.length > 3 && txt.length < 80 && !txt.includes('\\n')) {
        reports.push(txt);
      }
    });

    return {
      title: document.title,
      url: window.location.href,
      bodyTextLength: document.body.innerText.length,
      sampleText: document.body.innerText.slice(0, 1500),
      categories: [...new Set(categories)],
    };
  })()`;

  const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  fs.writeFileSync('scripts/gallery_scrape_result.json', JSON.stringify(res.result.value, null, 2));
  console.log('Scraped gallery successfully! Sample:');
  console.log(res.result.value.sampleText.slice(0, 400));
  ws.close();
}

scrapeReports().catch(console.error);
