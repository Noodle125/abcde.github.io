document.addEventListener("DOMContentLoaded", function() {
    const chatRoomContainer = document.getElementById("chat-room-container");
    const chatContainer = document.querySelector(".chat-container");
    const chatMessages = document.getElementById("chat-messages");
    const messageInput = document.getElementById("message-input");
    const submitButton = document.getElementById("submit-button");

    const newRoomInput = document.getElementById("new-room");
    const createRoomButton = document.getElementById("create-room-button");
    const chatRoomsDiv = document.getElementById("chat-rooms");
    const roomNameHeader = document.getElementById("room-name");

    const database = firebase.database();
    const auth = firebase.auth();
    let currentRoom = "general";
    let currentUser;

    auth.onAuthStateChanged(function(user) {
        if (user) {
            currentUser = user;
            loadChatRooms();
        }
    });

    createRoomButton.addEventListener("click", function() {
        const roomName = newRoomInput.value.trim();
        if (roomName) {
            database.ref('chatrooms/' + roomName).set({
                createdAt: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
                newRoomInput.value = "";
                loadChatRooms();
            });
        }
    });

    function loadChatRooms() {
        chatRoomsDiv.innerHTML = "";
        database.ref('chatrooms').on('child_added', function(snapshot) {
            const roomName = snapshot.key;
            const roomElement = document.createElement("div");
            roomElement.textContent = roomName;
            roomElement.classList.add("chat-room");
            roomElement.addEventListener("click", function() {
                enterChatRoom(roomName);
            });
            chatRoomsDiv.appendChild(roomElement);
        });
    }

    function enterChatRoom(roomName) {
        currentRoom = roomName;
        roomNameHeader.textContent = "Chat Room: " + roomName;
        chatRoomContainer.style.display = "none";
        chatContainer.style.display = "block";
        loadMessages();
    }

    submitButton.addEventListener("click", function() {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const message = {
                text: messageText,
                uid: currentUser.uid,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            database.ref('messages/' + currentRoom).push(message).then(() => {
                messageInput.value = "";
            });
        }
    });

    function loadMessages() {
        chatMessages.innerHTML = "";
        database.ref('messages/' + currentRoom).on('child_added', function(snapshot) {
            const messageData = snapshot.val();
            const messageElement = document.createElement("div");
            messageElement.textContent = messageData.text;
            chatMessages.appendChild(messageElement);
        });
    }
});
