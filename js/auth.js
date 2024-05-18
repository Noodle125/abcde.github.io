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
    const logoutButton = document.getElementById("logout-button");

    const auth = firebase.auth();
    const database = firebase.database();
    const storage = firebase.storage();

    function showProfileSetup() {
        authContainer.style.display = "none";
        profileContainer.style.display = "block";
    }

    function showChatRooms() {
        profileContainer.style.display = "none";
        chatRoomContainer.style.display = "block";
    }

    loginButton.addEventListener("click", function() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                database.ref('users/' + user.uid).once('value').then((snapshot) => {
                    if (snapshot.exists()) {
                        showChatRooms();
                    } else {
                        showProfileSetup();
                    }
                });
            })
            .catch((error) => {
                console.error("Login error:", error);
            });
    });

    signupButton.addEventListener("click", function() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                showProfileSetup();
            })
            .catch((error) => {
                console.error("Signup error:", error);
            });
    });

    saveProfileButton.addEventListener("click", function() {
        const user = auth.currentUser;
        const username = usernameInput.value.trim();
        const avatarFile = avatarInput.files[0];

        if (user && username && avatarFile) {
            const avatarRef = storage.ref('avatars/' + user.uid + '/' + avatarFile.name);
            avatarRef.put(avatarFile).then(() => {
                avatarRef.getDownloadURL().then((avatarURL) => {
                    database.ref('users/' + user.uid).set({
                        username: username,
                        avatar: avatarURL
                    }).then(() => {
                        showChatRooms();
                    });
                });
            });
        }
    });

    logoutButton.addEventListener("click", function() {
        auth.signOut().then(() => {
            authContainer.style.display = "block";
            profileContainer.style.display = "none";
            chatRoomContainer.style.display = "none";
            chatContainer.style.display = "none";
        });
    });
});
