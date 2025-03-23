// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, getDocs, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDIS0NT8DN6FDV-lSQnmGmnO999sQl5kbg",
    authDomain: "chat-app-2d518.firebaseapp.com",
    projectId: "chat-app-2d518",
    storageBucket: "chat-app-2d518.firebasestorage.app",
    messagingSenderId: "187148667173",
    appId: "1:187148667173:web:72688c1b31ac95a88172cc"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new GoogleAuthProvider();

let currentUser, chatWith;

// Handle Login
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('loginBtn').addEventListener('click', () => {
        signInWithPopup(auth, provider).then((result) => {
            showSection('searchSection');
            saveUser(result.user);
        }).catch(console.error);
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            showSection('searchSection');
            saveUser(user);
        } else {
            showSection('loginSection');
        }
    });

    document.getElementById('searchBtn').addEventListener('click', searchUsers);
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
});

// Save user to Firestore
async function saveUser(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        await setDoc(userRef, { uid: user.uid, name: user.displayName });
    }
}

// Search Users
async function searchUsers() {
    let searchInput = document.getElementById('searchUser').value.trim().toLowerCase();
    let usersSnapshot = await getDocs(collection(db, "users"));
    let userListDiv = document.getElementById('userList');

    userListDiv.innerHTML = "";
    usersSnapshot.forEach((doc) => {
        let userData = doc.data();
        if (userData.name.toLowerCase().includes(searchInput) && userData.uid !== currentUser.uid) {
            let userElement = document.createElement('div');
            userElement.innerHTML = `<p>${userData.name} <button onclick="startChat('${userData.uid}')">Chat</button></p>`;
            userListDiv.appendChild(userElement);
        }
    });
}

// Start Chat
window.startChat = (otherUserId) => {
    chatWith = otherUserId;
    showSection('chatSection');
    loadMessages();
};

// Send Message
async function sendMessage() {
    let messageInput = document.getElementById('messageInput').value.trim();
    if (messageInput && chatWith) {
        await addDoc(collection(db, "chats"), {
            sender: currentUser.uid,
            receiver: chatWith,
            message: messageInput,
            timestamp: new Date()
        });
        document.getElementById('messageInput').value = "";
    }
}

// Load Messages
function loadMessages() {
    let chatMessages = document.getElementById('chatMessages');
    let q = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    onSnapshot(q, (snapshot) => {
        chatMessages.innerHTML = "";
        snapshot.forEach((doc) => {
            let data = doc.data();
            if ((data.sender === currentUser.uid && data.receiver === chatWith) || 
                (data.sender === chatWith && data.receiver === currentUser.uid)) {
                let msgElement = document.createElement('p');
                msgElement.textContent = `${data.sender === currentUser.uid ? 'You' : 'Them'}: ${data.message}`;
                msgElement.classList.add("message", data.sender === currentUser.uid ? "sent" : "received");
                chatMessages.appendChild(msgElement);
            }
        });
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    });
}

// Show Sections
function showSection(sectionId) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('chatSection').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    showSection('loginSection'); // Ensure login is visible on page load
});

document.getElementById("loginBtn").addEventListener("click", function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
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


