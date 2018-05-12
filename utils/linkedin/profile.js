// @ts-check
const navigation = require("./navigation");

module.exports = (page, db) => {
  const navigationManager = navigation(page);

  const getPageProfiles = () =>
    page.evaluate(() =>
      /* global window */
      (
        window.document.body.innerHTML.match(/\/in\/([a-zA-Z0-9-]+)/g) || []
      ).map(i => i.split("/").pop())
    );

  const visitProfile = async uid => {
    console.log(`[visitProfile]: ${uid}`);
    await navigationManager.softNavigation(
      `https://www.linkedin.com/in/${uid}/`
    );
    const currentProfile = db.findOrCreateByUid(uid);
    currentProfile.lastVisited = Date.now();

    const profiles = await getPageProfiles();
    profiles.forEach(profileId => db.findOrCreateByUid(profileId));
  };

  return {
    getPageProfiles,
    visitProfile
  };
};
