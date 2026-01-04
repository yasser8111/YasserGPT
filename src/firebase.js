import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfybpy6Ui-MbEavOaJ1X4uPBaxvvLKbB0",
  authDomain: "database-b99fa.firebaseapp.com",
  databaseURL: "https://database-b99fa-default-rtdb.firebaseio.com",
  projectId: "database-b99fa",
  storageBucket: "database-b99fa.firebasestorage.app",
  messagingSenderId: "628676680782",
  appId: "1:628676680782:web:cf4fcdd9e45ad3ebbd771f",
  measurementId: "G-GG9FCR0XTT",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
