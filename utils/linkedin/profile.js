module.exports = page => {
  const getPageProfiles = () =>
    page.evaluate(() =>
      /* global window */
      window.document.body.innerHTML
        .match(/\/in\/([a-zA-Z0-9-]+)/g)
        .map(i => i.split("/").pop())
    );

  return {
    getPageProfiles
  };
};
