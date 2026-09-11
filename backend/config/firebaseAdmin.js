const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const {getMessaging} = require("firebase-admin/messaging");
const serviceAccount = require("../config/serviceAccountKey.json");

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

const firebaseAuth = getAuth(firebaseApp);
const firebaseMessaging = getMessaging(firebaseApp);

module.exports = {
  firebaseAuth,
  firebaseMessaging,
};