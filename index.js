const { getBrowserPage, closeBrowsers } = require("./utils/browser");
const linkedin = require("./utils/linkedin");
const Db = require("./utils/db");
const argv = require("./utils/argv");

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
const db = Db();

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
    profiles.forEach(uid => db.findOrCreateByUid(uid));
    await closeBrowsers();
    await db.close();
    console.log("Done!");
  } catch (e) {
    console.error("error:", e);
  }
})();
