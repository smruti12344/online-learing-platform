import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Load the Firebase service account key
const serviceAccount = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT;


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized");
}

export default admin;
