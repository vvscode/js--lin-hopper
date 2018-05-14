// @ts-check
require("dotenv").config();
const optimist = require("optimist");

const { argv } = optimist
  .usage("Usage: $0 -e [email] -p [pass]")
  .demand("e")
  .alias("e", "email")
  .describe("e", "Email for login")
  .demand("p")
  .alias("p", "pass")
  .describe("p", "Password for login")
  .boolean("debug")
  .describe("debug", "Run script in debug mode")
  .boolean("noImages")
  .describe("noImages", "Run script in debug mode")
  .boolean("crawlProfiles")
  .describe("crawlProfiles", "Crawl over profiles from db")
  .boolean("checkMyNetwork")
  .describe("checkMyNetwork", "Check my-network for new profiles")
  .demand(["e", "p"])
  .default({
    email: process.env.LI_USER,
    pass: process.env.LI_PASSWORD
  });

if (process.argv.length < 3) {
  optimist.showHelp();
  process.exit();
}

module.exports = argv;
