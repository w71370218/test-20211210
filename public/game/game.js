
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

const gameStart = {
    key: 'gameStart',
    init: function() {
        console.log('init');
        var size = 1;
    },
    preload: function(){
        // 載入資源
        var percentText = this.make.text({
            x: w / 2,
            y: h / 2 - 5,
            text: 'loading...',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        this.load.image("bg1", "./game/assets/img/bg/base.png");
        this.load.image('chracter', './game/assets/img/character/131.svg');

    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        this.input.mouse.capture = true;

        var bg1 = this.add.sprite(0,0, "bg1").setOrigin(0,0);
        bg1.displayWidth = w;
        bg1.displayHeight = h;
        
        character = this.add.sprite(x,y, 'chracter').setOrigin(0.5,0.7);
        character.displayWidth *= 1;
        character.displayHeight *= 1;
        character_w = character.displayWidth;
        character_h = character.displayHeight;
        //1.0
    },
    update: function(){
        // 遊戲狀態更新
        x = character.x;
        y = character.y;
        var pointer = this.input.activePointer;
        
        //console.log(pointer.event);
        if (pointer.leftButtonDown()){
            m_x = this.input.x;
            m_y = this.input.y;
            if (movable(m_x, m_y)){
                if (x!=m_x && y!=m_y){
                    console.log("yes!")
                    //size += 0.005*(m_y-y);
                    //console.log(0.005*(m_y-y));
                    //console.log(m_y,size);
                    //??????
                    
                    
                        //size 
               
                }
            }
        }
        
        if (m_x-x!=0) {
            if(m_x-x>0) {
                if (movable(character.x +1, character.y)){
                    character.x += 1;
                }
            } else {
                if (movable(character.x -1, character.y)){
                    character.x -= 1;
                }
            }
            //character.y += ;
        }
        if (m_y-y!=0) {
            if(m_y-y>0) {
                if (movable(character.x, character.y +1)){
                    character.y += 1;
                }
            } else {
                if (movable(character.x, character.y -1)){
                    character.y -= 1;
                }
            }
        }
        /*
        if (this.input.x this.input.y){

        }
        character.displayWidth *= size ;
        character.displayHeight *= size;
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
    ],
    physics: {
        default: 'arcade'
      },
}

const game = new Phaser.Game(config);

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
