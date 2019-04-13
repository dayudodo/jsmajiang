"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const room_1 = require("../../server/room");
const Player_1 = require("../../server/Player");
const PaiConvertor_1 = require("../../server/PaiConvertor");
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
    return PaiConvertor_1.PaiConvertor.pais(strs);
}
function to_number(str) {
    return PaiConvertor_1.PaiConvertor.ToNumber(str);
}
var room = new room_1.Room();
var player1 = new Player_1.Player({
    group_shou_pai: {
        anGang: [],
        mingGang: [],
        peng: [],
        selfPeng: [],
        shouPai: pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa")
    },
    socket: null,
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
    socket: null,
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
    socket: null,
    username: "tom3",
    user_id: "10003"
});
ava_1.default("应该有个房间号1001", function (t) {
    t.is(room.id, 1001);
});
//# sourceMappingURL=roomBaseTest.js.map