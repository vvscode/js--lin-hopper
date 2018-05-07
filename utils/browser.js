const puppeteer = require("puppeteer");

const browsers = [];

async function getBrowser(debug) {
  const browserOptions = {
    headless: !debug,
    timeout: 60 * 1000,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  };
  if (debug) {
    browserOptions.slowMo = 5;
  }
  const browser = await puppeteer.launch(browserOptions);
  browsers.push(browser);
  return browser;
}

async function getBrowserPage(debug) {
  const browser = await getBrowser(debug);
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
  );
  await page.setViewport({
    width: 1024,
    height: 900
  });
  return page;
}

async function closeBrowsers() {
  return Promise.all(browsers.map(browser => browser.close()));
}

module.exports = {
  getBrowser,
  getBrowserPage,
  closeBrowsers
};
