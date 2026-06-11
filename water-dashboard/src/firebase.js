import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// LOGIN FIREBASE
const authConfig = {
  apiKey: "AIzaSyBm1DZwbVfMc0TbqOOr7k8YaZUnqnQ4ipM",
  authDomain: "dashboard-login-6fc49.firebaseapp.com",
  projectId: "dashboard-login-6fc49",
  storageBucket: "dashboard-login-6fc49.firebasestorage.app",
  messagingSenderId: "741799624899",
  appId: "1:741799624899:web:da37c65166ef3fe3b2a276",
};

const authApp =
  getApps().length === 0
    ? initializeApp(authConfig)
    : getApps()[0];

export const auth = getAuth(authApp);

// WATER METER DATABASE
const waterApp = initializeApp(
  {
    databaseURL:
      "https://water-meter-3fb03-default-rtdb.asia-southeast1.firebasedatabase.app",
  },
  "waterMeterApp"
);

export const db = getDatabase(waterApp);