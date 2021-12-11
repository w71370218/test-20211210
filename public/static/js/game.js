const w = window.innerWidth;
const h = window.innerHeight;

const gameStart = {
    key: 'gameStart',
    preload: function(){
        // 載入資源
        this.load.image('bg1', './static/media/img/bg/216-8.png');
    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        this.bg1 = this.add.tileSprite(w/2, h/2, w, h, 'bg1');
    },
    update: function(){
        // 遊戲狀態更新
    }
}
const config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    parent: 'app',
    scene: [
        gameStart,
    ]
}

const game = new Phaser.Game(config);