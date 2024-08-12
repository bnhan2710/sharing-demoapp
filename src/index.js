const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

// Create a server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
