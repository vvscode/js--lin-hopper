// @ts-check
const { getBrowserPage, closeBrowsers } = require("./utils/browser");
const linkedin = require("./utils/linkedin");
const Db = require("./utils/db");
const argv = require("./utils/argv");

const crawlProfilesModule = require("./modules/crawlProfiles");
const checkMyNetworkContactsModule = require("./modules/checkMyNetworkContacts");

const LIMIT_FOR_VISITING = 15;
const LIMIT_FOR_SCROLLING = Number.MAX_SAFE_INTEGER - 100;

const { email, pass, debug, noImages, crawlProfiles, checkMyNetwork } = argv;

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
let db;
let startProfilesNumber;

const startTime = new Date();
let profilesCounter = 0;

const getExitBanner = msg => {
  const endProfilesNumber = db.getProfilesNumber();
  const endTime = new Date();

  return `
    -=| ${msg} |=-
    It have been working
    since ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}
    upto  ${endTime.toLocaleDateString()} ${endTime.toLocaleTimeString()}
    there were ${endProfilesNumber - startProfilesNumber} profiles added
    there are ${endProfilesNumber} profiles in db
    ${profilesCounter} were visited
    `;
};

/* eslint-disable consistent-return */
(async () => {
  try {
    db = await Db();
    startProfilesNumber = db.getProfilesNumber();
    page = await getBrowserPage({
      debug,
      noImages
    });
    page.on("console", msg => console.log(`[client console]`, msg.text()));
    await linkedin.login(page, email, pass);

    const navigationManager = linkedin.navigation(page);
    const profileManager = linkedin.profile(page, db);

    if (checkMyNetwork) {
      await checkMyNetworkContactsModule({
        navigationManager,
        profileManager,
        db,
        limitForScrolling: LIMIT_FOR_SCROLLING
      });
    }

    if (crawlProfiles) {
      profilesCounter = await crawlProfilesModule({
        db,
        profileManager,
        limitForVisiting: LIMIT_FOR_VISITING
      });
    }

    await closeBrowsers();
    await db.close();
    console.log(getExitBanner("Done!"));
  } catch (e) {
    console.error("error:", e);
  }
})();
