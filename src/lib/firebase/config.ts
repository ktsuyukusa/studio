import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAqXhkPnc8p8coutoZKnfLtvs92TRbDoeY",
  authDomain: "globalink-ceo.firebaseapp.com",
  projectId: "globalink-ceo",
  storageBucket: "globalink-ceo.appspot.com",
  messagingSenderId: "199954181433",
  appId: "1:199954181433:web:4010fa8c76dc960477cce8",
  measurementId: "G-7G7T4BRGPV"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  // Check if analytics is supported before initializing
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
