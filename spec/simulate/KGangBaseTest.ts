//测试room中decideShow中的扛牌情况
import test from "ava"
import * as util from "util"
import { Room } from "../../server/room"
import { Player } from "../../server/Player"
import { PaiConvertor } from "../../server/PaiConvertor"
import * as config from "../../server/config"
import * as g_events from "../../server/events"
import chalk from "chalk"
import { TablePaiManager } from "../../server/TablePaiManager"
import _ = require("lodash")
import { SocketTest } from "../SocketTest";

/**直接将字符串转换成数类麻将数组 */
function pais(strs): number[] {
  return PaiConvertor.pais(strs)
}
function orderPais(strs) {
  return _.orderBy(pais(strs))
}
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}
export function puts(obj: any) {
  console.log(chalk.green(util.inspect(obj)))
}

var room = new Room()
//玩家必须有socket, 用于传递消息！
var player1 = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: []
  },
  socket: new SocketTest("jack1"),
  username: "jack1",
  user_id: "10001"
})

var player2 = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: []
  },
  socket: new SocketTest("rose2"),
  username: "rose2",
  user_id: "10002"
})
var player3 = new Player({
  group_shou_pai: {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: []
  },
  socket: new SocketTest("tom3"),
  username: "tom3",
  user_id: "10003"
})
room.create_by(player1)
room.join_player(player2)
room.join_player(player3)

//开始游戏之前要先准备一下
room.players.forEach(item => (item.ready = true))
room.serverGameStart(TablePaiManager.zhuang_mopai_gang())

test("服务器发牌后player1手牌能扛", function(t) {
    let shou1 = orderPais("b8 b9 t1 t1 t1 t1 t7 zh zh fa di di di")
    let shou2 = orderPais("b1 b1 b2 b2 b3 b3 b5 b6 b7 b8 b8 b9 fa")
    let shou3 = orderPais("b4 b5 b6 b7 b8 b9 t2 t7 t7 t7 t8 t8 t9")
    t.deepEqual(player1.group_shou_pai.shouPai, shou1)
    t.deepEqual(player2.group_shou_pai.shouPai, shou2)
    t.deepEqual(player3.group_shou_pai.shouPai, shou3)

    t.deepEqual(player1.mo_pai, to_number("di"))


    
})