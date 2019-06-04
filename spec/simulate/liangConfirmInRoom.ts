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
import { toUnicode } from "punycode"

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

var room: Room, player1: Player, player2: Player, player3: Player
//使用beforeEach保证每个test之前都会有新的room, players！
var init = function(paisData: Pai[] = TablePaiManager.zhuang_dapai_liang()) {
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

// [isShowHu, isShowLiang, isShowGang, isShowPeng]
test("庄完打牌能亮，player1有selectShow", function(t) {
  init()
  player1.can_dapai = true
  room.client_da_pai(player1, to_number("t3"))
  t.deepEqual(player1.arr_selectShow, [false, true, false, false])
  t.deepEqual(player2.arr_selectShow, [])
  t.deepEqual(player3.arr_selectShow, [])
  t.deepEqual(room.selectShowQue.players, [player1])
  t.is(room.selectShowQue.canSelect(player1), true)
})
test("player1选择过，后selectShowQue变为空", function(t) {
  init()
  player1.can_dapai = true
  room.client_da_pai(player1, to_number("t3"))
  room.client_confirm_guo(player1)
  room.client_confirm_guo(player2) //无效，没反应
  room.client_confirm_guo(player3) //无效，没反应
  t.deepEqual(room.selectShowQue.players, [])
})
test("player1选择亮", function(t) {
  init()
  player1.can_dapai = true
  room.client_da_pai(player1, to_number("t3"))
  room.client_confirm_liang({ liangHidePais: [] }, player2) //无效
  room.client_confirm_liang({ liangHidePais: [] }, player3) //无效
  t.deepEqual(room.selectShowQue.players, [player1])
  room.client_confirm_liang({ liangHidePais: [] }, player1)
  t.deepEqual(room.selectShowQue.players, []) //不再有操作选项
  t.deepEqual(player1.hupai_data.all_hupai_zhang, _.sortBy(pais('t4 di')))
  // t.deepEqual(player2.group_shou_pai.peng, pais("fa")) //player2记录下了碰牌
})

test("player23能亮", function(t) {
  init(TablePaiManager.player23_liangTest())
  t.deepEqual(room.selectShowQue.players,[player2,player3])
  t.deepEqual(player2.arr_selectShow, [false,true,false,false])
  t.deepEqual(player3.arr_selectShow, [false,true,false,false])
})
test("player23能亮, 且选择了隐藏的牌", function(t) {
  init(TablePaiManager.player23_liangTest())
  room.client_confirm_liang( {liangHidePais: [to_number('b1')]}, player2) //亮，并且把b1起来
  t.deepEqual(player2.group_shou_pai.selfPeng, [to_number('b1')])
})