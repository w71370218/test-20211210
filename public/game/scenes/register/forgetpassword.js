import loading from '../../loading.js';

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

const forgetpassword = {
    key: 'forgetpassword',
    init: function() {
        
    },
    preload: function(){
        loading(this);
        this.load.html('forgetpassword', './game/assets/html/forgetpassword.html');
        
    },
    create: function(){
        var self = this;
        var forgetpassword = this.add.dom(w/2, h/2).createFromCache('forgetpassword');
        
        forgetpassword.addListener('click');
        forgetpassword.on('click', function (event) {
            if (event.target.name === 'login'){
                self.scene.start('login');
            }
        });
    },
    update: function(){
        var pointer = this.input.activePointer;
        
    }
}
export {
    forgetpassword, 
  };