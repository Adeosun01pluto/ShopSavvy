const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRnTyX6vi4GD_i_G-mXOypesVJlc3_QFI",
  authDomain: "shopsavvy-aa5ab.firebaseapp.com",
  projectId: "shopsavvy-aa5ab",
  storageBucket: "shopsavvy-aa5ab.appspot.com",
  messagingSenderId: "200351623921",
  appId: "1:200351623921:web:7c89f9b0a9c7d0cdb81750",
  measurementId: "G-D4YYM7KPNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export { auth, db,googleProvider, facebookProvider, twitterProvider };
