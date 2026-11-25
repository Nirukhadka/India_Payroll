const WebSocket = require('ws');
const http = require('http');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        const greyt = tabs.find(t => t.url.includes('greythr.com'));
        if (greyt) resolve(greyt.webSocketDebuggerUrl);
        else reject(new Error('No greytHR tab'));
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }
  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    this.ws.on('message', (msg) => {
      const data = JSON.parse(msg);
      if (this.callbacks.has(data.id)) {
        const cb = this.callbacks.get(data.id);
        this.callbacks.delete(data.id);
        cb(data.result);
      }
    });
    return new Promise((res, rej) => {
      this.ws.on('open', res);
      this.ws.on('error', rej);
    });
  }
  send(method, params = {}) {
    const curId = this.id++;
    return new Promise((resolve) => {
      this.callbacks.set(curId, resolve);
      this.ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }
  close() {
    this.ws.close();
  }
}

module.exports = { getWsUrl, CDPClient };
