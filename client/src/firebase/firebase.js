// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBcnFtjb5oBPVXPNXjvDiyHkPjomtjpJYo",
    authDomain: "e-learning-33156.firebaseapp.com",
    projectId: "e-learning-33156",
    storageBucket: "e-learning-33156.firebasestorage.app",
    messagingSenderId: "827008543438",
    appId: "1:827008543438:web:905d83a5a3dbf1a4347e9f",
    measurementId: "G-XHWZZ25JWG"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
