const { getBrowserPage, closeBrowsers } = require('./utils/browser');
const argv = require('./utils/argv');
const linkedin = require('./utils/linkedin');

const { email, pass, debug } = argv;

debug && console.debug('Script arguments:', argv);
debug &&
  console.log(`
email: "${email}"
pass: "${pass}"
`);

let page;

(async () => {
  try {
    page = await getBrowserPage(debug);
    await linkedin.login(page, email, pass);

    await page.screenshot({ path: 'tmp/after-login.png', fullPage: true });
    await closeBrowsers();
  } catch (e) {
    console.error('error:', e);
  }
})();
