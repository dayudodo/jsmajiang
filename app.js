'use strict'
//引入程序包
var express = require('express')
  , path = require('path')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
var _ = require('lodash');

var connections = []
var ArrayPlayer = []
// ArrayPlayer.prototype.toString = function(){

// }
server.listen(3000, function(){
  console.log("Express server listening on port " + 3000);
});
app.use(express.static('./'))
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/socket.html');
// });

io.sockets.on('connection', function (socket) {

  // 打印握手信息
  // console.log(socket.handshake);

    // 玩家对象
    var player = {
      socket:socket,
      username:undefined
    }

    socket.on('disconnect', function () {  
      //退出时要删除这个用户！
      connections.splice(connections.indexOf(socket),1)
      let disconnect_player = _.remove(ArrayPlayer, function(item){
        return item.socket == socket;
      })
      console.log("disconnect_player:%s",disconnect_player)
      if (new String(disconnect_player) != "") {
        console.log("%s已经离开", disconnect_player[0].username)
        console.log("剩%s位用户...", ArrayPlayer.length)
      };
      socket.disconnect();
      console.log(socket.id + ' Disconnect');
      console.log("%s connections remaining.", connections.length)

    });

    connections.push(socket);
    console.log("Connected: %s connectionss", connections.length)

    socket.on('player', function(new_player){
      let nameStr = ArrayPlayer.map(function(item){
        return item.username 
      })
      console.log(nameStr)
      let isPlayer_joined = _.findIndex(ArrayPlayer, { username: new_player.username})
      if (isPlayer_joined != -1 ) {
        console.log("%s already exist.", new_player.username)
      }else {

        if (ArrayPlayer.length ==3) {
          console.log('人员已满，最多3人')
          nameStr = ArrayPlayer.map(function(item){
            return item.username 
          })
          console.log(nameStr)
        }else {
          player.socket = socket
          player.username = new_player.username
          ArrayPlayer.push(player)
          console.log(player.username + ":joined")
        }
      }
    })
      // socket.emit('room_full')
      // console.log("Already have 3 connectionss in here!")

});


