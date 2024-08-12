const express = require("express");
const http = require("http");
const dotenv = require("dotenv").config();
const { Server } = require("socket.io");
const path = require("path");

// Create a server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
const route = require('./routes/index');

//Set up middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

//Connect to MongoDB
require('./configs/database.connect')();

//Set up routes
// route(app);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
