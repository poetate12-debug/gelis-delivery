// Firebase configuration untuk GELIS DELIVERY
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtFhSm-94AJioYgKuX1rAZFR-ZZNDCK38",
  authDomain: "gelis-delivery-563c0.firebaseapp.com",
  projectId: "gelis-delivery-563c0",
  storageBucket: "gelis-delivery-563c0.firebasestorage.app",
  messagingSenderId: "983429410102",
  appId: "1:983429410102:web:96ecff97afa3a644399797",
  measurementId: "G-29Q0ZPGMB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

export default app;