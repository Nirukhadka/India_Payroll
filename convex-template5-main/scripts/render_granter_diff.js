const WebSocket = require('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/node_modules/ws');
const fs = require('fs');

async function renderGranterOverlay() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/D4375D5F586C394D1A869853CFC737FC');
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

  const dir = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-leave-reference';
  const refB64 = fs.readFileSync(dir + '/reference-greythr-leave-granter-1920x1080.png').toString('base64');
  const localB64 = fs.readFileSync(dir + '/local-indiapay-leave-granter-1920x1080.png').toString('base64');

  const expr = `(async function() {
    function loadImage(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    }
    const img1 = await loadImage('data:image/png;base64,` + refB64 + `');
    const img2 = await loadImage('data:image/png;base64,` + localB64 + `');

    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Overlay 50%
    ctx.globalAlpha = 1.0;
    ctx.drawImage(img1, 0, 0);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(img2, 0, 0);
    const overlayData = canvas.toDataURL('image/png').split(',')[1];

    // Difference
    ctx.globalAlpha = 1.0;
    const c1 = document.createElement('canvas');
    c1.width = 1920; c1.height = 1080;
    const ctx1 = c1.getContext('2d');
    ctx1.drawImage(img1, 0, 0);
    const d1 = ctx1.getImageData(0, 0, 1920, 1080).data;

    const c2 = document.createElement('canvas');
    c2.width = 1920; c2.height = 1080;
    const ctx2 = c2.getContext('2d');
    ctx2.drawImage(img2, 0, 0);
    const d2 = ctx2.getImageData(0, 0, 1920, 1080).data;

    const diffImgData = ctx.createImageData(1920, 1080);
    let diffPixels = 0;
    const total = 1920 * 1080;

    for (let i = 0; i < d1.length; i += 4) {
      const delta = Math.abs(d1[i] - d2[i]) + Math.abs(d1[i+1] - d2[i+1]) + Math.abs(d1[i+2] - d2[i+2]);
      if (delta > 35) {
        diffPixels++;
        diffImgData.data[i] = 255;
        diffImgData.data[i+1] = 0;
        diffImgData.data[i+2] = 0;
        diffImgData.data[i+3] = 255;
      } else {
        diffImgData.data[i] = Math.round(d1[i] * 0.3);
        diffImgData.data[i+1] = Math.round(d1[i+1] * 0.3);
        diffImgData.data[i+2] = Math.round(d1[i+2] * 0.3);
        diffImgData.data[i+3] = 255;
      }
    }
    ctx.putImageData(diffImgData, 0, 0);
    const diffData = canvas.toDataURL('image/png').split(',')[1];

    return {
      matchPct: ((total - diffPixels) / total * 100).toFixed(2),
      diffPixels,
      overlayData,
      diffData
    };
  })()`;

  const res = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  console.log('Result Leave Granter 1920x1080:', res.result.value.matchPct + '% match');
  fs.writeFileSync(dir + '/leave-granter-overlay-50.png', Buffer.from(res.result.value.overlayData, 'base64'));
  fs.writeFileSync(dir + '/leave-granter-pixel-diff.png', Buffer.from(res.result.value.diffData, 'base64'));
  console.log('Saved Leave Granter overlay and pixel diff successfully!');
  ws.close();
}

renderGranterOverlay().catch(console.error);
