const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

async function verifyLoansPage() {
  http.get('http://localhost:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const targets = JSON.parse(data);
      const page = targets.find(t => t.type === 'page' && t.url.includes('localhost:3000'));
      if (!page) {
        console.error('No localhost:3000 page found in CDP');
        return;
      }

      console.log('Attaching to page:', page.url);
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let id = 1;

      const send = (method, params = {}) => {
        return new Promise((resolve) => {
          const reqId = id++;
          const handler = (msg) => {
            const res = JSON.parse(msg);
            if (res.id === reqId) {
              ws.off('message', handler);
              resolve(res.result);
            }
          };
          ws.on('message', handler);
          ws.send(JSON.stringify({ id: reqId, method, params }));
        });
      };

      ws.on('open', async () => {
        console.log('Navigating to http://localhost:3000/admin/payroll/loans ...');
        await send('Page.navigate', { url: 'http://localhost:3000/admin/payroll/loans' });
        await new Promise(r => setTimeout(r, 3000));

        const evalRes = await send('Runtime.evaluate', {
          expression: `({
            title: document.title,
            textSnippet: document.body.innerText.slice(0, 300).replace(/\\s+/g, ' '),
            hasLoanTable: !!document.querySelector('table'),
            hasNewLoanBtn: document.body.innerText.includes('New Employee Loan')
          })`,
          returnByValue: true
        });

        console.log('Loans Page Evaluation:', evalRes.result.value);

        // Capture screenshot
        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/indiapay-payroll-loans-management-1920x1080.png', Buffer.from(screenshot.data, 'base64'));
        console.log('Saved screenshot indiapay-payroll-loans-management-1920x1080.png');
        ws.close();
      });
    });
  });
}

verifyLoansPage();
