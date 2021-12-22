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

const gameStart = {
    key: 'gameStart',
    init: function() {
        
    },
    preload: function(){
        loading(this);
        this.load.image("bg2", "./game/assets/img/bg/216-8.png");
    },
    create: function(){
        var bg2 = this.add.sprite(0,0, "bg2").setOrigin(0,0);
        bg2.displayWidth = w;
        bg2.displayHeight = h;
    },
    update: function(){
        var pointer = this.input.activePointer;
        if (pointer.leftButtonDown()){
            this.scene.start('main_space');
        }
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
    ],
    physics: {
        default: 'arcade'
    },
    /* framerate
    fps: {
        target: 120,
        forceSetTimeOut: true
    },
    */
}

const game = new Phaser.Game(config);

