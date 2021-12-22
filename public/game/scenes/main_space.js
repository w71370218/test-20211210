import loading from '../loading.js';
import Character from '../character.js';

if (window.innerWidth > 930){
    var w = 930;
    var movable_range_A_x = 460;
    var movable_range_B_x = 0;
    var movable_range_C_x = w;
} else {
    var w = 360;
}
if (window.innerHeight > 620){
    var h = 620;
    var movable_range_A_y = 390;
    var movable_range_B_y = h;
    var movable_range_C_y = h;
} else {
    var h = 240;
}

var size = 1;
var character;
var character_w,character_h;
var x = movable_range_A_x;
var y = movable_range_A_y + 100;
var m_x = x;
var m_y = y;
var online_users = {};
var ch ;
var socket;
var found = false;

const main_space = {
    key: 'main_space',
    init: function() {
        console.log('init');

    },
    preload: function(){
        // 載入資源
        loading(this,w,h);

        this.load.image("bg1", "./game/assets/img/bg/base.png");
        this.load.image("character",'./game/assets/img/character/131.svg');

        //console.log(online_users);
        
        
    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        this.input.mouse.capture = true;
        

        var bg1 = this.add.sprite(0,0, "bg1").setOrigin(0,0);
        bg1.displayWidth = w;
        bg1.displayHeight = h;
        //1.0

        var self = this;
        this.socket = io();
        
        this.otherPlayers = this.physics.add.group();
        //console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        //new Character(character.id , character.x ,character.y);
        ch = this.ch;

        this.socket.on('online_users', function (characters) {
            Object.keys(characters).forEach(function (id) {
                if (characters[id].id === self.socket.id) {
                    ch = addPlayer(self, characters[id]);
                } else {
                    addOtherPlayers(self, characters[id]);
                }
            });
        });
        this.socket.on('newPlayer', function (playerInfo) {
            addOtherPlayers(self, playerInfo);
          });
        this.socket.on('disconnected', function (id) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (id === otherPlayer.id) {
                    otherPlayer.destroy();
                }
            });
        });
        this.socket.on('playerMoved', function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (otherPlayer) {
              if (playerInfo.id === otherPlayer.id) {
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
              }
            });
          });
        
    },
    update: function(){
        // 遊戲狀態更新
        

        var pointer = this.input.activePointer;
        
        if (this.ch){
            //console.log(pointer.event);
            if (pointer.leftButtonDown()){
                m_x = this.input.x;
                m_y = this.input.y;
                if (movable(m_x, m_y)){
                    if (ch.x!=m_x && ch.y!=m_y){
                        console.log("yes!")
                        //size += 0.005*(m_y-y);
                        //console.log(0.005*(m_y-y));
                        //console.log(m_y,size);
                        //??????size 
                
                    }
                }
            }
            if (movable(m_x, m_y)){
                if (m_x-ch.x!=0) {
                    if(m_x-ch.x>0) {
                        if (m_x-ch.x>10){
                            if (movable(ch.x +5, ch.y)){
                                ch.x += 5;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        } else if ((m_x-ch.x<=10) && (m_x-ch.x)%5==0) {
                            if (movable(ch.x +5, ch.y)){
                                ch.x += 5;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        } else {
                            if (movable(ch.x +1, ch.y)){
                                ch.x += 1;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        }
                    } else {
                        if (m_x-ch.x<-10){
                            if (movable(ch.x -5, ch.y)){
                                ch.x -= 5;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        } else if ((m_x-ch.x>=-10) && (m_x-ch.x)%5==0) {
                            if (movable(ch.x -5, ch.y)){
                                ch.x -= 5;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        } else {
                            if (movable(ch.x -1, ch.y)){
                                ch.x -= 1;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        }
                    }
                }
                if (m_y-ch.y!=0) {
                    if(m_y-ch.y>0) {
                        if (m_y-ch.y>10){
                            if (movable(ch.x, ch.y +5)){
                                ch.y += 5;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        } else if ((m_y-ch.y<=10) && (m_y-ch.y)%5==0) {
                            if (movable(ch.x, ch.y +5)){
                                ch.y += 5;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        } else {
                            if (movable(ch.x, ch.y +1)){
                                ch.y += 1;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        }
                    } else {
                        if (m_y-ch.y<-10)
                        {
                            if (movable(ch.x, ch.y -5)){
                                ch.y -= 5;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        } else if ((m_y-ch.y>=-10) && (m_y-ch.y)%5==0) {
                            if (movable(ch.x, ch.y -5)){
                                ch.y -= 5;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        } else {
                            if (movable(ch.x, ch.y -1)){
                                ch.y -= 1;
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y });
                            }
                        }
                    }
                }
            }
            //this.physics.world.wrap(this.ch);
        }
        
    }
}
/* function */
function movable(x, y, A_x = movable_range_A_x , A_y = movable_range_A_y, B_x = movable_range_B_x, B_y = movable_range_B_y, C_x = movable_range_C_x, C_y = movable_range_C_y) {
    var ap_ab = (x-A_x)*(B_y-A_y)-(y-A_y)*(B_x-A_x);
    var bp_bc = (x-B_x)*(C_y-B_y)-(y-B_y)*(C_x-B_x);
    var cp_ca = (x-C_x)*(A_y-C_y)-(y-C_y)*(A_x-C_x);
    //console.log(ap_ab, bp_bc, cp_ca);
    if ((ap_ab>0 && bp_bc>0 && cp_ca>0)||(ap_ab<0 && bp_bc<0 && cp_ca<0)){
        return true;
    }
    else {
        return false;
    }
}

function addPlayer(self, playerInfo) {
    self.ch = self.physics.add.image(playerInfo.x, playerInfo.y, "character").setOrigin(0.5,0.7);
    return self.ch;
}
function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.physics.add.image(playerInfo.x, playerInfo.y, "character").setOrigin(0.5,0.7);
    otherPlayer.id = playerInfo.id;
    self.otherPlayers.add(otherPlayer);
}


export { size, character, character_w, character_h, x , y, m_x, m_y, online_users, ch, //socket,
    main_space, 
    movable, addPlayer, addOtherPlayers
  };