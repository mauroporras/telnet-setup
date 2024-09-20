// Import the necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCIoL9RlD15JzJo1XDPBzTm1xR6StBUaxI",
  authDomain: "csc-surveylink.firebaseapp.com",
  projectId: "csc-surveylink",
  storageBucket: "csc-surveylink.appspot.com",
  messagingSenderId: "473701857342",
  appId: "1:473701857342:web:73573aa5b8fc7db50b396f",
  measurementId: "G-71DM2KZP94"
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the initialized app and Firestore instance
export { app, db, serverTimestamp };
