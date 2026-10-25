const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const {getMessaging} = require("firebase-admin/messaging");
const fs = require("fs");
const path = require("path");

const renderKeyPath = "/etc/secrets/serviceAccountKey.json";
const localKeyPath = path.join(__dirname, "serviceAccountKey.json");

const keyPath = fs.existsSync(renderKeyPath)
  ? renderKeyPath
  : localKeyPath;

const serviceAccount = JSON.parse(
  fs.readFileSync(keyPath, "utf8")
);

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

const firebaseAuth = getAuth(firebaseApp);
const firebaseMessaging = getMessaging(firebaseApp);

module.exports = {
  firebaseAuth,
  firebaseMessaging,
};