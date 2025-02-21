require('dotenv').config();
const axios = require('axios');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Kick API Credentials
const KICK_ACCESS_TOKEN = process.env.KICK_ACCESS_TOKEN;
const KICK_CHANNEL_ID = process.env.KICK_CHANNEL_ID;

// Function to send a chat message
const sendMessage = async (message) => {
    try {
        const response = await axios.post(
            'https://api.kick.com/public/v1/chat',
            { content: message, type: "bot" },
            { headers: { Authorization: `Bearer ${KICK_ACCESS_TOKEN}` } }
        );
        console.log("Message sent:", response.data);
    } catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
    }
};

// Function to check chat for /leaderboard command
const checkChat = async () => {
    try {
        const response = await axios.get(
            `https://api.kick.com/public/v1/chat/messages?broadcaster_user_id=${KICK_CHANNEL_ID}`,
            { headers: { Authorization: `Bearer ${KICK_ACCESS_TOKEN}` } }
        );

        const messages = response.data.data;
        if (!messages) return;

        // Check if any message contains "/leaderboard"
        for (let msg of messages) {
            if (msg.content.toLowerCase().includes("/leaderboard")) {
                console.log("Leaderboard command detected!");
                await sendMessage("Hello World!");
                break;
            }
        }
    } catch (error) {
        console.error("Error checking chat:", error.response ? error.response.data : error.message);
    }
};

// Run checkChat every 10 seconds
setInterval(checkChat, 10000);

// Express route for Heroku
app.get("/", (req, res) => res.send("Kick Bot is running!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
