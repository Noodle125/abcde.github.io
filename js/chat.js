// chat.js
document.addEventListener("DOMContentLoaded", function() {
    const chatRoomContainer = document.getElementById("chat-room-container");
    const chatContainer = document.querySelector(".chat-container");
    const chatMessages = document.getElementById("chat-messages");
    const messageInput = document.getElementById("message-input");
    const submitButton = document.getElementById("submit-button");
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
            loadChatRooms();
        }
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
