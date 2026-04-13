import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Firebase web config — these keys are PUBLIC by design.
 * Security is enforced by Firestore & Storage rules, not by hiding keys.
 * https://firebase.google.com/docs/projects/api-keys#api-keys-for-firebase-are-different
 */
const firebaseConfig = {
  apiKey: "AIzaSyB-Wejc2YxQUeA7GKsr4-KWxz2SFuxQ0L0",
  authDomain: "instudio-e9eb5.firebaseapp.com",
  projectId: "instudio-e9eb5",
  storageBucket: "instudio-e9eb5.firebasestorage.app",
  messagingSenderId: "15176173399",
  appId: "1:15176173399:web:c965e25d3fdf7a2f97e012",
};

// Avoid re-initializing on hot reload in development.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
