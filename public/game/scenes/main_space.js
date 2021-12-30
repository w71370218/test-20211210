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
var clothing;
var priority = {
    fore_foreground: 1,
    fore_fore_headWear: 2, 
    fore_fore_hairStyle: 3, 
    fore_facialDecoration:4,
    fore_eyeblow: 5,
    fore_eyes: 6,
    fore_nose: 7,
    fore_mouth: 8,
    fore_fore_cloths: 9,//
    fore_fore_pants:10,
    fore_shoes:11,
    fore_socks:12,
    back_fore_body:13,
    back_fore_pants:14,//
    back_fore_hairStyle:15,
    back_fore_headWear:16,
    fore_backgound:17,
    //
    right_foreground:18,
    fore_right_headWear:19,
    fore_right_hairStyle:20,
    right_facialDecoration:21,
    right_eyeblow:22,
    right_eyes:23,
    right_nose:24,
    right_mouth:25,
    fore_right_cloths:26,
    fore_right_body:27,
    back_right_cloths:28,//
    fore_right_pants:29,
    right_shoes:30,
    right_socks:31,
    back_right_body:32,//
    back_right_hairStyle:33,
    back_right_headWear:34,
    right_background:35,
    //
    left_foreground:36,
    fore_left_headWear:37,
    fore_left_hairStyle:38,
    left_facialDecoration:39,
    left_eyeblow:40,
    left_eyes:41,
    left_nose:42,
    left_mouth:43,
    fore_left_cloths:44,
    fore_left_body:45,
    back_left_cloths:46,//
    fore_left_pants:47,
    left_shoes:48,
    left_socks:49,
    back_left_body:50,//
    back_left_hairStyle:51,
    back_left_headWear:52,
    left_background:53,
    //
    back_foreground:54,
    fore_back_headWear:55, 
    fore_back_hairStyle:56, 
    fore_back_pants:57,//
    fore_back_cloths:58, 
    back_back_cloths:59, 
    back_back_pants:60,
    back_shoes:61,
    back_socks:62, 
    back_back_headWear:63,
    back_back_body:64, //
    back_backgound:65
};
var direction = ['fore', 'back', 'left', 'right'];

const main_space = {
    key: 'main_space',
    init: function(data) {
        console.log('init');
        this.clothing = data;
    },
    preload: function(){
        // 載入資源
        loading(this,w,h);
        //console.log(this.clothing);
        var clothing =  this.clothing;
        for (let i = 0; i < clothing.length; i++) {
            for (var key in clothing[i]["direction"]){
                if (clothing[i]["direction"][key].length != 0 && direction.includes(key)){
                    for (var k in clothing[i]["direction"][key]){
                        //console.log(clothing[i]["type"]);
                        if (direction.includes(k)){
                            //console.log(clothing[i]["type"]);
                            //console.log(k);
                            var url = './game/assets/img/player/'+ clothing[i]["type"] +'/'+ k +'/' + key + '/' + clothing[i]["filename"];
                            //url = readSVG(url);
                            this.load.svg(k +'_' + key + '_' + clothing[i]["type"] + '_' + clothing[i]["_id"], url);
                            var wk = './game/assets/img/player/'+ clothing[i]["type"] +'/'+ k +'/' + key + '/walk/' + clothing[i]["filename"];
                            var wk2 = './game/assets/img/player/'+ clothing[i]["type"] +'/'+ k +'/' + key + '/walk2/' + clothing[i]["filename"];
                            if (fileExists(wk) && fileExists(wk2)){
                                this.load.svg(k +'_' + key + '_' + clothing[i]["type"] + '_walk_' + clothing[i]["_id"], wk);
                                this.load.svg(k +'_' + key + '_' + clothing[i]["type"] + '_walk2_' + clothing[i]["_id"], wk2);
                            }
                        } else {
                            //console.log(clothing[i]["type"]);
                            //console.log(key);
                            this.load.svg(key + '_' + clothing[i]["type"] + '_' + clothing[i]["_id"], './game/assets/img/player/'+ clothing[i]["type"] +'/' + key + '/' + clothing[i]["filename"]);
                            //console.log(t);
                            var kw = './game/assets/img/player/'+ clothing[i]["type"] +'/' + key + '/walk/' + clothing[i]["filename"];
                            var kw2 = './game/assets/img/player/'+ clothing[i]["type"] +'/' + key + '/walk2/' + clothing[i]["filename"];
                            if (fileExists(kw) && fileExists(kw2)){
                                this.load.svg(key + '_' + clothing[i]["type"] + '_walk_' + clothing[i]["_id"],kw);
                                this.load.svg(key + '_' + clothing[i]["type"] + '_walk2_' + clothing[i]["_id"], kw2);
                            }
                        //console.log(clothing[i]["direction"][key][k]);
                        }
                    } 
                }
                
            }
        }
        
        this.load.image("bg1", "./game/assets/img/bg/base.png");
    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        console.clear();
        this.input.mouse.capture = true;
        
        var bg1 = this.add.sprite(0,0, "bg1").setOrigin(0,0);
        bg1.displayWidth = w;
        bg1.displayHeight = h;
        //1.0

        var self = this;
        this.socket = io();
        
        this.socket.on("connect", () => {
            this.socket.emit('playerOnline', self.socket.id);
        });
        
        this.otherPlayers = this.physics.add.group();
        ch = this.ch;
        this.socket.on('online_users', function (characters) {
            //console.log(characters);
            
            Object.keys(characters).forEach(function (id) {
                if (characters[id].id === self.socket.id) {
                    ch = addPlayer(self, characters[id]);
                    //console.log(ch)
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
                otherPlayer["direction"] = playerInfo.direction;
                otherPlayer["m_x"] = playerInfo.m_x;
                otherPlayer["m_y"] = playerInfo.m_y;
              }
            });
          });
        
    },
    update: function(){
        // 遊戲狀態更新
        
        //console.log();
        var pointer = this.input.activePointer;
        
        this.otherPlayers.getChildren().forEach(otherPlayer =>{
            if (otherPlayer){
                otherPlayer.setDepth(otherPlayer.y);
                setDirectionVisible(otherPlayer);
            }
        });

        if (this.ch){
            //console.log(pointer.event);
            //console.log(this.ch);
            this.ch.setDepth(this.ch.y);
            setDirectionVisible(this.ch);
            if (pointer.leftButtonDown()){
                m_x = this.input.x;
                m_y = this.input.y;
                /*
                if (movable(m_x, m_y)){
                    if (ch.x!=m_x && ch.y!=m_y){
                        console.log("yes!")
                        //size += 0.005*(m_y-y);
                        //console.log(0.005*(m_y-y));
                        //console.log(m_y,size);
                        //??????size 
                
                    }
                }
                */
            }

            if (movable(m_x, m_y)){
                this.ch.m_x = m_x;
                this.ch.m_y = m_y;
                if (m_x-ch.x!=0) {
                    if(m_x-ch.x>0) {
                        if (m_x-ch.x>10){
                            if (movable(ch.x +5, ch.y)){
                                ch.x += 5;
                                ch.direction = 'right';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        } else if ((m_x-ch.x<=10) && (m_x-ch.x)%5==0) {
                            if (movable(ch.x +5, ch.y)){
                                ch.x += 5;
                                ch.direction = 'right';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        } else {
                            if (movable(ch.x +1, ch.y)){
                                ch.x += 1;
                                ch.direction = 'right';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        }
                    } else {
                        if (m_x-ch.x<-10){
                            if (movable(ch.x -5, ch.y)){
                                ch.x -= 5;
                                ch.direction = 'left';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        } else if ((m_x-ch.x>=-10) && (m_x-ch.x)%5==0) {
                            if (movable(ch.x -5, ch.y)){
                                ch.x -= 5;
                                ch.direction = 'left';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        } else {
                            if (movable(ch.x -1, ch.y)){
                                ch.x -= 1;
                                ch.direction = 'left';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        }
                    }
                }
                if (m_y-ch.y!=0) {
                    if(m_y-ch.y>0) {
                        if (m_y-ch.y>10){
                            if (movable(ch.x, ch.y +5)){
                                ch.y += 5;
                                ch.direction = 'fore';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        } else if ((m_y-ch.y<=10) && (m_y-ch.y)%5==0) {
                            if (movable(ch.x, ch.y +5)){
                                ch.y += 5;
                                ch.direction = 'fore';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        } else {
                            if (movable(ch.x, ch.y +1)){
                                ch.y += 1;
                                ch.direction = 'fore';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        }
                    } else {
                        if (m_y-ch.y<-10)
                        {
                            if (movable(ch.x, ch.y -5)){
                                ch.y -= 5;
                                ch.direction = 'back';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        } else if ((m_y-ch.y>=-10) && (m_y-ch.y)%5==0) {
                            if (movable(ch.x, ch.y -5)){
                                ch.y -= 5;
                                ch.direction = 'back';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        } else {
                            if (movable(ch.x, ch.y -1)){
                                ch.y -= 1;
                                ch.direction = 'back';
                                this.socket.emit('playerMovement', { x: ch.x, y: ch.y ,direction: ch.direction, m_x: m_x, m_y: m_y});
                            }
                        }
                    }
                }
            }
        }
        
    }
}
/* function */
function fileExists(url)
{
    var http = new XMLHttpRequest();
    http.open('GET', url, true);
    http.send();
    return http.status!=404;
}

function readSVG(url, color) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    
    request.addEventListener("load", function(event) {
        //console.log(request.responseText);
        //console.log(typeof(request.responseXML));
        //console.log(request.responseXML.getElementsByTagName("path")[0].style.fill);
        var svg = request.responseXML;
        for (var pro in color){ //stop-color
            for(var eles in color[pro]){ // #未命名漸層_200 stop[stop-color]
                //console.log(eles);
                console.log(color);
                if (eles.includes('.')){
                    var c = svg.getElementsByClassName(eles);
                    for(var element in c){
                        svg.getElementsByClassName(eles)[element].style.cssText += pro+":"+ color[pro][eles];
                        console.log(c[element].style.cssText);
                    };
                } else if (eles.includes('#')){
                    var c = svg.getElementById(eles);
                    for(var element in c){
                        svg.getElementById(eles)[element].style.cssText += pro+":"+ color[pro][eles];
                        console.log(c[element].style.cssText);
                    };
                } else if (eles === null){
                    break;
                } else {
                    var c = svg.getElementsByTagName(eles);
                    for(var element in c){
                        svg.getElementsByTagName(eles)[element].style.cssText += pro+":"+ color[pro][eles];
                        console.log(c[element].style.cssText);
                    };
                    
                }
                //console.log(typeof(c));
                
            }
        }
        var encodedData = window.btoa(svg);
        console.log("data:image/svg+xml;base64,"+encodedData);
        
        return ("data:image/svg+xml;base64,"+encodedData);
        
    });
    request.send();
}

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

function addClothing(self, playerInfo) {
    var own_clothing = [];
    
    for(let k in playerInfo.clothing){
        for (var key in playerInfo.clothing[k]["direction"]){
            if (direction.includes(key)){
                for (var kk in playerInfo.clothing[k]["direction"][key]){
                    if (direction.includes(kk)){
                        var clo =  self.physics.add.image(0,0, kk + "_"+ key + "_"+playerInfo.clothing[k]["type"] + "_" + playerInfo.clothing[k]['_id']).setOrigin(0.5,0.8);
                        
                        if (clo["texture"]["key"] != "__MISSING"){
                            own_clothing.push(clo);
                        }
                        var clow = self.physics.add.image(0,0, kk + "_"+ key + "_"+playerInfo.clothing[k]["type"] + "_walk_" + playerInfo.clothing[k]['_id']).setOrigin(0.5,0.8);
                        if (clow["texture"]["key"] != "__MISSING"){
                            own_clothing.push(clow);
                        }
                        var clow2 = self.physics.add.image(0,0, kk + "_"+ key + "_"+playerInfo.clothing[k]["type"] + "_walk2_" + playerInfo.clothing[k]['_id']).setOrigin(0.5,0.8);
                        if (clow2["texture"]["key"] != "__MISSING"){
                            own_clothing.push(clow2);
                        }
                    } else {
                        var clo =  self.physics.add.image(0,0, key + "_"+playerInfo.clothing[k]["type"] + "_" + playerInfo.clothing[k]['_id']).setOrigin(0.5,0.8);
                        if (clo["texture"]["key"] != "__MISSING"){
                            own_clothing.push(clo);
                        }
                        var clow = self.physics.add.image(0,0, key + "_"+playerInfo.clothing[k]["type"] + "_walk_" + playerInfo.clothing[k]['_id']).setOrigin(0.5,0.8);
                        if (clow["texture"]["key"] != "__MISSING"){
                            own_clothing.push(clow);
                        }
                        var clow2 = self.physics.add.image(0,0, key + "_"+playerInfo.clothing[k]["type"] + "_walk2_" + playerInfo.clothing[k]['_id']).setOrigin(0.5,0.8);
                        if (clow2["texture"]["key"] != "__MISSING"){
                            own_clothing.push(clow2);
                        }
                    }
                }
            }
        }
    }
    //console.log(own_clothing);
    
    var sorted_own_clothing = own_clothing.sort((a,b) => {
            for (let p in priority) {
                if (a['texture']['key'].includes(p)){
                    var p_a = p;
                    break;
                }
            }
            for (let p in priority) {
                if (b['texture']['key'].includes(p)){
                    var p_b = p;
                    break;
                }
            }
            if (priority[p_a] > priority[p_b]){
                return -1;
            }
            if (priority[p_a] < priority[p_b]){
                return 1;
            }
            return 0;
        }
    );
    
    console.log(sorted_own_clothing);
    /*sorted_own_clothing.forEach(element => {
        console.log(element['texture']['key']);
    });
    */
   var ccc = self.add.container(playerInfo, playerInfo.y, sorted_own_clothing);
    return ccc;
}

function addPlayer(self, playerInfo) {
    //var cha = self.physics.add.image(playerInfo.x, playerInfo.y, "character").setOrigin(0.5,0.7);
    var cha = addClothing(self, playerInfo);
    //console.log(cha);
    for (var i in playerInfo){
        cha[i] = playerInfo[i];
    }
    self.ch = cha;
    //console.log(self.ch);
    return self.ch;
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = addClothing(self, playerInfo);
    //const otherPlayer = self.physics.add.image(playerInfo.x, playerInfo.y, "character").setOrigin(0.5,0.7);
    for (var i in playerInfo){
        otherPlayer[i] = playerInfo[i];
    }
    otherPlayer.id = playerInfo.id;
    self.otherPlayers.add(otherPlayer);
}

function setDirectionVisible(player) {
    player['list'].forEach(element => {
        for (var key in priority){
            if (element['texture']['key'].includes(key)){
                var ind = key;
                if(1 <= priority[ind] && priority[ind] <= 17 && player['direction']=='fore'){
                    if(player.m_y-player.y!=0 && 9 <= priority[ind] && priority[ind] <= 14){
                        if ( player.m_y-player.y>0 && (player.m_y-player.y)%2==0 && element['texture']['key'].includes("walk2")){
                            element.setVisible(true);
                        } else if (player.m_y-player.y>0 && (player.m_y-player.y)%2!=0  && element['texture']['key'].includes("walk") && !element['texture']['key'].includes("walk2")){
                            element.setVisible(true);
                        } else {
                            element.setVisible(false);
                        }
                    } else{
                        if (element['texture']['key'].includes("walk")){
                            element.setVisible(false);
                        } else {
                            element.setVisible(true);
                        }
                    }
                    
                } else if (18 <= priority[ind] && priority[ind] <= 35 && player['direction']=='right'){
                    if(player.m_x-player.x!=0 && 28 <= priority[ind] && priority[ind] <= 32){
                        if (player.m_x-player.x>0 && (player.m_x-player.x)%2==0 && element['texture']['key'].includes("walk2")){
                            element.setVisible(true);
                        } else if (player.m_x-player.x>0 && (player.m_x-player.x)%2!=0 && element['texture']['key'].includes("walk") && !element['texture']['key'].includes("walk2")){
                            element.setVisible(true);
                        } else {
                            element.setVisible(false);
                        }
                    } else {
                        if (element['texture']['key'].includes("walk")){
                            element.setVisible(false);
                        } else {
                            element.setVisible(true);
                        }
                    }
                } else if (36 <= priority[ind] && priority[ind] <= 53 && player['direction']=='left'){
                    if(player.m_x-player.x!=0 && 46 <= priority[ind] && priority[ind] <= 50){
                        if (player.m_x-player.x<0 && (player.m_x-player.x)%2==0 && element['texture']['key'].includes("walk2")){
                            element.setVisible(true);
                        } else if (player.m_x-player.x<0 && (player.m_x-player.x)%2!=0 && element['texture']['key'].includes("walk") && !element['texture']['key'].includes("walk2")){
                            element.setVisible(true);
                        } else {
                            element.setVisible(false);
                        }
                    } else {
                        if (element['texture']['key'].includes("walk")){
                            element.setVisible(false);
                        } else {
                            element.setVisible(true);
                        }
                    }
                } else if (54 <= priority[ind] && priority[ind] <= 65 && player['direction']=='back'){
                    if(player.m_y-player.y!=0 && 57 <= priority[ind] && priority[ind] <= 64){
                        if (player.m_y-player.y<0 && (player.m_y-player.y)%2==0 && element['texture']['key'].includes("walk2")){
                            element.setVisible(true);
                        } else if (player.m_y-player.y<0 && (player.m_y-player.y)%2!=0  && element['texture']['key'].includes("walk") && !element['texture']['key'].includes("walk2")){
                            element.setVisible(true);
                        } else {
                            element.setVisible(false);
                        }
                    } else {
                        if (element['texture']['key'].includes("walk")){
                            element.setVisible(false);
                        } else {
                            element.setVisible(true);
                        }
                    }
                } else {
                    element.setVisible(false);
                }
                break;
            }
        }
        
    });
}

export { size, character, character_w, character_h, x , y, m_x, m_y, online_users, ch,
    main_space, 
    movable, addPlayer, addOtherPlayers
  };