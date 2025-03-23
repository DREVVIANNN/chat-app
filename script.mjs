import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDIS0NT8DN6FDV-lSQnmGmnO999sQl5kbg",
    authDomain: "chat-app-2d518.firebaseapp.com",
    projectId: "chat-app-2d518",
    storageBucket: "chat-app-2d518.firebasestorage.app",
    messagingSenderId: "187148667173",
    appId: "1:187148667173:web:72688c1b31ac95a88172cc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginBtn").addEventListener("click", function() {
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
    .then((result) => {
        console.log("User signed in:", result.user);
        alert("Login successful!");
        showSection('searchSection'); // Redirect to search section
    })
    .catch((error) => {
        console.error("Login Error:", error.message);
        alert("Login failed: " + error.message);
    });
});
