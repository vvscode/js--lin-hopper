// @ts-check
/* global window */
const time = require("../time");

module.exports = page => {
  const softNavigation = async targetUrl => {
    await page.evaluate(url => {
      window.history.pushState(null, null, url);
      window.history.pushState(null, null, "/someUnhandledAdress");
      window.history.back();
    }, targetUrl);
    return time.sleep(500);
  };

  const scrollToPageBottom = (
    iterationsLimit = Number.MAX_SAFE_INTEGER - 10
  ) => {
    /* eslint-disable no-console */
    console.debug(`[scrollToPageBottom]: ${iterationsLimit}`);
    return page.evaluate(maxIterations => {
      const SCROLL_STEP = 19999;
      const SCROLL_DELAY = 5000;
      let lastScrollPosition = 0;
      let counter = 0;
      const scrollableContainer = window.document.body.parentElement;
      return new Promise(resolve => {
        const scroll = () => {
          console.log(`[scrollToPageBottom] iteration #${counter}`);
          return setTimeout(() => {
            scrollableContainer.scrollTop += SCROLL_STEP;
            return setTimeout(() => {
              if (
                (counter && counter > maxIterations) ||
                scrollableContainer.scrollTop === lastScrollPosition
              ) {
                return resolve("[scrollToPageBottom] finished");
              }
              counter += 1;
              lastScrollPosition = scrollableContainer.scrollTop;
              return scroll();
            }, SCROLL_DELAY);
          }, SCROLL_DELAY / 2);
        };
        scroll();
      });
    }, iterationsLimit);
  };

  return {
    softNavigation,
    scrollToPageBottom
  };
};
