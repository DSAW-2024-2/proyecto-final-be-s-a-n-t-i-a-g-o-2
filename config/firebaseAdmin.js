const admin = require('firebase-admin');
const serviceAccount = require('./firebaseAdminConfig.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://proyecto-final-web-santiago-2.firebaseio.com"
});

module.exports = admin;
