// chat-ui.js

const chatDataUrl = "./files/Andrew Tate's The Real World (Hustler's University)/Public Channels/Hustler's Campus/01HST8F8W7P3VYBXCSDAVSS0GF.json"; 
const usersDataUrl = "./files/Andrew Tate's The Real World (Hustler's University)/users.json"; 

async function loadChatData() {
    try {
        // Fetch chat data
        const chatResponse = await fetch(chatDataUrl);
        const chatDataRaw = await chatResponse.text(); // Fetch the file as raw text
        const chatData = parseMultipleJsonBlocks(chatDataRaw); // Parse multiple JSON blocks

        // Fetch and parse users data
        const usersResponse = await fetch(usersDataUrl);
        const usersDataRaw = await usersResponse.text(); // Fetch raw NDJSON
        const usersData = parseNdjson(usersDataRaw); // Convert NDJSON to an array

        // Create a mapping of user IDs to usernames for easier lookup
        const userIdToUsername = {};
        usersData.forEach(user => {
            userIdToUsername[user.user._id] = user.user.username;
        });

        // Display the chat
        displayChat(chatData, userIdToUsername);
    } catch (error) {
        console.error("Error loading chat data:", error);
    }
}

function parseNdjson(ndjson) {
    // Split lines and parse each line as JSON
    return ndjson
        .trim() // Remove extra whitespace
        .split("\n") // Split by newline
        .map(line => JSON.parse(line)); // Parse each line into a JSON object
}


function parseMultipleJsonBlocks(rawData) {
    // Split the data by blocks, parsing each block individually
    const jsonBlocks = rawData.split(/\]\s*\[/); // Match `][` or variations
    const chatData = jsonBlocks.map((block, index, array) => {
        // Add opening or closing brackets as necessary
        const formattedBlock =
            (index === 0 ? block.trim() : "[" + block.trim()) +
            (index === array.length - 1 ? "" : "]");
        return JSON.parse(formattedBlock);
    });

    // Flatten the array of arrays into a single array
    return chatData.flat();
}

function formatTimestamp(unixTimestamp) {
    return new Date(unixTimestamp).toLocaleString(); // Example: "11/26/2024, 10:00:00 AM"
}

function displayChat(chatData, userIdToUsername) {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = ""; // Clear previous messages if any

    chatData.forEach(chat => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message");
        messageDiv.classList.add(chat.author === "01GHTKFE8HGS1V33WP05S51CTZ" ? "sender" : "receiver");

        // Look up the username from the mapping
        const username = userIdToUsername[chat.author] || "Unknown User";

        messageDiv.innerHTML = `
            <strong>${username}</strong><br>
            ${chat.content}<br>
            <small>${formatTimestamp(chat.timestamp)}</small>
        `;
        chatMessages.appendChild(messageDiv);
    });
}


// Load the chat data when the page loads
loadChatData();
