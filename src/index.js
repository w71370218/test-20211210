const port = process.env.PORT || 3000;

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const path = require('path');

var currentUsers = {};

const uri = process.env.MONGODB_URI;
var MongoClient = require('mongodb').MongoClient;
//const { userInfo } = require('os');
//const { socket } = require('../public/game/scenes/main_space.js');
var character;

MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    console.log("mongodb connected!");
    var dbo = db.db("mydb");
    

    io.on('connection', (socket) => {
        socket.on('login', function (loginData) {
            dbo.collection("users").find({username: loginData.username}).toArray(function(er, result) {
                if (er) {
                    socket.emit('loginResponse', "抱歉 伺服器目前有些錯誤 請稍後再重試1");
                    console.log(er);
                };
                if (result.length != 0){
                    if (result[0]['password'] === loginData.password){
                        //login correct
                        var newLoginTime = new Date();
                        result[0]['lastLoginTime'] = newLoginTime;
                        dbo.collection("users").updateOne({username: loginData.username}, {$set: {lastLoginTime: newLoginTime}}, function(e) {
                            if (e) {
                                socket.emit('loginResponse', "抱歉 伺服器目前有些錯誤 請稍後再重試2");
                                console.log(e);
                            };
                            //console.log("1 document updated");
                            delete result[0]['password']; //delete some Sensitive information
                            character = result[0];
                          });
                    
                        dbo.collection("clothing").find().toArray(function(error, clothing) {
                            if (error) {
                                socket.emit('loginResponse', "抱歉 伺服器目前有些錯誤 請稍後再重試3");
                                console.log(error);
                            };
                            /* 前提user的clothing裡要有key
                            for (var key in result[0]['clothing']){
                                for (var c in clothing){
                                    if (result[0]['clothing'][key].toString() == clothing[c]['_id'].toString()){
                                        upda[clothing[c]['type']] = clothing[c];
                                    }
                                }
                            }
                            console.log(upda);
                            
                            dbo.collection("users").updateOne({username: loginData.username}, {$set: {clothing: upda}}, function(err, res) {
                                console.log(upda);
                                if (err) {
                                    socket.emit('loginResponse', "抱歉 伺服器目前有些錯誤 請稍後再重試");
                                    console.log(err);
                                }
                                console.log('update!!');
                            });
                            */
                            socket.emit('loginSucceed', clothing);
                        });
                        
                            //console.log("1 document updated");
                            delete result[0]['password']; //delete some Sensitive information
                            character = result[0];
                        //console.log(socket.id+' connect!'); // x8WIv7-mJelg7on_ALbx
                        
                    } else {
                        socket.emit('loginResponse', "輸入密碼不正確");
                    }
                } else {
                    socket.emit('loginResponse', "帳號不存在");
                }
              });
            //if ( loginData.username )
            //socket.emit('loginResponse', );
        });

        /* already login */
        socket.on('playerOnline', function (id) {
            character['id'] = id;
            currentUsers[id] = character;
            /* 傳送 */
            //socket.emit('csrftoken', );
            socket.emit('online_users', currentUsers);
            socket.broadcast.emit('newPlayer', currentUsers[id]);
        
            /* 離線 */
            socket.on('disconnect', function() {
                console.log(id + ' disconnected!');
                delete currentUsers[id];
                io.emit('disconnected', id);
            });
            
            socket.on('playerMovement', function (movementData) {
                currentUsers[id].x = movementData.x;
                currentUsers[id].y = movementData.y;
                currentUsers[id].direction = movementData.direction;
                currentUsers[id].m_x= movementData.m_x;
                currentUsers[id].m_y= movementData.m_y;
                // emit a message to all players about the player that moved
                socket.broadcast.emit('playerMoved', currentUsers[id]);
                //console.log(currentUsers);
            });
        });
        
    });

    
    /*
    var myobj = { id: 1, username:"admin", password:"admin", nickname:"admin", class:"admin", type: "web", signInTime : new Date(), lastLoginTime: new Date().toLocaleString('zh-tw'), status:"nomal", friends:{}};
    dbo.collection("users").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
    */
    //db.close();
  });

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(new Date().toLocaleString('zh-tw'));
    return res.sendFile(path.join(__dirname, '../public/client.html'));
});
    



httpServer.listen(port);