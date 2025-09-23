// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcWYHGj6eC1wZ8wbCw-FzLh4rJc-JrFFk",
  authDomain: "cabana-403ac.firebaseapp.com",
  projectId: "cabana-403ac",
  storageBucket: "cabana-403ac.appspot.com",
  messagingSenderId: "480413456280",
  appId: "1:480413456280:web:e7507fef974df7533c7ded",
  measurementId: "G-DKMQGTKFHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
