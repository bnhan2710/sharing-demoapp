const express = require("express");
const http = require("http");
const dotenv = require("dotenv").config();
const { Server } = require("socket.io");
const path = require("path");
const chatController = require('./controllers/chat.controllers');
// Create a server
const { ExpressPeerServer } = require('peer'); 
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const route = require('./routes/index');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
chatController(io);

//Set up middleware
app.use('/peerjs', peerServer); 
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

//Connect to MongoDB
require('./configs/database.connect')();

//Set up routes
route(app);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
