// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnmUP7T5n7Vl3eRdGrDl4Eo-ulNJAPe3Q",
  authDomain: "e-commerce-4387b.firebaseapp.com",
  projectId: "e-commerce-4387b",
  storageBucket: "e-commerce-4387b.firebasestorage.app",
  messagingSenderId: "1051973612864",
  appId: "1:1051973612864:web:ffea3422974ef6b77d76a5",
  measurementId: "G-T4BYKKG17N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);