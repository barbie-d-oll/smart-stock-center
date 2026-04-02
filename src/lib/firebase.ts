// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // PASTE YOUR COPIED CONFIG HERE:
  apiKey: "AIzaSyARoGQdvAGtrq45ds8EojQ1HNUdC5jupEU",
  authDomain: "smart-stock-center.firebaseapp.com",
  projectId: "smart-stock-center",
  storageBucket: "smart-stock-center.firebasestorage.app",
  messagingSenderId: "923328263778",
  appId: "1:923328263778:web:f7bfb844c0f9788a78033b",
   measurementId: "G-GEJ87KSL51"
};

// Initialize Firebase (Check if app already exists to prevent errors during hot-reload)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// The "Plugs" we will use in our pages
export const db = getFirestore(app);
export const auth = getAuth(app);