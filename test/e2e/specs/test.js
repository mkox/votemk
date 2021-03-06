// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'basic e2e tests for sb seats': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#voteOverview', 5000)
      // .assert.elementPresent('#search')
      // .assert.containsText('#search', 'Search')
      .end()
  }
}
