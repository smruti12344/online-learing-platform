import admin from 'firebase-admin';
import serviceAccount from '' assert { type: 'json' };

// Download this file from Firebase Console
const serviceAccount = JSON.parse(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;