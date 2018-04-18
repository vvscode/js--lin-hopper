const argv = require("optimist")
  .usage("Usage: $0 -e [email] -p [pass]")
  .demand("e")
  .alias("e", "email")
  .describe("e", "Email for login")
  .demand("p")
  .alias("p", "pass")
  .describe("p", "Password for login").argv;

console.log(argv);
