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
import chalk from "chalk";

//初始化几个可用房间，每次用完就将其删除掉，直接房间全部占完
var g_rooms = [];
var g_lobby = new Connector();

// console.log(_.shuffle(all_pai), all_pai.length)
// var room_name = "roomAnge";
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
      let room = d_client.room;
      console.dir(room);
      if (room) {
        room.exit_room(socket);
        console.log(`玩家:${d_client.player.username}退出房间${room.id}`);
        //todo: 断开连接还需要通知其它用户我断线了
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
    //     socket.join(room_name, function() {
    //       socket.to(room_name).emit("room_enter", player.username);
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
  socket.on("create_room", function(callback) {
    // console.dir(callback)
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
        // socket.emit("server_room_sold_out");
        callback({ error: "很抱歉，无可用房间，请联系客服！" });
        // process.exit(1500);
        return;
      }
      conn.player.east = true; //创建房间者即为东家，初始化时会多一张牉！
      conn.player.seat_index = 0; //玩家座位号从0开始
      owner_room.join_player(conn.player); //新建的房间要加入本玩家
      conn.room = owner_room; //创建房间后，应该把房间保存到此socket的连接信息中
      console.log(`${conn.player.username}创建了房间${owner_room.id}`);
      // console.dir(conn)
      socket.join(room_name); //成功后你还需要让此socket加入此房间，不然创建者收不到任何消息
      //成功创建房间后要给前端发送成功的消息
      // socket.emit("server_made_room", owner_room.id);
      callback({ room_name: owner_room.id });
    }
  });
  //玩家加入某个指定房间room_name
  socket.on("join_room", function(room_id) {
    let room = g_lobby.find_room_by_id(room_id);
    // console.dir(room);
    let _me = g_lobby.find_player_by_socket(socket); //有时候感觉直接把用户信息就保存在socket里面也许会更方便，不过呢，会改变socket
    let conn = g_lobby.find_conn_by(socket);
    //找到房间后，还要把当前连接的room保存到其连接信息中，而在登录时conn中已经保存有用户信息了
    conn.room = room;
    console.log(`用户${_me.username}想要加入房间${room_id}`);
    // console.log('本玩家连接信息')
    // console.dir(conn);
    if (room) {
      let room_name = room.id;
      //todo: 检查房间玩家数量，超过3人就不能再添加了
      console.log(`${room_name}房间内全部玩家：${room.all_player_names}`);
      if (room.players_count == config.LIMIT_IN_ROOM) {
        console.log(`房间${room_name}已满，玩家有：${room.all_player_names}`);
        socket.emit("server_room_full");
      } else {
        console.log(`用户${_me.username}成功加入房间${room_name}`);
        //设置其座位号
        _me.seat_index = room.last_join_player.seat_index + 1;
        room.join_player(_me);
        // console.dir(room)
        socket.join(room_name, () => {
          //告诉房间的其它人我已经加入房间
          io.to(room_name).emit("server_player_enter_room", {
            player_names: room.all_player_names,
            room_name: room_name
          });
        });
      }
    } else {
      console.log(`服务器无此房间：${room_id}`);
      socket.emit("server_no_such_room", room_id);
    }
  });
  //玩家点击开始
  socket.on("player_ready", function(fn) {
    let player = g_lobby.find_player_by_socket(socket);
    let room = g_lobby.find_room_by_socket(socket);
    let room_name = room.id;
    player.ready = true;

    //向房间内的所有人广播说我已经开始了
    socket.to(room_name).emit("server_receive_ready", player.username);
    console.log(
      `房间：${room_name}内用户：${player.username}准备开始游戏 。。。`
    );
    // 如果所有的人都准备好了，就开始游戏！
    if (room.all_ready) {
      console.log(
        chalk.green(`===>房间${room_name}全部玩家准备完毕，可以游戏啦！`)
      );
      //给所有客户端发牌，room管理所有的牌，g_lobby只是调度！另外，用户没有都进来，room的牌并不需要初始化，节省运算和内存吧。
      room.start_game();
    }
    fn(player.username);
  });

  //玩家打了一张牌
  socket.on("dapai", function(pai) {
    let player = g_lobby.find_player_by_socket(socket);
    console.log(`用户${player.username}打牌:${pai}`);
    let room = g_lobby.find_room_by_socket(socket);
    //告诉房间，哪个socket打了啥牌
    room.da_pai(io, socket, pai);
  });

  socket.on("confirm_hu", function(pai_name) {
    let { room_name, player, room } = confirmInit(socket);
    console.log(`房间:${room_name}用户${player.username}确定胡牌:${pai_name}`);
    room.confirm_hu(io, socket, pai_name);
  });
  socket.on("confirm_peng", function(pai_name) {
    let { room_name, player, room } = confirmInit(socket);
    console.log(`房间:${room_name}用户${player.username}确定碰牌:${pai_name}`);
    room.confirm_peng(io, socket, pai_name);
  });
  socket.on("confirm_gang", function(pai_name) {
    let { room_name, player, room } = confirmInit(socket);
    console.log(`房间:${room_name}用户${player.username}确定杠牌:${pai_name}`);
    room.confirm_gang(io, socket, pai_name);
  });
  //玩家选择了过，不碰也不胡，需要做一些取消操作，并且都是发给房间来做处理
  socket.on("confirm_guo", function(pai) {
    let { room_name, player, room } = confirmInit(socket);
    console.log(`房间:${room_name}用户${player.username}决定放弃:${pai}`);
    room.confirm_guo(io, socket);
  });

  socket.on("chat_cast", function(info) {
    let room = g_lobby.find_room_by_socket(socket);
    let room_name = room.id;
    socket.to(room_name).emit("chat_cast", info);
  });
});
function confirmInit(socket) {
  let player = g_lobby.find_player_by_socket(socket);
  let room = g_lobby.find_room_by_socket(socket);
  let room_name = room.id;
  return { room_name, player, room };
}
