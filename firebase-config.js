// Firebase configuration - Compat version
const firebaseConfig = {
    apiKey: "AIzaSyDbYxHHg3408w_Irby_T70cigN4fZuHi0Q",
    authDomain: "shareabite-595c9.firebaseapp.com",
    projectId: "shareabite-595c9",
    storageBucket: "shareabite-595c9.firebasestorage.app",
    messagingSenderId: "1061815067540",
    appId: "1:1061815067540:web:b80cb5efc9765e7300a581",
    measurementId: "G-93611PDXE2"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();