module.exports = async ({
  navigationManager,
  profileManager,
  db,
  limitForScrolling
}) => {
  try {
    await navigationManager.softNavigation(
      "https://www.linkedin.com/mynetwork/"
    );
    await navigationManager.scrollToPageBottom(limitForScrolling);
    const profiles = await profileManager.getPageProfiles();
    profiles.forEach(uid => db.findOrCreateByUid(uid));
  } catch (e) {
    console.error("[checkMyNetwork ERROR]:", e);
  }
};
