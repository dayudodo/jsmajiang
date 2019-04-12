import test from "ava"
import { Room } from "../../server/room"
import { Player } from "../../server/Player"
import { PaiConvertor } from "../../server/PaiConvertor"
import * as config from "../../server/config"
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}

var room = new Room()
var player1 = new Player({
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
})
test("能够杠的牌有三张", function(t) {
  t.deepEqual(player1.canGangPais(), pais(["b1", "b2", "t7"]))
})

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
