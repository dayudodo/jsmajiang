// 'use strict'
//引入程序包
var express = require("express"),
  path = require("path"),
  app = express(),
  server = require("http").createServer(app),
  io = require("socket.io").listen(server);
// var _ = require('lodash');
import _ from "lodash";
import * as config from "../config";
import { Player } from "./player";
import { Room } from "./room";
import { Connector } from "./Connector";

//以前还不熟悉如何复制一个数组
Array.prototype.repeat = function(times) {
  var result = [];
  for (var i = 0; i < times; i++) {
    this.map(item => {
      result.push(item);
    });
  }
  return result;
};

//初始化几个可用房间，每次用完就将其删除掉，直接房间全部占完
var g_rooms = [];
var g_lobby = new Connector();
var ArrayPlayer = [];
var Hobby = []; //大厅，用来保存房间

var BING = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"];
var TIAO = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
// 中风、发财、白板(电视)，为避免首字母重复，白板用电视拼音，字牌
var ZHIPAI = ["zh", "fa", "di"];

var all_single_pai = BING.concat(TIAO).concat(ZHIPAI);
var all_pai = BING.repeat(4)
  .concat(TIAO.repeat(4))
  .concat(ZHIPAI.repeat(4));
var table_random_pai = _.shuffle(all_pai);

// var clone_pai = _.clone(table_random_pai).splice(0,45) // 全局变量，开发时记得重启，开发时使用45张牌
var clone_pai = _.clone(table_random_pai);
// console.log(_.shuffle(all_pai), all_pai.length)
// var RoomName = "roomAnge";
var player_index = 0;

server.listen(config.PORT, function() {
  console.log("Express server listening on port " + config.PORT);
});
app.use(express.static("./"));
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/socket.html');
// });

io.sockets.on("connection", function(socket) {
  //只要连接，就建立一个玩家对象？如果掉线呢？就需要更新玩家信息了，这就需要真正的根据玩家ID来进行玩家身份的识别，而并非是socketid
  //显示当前有多少连接，这其实应该是lobby的事情，也就是app
  // connections.push(socket);
  g_lobby.new_connect(socket);
  console.log(
    `有新的连接：${socket.id} | 服务器连接数: ${g_lobby.clients_count}`
  );

  // 玩家对象
  // var player = new Player({
  //   socket_id: socket.id,
  //   username: "",
  //   ready: false,
  //   east: false,
  //   shou_pai: []
  // });
  // var player = {
  //     id:socket.id
  //   , username:''
  //   , ready: false
  //   , east: false
  //   , shou_pai: []
  // }

  socket.on("disconnect", function() {
    //先删除掉其连接信息
    // connections.splice(connections.indexOf(socket), 1);
    // g_lobby.
    //退出时要删除这个用户！根据用户找到其所在的room，这样的话其实连接信息需要重新设计，应该包括
    //连接的socketId, player信息，room信息，这样就不需要再去player中查找了，那样比较麻烦，玩家一多找起来可就麻烦了。
    //需要一个房间一个房间的找，效率太慢！一个socket来了，就建立好相关的信息。
    let disconnect_client = g_lobby.dis_connect(socket);
    // console.dir(disconnect_client);
    let d_client = _.first(disconnect_client);
    //断开其实要考虑的事情也比较多，登录后断开，加入房间后断开，都要想到，所以写这东西对游戏服务器肯定是有基础的了解了！
    if (d_client && d_client.player) {
      console.log(`玩家:${d_client.player.username} 连接断开`);
      let room = d_client.room
      if (room) {
        room.exit_room(socket)
        console.log(`玩家:${d_client.player.username}退出房间${room.id}`);
      }
    } else {
      console.log(`用户未登录的情况下断开连接: ${socket.id}`);
    }
    //只有进入房间的才算是真正的玩家
    // console.log("剩%s个用户...", g_lobby.players_count);
    socket.disconnect();
    console.log("剩%s个连接...", g_lobby.clients_count);
  });

  // function joined(socket, obj){
  //   socket.emit('joined', obj)
  // }

  //玩家进入，这儿其实只管用户登录，房间的话还需要另外处理
  socket.on("login", function(new_player) {
    let joined_conn = g_lobby.find_conn_by_username(new_player.username);
    if (joined_conn) {
      console.log(
        `${joined_conn.player.username}玩家已经存在. 其socketId:${
          joined_conn.socket_id
        }`
      );
      return;
    }
    let conn = g_lobby.find_conn_by(socket);
    let s_player = new Player({
      socket: socket,
      username: new_player.username
    });
    //一开始连接的时候还没有用户信息，在用户登录之后再行保存到连接信息中，方便查询
    conn.player = s_player;
    console.log(`玩家: ${s_player.username}已经登录`);
    //服务器给本玩家发送登录成功的消息
    socket.emit("login");

    //显示一下所有的用户名称
    console.log("当前全部的player_names:", g_lobby.player_names);
    // quit()
    // else {
    //   if (ArrayPlayer.length == 3) {
    //     console.log("人员已满，最多3人");
    //     nameStr = ArrayPlayer.map(function(item) {
    //       return item.username;
    //     });
    //     socket.emit("room_full");
    //     console.log(nameStr);
    //   } else {
    //     if (ArrayPlayer.length == 0) {
    //       player.east = true;
    //     }
    //     player.username = new_player.username;
    //     socket.join(RoomName, function() {
    //       socket.to(RoomName).emit("room_enter", player.username);
    //       console.log("%s join room ", player.username);
    //     });
    //     ArrayPlayer.push(player);
    //     socket.emit("login", ArrayPlayer); //给自己发个login, 表明服务器已经允许你登录
    //     socket.broadcast.emit("joined", ArrayPlayer); // 给其它人发joined, 表明自己已经加入游戏中
    //     nameStr = ArrayPlayer.map(item => item.username);
    //     console.log(
    //       player.username + ":joined! Broadcast to %s player",
    //       nameStr
    //     );
    //   }
    // }
  });

  //玩家创建房间，玩家先前应已登录
  socket.on("create_room", function() {
    let conn = g_lobby.find_conn_by(socket);
    if (!conn.player) {
      socket.disconnect();
      console.log(`用户未登录执行了创建房间：${conn.socket.id}`);
    } else {
      let owner_room = new Room();
      let room_name = Room.make();
      if (room_name) {
        owner_room.id = room_name;
      } else {
        socket.emit("server_room_sold_out");
        // process.exit(1500);
        return;
      }
      owner_room.join_player(conn.player); //新建的房间要加入本玩家
      conn.room = owner_room; //创建房间后，应该把房间保存到此socket的连接信息中
      console.log(`${conn.player.username}创建了房间${owner_room.id}`);
      // console.dir(conn)
      socket.join(room_name) //成功后你还需要让此socket加入此房间，不然创建者收不到任何消息
      //成功创建房间后要给前端发送成功的消息
      socket.emit("server_made_room", owner_room.id);
    }
  });
  //玩家加入某个指定房间room_name
  socket.on("join_room", function(room_id) {
    let room = g_lobby.find_room_by_id(room_id);
    // console.dir(room);
    let _me = g_lobby.find_player_by_socket(socket); //有时候感觉直接把用户信息就保存在socket里面也许会更方便，不过呢，会改变socket
    console.log(`用户${_me.username}想要加入房间${room_id}`);
    console.dir(room)
    if (room) {
      //todo: 检查房间玩家数量，超过3人就不能再添加了
      console.log(`${room_id}房间内全部玩家：${room.all_player_names}`);
      if (room.players_count == 3) {
        socket.emit("server_room_full");
      } else {
        console.log(`用户${_me.username}成功加入房间${room_id}`);
        room.join_player(_me)
        socket.join(room_id, () => {
          //告诉房间的其它人我已经加入房间
          io.to(room_id).emit("server_player_enter_room", room.all_player_names);
        });
      }
    } else {
      socket.emit("server_no_such_room", room_id);
    }
  });
  socket.on("ready_server", function() {
    // let testData= io.sockets.connected
    // console.log(testData)
    //用户所带有的socketid其实就是其唯一身份！
    let current_player = _.find(ArrayPlayer, {
      id: socket.id
    });
    current_player.ready = true;
    socket.emit("ready_client", current_player.username);
    socket.to("room").emit("ready_client", current_player.username);
    console.log("%s is ready to start:", current_player.username);
    // 如果所有的人都准备好了，就开始游戏！
    let player_ready_count = ArrayPlayer.filter(item => item.ready).length;
    console.log("ready count:", player_ready_count);
    let allReady = player_ready_count == 3;
    if (allReady) {
      console.log("all players ready, start game");
      let others = ArrayPlayer.map(item => {
        return _.find(connections, {
          id: item.id
        });
      });
      // console.log(others.length)

      let dongJia = _.find(ArrayPlayer, {
        east: true
      });
      others.forEach(otherSocket => {
        if (otherSocket.id == dongJia.id) {
          otherSocket.emit("game_start", clone_pai.splice(0, 13));
          let fa_pai = clone_pai.splice(0, 1);
          console.log("服务器发牌：%s", fa_pai);
          otherSocket.emit("table_fa_pai", fa_pai);
        } else {
          otherSocket.emit("game_start", clone_pai.splice(0, 13));
        }
      });
    }
  });

  //玩家打了一张牌
  socket.on("dapai", function(pai) {
    io.in(RoomName).emit("dapai", pai);
    // 有没有人可以碰的？ 有人碰就等待10秒，这个碰的就成了下一家，需要打张牌！
    //找到下一家，再发牌
    let index = ++player_index % 3;
    let shouPaiPlayer = ArrayPlayer[index];
    let playerSocket = _.find(connections, {
      id: shouPaiPlayer.id
    });
    if (clone_pai.length == 0) {
      io.in(RoomName).emit("game over");
      // 牌要重新发了
      clone_pai = _.shuffle(_.clone(table_random_pai));
      // 用户也需要重新准备
      ArrayPlayer.forEach(item => (item.ready = false));
    } else {
      let fa_pai = clone_pai.splice(0, 1);
      console.log("服务器发牌 %s 给：%s", fa_pai, shouPaiPlayer.username);
      console.log("本桌牌还有%s张", clone_pai.length);
      playerSocket.emit("table_fa_pai", fa_pai);
    }
  });

  socket.on("chat_cast", function(info) {
    socket.to("room").emit("chat_cast", clone_pai);
  });
});
