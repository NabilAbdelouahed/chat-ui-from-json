// chat-ui.js

// Example JSON Data (replace this with a fetch call to load your JSON file)
const chatDataUrl = "./chat.json"; // Adjust the path

async function loadChatData() {
    try {
        const response = await fetch(chatDataUrl);
        const chatData = await response.json();
        displayChat(chatData);
    } catch (error) {
        console.error("Error loading chat data:", error);
    }
}


function formatTimestamp(unixTimestamp) {
    return new Date(unixTimestamp).toLocaleString(); // Example: "11/26/2024, 10:00:00 AM"
}


function displayChat(chatData) {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = ""; // Clear previous messages if any

    chatData.forEach((chat) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message");
        messageDiv.classList.add(chat.sender === "Alice" ? "sender" : "receiver");
        messageDiv.innerHTML = `
            <strong>${chat.sender}</strong><br>
            ${chat.message}<br>
            <small>${formatTimestamp(chat.timestamp)}</small>
        `;
        chatMessages.appendChild(messageDiv);
    });
}

// Load the chat data when the page loads
loadChatData();
