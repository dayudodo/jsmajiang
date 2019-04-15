var express = require("express"),
  http = require("http"),
  WebSocket = require("ws");

import * as config from "./config";
import * as _ from "lodash";
import { LobbyManager } from "./LobbyManager";
import { Player } from "./player";
import { Room } from "./room";
import chalk from "chalk";
import * as g_events from "./events";
const app = express();

declare global {
  namespace NodeJS {
    interface Global {
      room: Room;
    }
  }
}
//初始化一个http server
const server = http.createServer(app);
const wsserver = new WebSocket.Server({ server });
const g_lobby = new LobbyManager();
var test_names = ["jack1", "rose2", "tom3", "jerry4", "michael5", "adam6", "bruce7", "adam8", "david9"];
var eventsHandler: [String, Function][] = [
  [g_events.client_testlogin, client_testlogin],
  [g_events.client_create_room, client_create_room],
  [g_events.client_join_room, client_join_room],
  [g_events.client_player_ready, client_player_ready],
  [g_events.client_da_pai, client_da_pai],
  [g_events.client_confirm_hu, client_confirm_hu],
  // [g_events.client_confirm_ting, client_confirm_ting],
  [g_events.client_confirm_liang, client_confirm_liang],
  [g_events.client_confirm_mingGang, client_confirm_mingGang],
  [g_events.client_confirm_peng, client_confirm_peng],
  [g_events.client_confirm_guo, client_confirm_guo],
  [g_events.client_restart_game, client_restart_game],
  [g_events.client_disslove, client_disslove  ],
];


/**房主解散房间 */
function client_disslove(client_message, socket) {
  let player = g_lobby.find_player_by(socket);
  console.log(`房间:${player.room.id} 用户:${player.username} 解散房间`);
  //重启游戏也需要修改g_lobby中保存的玩家信息，便于下面的查找
  //另外，使用socket传递参数其实是最正确的选择，而不是直接找到player!
  if('ok'== player.room.client_disslove(g_lobby, client_message, socket)){
  }else{
    throw new Error('用户解散房间失败')
  }
}
function client_restart_game(client_message, socket) {
  let player = g_lobby.find_player_by(socket);
  console.log(`房间:${player.room.id} 用户:${player.username} 重新开始游戏`);
  //重启游戏也需要修改g_lobby中保存的玩家信息，便于下面的查找
  //另外，使用socket传递参数其实是最正确的选择，而不是直接找到player!
  player.room.client_restart_game(g_lobby, client_message, socket);
}

function client_confirm_hu(client_message, socket) {
  let player = g_lobby.find_player_by(socket);
  console.log(`房间:${player.room.id} 用户:${player.username} 选择胡牌`);
  player.room.client_confirm_hu(socket);
}
// function client_confirm_ting(client_message, socket) {
//   let { player, room } = confirmInit(socket);
//   console.log(`房间:${room.id} 用户:${player.username} 选择听牌`);
//   room.client_confirm_ting(socket);
// }
function client_confirm_liang(client_message, socket) {
  let player = g_lobby.find_player_by(socket);
  console.log(`房间:${player.room.id} 用户:${player.username} 选择亮牌`);
  player.room.client_confirm_liang(client_message, socket);
}
function client_confirm_mingGang(client_message, socket) {
  let player = g_lobby.find_player_by(socket);
  console.log(`房间:${player.room.id} 用户:${player.username} 选择杠牌`);
  player.room.client_confirm_mingGang(client_message, socket);
}
function client_confirm_peng(client_message, socket) {
  let player = g_lobby.find_player_by(socket);
  console.log(`房间:${player.room.id} 用户:${player.username} 选择碰牌`);
  player.room.client_confirm_peng(socket);
}
function client_confirm_guo(client_message, socket) {
  let player = g_lobby.find_player_by(socket);
  console.log(`房间:${player.room.id} 用户:${player.username} 选择过牌`);
  player.room.client_confirm_guo(socket);
}

wsserver.on("connection", socket => {
  socket.id = g_lobby.generate_socket_id();
  g_lobby.new_connect(socket);
  console.log(`有新的连接, id:${socket.id} | 服务器连接数: ${g_lobby.clients_count}`);
  socket.sendmsg({
    type: g_events.server_welcome,
    welcome: "与服务器建立连接，欢迎来到安哥世界"
  });

  socket.on("close", () => {
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
    // socket.disconnect(); //不管我使用socket.close还是terminate都不会让此socket消失。。。也许使用reconnect? 已经连接已经在g_lobby中处理过了！
    console.log("剩%s个连接...", g_lobby.clients_count);
  });
  
  //接收客户端发送来的消息并做相应的处理
  socket.on("message", message => {
    let client_message = JSON.parse(message);
    let right_element = eventsHandler.find(item => client_message.type == item[0]);
    if (right_element) {
      let func = right_element[1];
      func.call(this, client_message, socket);
      return;
    }
    console.log("未知消息:", client_message);
  });
});

function client_da_pai(client_message, socket) {
  let player = g_lobby.find_player_by(socket);
  let pai: Pai = client_message.pai;
  console.log(chalk.blue(`用户${player.username}打牌:${pai}`));
  //告诉房间，哪个socket打了啥牌
  player.room.client_da_pai(socket, pai);
  
}

function client_join_room(client_message, socket) {
  let { room_number } = client_message;
  let room = g_lobby.find_room_by_id(room_number);
  // console.dir(room);
  let _me = g_lobby.find_player_by(socket); //有时候感觉直接把用户信息就保存在socket里面也许会更方便，不过呢，会改变socket
  let conn = g_lobby.find_conn_by(socket);
  //找到房间后，还要把当前连接的room保存到其连接信息中，而在登录时conn中已经保存有用户信息了
  conn.room = room;
  console.log(`用户${_me.username}想要加入房间${room_number}`);
  // console.log('本玩家连接信息')
  // console.dir(conn);
  if (room) {
    //todo: 检查房间玩家数量，超过3人就不能再添加了
    console.log(`${room_number}房间内全部玩家：${room.all_player_names}`);
    if (room.players_count == config.LIMIT_IN_ROOM) {
      console.log(`房间${room_number}已满，玩家有：${room.all_player_names}`);
      socket.sendmsg({ type: g_events.server_room_full });
    } else {
      console.log(`用户${_me.username}成功加入房间${room_number}`);
      //房间会保存玩家信息，玩家也会保存房间信息
      room.join_player(_me);
      // console.dir(room)
      //通知他人应该是房间的事情！
      // room.player_enter_room(socket);
    }
  } else {
    console.log(`服务器无此房间：${room_number}`);
    socket.sendmsg({
      type: g_events.server_no_such_room
    });
  }
}

//客户端玩家创建房间
function client_create_room(client_message, socket) {
  let conn = g_lobby.find_conn_by(socket);
  if (!conn.player) {
    socket = null;
    console.log(`用户${conn.player.username}未登录执行了创建房间：${conn.socket_id}`);
    return;
  } else {
    let owner_room = new Room();
    let room_name = owner_room.id;
    if (room_name) {
      owner_room.create_by(conn.player)
      conn.room = owner_room; //创建房间后，应该把房间保存到此socket的连接信息中
      console.log(`${conn.player.username}创建了房间${owner_room.id}, seat_index: ${conn.player.seat_index}`);
      // conn.room.player_enter_room(socket);
      //todo: 供调试用
      global.room = conn.room;

    } else { //无法创建房间号

      console.log("服务器无可用房间了");
      socket.sendmsg({
        type: g_events.server_no_room
      });
    }
  }
}

function client_testlogin(client_message, socket) {
  let shift_name = test_names.shift();
  if (!shift_name) {
    throw new Error("没有空余的测试用户名了！");
  }
  let conn = g_lobby.find_conn_by(socket);
  let s_player = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng: [],
      shouPai: []
    },
    socket: socket,
    username: shift_name,
    user_id: g_lobby.generate_user_id()
  });
  //todo: 模拟用户的积分，暂时定为其id增长1万。
  s_player.score = s_player.user_id + 10000;
  s_player.ip = socket.handshake.address //通过socket获取到用户的ip地址
  console.log(`${s_player.username}登录成功，id:${s_player.user_id}, socket_id: ${socket.id}`);
  conn.player = s_player;
  socket.sendmsg({
    type: g_events.server_login,
    user_id: s_player.user_id,
    username: s_player.username,
    score: s_player.score
  });
}

function client_player_ready(client_message, socket) {
  let player = g_lobby.find_player_by(socket);
  let room = g_lobby.find_room_by(socket);
  player.ready = true;

  //向房间内的所有人广播说我已经开始了
  room.server_receive_ready(socket);
  // socket.to(room_name).emit("server_receive_ready", player.username);
  console.log(`房间：${room.id}内用户：${player.username}准备开始游戏 。。。`);
  // 如果所有的人都准备好了，就开始游戏！
  if (room.all_ready) {
    console.log(chalk.green(`===>房间${room.id}全部玩家准备完毕，可以游戏啦！`));
    // room.send_all_players_message();
    //给所有客户端发牌，room管理所有的牌，g_lobby只是调度！另外，用户没有都进来，room的牌并不需要初始化，节省运算和内存吧。
    room.server_game_start();
  }
}

//服务器相关信息，包括内存使用状态，当前玩家数量
function server_info(){
  return {
    memoryUsage: process.memoryUsage(),
    clients_count: g_lobby.clients_count,
  }
}
//start our server
server.listen(process.env.PORT || config.PORT, () => {
  var ifs = require("os").networkInterfaces();
  var address = Object.keys(ifs)
    .map(x => ifs[x].filter(x => x.family === "IPv4" && !x.internal)[0])
    .filter(x => x)[0].address;
  let { port } = server.address();
  console.log(`服务器已经启动，物理地址：${address}:${port}`);
});
