document.addEventListener("DOMContentLoaded", function() {
    const authContainer = document.getElementById("auth-container");
    const profileContainer = document.getElementById("profile-container");
    const forgotPasswordContainer = document.getElementById("forgot-password-container");

    const emailInput = document.getElementById("email");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const ageInput = document.getElementById("age");
    const loginButton = document.getElementById("login-button");
    const signupButton = document.getElementById("signup-button");
    const forgotPasswordButton = document.getElementById("forgot-password-button");

    const nameInput = document.getElementById("name");
    const avatarInput = document.getElementById("avatar");
    const saveProfileButton = document.getElementById("save-profile-button");
    const logoutButton = document.getElementById("logout-button");

    const forgotEmailInput = document.getElementById("forgot-email");
    const sendCodeButton = document.getElementById("send-code-button");
    const resetCodeInput = document.getElementById("reset-code");
    const newPasswordInput = document.getElementById("new-password");
    const resetPasswordButton = document.getElementById("reset-password-button");
    const backToLoginButton = document.getElementById("back-to-login-button");

    const auth = firebase.auth();
    const database = firebase.database();
    const storage = firebase.storage();

    function showProfileSetup() {
        authContainer.style.display = "none";
        profileContainer.style.display = "block";
    }

    function showForgotPassword() {
        authContainer.style.display = "none";
        forgotPasswordContainer.style.display = "block";
    }

    function backToLogin() {
        forgotPasswordContainer.style.display = "none";
        authContainer.style.display = "block";
    }

    loginButton.addEventListener("click", function() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                database.ref('users/' + user.uid).once('value').then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log("User exists, proceeding to profile setup or chat room.");
                        // Redirect to chat room or other functionality
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
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const age = ageInput.value.trim();
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                database.ref('users/' + user.uid).set({
                    email: email,
                    username: username,
                    age: age
                }).then(() => {
                    showProfileSetup();
                });
            })
            .catch((error) => {
                console.error("Signup error:", error);
            });
    });

    saveProfileButton.addEventListener("click", function() {
        const user = auth.currentUser;
        const name = nameInput.value.trim();
        const avatarFile = avatarInput.files[0];

        if (user && name && avatarFile) {
            const avatarRef = storage.ref('avatars/' + user.uid + '/' + avatarFile.name);
            avatarRef.put(avatarFile).then(() => {
                avatarRef.getDownloadURL().then((avatarURL) => {
                    database.ref('users/' + user.uid).update({
                        name: name,
                        avatar: avatarURL
                    }).then(() => {
                        console.log("Profile updated, redirecting to chat room.");
                        // Redirect to chat room or other functionality
                    });
                });
            });
        }
    });

    forgotPasswordButton.addEventListener("click", showForgotPassword);
    backToLoginButton.addEventListener("click", backToLogin);

    sendCodeButton.addEventListener("click", function() {
        const email = forgotEmailInput.value.trim();
        auth.sendPasswordResetEmail(email).then(() => {
            console.log("Password reset email sent.");
        }).catch((error) => {
            console.error("Password reset error:", error);
        });
    });

    resetPasswordButton.addEventListener("click", function() {
        const code = resetCodeInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        auth.verifyPasswordResetCode(code).then(() => {
            auth.confirmPasswordReset(code, newPassword).then(() => {
                console.log("Password has been reset.");
                backToLogin();
            }).catch((error) => {
                console.error("Password reset error:", error);
            });
        }).catch((error) => {
            console.error("Invalid reset code:", error);
        });
    });

    logoutButton.addEventListener("click", function() {
        auth.signOut().then(() => {
            console.log("User signed out.");
            authContainer.style.display = "block";
            profileContainer.style.display = "none";
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    });
});
