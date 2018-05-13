// @ts-check
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const random = (min = 0, max) => Math.random() * (max - min) + min;

module.exports = {
  sleep,
  random
};
