const fs = require("fs");

const port = process.env.PORT || 3000;

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(Date());
    console.log(new Date().toUTCString());
    console.log(Date().toLocaleString());
    console.log(Date().toLocaleString('zh-tw'));
    return res.sendFile(path.join(__dirname, '../public/client.html'));
});
    
io.on("connection", (socket) => {
    console.log("server connect!!");
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    // ...
});

httpServer.listen(port);

