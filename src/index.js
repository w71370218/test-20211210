const port = process.env.PORT || 3000;

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const path = require('path');

var current_users = {};

const uri = process.env.MONGODB_URI;
var MongoClient = require('mongodb').MongoClient;
//const { userInfo } = require('os');
//const { socket } = require('../public/game/scenes/main_space.js');

MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    console.log("mongodb connected!");
    /*
    var dbo = db.db("mydb");
    var myobj = { id: 1, username:"admin", password:"admin", nickname:"admin", class:"admin", type: "web", signInTime : new Date().toLocaleString('zh-tw'), lastLoginTime: new Date().toLocaleString('zh-tw'), status:"nomal", friends:{}};
    dbo.collection("users").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
    */
    db.close();
  });

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(new Date().toLocaleString('zh-tw'));
    return res.sendFile(path.join(__dirname, '../public/client.html'));
});
    
io.on('connection', (socket) => {
    
    var character = {'id':socket.id, 'x': 460, 'y': 490};
    //console.log(socket.id+' connect!'); // x8WIv7-mJelg7on_ALbx
    current_users[socket.id] = character;
    /* 傳送 */
    socket.emit('online_users', current_users);
    socket.broadcast.emit('newPlayer', current_users[socket.id]);

    /* 離線 */
    socket.on('disconnect', function() {
        console.log(socket.id + 'disconnected!');
        delete current_users[socket.id];
        io.emit('disconnected', socket.id);
     });
     
     socket.on('playerMovement', function (movementData) {
        current_users[socket.id].x = movementData.x;
        current_users[socket.id].y = movementData.y;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', current_users[socket.id]);
        //console.log(online_users);
    });
});


httpServer.listen(port);