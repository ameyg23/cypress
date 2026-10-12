const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Workaround for cypress-io/cypress#34856: Chrome 153+ disables the
      // `unload` event on cypress open's persistent profile, which breaks
      // Cypress's native alert/confirm auto-dismiss.
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--enable-features=DeprecateUnload');
        }
        return launchOptions;
      });
    },
  },
});
