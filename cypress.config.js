const { defineConfig } = require("cypress");

module.exports = defineConfig({
  screenshotOnRunFailure: true,

  video: true,

  // Generates an HTML report (cypress/reports/html) after `npx cypress run`
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportPageTitle: 'Cypress Test Report',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  e2e: {
    setupNodeEvents(on, config) {

      require('cypress-mochawesome-reporter/plugin')(on);

      // Workaround for cypress-io/cypress#34856: Chrome 153+ disables the
      // `unload` event on cypress open's persistent profile, which breaks
      // Cypress's native alert/confirm auto-dismiss.
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--enable-features=DeprecateUnload');
        }
        return launchOptions;
      });

      // Must be the last statement: anything after it would never run.
      return config;
    },
  },
});
