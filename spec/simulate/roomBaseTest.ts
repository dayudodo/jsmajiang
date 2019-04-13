import test from "ava"
import { Room } from "../../server/room"
import { Player } from "../../server/Player"
import { PaiConvertor } from "../../server/PaiConvertor"
import * as config from "../../server/config"
/**直接将字符串转换成数类麻将数组 */
function pais(strs): number[] {
  return PaiConvertor.pais(strs)
}
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}

class SocketTest {
  constructor() {}
  sendmsg(msg) {
    for(let key in msg){
      console.log(`${key}: ${msg[key]}`);
    }
  }
}

var room = new Room()
var player1 = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa")
  },
  socket: new SocketTest(),
  username: "jack1",
  user_id: "10001"
})

var player2 = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais("t1 t1 t1 t3 t4 t5 zh zh zh fa fa fa di")
  },
  socket: new SocketTest(),
  username: "rose2",
  user_id: "10002"
})
var player3 = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais("b4 b5 b6 b7 b8 b9 t1 t7 t7 t7 t8 t8 t9")
  },
  socket: new SocketTest(),
  username: "tom3",
  user_id: "10003"
})

test("应该有个房间号1001", function(t) {
  t.is(room.id, 1001)
})
