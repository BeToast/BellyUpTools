// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyDf1XNzQEG2g7TOWhfx7uyaOuXwuXOkiFM",
   authDomain: "bellyuptools.firebaseapp.com",
   projectId: "bellyuptools",
   storageBucket: "bellyuptools.appspot.com",
   messagingSenderId: "941512727373",
   appId: "1:941512727373:web:bc49586f8e0b28fff97504",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore();
