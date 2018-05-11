const fs = require("fs");
const path = require("path");
const Loki = require("lokijs");
const { promisify } = require("es6-promisify");

const DB_PATH = path.resolve(`${__dirname}/../tmp/db.json`);
const PROFILES_COLLECTION_NAME = "PROFILES";
let db;
let profiles;

const initDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, "{}");
  }

  db = new Loki(DB_PATH, {
    autosave: true
  });

  profiles = db.getCollection(PROFILES_COLLECTION_NAME);
  if (!profiles) {
    profiles = db.addCollection(PROFILES_COLLECTION_NAME, {
      unique: ["uid"]
    });
  }
  profiles.on("error", errDoc =>
    console.error(`[${PROFILES_COLLECTION_NAME}] error:`, errDoc)
  );
};

const findOrCreateByUid = uid =>
  profiles.by("uid", uid) ||
  profiles.insert({
    uid,
    lastVisited: 0
  });

module.exports = () => {
  initDb();

  const close = promisify(db.close.bind(db));

  return {
    findOrCreateByUid,
    close
  };
};
