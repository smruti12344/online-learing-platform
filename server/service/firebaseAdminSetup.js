import admin from 'firebase-admin';
import serviceAccount from '../firebase/firebase-admin-sdk.json' assert { type: 'json' };

// Download this file from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;