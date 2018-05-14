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
  .default({
    email: process.env.LI_USER,
    pass: process.env.LI_PASSWORD
  })
  .boolean("debug")
  .describe("debug", "Run script in debug mode")
  .boolean("noImages")
  .describe("noImages", "Run script in debug mode")
  .boolean("checkMyNetwork")
  .describe("checkMyNetwork", "Check my-network for new profiles")
  .describe(
    "crawlProfiles",
    "Crawl over profiles from db (Might set limit of profiles)"
  );

if (process.argv.length < 3) {
  optimist.showHelp();
  process.exit();
}

module.exports = argv;
