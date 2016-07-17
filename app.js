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
var Hobby = [] //大厅，用来保存房间

var BING = ['b1','b2','b3','b4','b5','b6','b7','b8','b9']
var TIAO   = ['t1','t2','t3','t4','t5','t6','t7','t8','t9']
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI    = ['zh','fa','di']

var all_single_pai=BING.concat(TIAO).concat(ZHIPAI)
var all_pai = BING.repeat(4).concat(TIAO.repeat(4)).concat(ZHIPAI.repeat(4))
var table_random_pai = _.shuffle( all_pai )

// var clone_pai = _.clone(table_random_pai).splice(0,45) // 全局变量，开发时记得重启，开发时使用45张牌
var clone_pai = _.clone(table_random_pai)
// console.log(_.shuffle(all_pai), all_pai.length)
var RoomName = 'roomAnge'
var player_index = 0

server.listen(3000, function(){
  console.log("Express server listening on port " + 3000);
});
app.use(express.static('./'))
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/socket.html');
// });

// table_pai桌面有多少牌
var  getTable= function(){
  let table = new Object()
  table.current_player = 0
  table.table_pai = _.shuffle( _.clone(all_pai))
  table.room_name = ''
  table.ArrayPlayer = []
  return table
}


io.sockets.on('connection', function (socket) {

    // 玩家对象
    var player = {
        id:socket.id
      , username:''
      , ready: false
      , east: false
      , shou_pai: []
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
            player.east = true;
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
      // let testData= io.sockets.connected
      // console.log(testData)
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
        console.log('all players ready, start game')
        let others = ArrayPlayer.map(item=>{
          return _.find(connections, { id: item.id})
        })
        // console.log(others.length)
        
        let dongJia = _.find(ArrayPlayer, { east:true })
        others.forEach(otherSocket=>{
          if (otherSocket.id == dongJia.id) {
            otherSocket.emit('game_start', clone_pai.splice(0,13))
            let fa_pai = clone_pai.splice(0,1)
            console.log('服务器发牌：%s', fa_pai)
            otherSocket.emit('table_fa_pai', fa_pai)
          }else{
            otherSocket.emit('game_start', clone_pai.splice(0,13))
          }
        })
      }
    })

    socket.on('dapai', function(pai){
      io.in(RoomName).emit('dapai', pai)
      // 有没有人可以碰的？ 有人碰就等待10秒，这个碰的就成了下一家，需要打张牌！
      //找到下一家，再发牌
      let index  = ( ++player_index ) % 3
      let shouPaiPlayer = ArrayPlayer[index]
      let playerSocket = _.find(connections, { id: shouPaiPlayer.id })
      if (clone_pai.length == 0) {
        io.in(RoomName).emit('game over')
        // 牌要重新发了
        clone_pai = _.shuffle( _.clone(table_random_pai) )
        // 用户也需要重新准备
        ArrayPlayer.forEach(item=> item.ready = false )
      }else {
        let fa_pai = clone_pai.splice(0,1)
        console.log('服务器发牌 %s 给：%s', fa_pai, shouPaiPlayer.username)
        console.log('本桌牌还有%s张', clone_pai.length)
        playerSocket.emit('table_fa_pai', fa_pai)
      }
    })

    socket.on('chat_cast',function(info){
      socket.to('room').emit('chat_cast', clone_pai)
    })



})


