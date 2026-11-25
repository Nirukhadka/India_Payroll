const { getWsUrl, CDPClient } = require('./cdp-helper');
const fs = require('fs');

async function extractAll() {
  const wsUrl = await getWsUrl();
  const client = new CDPClient(wsUrl);
  await client.connect();

  console.log('Connected to greytHR tab. Navigating to settings/general/company-info...');
  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/company-info' });
  await new Promise(r => setTimeout(r, 4000));

  const result = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          const el = document.querySelector('[ng-app]') || document.body;
          if (!window.angular) {
            return { error: 'window.angular not present' };
          }
          const injector = window.angular.element(el).injector();
          if (!injector) {
            return { error: 'injector not found on element' };
          }
          const stateService = injector.get('$state');
          if (!stateService) {
            return { error: '$state service not found' };
          }
          const all = stateService.get();
          return {
            total: all.length,
            states: all.map(s => ({
              name: s.name,
              url: s.url,
              abstract: !!s.abstract,
              title: s.data?.title || s.title || '',
              parent: s.parent || ''
            }))
          };
        } catch (e) {
          return { error: e.message };
        }
      })()
    `,
    returnByValue: true
  });

  console.log('Extraction Evaluation:', result.result.value ? { total: result.result.value.total, error: result.result.value.error } : result);

  if (result.result.value?.states) {
    fs.writeFileSync(
      'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-all-discovered-states.json',
      JSON.stringify(result.result.value.states, null, 2),
      'utf8'
    );
    console.log('Saved docs/greythr-all-discovered-states.json with ' + result.result.value.states.length + ' states!');
  }

  process.exit(0);
}

extractAll().catch(console.error);
