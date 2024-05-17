// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADmNV47sId0qdGDiWvl6awe1_5PSRncjM",
  authDomain: "ndx-b1e1d.firebaseapp.com",
  databaseURL: "https://ndx-b1e1d-default-rtdb.firebaseio.com",
  projectId: "ndx-b1e1d",
  storageBucket: "ndx-b1e1d.appspot.com",
  messagingSenderId: "512322480998",
  appId: "1:512322480998:web:d8d8948413e254f330f6a7",
  measurementId: "G-S6VCWNNJQC"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

document.addEventListener("DOMContentLoaded", function() {
    const authContainer = document.getElementById("auth-container");
    const profileContainer = document.getElementById("profile-container");
    const chatRoomContainer = document.getElementById("chat-room-container");
    const chatContainer = document.querySelector(".chat-container");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");
    const signupButton = document.getElementById("signup-button");
    const usernameInput = document.getElementById("username");
    const avatarInput = document.getElementById("avatar");
    const saveProfileButton = document.getElementById("save-profile-button");
    const chatMessages = document.getElementById("chat-messages");
    const messageInput = document.getElementById("message-input");
    const submitButton = document.getElementById("submit-button");
    const logoutButton = document.getElementById("logout-button");
    const chatRooms = document.getElementById("chat-rooms");
    const newRoomInput = document.getElementById("new-room");
    const createRoomButton = document.getElementById("create-room-button");
    const roomNameHeader = document.getElementById("room-name");

    let currentUser = null;
    let currentRoom = "general";

    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            console.log("User logged in:", user);
            authContainer.style.display = "none";
            loadUserProfile();
        } else {
            console.log("No user logged in");
            currentUser = null;
            authContainer.style.display = "block";
            profileContainer.style.display = "none";
            chatRoomContainer.style.display = "none";
            chatContainer.style.display = "none";
        }
    });

    loginButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                authContainer.style.display = "none";
            })
            .catch(error => {
                console.error("Error logging in:", error);
                alert(error.message);
            });
    });

    signupButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                authContainer.style.display = "none";
            })
            .catch(error => {
                console.error("Error signing up:", error);
                alert(error.message);
            });
    });

    saveProfileButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const avatarFile = avatarInput.files[0];
        if (username && avatarFile) {
            const storageRef = storage.ref('avatars/' + currentUser.uid + '/' + avatarFile.name);
            storageRef.put(avatarFile).then(snapshot => {
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    currentUser.updateProfile({
                        displayName: username,
                        photoURL: downloadURL
                    }).then(() => {
                        database.ref('users/' + currentUser.uid).set({
                            username: username,
                            avatar: downloadURL
                        }).then(() => {
                            profileContainer.style.display = "none";
                            loadChatRooms();
                        });
                    });
                });
            });
        } else {
            alert("Please enter a username and select an avatar.");
        }
    });

    logoutButton.addEventListener("click", () => {
        auth.signOut().then(() => {
            window.location.reload();
        });
    });

    createRoomButton.addEventListener("click", () => {
        const roomName = newRoomInput.value.trim();
        if (roomName) {
            database.ref('chatRooms/' + roomName).set({
                createdAt: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
                loadChatRooms();
                newRoomInput.value = "";  // Clear the input field
            });
        } else {
            alert("Please enter a room name.");
        }
    });

    submitButton.addEventListener("click", () => {
        const messageText = messageInput.value.trim();
        if (messageText && currentUser) {
            database.ref('messages/' + currentRoom).push().set({
                username: currentUser.displayName || "Anonymous",
                message: messageText,
                userId: currentUser.uid,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            messageInput.value = ""; // Clear message input
        } else {
            alert("Please enter a message.");
        }
    });

    function loadUserProfile() {
        if (currentUser) {
            database.ref('users/' + currentUser.uid).once('value').then(snapshot => {
                const userProfile = snapshot.val();
                if (userProfile) {
                    profileContainer.style.display = "none";
                    loadChatRooms();
                } else {
                    profileContainer.style.display = "block";
                }
            }).catch(error => {
                console.error("Error loading user profile:", error);
            });
        }
    }

    function loadChatRooms() {
        chatRoomContainer.style.display = "block";
        chatRooms.innerHTML = "";
        database.ref('chatRooms').on('child_added', snapshot => {
            const roomName = snapshot.key;
            const roomElement = document.createElement("div");
            roomElement.textContent = roomName;
            roomElement.addEventListener("click", () => {
                currentRoom = roomName;
                loadMessages();
            });
            chatRooms.appendChild(roomElement);
        });
    }

    function loadMessages() {
        chatContainer.style.display = "block";
        chatMessages.innerHTML = "";
        roomNameHeader.textContent = currentRoom;
        database.ref('messages/' + currentRoom).on('child_added', snapshot => {
            const messageData = snapshot.val();
            const messageElement = document.createElement("div");
            messageElement.textContent = `${messageData.username}: ${messageData.message}`;
            chatMessages.appendChild(messageElement);
        });
    }
});
