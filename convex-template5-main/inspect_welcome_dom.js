const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/F9A51BC9318EED2E5198A7CB3401D0FB');

ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        // Look for the welcome container
        const welcome = document.querySelector('.welcome-container, .ng-scope[ng-switch-when*=\"welcome\"], .greeting-container');
        if (!welcome) {
          // let's look for Good Afternoon
          const el = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.includes('Good Afternoon'));
          if (el) {
            return {
              foundText: el.innerText.slice(0, 100),
              tag: el.tagName,
              className: el.className,
              parentTag: el.parentElement.tagName,
              parentClass: el.parentElement.className
            };
          }
          return { error: 'Not found' };
        }
        return {
          tag: welcome.tagName,
          className: welcome.className,
          html: welcome.outerHTML.slice(0, 500)
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
