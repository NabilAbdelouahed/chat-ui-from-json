// chat-ui.js

const chatDataUrl = "./files/Andrew Tate's The Real World (Hustler's University)/Public Channels/Copywriting/01GGQAW295ZTD4JSD1HWYQRPYX.json"; 

async function loadChatData() {
    try {
        const response = await fetch(chatDataUrl);
        const chatDataRaw = await response.text(); // Fetch the file as raw text
        const chatData = parseMultipleJsonBlocks(chatDataRaw); // Parse multiple JSON blocks
        displayChat(chatData);
    } catch (error) {
        console.error("Error loading chat data:", error);
    }
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

function displayChat(chatData) {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = ""; // Clear previous messages if any

    chatData.forEach((chat) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message");
        messageDiv.classList.add(chat.sender === "CobraTate" ? "sender" : "receiver");
        messageDiv.innerHTML = `
            <strong>${chat.author}</strong><br>
            ${chat.content}<br>
            <small>${formatTimestamp(chat.timestamp)}</small>
        `;
        chatMessages.appendChild(messageDiv);
    });
}

// Load the chat data when the page loads
loadChatData();
