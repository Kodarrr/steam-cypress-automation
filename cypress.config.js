const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl:'https://store.steampowered.com',
    scrollBehavior: 'center',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
