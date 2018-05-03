const puppeteer = require('puppeteer');
let browsers = [];

async function getBrowser(debug) {
  let browserOptions = {
    headless: !debug,
    timeout: 60 * 1000,
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  };
  debug && (browserOptions.slowMo = 5);
  let browser = await puppeteer.launch(browserOptions);
  browsers.push(browser);
  return browser;
}

async function getBrowserPage(debug) {
  let browser = await getBrowser(debug);
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
  );
  return page;
}

async function closeBrowsers() {
  browsers.forEach(async browser => await browser.close());
}

module.exports = {
  getBrowser,
  getBrowserPage,
  closeBrowsers
};
