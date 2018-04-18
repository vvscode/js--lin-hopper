const puppeteer = require("puppeteer");
const optimist = require("optimist");

const argv = optimist
  .usage("Usage: $0 -e [email] -p [pass]")
  .demand("e")
  .alias("e", "email")
  .describe("e", "Email for login")
  .demand("p")
  .alias("p", "pass")
  .describe("p", "Password for login")
  .boolean("debug").argv;

console.log(argv);

const { email, pass, debug } = argv;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let browser;

(async () => {
  browser = await puppeteer.launch({
    headless: !debug
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
  );

  await page.goto("https://www.linkedin.com/");
  var login = await page.$("#login-email");
  await login.type(email);
  var pass = await page.$("#login-password");
  await pass.type(pass);
  await page.click("#login-submit");
  await sleep(15000);
  await page.screenshot({ path: "news.png", fullPage: true });
  await browser.close();
})();
