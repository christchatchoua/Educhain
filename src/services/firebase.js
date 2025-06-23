// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC67SNcaC7tE4WKgAhZDJMOOt_5wek7xgg",
  authDomain: "educhain-fe2e8.firebaseapp.com",
  projectId: "educhain-fe2e8",
  storageBucket: "educhain-fe2e8.firebasestorage.app",
  messagingSenderId: "428159243023",
  appId: "1:428159243023:web:757d189357d7f91382a47a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export
const db = getFirestore(app);

export { app, db };