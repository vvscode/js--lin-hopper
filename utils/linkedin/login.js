const { sleep } = require('../time');

module.exports = async (page, email, pass) => {
  await page.goto('https://www.linkedin.com/');
  var loginInput = await page.$('#login-email');
  await loginInput.type(`${email}`);
  var passInput = await page.$('#login-password');
  await passInput.type(`${pass}`);
  await page.click('#login-submit');
  await sleep(5000);
};
