// Firebase configuration (unchanged)
const firebaseConfig = {
  // ... your Firebase configuration
};

// Initialize Firebase (unchanged)
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase database (unchanged)
const database = firebase.database();

document.addEventListener("DOMContentLoaded", function() {
  const usernameInput = document.getElementById("username-input");
  const messageInput = document.getElementById("message-input");
  const submitButton = document.getElementById("submit-button");
  const chatMessages = document.getElementById("chat-messages");

  // **Photo Slideshow variables**
  const imageContainer = document.getElementById('slideshow-container');
  const currentImage = document.getElementById('current-image');
  const slideshowControls = document.getElementById('slideshow-controls');

  let imageIndex = 0; // Keeps track of the current image
  const images = [  // Array of image paths (replace with your image paths)
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    // ... add more images
  ];

  // Function to display the next slide
  function nextSlide() {
    imageIndex++;
    if (imageIndex >= images.length) {
      imageIndex = 0;
    }
    currentImage.src = images[imageIndex];
  }

  // Function to display the previous slide
  function prevSlide() {
    imageIndex--;
    if (imageIndex < 0) {
      imageIndex = images.length - 1;
    }
    currentImage.src = images[imageIndex];
  }

  // Initial slide display (optional, to ensure a starting image)
  currentImage.src = images[imageIndex];

  // **Disappearing Announcement functionality**
  const announcement = document.getElementById('announcement');
  const usernameInput = document.getElementById('username-input');

  announcement.addEventListener('click', function() {
    announcement.classList.add('disappear'); // Add a CSS class for animation
    usernameInput.focus(); // Set focus on username input after animation
  });

  // Function to add a message to the chat (unchanged)
  function addMessage(username, message) {
    // ... (unchanged)
  }

  // Event listener for the submit button (unchanged)
  submitButton.addEventListener("click", function() {
    // ... (unchanged)
  });

  // Load existing messages from Firebase Realtime Database (unchanged)
