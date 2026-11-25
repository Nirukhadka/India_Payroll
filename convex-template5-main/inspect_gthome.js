const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/F9A51BC9318EED2E5198A7CB3401D0FB');

ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        // click welcome if needed
        const welcomeTab = Array.from(document.querySelectorAll('a, button, li, span, div')).find(el => el.textContent.trim() === 'Welcome');
        if (welcomeTab) welcomeTab.click();
        
        const gtHome = document.querySelector('.gt-home');
        if (!gtHome) return { error: 'no gt-home' };
        
        // Find all elements with classes and text
        return Array.from(gtHome.querySelectorAll('*')).slice(0, 50).map(el => ({
          tag: el.tagName,
          class: el.className,
          bg: window.getComputedStyle(el).backgroundImage,
          text: el.innerText ? el.innerText.slice(0, 30) : ''
        })).filter(x => x.class || x.bg !== 'none' || x.text);
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', (data) => {
  const res = JSON.parse(data);
  if (res.id === 1) {
    console.log(JSON.stringify(res.result.result.value, null, 2));
    process.exit(0);
  }
});
