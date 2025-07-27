// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwd2bu48TRiJoiaeVsYoJuA7TYWLXa3C4",
  authDomain: "amrita-lahari.firebaseapp.com",
  databaseURL: "https://amrita-lahari.firebaseio.com",
  projectId: "amrita-lahari",
  storageBucket: "amrita-lahari.appspot.com",
  messagingSenderId: "230997160576",
  appId: "1:230997160576:web:3f9cd1d749b64cc9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
