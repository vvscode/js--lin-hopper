const puppeteer = require('puppeteer');
const optimist = require('optimist');
require('dotenv').config();

const argv = optimist
  .usage('Usage: $0 -e [email] -p [pass]')
  .demand('e')
  .alias('e', 'email')
  .describe('e', 'Email for login')
  .demand('p')
  .alias('p', 'pass')
  .describe('p', 'Password for login')
  .boolean('debug')
  .default({
    email: process.env.LI_USER,
    pass: process.env.LI_PASSWORD
  }).argv;

const { email, pass, debug } = argv;

debug && console.debug('Script arguments:', argv);
debug &&
  console.log(`
email: "${email}"
pass: "${pass}"
`);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let browser;

let browserOptions = {
  headless: !debug,
  timeout: 60 * 1000,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
};
debug && (browserOptions.slowMo = 5);

(async () => {
  browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
  );
  try {
    await page.goto('https://www.linkedin.com/');
    var loginInput = await page.$('#login-email');
    await loginInput.type(`${email}`);
    var passInput = await page.$('#login-password');
    await passInput.type(`${pass}`);
    await page.click('#login-submit');
    await sleep(5000);
    await page.screenshot({ path: 'tmp/after-login.png', fullPage: true });
    await browser.close();
  } catch (e) {
    console.error('error:', e);
  }
})();
