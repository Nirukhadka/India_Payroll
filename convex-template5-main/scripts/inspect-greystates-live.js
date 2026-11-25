const { getWsUrl, CDPClient } = require('./cdp-helper');

async function inspectNav() {
  const wsUrl = await getWsUrl();
  const client = new CDPClient(wsUrl);
  await client.connect();

  await client.send('Page.navigate', { url: 'https://victorchasex.greythr.com/ngapp/settings/general/company-info' });
  await new Promise(r => setTimeout(r, 4000));

  const nav = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        // Inspect top navigation bar elements specifically
        const navContainer = document.querySelector('.navbar, header, nav, .settings-nav, gt-settings-nav, .sub-nav');
        const links = Array.from(document.querySelectorAll('nav a, .navbar a, .sub-nav a, [role="navigation"] a, .dropdown-menu a, .dropdown-item')).map(a => ({
          text: a.innerText.trim(),
          href: a.href || a.getAttribute('href') || ''
        })).filter(a => a.text);

        // Also check Angular state definitions if accessible on window
        const angularStates = [];
        try {
          const el = document.querySelector('[ng-app]') || document.body;
          if (window.angular) {
            const injector = window.angular.element(el).injector();
            if (injector) {
              const stateService = injector.get('$state');
              if (stateService) {
                const all = stateService.get();
                for (const s of all) {
                  if (s.name && s.name.startsWith('settings')) {
                    angularStates.push({
                      name: s.name,
                      url: s.url,
                      title: s.data ? s.data.title : undefined
                    });
                  }
                }
              }
            }
          }
        } catch(e) {}

        return {
          currentUrl: window.location.href,
          linkCount: links.length,
          sampleLinks: links.slice(0, 30),
          angularSettingsStatesCount: angularStates.length,
          sampleStates: angularStates.slice(0, 15)
        };
      })()
    `,
    returnByValue: true
  });
  console.log(JSON.stringify(nav.result.value, null, 2));
  client.close();
}
inspectNav().catch(console.error);
