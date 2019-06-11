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
import { SocketTest } from "../SocketTest"

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
enum Operate {
  mo = "mo",
  da = "da",
  peng = "peng",
  gang = "gang",
  hu = "hu",
  liang = "liang",
  guo = "guo"
}

var room: Room, player1: Player, player2: Player, player3: Player
//使用beforeEach保证每个test之前都会有新的room, players！
var init = function(paisData: Pai[] = TablePaiManager.zhuang_mopai_gang()) {
  room = new Room()
  //玩家必须有socket, 用于传递消息！
  player1 = new Player({
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

  player2 = new Player({
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
  player3 = new Player({
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
  room.serverGameStart(paisData)
}

test("player1有selectShow", function(t) {
  init()
  t.deepEqual(player1.arr_selectShow, [false, false, true, false])
  t.deepEqual(player2.arr_selectShow, [])
  t.deepEqual(player3.arr_selectShow, [])
  t.deepEqual(room.selectShowQue.players, [player1])
  t.is(room.selectShowQue.canSelect(player1), true)
})
test("player1选择过", function(t) {
  init()
  room.client_confirm_guo(player1)
  room.client_confirm_guo(player2) //无效，没反应
  room.client_confirm_guo(player3) //无效，没反应
  t.deepEqual(room.selectShowQue.players, [])
})
test("player1选择杠", function(t) {
  init()
  room.client_confirm_gang({ selectedPai: to_number("di") }, player2) //无效
  room.client_confirm_gang({ selectedPai: to_number("di") }, player3) //无效
  t.deepEqual(room.selectShowQue.players, [player1])
  room.client_confirm_gang({ selectedPai: to_number("di") }, player1)
  t.deepEqual(room.selectShowQue.players, [])
  t.deepEqual(player1.group_shou_pai.anGang, pais("di"))
})

test("庄家打b1后player2能扛", function(t) {
  init(TablePaiManager.zhuang_fangGang())
  room.client_da_pai(player1, to_number("b1"))
  t.deepEqual(room.selectShowQue.players, [player2])
  room.client_confirm_gang({ selectedPai: to_number("b1") }, player2)
  t.deepEqual(room.selectShowQue.players, [])
  t.deepEqual(player2.group_shou_pai.mingGang, pais("b1"))
})
test("庄家打b1后player2能扛，打zh后player3扛上扛", function(t) {
  init(TablePaiManager.player2_fang_GangShangGang())
  room.client_da_pai(player1, to_number("b1"))
  t.deepEqual(room.selectShowQue.players, [player2])
  room.client_confirm_gang({ selectedPai: to_number("b1") }, player2)
  t.deepEqual(room.selectShowQue.players, [])
  t.deepEqual(player2.group_shou_pai.mingGang, pais("b1"))
  //player2放杠牌zh
  room.client_da_pai(player2, to_number("zh"))
  t.deepEqual(room.selectShowQue.players, [player3])
  room.client_confirm_gang({ selectedPai: to_number("zh") }, player3)
  t.deepEqual(room.selectShowQue.players, [])
  t.deepEqual(player3.group_shou_pai.mingGang, pais("zh"))
  t.deepEqual(room.front_operationOf(room.dapai_player, 3).action, Operate.gang)
  t.deepEqual(room.dapai_player.innerGang_lose_data, [
    { type: config.LoseGangShangGang, pai: to_number("zh") }
  ])
  t.deepEqual(player2.gang_lose_names,['放杠上杠'])
  t.deepEqual(player3.gang_win_codes,[config.HuisGangShangGang])
  t.deepEqual(player3.gang_win_names,['杠上杠'])
})
