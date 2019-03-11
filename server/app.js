"use strict";
var _this = this;
exports.__esModule = true;
var express = require("express"), http = require("http"), WebSocket = require("ws"), ip = require("ip");
var config = require("./config");
var _ = require("lodash");
var LobbyManager_1 = require("./LobbyManager");
var player_1 = require("./player");
var room_1 = require("./room");
var chalk_1 = require("chalk");
var g_events = require("./events");
var app = express();
//initialize a simple http server
var server = http.createServer(app);
var wsserver = new WebSocket.Server({ server: server });
var g_lobby = new LobbyManager_1.LobbyManager();
var test_names = ["jack1", "rose2", "tom3", "jerry4", "michael5", "adam6", "bruce7", "adam8", "david9"];
var eventsHandler = [
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
    [g_events.client_restart_game, client_restart_game]
];
function client_restart_game(client_message, socket) {
    var player = g_lobby.find_player_by(socket);
    console.log("\u623F\u95F4:" + player.room.id + " \u7528\u6237:" + player.username + " \u91CD\u65B0\u5F00\u59CB\u6E38\u620F");
    //重启游戏也需要修改g_lobby中保存的玩家信息，便于下面的查找
    //另外，使用socket传递参数其实是最正确的选择，而不是直接找到player!
    player.room.client_restart_game(g_lobby, client_message, socket);
}
function client_confirm_hu(client_message, socket) {
    var player = g_lobby.find_player_by(socket);
    console.log("\u623F\u95F4:" + player.room.id + " \u7528\u6237:" + player.username + " \u9009\u62E9\u80E1\u724C");
    player.room.client_confirm_hu(socket);
}
// function client_confirm_ting(client_message, socket) {
//   let { player, room } = confirmInit(socket);
//   console.log(`房间:${room.id} 用户:${player.username} 选择听牌`);
//   room.client_confirm_ting(socket);
// }
function client_confirm_liang(client_message, socket) {
    var player = g_lobby.find_player_by(socket);
    console.log("\u623F\u95F4:" + player.room.id + " \u7528\u6237:" + player.username + " \u9009\u62E9\u4EAE\u724C");
    player.room.client_confirm_liang(client_message, socket);
}
function client_confirm_mingGang(client_message, socket) {
    var player = g_lobby.find_player_by(socket);
    console.log("\u623F\u95F4:" + player.room.id + " \u7528\u6237:" + player.username + " \u9009\u62E9\u6760\u724C");
    player.room.client_confirm_mingGang(client_message, socket);
}
function client_confirm_peng(client_message, socket) {
    var player = g_lobby.find_player_by(socket);
    console.log("\u623F\u95F4:" + player.room.id + " \u7528\u6237:" + player.username + " \u9009\u62E9\u78B0\u724C");
    player.room.client_confirm_peng(socket);
}
function client_confirm_guo(client_message, socket) {
    var player = g_lobby.find_player_by(socket);
    console.log("\u623F\u95F4:" + player.room.id + " \u7528\u6237:" + player.username + " \u9009\u62E9\u8FC7\u724C");
    player.room.client_confirm_guo(socket);
}
wsserver.on("connection", function (socket) {
    socket.id = g_lobby.generate_socket_id();
    g_lobby.new_connect(socket);
    console.log("\u6709\u65B0\u7684\u8FDE\u63A5, id:" + socket.id + " | \u670D\u52A1\u5668\u8FDE\u63A5\u6570: " + g_lobby.clients_count);
    socket.sendmsg({
        type: g_events.server_welcome,
        welcome: "与服务器建立连接，欢迎来到安哥世界"
    });
    var onClose = function () {
        var disconnect_client = g_lobby.dis_connect(socket);
        // console.dir(disconnect_client);
        var d_client = _.first(disconnect_client);
        //断开其实要考虑的事情也比较多，登录后断开，加入房间后断开，都要想到，所以写这东西对游戏服务器肯定是有基础的了解了！
        if (d_client && d_client.player) {
            console.log("\u73A9\u5BB6:" + d_client.player.username + " \u8FDE\u63A5\u65AD\u5F00");
            var room = d_client.room;
            console.dir(room);
            if (room) {
                room.exit_room(socket);
                console.log("\u73A9\u5BB6:" + d_client.player.username + "\u9000\u51FA\u623F\u95F4" + room.id);
                //todo: 断开连接还需要通知其它用户我断线了
            }
        }
        else {
            console.log("\u7528\u6237\u672A\u767B\u5F55\u7684\u60C5\u51B5\u4E0B\u65AD\u5F00\u8FDE\u63A5: " + socket.id);
        }
        //只有进入房间的才算是真正的玩家
        // console.log("剩%s个用户...", g_lobby.players_count);
        socket = null; //不管我使用socket.close还是terminate都不会让此socket消失。。。也许使用reconnect?
        console.log("剩%s个连接...", g_lobby.clients_count);
    };
    socket.on("close", onClose);
    //connection is up, let's add a simple simple event
    socket.on("message", function (message) {
        //log the received message and send it back to the client
        var client_message = JSON.parse(message);
        var right_element = eventsHandler.find(function (item) { return client_message.type == item[0]; });
        if (right_element) {
            var func = right_element[1];
            func.call(_this, client_message, socket);
            return;
        }
        console.log("未知消息:", client_message);
    });
});
function client_da_pai(client_message, socket) {
    var player = g_lobby.find_player_by(socket);
    var pai = client_message.pai;
    console.log(chalk_1["default"].blue("\u7528\u6237" + player.username + "\u6253\u724C:" + pai));
    //告诉房间，哪个socket打了啥牌
    player.room.client_da_pai(socket, pai);
}
function client_join_room(client_message, socket) {
    var room_number = client_message.room_number;
    var room = g_lobby.find_room_by_id(room_number);
    // console.dir(room);
    var _me = g_lobby.find_player_by(socket); //有时候感觉直接把用户信息就保存在socket里面也许会更方便，不过呢，会改变socket
    var conn = g_lobby.find_conn_by(socket);
    //找到房间后，还要把当前连接的room保存到其连接信息中，而在登录时conn中已经保存有用户信息了
    conn.room = room;
    console.log("\u7528\u6237" + _me.username + "\u60F3\u8981\u52A0\u5165\u623F\u95F4" + room_number);
    // console.log('本玩家连接信息')
    // console.dir(conn);
    if (room) {
        //todo: 检查房间玩家数量，超过3人就不能再添加了
        console.log(room_number + "\u623F\u95F4\u5185\u5168\u90E8\u73A9\u5BB6\uFF1A" + room.all_player_names);
        if (room.players_count == config.LIMIT_IN_ROOM) {
            console.log("\u623F\u95F4" + room_number + "\u5DF2\u6EE1\uFF0C\u73A9\u5BB6\u6709\uFF1A" + room.all_player_names);
            socket.sendmsg({ type: g_events.server_room_full });
        }
        else {
            console.log("\u7528\u6237" + _me.username + "\u6210\u529F\u52A0\u5165\u623F\u95F4" + room_number);
            //设置其座位号
            _me.seat_index = room.last_join_player.seat_index + 1;
            //房间会保存玩家信息，玩家也会保存房间信息
            room.join_player(_me);
            _me.room = room;
            // console.dir(room)
            //通知他人应该是房间的事情！
            room.player_enter_room(socket);
        }
    }
    else {
        console.log("\u670D\u52A1\u5668\u65E0\u6B64\u623F\u95F4\uFF1A" + room_number);
        socket.sendmsg({
            type: g_events.server_no_such_room
        });
    }
}
function client_create_room(client_message, socket) {
    var conn = g_lobby.find_conn_by(socket);
    if (!conn.player) {
        socket = null;
        console.log("\u7528\u6237" + conn.player.username + "\u672A\u767B\u5F55\u6267\u884C\u4E86\u521B\u5EFA\u623F\u95F4\uFF1A" + conn.socket_id);
        return;
    }
    else {
        var owner_room = new room_1.Room();
        var room_name = owner_room.id;
        if (room_name) {
            owner_room.set_dong_jia(conn.player); //创建房间者即为东家，初始化时会多一张牉！
            conn.player.seat_index = 0; //玩家座位号从0开始
            owner_room.join_player(conn.player); //新建的房间要加入本玩家
            conn.room = owner_room; //创建房间后，应该把房间保存到此socket的连接信息中
            console.log(conn.player.username + "\u521B\u5EFA\u4E86\u623F\u95F4" + owner_room.id + ", seat_index: " + conn.player.seat_index);
            conn.room.player_enter_room(socket);
            //todo: 供调试用
            global.room = conn.room;
        }
        else { //无法创建房间号
            console.log("服务器无可用房间了");
            socket.sendmsg({
                type: g_events.server_no_room
            });
        }
    }
}
function client_testlogin(client_message, socket) {
    var shift_name = test_names.shift();
    if (!shift_name) {
        throw new Error("没有空余的测试用户名了！");
    }
    var conn = g_lobby.find_conn_by(socket);
    var s_player = new player_1.Player({
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
    console.log(s_player.username + "\u767B\u5F55\u6210\u529F\uFF0Cid:" + s_player.user_id + ", socket_id: " + socket.id);
    conn.player = s_player;
    socket.sendmsg({
        type: g_events.server_login,
        user_id: s_player.user_id,
        username: s_player.username,
        score: s_player.score
    });
}
function client_player_ready(client_message, socket) {
    var player = g_lobby.find_player_by(socket);
    var room = g_lobby.find_room_by(socket);
    player.ready = true;
    //向房间内的所有人广播说我已经开始了
    room.server_receive_ready(socket);
    // socket.to(room_name).emit("server_receive_ready", player.username);
    console.log("\u623F\u95F4\uFF1A" + room.id + "\u5185\u7528\u6237\uFF1A" + player.username + "\u51C6\u5907\u5F00\u59CB\u6E38\u620F \u3002\u3002\u3002");
    // 如果所有的人都准备好了，就开始游戏！
    if (room.all_ready) {
        console.log(chalk_1["default"].green("===>\u623F\u95F4" + room.id + "\u5168\u90E8\u73A9\u5BB6\u51C6\u5907\u5B8C\u6BD5\uFF0C\u53EF\u4EE5\u6E38\u620F\u5566\uFF01"));
        // room.send_all_players_message();
        //给所有客户端发牌，room管理所有的牌，g_lobby只是调度！另外，用户没有都进来，room的牌并不需要初始化，节省运算和内存吧。
        room.server_game_start();
    }
}
//start our server
server.listen(process.env.PORT || config.PORT, function () {
    var ifs = require("os").networkInterfaces();
    var address = Object.keys(ifs)
        .map(function (x) { return ifs[x].filter(function (x) { return x.family === "IPv4" && !x.internal; })[0]; })
        .filter(function (x) { return x; })[0].address;
    var port = server.address().port;
    console.log("\u670D\u52A1\u5668\u5DF2\u7ECF\u542F\u52A8\uFF0C\u7269\u7406\u5730\u5740\uFF1A" + address + ":" + port);
});
