// @ts-check
const { getBrowserPage, closeBrowsers } = require("./utils/browser");
const linkedin = require("./utils/linkedin");
const Db = require("./utils/db");
const argv = require("./utils/argv");

const LIMIT_FOR_VISITING = 10;
const LIMIT_FOR_SCROLLING = 4;

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
    page = await getBrowserPage(debug);
    page.on("console", msg => console.log(`[client console]`, msg.text()));
    await linkedin.login(page, email, pass);

    const navigationManager = linkedin.navigation(page);
    const profileManager = linkedin.profile(page, db);
    await navigationManager.softNavigation(
      "https://www.linkedin.com/mynetwork/"
    );
    await navigationManager.scrollToPageBottom(LIMIT_FOR_SCROLLING);
    const profiles = await profileManager.getPageProfiles();
    profiles.forEach(uid => db.findOrCreateByUid(uid));

    try {
      await new Promise(resolve => {
        const loopOverProfiles = async () => {
          const profile = db.getNextProfileToView();
          if (!profile || profilesCounter > LIMIT_FOR_VISITING) {
            return resolve();
          }
          await profileManager.visitProfile(profile.uid);
          profilesCounter += 1;
          loopOverProfiles();
        };

        loopOverProfiles();
      });
    } catch (e) {
      console.error("[ERROR]:", e);
    }

    await closeBrowsers();
    await db.close();
    console.log(getExitBanner("Done!"));
  } catch (e) {
    console.error("error:", e);
  }
})();
