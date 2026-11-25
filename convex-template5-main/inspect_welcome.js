const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/F9A51BC9318EED2E5198A7CB3401D0FB');

ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const tasks = document.querySelector('.tasks-container, [class*=\"task\"]');
        function getInfo(node, depth = 0) {
          if (!node || depth > 5) return null;
          const s = window.getComputedStyle(node);
          return {
            tag: node.tagName,
            class: node.className,
            bg: s.backgroundImage,
            text: node.innerText ? node.innerText.slice(0, 50) : '',
            children: Array.from(node.children).map(c => getInfo(c, depth + 1))
          };
        }
        return getInfo(document.querySelector('.body-container, main, .home-container, .welcome-container') || document.body);
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', (data) => {
  const res = JSON.parse(data);
  if (res.id === 1) {
    console.log(JSON.stringify(res.result.result.value, null, 2).slice(0, 2000));
    process.exit(0);
  }
});
