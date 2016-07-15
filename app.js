'use strict'
//引入程序包
var express = require('express')
  , path = require('path')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
var _ = require('lodash');

Array.prototype.repeat= function(times){
  var result = []
  for (var i = 0; i < times; i++) {
    this.map(item=>{
      result.push(item)
    })
  }
  return result
}

var connections = []
var ArrayPlayer = []

var BING = ['b1','b2','b3','b4','b5','b6','b7','b8','b9']
var TIAO   = ['t1','t2','t3','t4','t5','t6','t7','t8','t9']
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI    = ['zh','fa','di']

var all_single_pai=BING.concat(TIAO).concat(ZHIPAI)
var all_pai = BING.repeat(4).concat(TIAO.repeat(4)).concat(ZHIPAI.repeat(4))
// console.log(_.shuffle(all_pai), all_pai.length)
var RoomName = 'room'

server.listen(3000, function(){
  console.log("Express server listening on port " + 3000);
});
app.use(express.static('./'))
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/socket.html');
// });

io.sockets.on('connection', function (socket) {

    // 玩家对象
    var player = {
        id:socket.id
      , username:undefined
      , ready: false
      , first: false
    }

    socket.on('disconnect', function () {  
      //退出时要删除这个用户！
      connections.splice(connections.indexOf(socket),1)
      let disconnect_player = _.remove(ArrayPlayer, function(item){
        return item.id == socket.id;
      })
      console.log("disconnect_player:%s",disconnect_player)
      if (new String(disconnect_player) != "") {
        console.log("%s已经离开", disconnect_player[0].username)
        console.log("剩%s位用户...", ArrayPlayer.length)
      };
      socket.disconnect();
      console.log(socket.id + ' Disconnect');
      console.log("%s connections remaining.", connections.length)

    })

    connections.push(socket);
    console.log("Connected: %s connections", connections.length);

    function joined(socket, obj){
      socket.emit('joined', obj)
    }

    socket.on('player_enter', function(new_player){
      let nameStr = ArrayPlayer.map(item=>item.username)
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
          socket.emit('room_full')
          console.log(nameStr)
        }else {
          if ( ArrayPlayer.length ==0 ) {
            player.first = true;
          }
          player.username = new_player.username
          socket.join(RoomName,function(){
            socket.to(RoomName).emit('room_enter', player.username)
            console.log("%s join room ", player.username)
          })
          ArrayPlayer.push(player)
          socket.emit('login', ArrayPlayer) //给自己发个login, 表明服务器已经允许你登录
          socket.broadcast.emit('joined', ArrayPlayer) // 给其它人发joined, 表明自己已经加入游戏中
          nameStr = ArrayPlayer.map(item=>item.username)
          console.log(player.username + ":joined! Broadcast to %s player", nameStr)
        }
      }
    })

    socket.on('ready_server', function(){
      let current_player = _.find(ArrayPlayer, { id: socket.id })
      current_player.ready = true
      socket.emit('ready_client', current_player.username)
      socket.to('room').emit('ready_client', current_player.username)
      console.log("%s is ready to start:", current_player.username)
      // 如果所有的人都准备好了，就开始游戏！
      let player_ready_count = ArrayPlayer.filter( item=>item.ready ).length
      console.log('ready count:',player_ready_count)
      let allReady = ( player_ready_count == 3 ) 
      if ( allReady ) {
        let yiShou = all_pai.splice(0,13)
        socket.emit('game_start', yiShou)
        console.log('all players ready, start game')
        let others = ArrayPlayer.map(item=>{
          return _.find(connections, { id: item.id})
        })
        // console.log(others.length)
        others.forEach(otherSocket=>{
          otherSocket.emit('game_start', all_pai.splice(0,13))
        })
        
      }
    })

    socket.on('chat_cast',function(info){
      socket.to('room').emit('chat_cast', info)
    })



});


