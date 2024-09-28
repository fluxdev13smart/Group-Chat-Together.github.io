// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Enter chat function
function enterChat() {
    const displayName = document.getElementById('display-name').value;
    const profilePicture = document.getElementById('profile-picture').files[0];

    if (!displayName || !profilePicture) {
        alert('Please enter your display name and choose a profile picture.');
        return;
    }

    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('chat-room').style.display = 'block';

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('profile-img').src = e.target.result;
    };
    reader.readAsDataURL(profilePicture);
    document.getElementById('user-name').textContent = displayName;

    // Listen for new messages
    database.ref('messages').on('child_added', function(snapshot) {
        const data = snapshot.val();
        addMessageToChat(data.name, data.message, data.profilePicture);
    });
}

// Function to send message
function sendMessage() {
    const message = document.getElementById('message').value;
    const displayName = document.getElementById('user-name').textContent;
    const profilePicture = document.getElementById('profile-img').src;

    if (message.trim() === '') {
        alert('Please enter a message.');
        return;
    }

    // Save message to Firebase
    database.ref('messages').push({
        name: displayName,
        message: message,
        profilePicture: profilePicture
    });

    document.getElementById('message').value = '';
}

// Function to add message to chat
function addMessageToChat(name, message, profilePicture) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const profileImgElement = document.createElement('img');
    profileImgElement.src = profilePicture;
    messageElement.appendChild(profileImgElement);

    const messageContentElement = document.createElement('div');
    messageContentElement.classList.add('message-content');
    messageContentElement.textContent = `${name}: ${message}`;
    messageElement.appendChild(messageContentElement);

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}
