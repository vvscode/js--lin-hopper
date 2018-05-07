const fs = require("fs");
const { getBrowserPage, closeBrowsers } = require("./utils/browser");
const argv = require("./utils/argv");
const linkedin = require("./utils/linkedin");

const { email, pass, debug } = argv;

if (debug) {
  console.debug(
    "Script arguments:",
    argv,
    `
    email: "${email}"
    pass: "${pass}"
    `
  );
}

let page;

(async () => {
  try {
    page = await getBrowserPage(debug);
    page.on("console", msg => console.log(`[client console]`, msg.text()));
    await linkedin.login(page, email, pass);

    const navigationManager = linkedin.navigation(page);
    const profileManager = linkedin.profile(page);
    await navigationManager.softNavigation(
      "https://www.linkedin.com/mynetwork/"
    );
    await navigationManager.scrollToPageBottom();
    const profiles = await profileManager.getPageProfiles();
    fs.writeFileSync("./accounts.txt", profiles.join("\n"));
    await closeBrowsers();
  } catch (e) {
    console.error("error:", e);
  }
})();
