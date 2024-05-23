// firebase.js

// Import the Firebase core module and any specific services you need
import firebase from 'firebase/compat/app'; // Use 'compat/app' for Firebase v9 (Modular SDK) backward compatibility
import 'firebase/compat/firestore'; // Use 'compat/firestore' for Firebase v9 (Modular SDK) backward compatibility


const firebaseConfig = {
  apiKey: "apikey",
  authDomain: "authDomain",
  projectId: "projectID",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Firestore
export const firestore = firebase.firestore();