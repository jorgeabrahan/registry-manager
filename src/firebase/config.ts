import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const FIREBASE_APP = initializeApp(FIREBASE_CONFIG)
const FIREBASE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_AUTH = getAuth(FIREBASE_APP)

export { FIREBASE_APP, FIREBASE_DB, FIREBASE_AUTH }
