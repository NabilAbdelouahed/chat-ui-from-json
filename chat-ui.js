let userIdToUsername = {}; // Global variable to store user ID to username mapping

// Load the file structure from a JSON file
async function loadFileStructure() {
    try {
        const response = await fetch('./file_structure.json'); // Adjust the path if needed
        const fileStructure = await response.json();
        console.log('File Structure:', fileStructure);
        populateSidebar(fileStructure); // Populate the sidebar with file structure
    } catch (error) {
        console.error('Error loading file structure:', error);
    }
}

// Populate Sidebar with File Structure
function populateSidebar(fileStructure) {
    const fileList = document.getElementById("fileList");

    for (const category in fileStructure) {
        const categoryItem = document.createElement("li");
        categoryItem.innerHTML = `<strong>${category}</strong>`;
        fileList.appendChild(categoryItem);

        for (const theme in fileStructure[category]) {
            const themeItem = document.createElement("li");
            themeItem.innerHTML = `<em>${theme}</em>`;
            fileList.appendChild(themeItem);

            fileStructure[category][theme].forEach(file => {
                const filePath = `./files/Andrew Tate's The Real World (Hustler's University)/${category}/${theme}/${file}`;
                const fileItem = document.createElement("li");
                fileItem.innerHTML = `<a href="#" data-file="${filePath}">${file}</a>`;
                fileList.appendChild(fileItem);
            });
        }
    }
}

// Load the user mapping from the users.json file
// Load the user mapping from the NDJSON users.json file
async function loadUserMapping() {
    try {
        const response = await fetch('./files/Andrew Tate\'s The Real World (Hustler\'s University)/users.json'); // Adjust path as needed
        const usersDataRaw = await response.text(); // Read the file as raw text

        // Split the NDJSON file into individual lines and parse each line as JSON
        const usersData = usersDataRaw
            .split('\n') // Split by newlines
            .filter(line => line.trim() !== '') // Remove empty lines
            .map(line => JSON.parse(line)); // Parse each line as JSON

        // Populate the userIdToUsername mapping
        usersData.forEach(userEntry => {
            if (userEntry.user && userEntry.user._id && userEntry.user.username) {
                userIdToUsername[userEntry.user._id] = userEntry.user.username;
            }
        });

        console.log('User Mapping:', userIdToUsername); // Debugging
    } catch (error) {
        console.error("Error loading user mapping:", error);
    }
}


// Handle File Selection
document.addEventListener("click", event => {
    if (event.target.tagName === "A" && event.target.dataset.file) {
        event.preventDefault();
        const fileUrl = event.target.getAttribute("data-file");
        loadChatData(fileUrl);
    }
});

// Load chat data from a JSON file
async function loadChatData(chatDataUrl) {
    try {
        const chatResponse = await fetch(chatDataUrl);
        const chatDataRaw = await chatResponse.text(); // Fetch the file as raw text
        const chatData = parseMultipleJsonBlocks(chatDataRaw); // Parse multiple JSON blocks

        // Pass the userIdToUsername mapping to displayChat
        displayChat(chatData, userIdToUsername);
    } catch (error) {
        console.error("Error loading chat data:", error);
    }
}

// Utility to parse multiple JSON blocks
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

// Display chat messages in the chat container
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

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Utility to format a timestamp
function formatTimestamp(unixTimestamp) {
    return new Date(unixTimestamp).toLocaleString(); // Example: "11/26/2024, 10:00:00 AM"
}

// Initialize the app
(async function initializeApp() {
    await loadUserMapping(); // Ensure user mapping is loaded
    loadFileStructure(); // Populate the file sidebar
})();
