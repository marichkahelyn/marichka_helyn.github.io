import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuZynPtlF4lQXQ2YfOOKcRh_htP-ycj8k",
  authDomain: "vibetour-8e403.firebaseapp.com",
  projectId: "vibetour-8e403",
  storageBucket: "vibetour-8e403.firebasestorage.app",
  messagingSenderId: "102860771049",
  appId: "1:102860771049:web:cf442b4b6d9014f44d2a78",
  measurementId: "G-E6H9RPV3V0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);