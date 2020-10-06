
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.GOOGLE_FIRESTORE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anime-store-api.firebaseio.com"
});

module.exports = admin;