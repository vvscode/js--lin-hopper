module.exports = async ({ db, profileManager, limitForVisiting }) => {
  let profilesCounter = 0;
  try {
    await new Promise(resolve => {
      const loopOverProfiles = async () => {
        const profile = db.getNextProfileToView();
        if (!profile || profilesCounter >= limitForVisiting) {
          return resolve();
        }
        await profileManager.visitProfile(profile.uid);
        profilesCounter += 1;
        return setTimeout(loopOverProfiles, 0);
      };

      return loopOverProfiles();
    });
  } catch (e) {
    console.error("[crawlProfiles ERROR]:", e);
  }
  return profilesCounter;
};
