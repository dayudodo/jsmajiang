var express = require("express"),
  http = require("http"),
  WebSocket = require("ws"),
  config = require("./../config");
import _ from "lodash";
import { Connector } from "./Connector";
import { Player } from "./player";
import { Room } from "./room";
import chalk from "chalk";
import * as g_events from "../events"; //events呢容易产生同名，所以加个前缀
const app = express();

//initialize a simple http server
const server = http.createServer(app);
const wsserver = new WebSocket.Server({ server });
const g_lobby = new Connector();
var test_names = ["jack", "rose", "tom", "jerry", "michael", "adam", "bruce"];
var eventsHandler = [
  [g_events.client_testlogin, client_testlogin],
  [g_events.client_create_room, client_create_room],
  [g_events.client_join_room, client_join_room],
  [g_events.client_player_ready, client_player_ready]
];

wsserver.on("connection", socket => {
  socket.id = g_lobby.generate_socket_id();
  g_lobby.new_connect(socket);
  console.log(
    `有新的连接：${socket.id} | 服务器连接数: ${g_lobby.clients_count}`
  );
  socket.sendmsg({
    type: g_events.server_welcome,
    welcome: "欢迎来到安哥世界"
  });
  const onClose = () => {
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
    socket = null; //不管我使用socket.close还是terminate都不会让此socket消失。。。也许使用reconnect?
    console.log("剩%s个连接...", g_lobby.clients_count);
  };
  socket.on("close", onClose);
  //connection is up, let's add a simple simple event
  socket.on("message", message => {
    //log the received message and send it back to the client
    let client_message = JSON.parse(message);
    for (let index = 0; index < eventsHandler.length; index++) {
      const element = eventsHandler[index];
      if (client_message.type == element[0]) {
        element[1].call(this, client_message, socket);
        return;
      }
    }
    console.log("未知消息:", client_message);
  });
});

//start our server
server.listen(process.env.PORT || config.PORT, () => {
  console.log(`服务器已经启动，端口号： ${server.address().port} :)`);
});
function client_join_room(client_message, socket) {
  let { room_id } = client_message;
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
    //todo: 检查房间玩家数量，超过3人就不能再添加了
    console.log(`${room_id}房间内全部玩家：${room.all_player_names}`);
    if (room.players_count == config.LIMIT_IN_ROOM) {
      console.log(`房间${room_name}已满，玩家有：${room.all_player_names}`);
      socket.send(JSON.stringify({ type: g_events.server_room_full }));
    } else {
      console.log(`用户${_me.username}成功加入房间${room_id}`);
      //设置其座位号
      _me.seat_index = room.last_join_player.seat_index + 1;
      room.join_player(_me);
      // console.dir(room)
      //通知他人应该是房间的事情！
      room.player_enter_room(socket);
    }
  } else {
    console.log(`服务器无此房间：${room_id}`);
    socket.send(JSON.stringify({ type: g_events.server_no_such_room }));
  }
}
function client_create_room(client_message, socket) {
  let conn = g_lobby.find_conn_by(socket);
  if (!conn.player) {
    socket = null;
    console.log(`用户${conn.username}未登录执行了创建房间：${conn.socket.id}`);
    return;
  } else {
    let owner_room = new Room();
    let room_name = Room.make();
    if (room_name) {
      owner_room.id = room_name;
    } else {
      console.log("服务器无可用房间了");
      socket.sendmsg({
        type: g_events.server_no_room
      });
      return;
    }
    owner_room.dong_jia = conn.player; //创建房间者即为东家，初始化时会多一张牉！
    conn.player.seat_index = 0; //玩家座位号从0开始
    owner_room.join_player(conn.player); //新建的房间要加入本玩家
    conn.room = owner_room; //创建房间后，应该把房间保存到此socket的连接信息中
    console.log(`${conn.player.username}创建了房间${owner_room.id}`);
    // console.dir(conn)
    //成功创建房间后要给前端发送成功的消息
    socket.sendmsg({
      type: g_events.server_create_room_ok,
      room_id: owner_room.id
    });
  }
}

function client_testlogin(client_message, socket) {
  let shift_name = test_names.shift();
  if (!shift_name) {
    throw new Error("没有空余的测试用户名了！");
  }
  let conn = g_lobby.find_conn_by(socket);
  let s_player = new Player({
    socket: socket,
    username: shift_name,
    user_id: g_lobby.generate_user_id()
  });
  console.log(
    `${s_player.username}登录成功，id:${s_player.user_id}, socket_id: ${
      socket.id
    }`
  );
  conn.player = s_player;
  socket.sendmsg({
    type: g_events.server_login,
    user_id: s_player.user_id,
    username: s_player.username
  });
}

function client_player_ready(client_message, socket) {
  let player = g_lobby.find_player_by_socket(socket);
  let room = g_lobby.find_room_by_socket(socket);
  player.ready = true;

  //向房间内的所有人广播说我已经开始了
  room.server_receive_ready(socket);
  // socket.to(room_name).emit("server_receive_ready", player.username);
  console.log(`房间：${room.id}内用户：${player.username}准备开始游戏 。。。`);
  // 如果所有的人都准备好了，就开始游戏！
  if (room.all_ready) {
    console.log(
      chalk.green(`===>房间${room.id}全部玩家准备完毕，可以游戏啦！`)
    );
    //给所有客户端发牌，room管理所有的牌，g_lobby只是调度！另外，用户没有都进来，room的牌并不需要初始化，节省运算和内存吧。
    room.start_game();
  }
}
