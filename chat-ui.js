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

// Populate Sidebar with Expandable Structure
function populateSidebar(fileStructure) {
    const fileList = document.getElementById("fileList");

    for (const category in fileStructure) {
        const categoryItem = document.createElement("li");
        categoryItem.innerHTML = `
            <span class="toggle">&#9654;</span> 
            <strong>${category}</strong>
        `;
        categoryItem.classList.add("category");

        const themeList = document.createElement("ul");
        themeList.classList.add("nested");

        for (const theme in fileStructure[category]) {
            const themeItem = document.createElement("li");
            themeItem.innerHTML = `
                <span class="toggle">&#9654;</span> 
                <em>${theme}</em>
            `;
            themeItem.classList.add("theme");

            const fileList = document.createElement("ul");
            fileList.classList.add("nested");

            fileStructure[category][theme].forEach(file => {
                const filePath = `./files/Andrew Tate's The Real World (Hustler's University)/${category}/${theme}/${file}`;
                const fileItem = document.createElement("li");
                fileItem.innerHTML = `<a href="#" data-file="${filePath}">${file}</a>`;
                fileList.appendChild(fileItem);
            });

            themeItem.appendChild(fileList);
            themeList.appendChild(themeItem);
        }

        categoryItem.appendChild(themeList);
        fileList.appendChild(categoryItem);
    }

    addSidebarToggleFunctionality();
}

// Add Toggle Functionality to Expand/Collapse
function addSidebarToggleFunctionality() {
    const toggles = document.querySelectorAll(".toggle");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", function () {
            const parent = this.parentElement;
            const nestedList = parent.querySelector(".nested");
            if (nestedList) {
                nestedList.classList.toggle("active");
                this.innerHTML = nestedList.classList.contains("active") ? "&#9660;" : "&#9654;"; // Arrow change
            }
        });
    });
}

// Load the user mapping from the NDJSON users.json file
async function loadUserMapping() {
    try {
        const response = await fetch('./files/Andrew Tate\'s The Real World (Hustler\'s University)/users.json'); // Adjust path as needed
        const usersDataRaw = await response.text();

        const usersData = usersDataRaw
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => JSON.parse(line));

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
        const chatDataRaw = await chatResponse.text();
        const chatData = parseMultipleJsonBlocks(chatDataRaw);

        displayChat(chatData, userIdToUsername);
    } catch (error) {
        console.error("Error loading chat data:", error);
    }
}

// Utility to parse multiple JSON blocks
function parseMultipleJsonBlocks(rawData) {
    const jsonBlocks = rawData.split(/\]\s*\[/);
    const chatData = jsonBlocks.map((block, index, array) => {
        const formattedBlock =
            (index === 0 ? block.trim() : "[" + block.trim()) +
            (index === array.length - 1 ? "" : "]");
        return JSON.parse(formattedBlock);
    });

    return chatData.flat();
}

// Display chat messages in the chat container
function displayChat(chatData, userIdToUsername) {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = "";

    chatData.forEach(chat => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message");
        messageDiv.classList.add(chat.author === "01GHTKFE8HGS1V33WP05S51CTZ" ? "sender" : "receiver");

        const username = userIdToUsername[chat.author] || "Unknown User";

        messageDiv.innerHTML = `
            <strong>${username}</strong><br>
            ${chat.content}<br>
            <small>${formatTimestamp(chat.timestamp)}</small>
        `;
        chatMessages.appendChild(messageDiv);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Utility to format a timestamp
function formatTimestamp(unixTimestamp) {
    return new Date(unixTimestamp).toLocaleString();
}

// Initialize the app
(async function initializeApp() {
    await loadUserMapping();
    loadFileStructure();
})();
