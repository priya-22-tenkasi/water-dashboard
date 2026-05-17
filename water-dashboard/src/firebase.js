import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBm1DZwbVfMc0TbqOOr7k8YaZUnqnQ4ipM",
  authDomain: "dashboard-login-6fc49.firebaseapp.com",
  projectId: "dashboard-login-6fc49",
  storageBucket: "dashboard-login-6fc49.firebasestorage.app",
  messagingSenderId: "741799624899",
  appId: "1:741799624899:web:da37c65166ef3fe3b2a276",
  measurementId: "G-T4330B1PC5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);