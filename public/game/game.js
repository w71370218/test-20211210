if (window.innerWidth > 930){
    var w = 930;
} else {
    var w = 360;
}
if (window.innerHeight > 620){
    var h = 620;
} else {
    var h = 240;
}

import loading from './loading.js';
import { main_space } from './scenes/main_space.js';
import { login } from './scenes/register/login.js';
import { signup } from './scenes/register/signup.js';
import { forgetpassword } from './scenes/register/forgetpassword.js';

var loginButton;
var singInButton;
var button_w = 148;
var button_h = 74;
var button_color = "0x6666ff";

const gameStart = {
    key: 'gameStart',
    init: function() {
        
    },
    preload: function(){
        loading(this);
        this.load.html('loginform', './game/assets/html/loginform.html');
        /* load folder files
        array.forEach(element => {
            re = ".*.svg";
        });
        */
        this.load.image("bg2", "./game/assets/img/bg/216-8.png");
    },
    create: function(){
        var bg2 = this.add.sprite(0,0, "bg2").setOrigin(0,0);
        bg2.displayWidth = w;
        bg2.displayHeight = h;

        //loginButton = new Button(this, 200, h-100,"Login");
        loginButton = this.add.rectangle(200, h-100, button_w, button_h, button_color).setOrigin(0,0);
        this.add.text(200 + button_w/2, h-100 + button_h/2, '登入', { fill: '#fff', fontSize: '30px' }).setOrigin(0.5,0.5);
        loginButton.setInteractive();
        loginButton.on('pointerdown', () => { 
            this.scene.start('login');
         });

        singInButton = this.add.rectangle(200+234+button_w, h-100, button_w, button_h, button_color).setOrigin(0,0);
        this.add.text(200+234 +button_w+ button_w/2, h-100 + button_h/2, '註冊', { fill: '#fff', fontSize: '30px' }).setOrigin(0.5,0.5);
        singInButton.setInteractive();
        singInButton.on('pointerdown', () => { 
            this.scene.start('signup');
         });

        //var element = this.add.dom(w/2,h/2).createFromCache('loginform');
    },
    update: function(){
        this.scene.start('gameStart');
        var pointer = this.input.activePointer;
        /*
        if (pointer.leftButtonDown()){
            this.scene.start('main_space');
        }
        */
    }
}

const config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    parent: 'app',
    scene: [
        gameStart,
        main_space,
        login,
        signup,
        forgetpassword,
    ],
    physics: {
        default: 'arcade'
    },
    dom: {
        createContainer: true
    },
    /* framerate
    fps: {
        target: 120,
        forceSetTimeOut: true
    },
    */
}

const game = new Phaser.Game(config);

/* function */
class Button {
    constructor(self, x, y, text) {
        this.x = x;
        this.y = y;
        var w = 148;
        var h = 74;
        var color = "0x6666ff";
        self.add.rectangle(x, y, w, h, color).setOrigin(0,0);
    }
}
