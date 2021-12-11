const fs = require("fs");

const port = process.env.PORT || 3000;

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const path = require('path');

let key_data = fs.readFileSync('key.json','utf8');
const key_json = JSON.parse(key_data);
const mongodbkey = key_json.mongodbkey;

var mongoClient = require("mongodb").MongoClient;

mongoClient.connect( mongodbkey, function (err, client) {
    console.log("mongodb connect!");  
    client.close();
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/client.html'));
});

io.on("connection", (socket) => {
    console.log("server connect!!");
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    // ...
});

httpServer.listen(port);

