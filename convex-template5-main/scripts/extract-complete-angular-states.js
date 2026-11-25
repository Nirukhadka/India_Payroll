const WebSocket = require('ws');
const fs = require('fs');

const ws = new WebSocket('ws://localhost:9222/devtools/page/A33683EC6FC65410ACED04A22E657B9C');

ws.on('open', () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        try {
          const el = document.querySelector('[ng-app]') || document.body;
          const $injector = window.angular ? window.angular.element(el).injector() : null;
          if ($injector && $injector.has('$state')) {
            const $state = $injector.get('$state');
            const states = $state.get();
            return {
              type: 'angular_states',
              totalStates: states.length,
              states: states.map(s => ({
                name: s.name,
                url: s.url,
                abstract: s.abstract,
                title: s.data?.title || s.title || '',
                templateUrl: s.templateUrl || '',
                module: s.name.split('.')[0]
              }))
            };
          }
          return { type: 'no_injector', error: 'Angular $state injector not found' };
        } catch (e) {
          return { type: 'error', message: e.message };
        }
      })()`,
      returnByValue: true
    }
  }));
});

ws.on('message', (msg) => {
  const res = JSON.parse(msg);
  if (res.id === 1) {
    const val = res.result.result.value;
    console.log('Result Type:', val.type);
    console.log('Total States Discovered:', val.totalStates);
    if (val.states) {
      fs.writeFileSync(
        'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/scripts/all-angular-states-dump.json',
        JSON.stringify(val.states, null, 2),
        'utf8'
      );
      console.log('Successfully saved all-angular-states-dump.json!');
    }
    ws.close();
  }
});
