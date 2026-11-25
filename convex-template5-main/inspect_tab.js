const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/F9A51BC9318EED2E5198A7CB3401D0FB');

ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const welcomeTab = Array.from(document.querySelectorAll('a, button, li, div')).find(el => el.textContent.trim() === 'Welcome');
        return {
          currentUrl: window.location.href,
          hasWelcomeTab: !!welcomeTab,
          welcomeClass: welcomeTab ? welcomeTab.className : null
        };
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
