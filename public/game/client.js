var socket = io();

socket.on("connect", () => {
    console.log("client connect!!");
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});