// @ts-check
const navigation = require("./navigation");
const { sleep, random } = require("../time");

const MIN_RANDOM_WAIT = 15 * 1000;
const MAX_RANDOM_WAIT = 60 * 1000;

module.exports = (page, db) => {
  const navigationManager = navigation(page);

  const getPageProfiles = () =>
    page.evaluate(() =>
      /* global window */
      (
        window.document.body.innerHTML.match(/\/in\/([a-zA-Z0-9-]+)/g) || []
      ).map(i => i.split("/").pop())
    );

  const visitProfile = async (uid, randomWait = true) => {
    console.log(`[visitProfile]: ${uid}`);
    await navigationManager.softNavigation(
      `https://www.linkedin.com/in/${uid}/`
    );
    const currentProfile = db.findOrCreateByUid(uid);
    currentProfile.lastVisited = Date.now();

    if (randomWait) {
      await sleep(random(MIN_RANDOM_WAIT, MAX_RANDOM_WAIT));
    }

    const profiles = await getPageProfiles();
    profiles.forEach(profileId => db.findOrCreateByUid(profileId));
  };

  return {
    getPageProfiles,
    visitProfile
  };
};
