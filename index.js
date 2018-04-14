const { getBrowserPage, closeBrowsers } = require('./utils/browser');
const argv = require('./utils/argv');

const { email, pass, debug } = argv;

debug && console.debug('Script arguments:', argv);
debug &&
  console.log(`
email: "${email}"
pass: "${pass}"
`);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let page;

(async () => {
  try {
    page = await getBrowserPage(debug);
    await page.goto('https://www.linkedin.com/');
    var loginInput = await page.$('#login-email');
    await loginInput.type(`${email}`);
    var passInput = await page.$('#login-password');
    await passInput.type(`${pass}`);
    await page.click('#login-submit');
    await sleep(5000);
    await page.screenshot({ path: 'tmp/after-login.png', fullPage: true });
    await closeBrowsers();
  } catch (e) {
    console.error('error:', e);
  }
})();
