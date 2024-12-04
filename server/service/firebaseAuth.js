import admin from "./firebaseAdminSetup.js";
// Firebase Authentication Verification Function
const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken; // Returns user data from Firebase (uid, email, etc.)
  } catch (error) {
    throw new Error("Invalid Firebase ID Token");
  }
};

export default verifyFirebaseToken;
