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

const signup = {
    key: 'signup',
    init: function() {
        
    },
    preload: function(){
        loading(this);
        this.load.html('signupform', './game/assets/html/signupform.html');
        
    },
    create: function(){
        var self = this;
        var signupform = this.add.dom(w/2, h/2).createFromCache('signupform');
        
        signupform.addListener('click');
        signupform.on('click', function (event) {
            if (event.target.name === 'login'){
                self.scene.start('login');
            }
            if (event.target.name === 'signupButton') {
                var inputUsername = this.getChildByName('username').value;
                var inputPassword = this.getChildByName('password').value;
                var inputEmail = this.getChildByName('email').value;
                self.socket.emit('signup', { 'username': inputUsername , 'password': inputPassword, 'email': inputEmail });
            }
        });
    },
    update: function(){
        var pointer = this.input.activePointer;
        
    }
}
export {
    signup, 
  };