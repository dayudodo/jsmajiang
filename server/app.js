var express = require("express"),
  http = require("http"),
  WebSocket = require("ws"),
  config = require("./../config");
import _ from "lodash";
import { Connector } from "./Connector";
import { Player } from "./player";
import { Room } from "./room";
import chalk from "chalk";
const app = express();

//initialize a simple http server
const server = http.createServer(app);
const wsserver = new WebSocket.Server({ server });
const g_lobby = new Connector();
var test_names = ["jack", "rose", "tom", "jerry", "michael", "adam", "bruce"];

wsserver.on("connection", socket => {
  socket.id = g_lobby.generate_socket_id();
  g_lobby.new_connect(socket);
  console.log(
    `有新的连接：${socket.id} | 服务器连接数: ${g_lobby.clients_count}`
  );
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

    //测试登录
    if (client_message.testlogin) {
      let shift_name = test_names.shift();
      if (!shift_name) {
        throw new Error("没有空余的测试用户名了！");
      }
      let conn = g_lobby.find_conn_by(socket);
      let s_player = new Player({
        socket: socket,
        username: shift_name
      });
      console.log(`${s_player.username}登录成功，socket_id: ${socket.id}`);
      conn.player = s_player;
      socket.send(
        JSON.stringify({
          server_login: "success",
          userId: socket.id,
          username: s_player.username
        })
      );
    //创建房间
    } else if (client_message.create_room) {
      let conn = g_lobby.find_conn_by(socket);
      if (!conn.player) {
        socket = null;
        console.log(
          `用户${conn.username}未登录执行了创建房间：${conn.socket.id}`
        );
        return;
      } else {
        let owner_room = new Room();
        let room_name = Room.make();
        if (room_name) {
          owner_room.id = room_name;
        } else {
          console.log("服务器无可用房间了");
          socket.send(
            JSON.stringify({
              server_no_room: "server_no_room"
            })
          );
          return;
        }
        owner_room.dong_jia = conn.player; //创建房间者即为东家，初始化时会多一张牉！
        conn.player.seat_index = 0; //玩家座位号从0开始
        owner_room.join_player(conn.player); //新建的房间要加入本玩家
        conn.room = owner_room; //创建房间后，应该把房间保存到此socket的连接信息中
        console.log(`${conn.player.username}创建了房间${owner_room.id}`);
        // console.dir(conn)
        //成功创建房间后要给前端发送成功的消息
        socket.send(
          JSON.stringify({
            server_join_room_ok: "server_join_room_ok",
            room_name: owner_room.id
          })
        );
      }
    } else {
      socket.send(JSON.stringify({ info: `未知消息${message}` }));
    }
  });

  //send immediatly a feedback to the incoming connection
  socket.send(JSON.stringify({ welcome: "欢迎来到安哥的游戏世界" }));
});

//start our server
server.listen(process.env.PORT || config.PORT, () => {
  console.log(`服务器已经启动，端口号： ${server.address().port} :)`);
});
