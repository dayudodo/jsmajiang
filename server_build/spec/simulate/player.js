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
        peng: pais(["b1"]),
        selfPeng: pais(["b2"]),
        shouPai: pais(["b1", "b2", "t7", "t7", "t7", "t7", "fa"])
    },
    socket: null,
    username: "jack1",
    user_id: "10001"
});
ava_1.default("能够杠的牌有三张", function (t) {
    t.deepEqual(player1.canGangPais(), pais(["b1", "b2", "t7"]));
});
// var player2 = new Player({
//     group_shou_pai: {
//       anGang: [],
//       mingGang: [],
//       peng: pais(["b1"]),
//       selfPeng:pais(["b2"]),
//       shouPai: pais(["b1", "b2", "t7", "t7", "t7","t7","fa"])
//     },
//     socket: null,
//     username: 'rose2',
//     user_id: '10002'
//   });
// var player3 = new Player({
//     group_shou_pai: {
//       anGang: [],
//       mingGang: [],
//       peng: pais(["b1"]),
//       selfPeng:pais(["b2"]),
//       shouPai: pais(["b1", "b2", "t7", "t7", "t7","t7","fa"])
//     },
//     socket: null,
//     username: 'tom3',
//     user_id: '10003'
//   });
//# sourceMappingURL=player.js.map