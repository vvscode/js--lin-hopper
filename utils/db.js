// @ts-check
const fs = require("fs");
const path = require("path");
const Loki = require("lokijs");
const { promisify } = require("es6-promisify");

const DB_PATH = path.resolve(`${__dirname}/../tmp/db.json`);
const PROFILES_COLLECTION_NAME = "PROFILES";
let db;
let profiles;

const initDb = async () => {
  db = await new Promise(resolve => {
    console.debug(`[initDb]:`, DB_PATH);
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, "{}");
    }

    const newDb = new Loki(DB_PATH, {
      autosave: true,
      autoload: true,
      autoloadCallback: () => resolve(newDb)
    });
  });

  profiles = db.getCollection(PROFILES_COLLECTION_NAME);
  if (!profiles) {
    console.debug(`collection ${PROFILES_COLLECTION_NAME} was added`);
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

const getProfilesNumber = () => profiles.data.length;

const getNextProfileToView = () =>
  profiles
    .chain()
    .find()
    .limit(1)
    .simplesort("lastVisited")
    .data()
    .pop();

module.exports = async () => {
  await initDb();

  const close = promisify(db.close.bind(db));

  return {
    findOrCreateByUid,
    getProfilesNumber,
    getNextProfileToView,
    close
  };
};
