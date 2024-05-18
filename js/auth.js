// auth.js
document.addEventListener("DOMContentLoaded", function() {
    const authContainer = document.getElementById("auth-container");
    const profileContainer = document.getElementById("profile-container");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");
    const signupButton = document.getElementById("signup-button");
    const usernameInput = document.getElementById("username");
    const avatarInput = document.getElementById("avatar");
    const saveProfileButton = document.getElementById("save-profile-button");
    const logoutButton = document.getElementById("logout-button");

    let currentUser = null;

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
                            // Load chat rooms or chat container here
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

    function loadUserProfile() {
        if (currentUser) {
            database.ref('users/' + currentUser.uid).once('value').then(snapshot => {
                const userProfile = snapshot.val();
                if (userProfile) {
                    profileContainer.style.display = "none";
                    // Load chat rooms or chat container here
                } else {
                    profileContainer.style.display = "block";
                }
            }).catch(error => {
                console.error("Error loading user profile:", error);
            });
        }
    }
});
