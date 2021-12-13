
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


const gameStart = {
    key: 'gameStart',
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
        this.load.image('bg1', './static/media/img/bg/216-8.png');

    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        this.add.tileSprite(w/2, h/2, w, h, 'bg1');
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