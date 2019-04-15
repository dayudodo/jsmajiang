"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const util = require("util");
const room_1 = require("../../server/room");
const Player_1 = require("../../server/Player");
const PaiConvertor_1 = require("../../server/PaiConvertor");
const chalk_1 = require("chalk");
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
    return PaiConvertor_1.PaiConvertor.pais(strs);
}
function to_number(str) {
    return PaiConvertor_1.PaiConvertor.ToNumber(str);
}
function puts(obj) {
    console.log(chalk_1.default.green(util.inspect(obj)));
}
class SocketTest {
    constructor(username) {
        this.username = username;
        this.id = Math.random();
    }
    sendmsg(msg) {
        console.log(`===${this.username} msg==`);
        // for (let key in msg) {
        //   console.log(chalk.green(`${key}: ${msg[key]}`))
        // }
        puts(msg);
        console.log("===end===");
    }
}
var room = new room_1.Room();
//玩家必须有socket, 用于传递消息！
var player1 = new Player_1.Player({
    group_shou_pai: {
        anGang: [],
        mingGang: [],
        peng: [],
        selfPeng: [],
        shouPai: pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa")
    },
    socket: new SocketTest('jack1'),
    username: "jack1",
    user_id: "10001"
});
var player2 = new Player_1.Player({
    group_shou_pai: {
        anGang: [],
        mingGang: [],
        peng: [],
        selfPeng: [],
        shouPai: pais("t1 t1 t1 t3 t4 t5 zh zh zh fa fa fa di")
    },
    socket: new SocketTest('rose2'),
    username: "rose2",
    user_id: "10002"
});
var player3 = new Player_1.Player({
    group_shou_pai: {
        anGang: [],
        mingGang: [],
        peng: [],
        selfPeng: [],
        shouPai: pais("b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 t9")
    },
    socket: new SocketTest('tom3'),
    username: "tom3",
    user_id: "10003"
});
room.join_player(player1);
room.join_player(player2);
room.join_player(player3);
ava_1.default("应该有个房间号1001", function (t) {
    t.is(room.id, 1001);
});
ava_1.default("用户全部加入房间", function (t) {
    t.is(room.players_count, 3);
});
//# sourceMappingURL=roomBaseTest.js.map