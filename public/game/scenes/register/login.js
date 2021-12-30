import loading from '../../loading.js';

if (window.innerWidth > 930) {
    var w = 930;
} else {
    var w = 360;
}
if (window.innerHeight > 620) {
    var h = 620;
} else {
    var h = 240;
}

const login = {
    key: 'login',
    init: function () {

    },
    preload: function () {
        loading(this);
        this.load.html('loginform', './game/assets/html/loginform.html');
        this.load.html('signupform', './game/assets/html/signupform.html');
        this.load.html('forgetpassword', './game/assets/html/forgetpassword.html');

    },
    create: function () {
        var self = this;
        var loginform = this.add.dom(w / 2, h / 2).createFromCache('loginform');
        this.socket = io();
        loginform.addListener('click');
        loginform.on('click', function (event) {
            if (event.target.name === 'signup') {
                self.scene.start('signup');
            }
            if (event.target.name === 'forgetpassword') {
                self.scene.start('forgetpassword');
            }
            if (event.target.name === 'loginButton') {
                var inputUsername = this.getChildByName('username').value;
                var inputPassword = this.getChildByName('password').value;
                self.socket.emit('login', { 'username': inputUsername , 'password': inputPassword });
            }
        });

        this.socket.on('loginResponse', function (loginResponse) {
            alert(loginResponse);
        });
        this.socket.on('loginSucceed', function (loginResponse) {
            self.scene.start('main_space', loginResponse);
        });
    },
    update: function () {
        var pointer = this.input.activePointer;

    }
}
export {
    login,
};