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
var init = function() {
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
    username: "player1_jack1",
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
    username: "player2_rose2",
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
    username: "player3_tom3",
    user_id: "10003"
  })
  room.create_by(player1)
  room.join_player(player2)
  room.join_player(player3)
  //开始游戏之前要先准备一下
  room.players.forEach(item => (item.ready = true))
  room.serverGameStart(TablePaiManager.player2_qidiu_ting())
}

// [isShowHu, isShowLiang, isShowGang, isShowPeng]
test("player2有selectShow", function(t) {
  init()
  t.deepEqual(player2.arr_selectShow, [false, true, false, false]) //一上手，player2就有selectShow，可以听胡
  t.deepEqual(player1.arr_selectShow, [])
  t.deepEqual(player3.arr_selectShow, [])
  t.deepEqual(room.selectShowQue.players, [player2])
  t.is(room.selectShowQue.canSelect(player1), false)
  t.is(room.selectShowQue.canSelect(player2), true) //只有player2才可以打牌！
})
test("player2选择过，后selectShowQue变为空", function(t) {
  init()
  room.client_confirm_guo(player2)
  room.client_confirm_guo(player1) //无效，没反应
  room.client_confirm_guo(player3) //无效，没反应
  t.deepEqual(room.selectShowQue.players, [])
})
test("player2可以胡并选择胡", function(t) {
  init()
  room.client_confirm_guo(player2) //七对听胡，选择过
  room.client_confirm_hu( player1) //无效
  room.client_confirm_hu( player3) //无效
  player1.can_dapai = true //todo:改为正常的判断
  room.client_da_pai(player1, to_number("b5"))
  //player2可以胡b5
  t.deepEqual(player2.hupai_data.all_hupai_zhang, _.sortBy(pais('b5')))
  //即能胡也可以亮
  t.deepEqual(player2.arr_selectShow, [true, true, false, false])
  t.deepEqual(player1.arr_selectShow, [])
  t.deepEqual(player3.arr_selectShow, [])
  room.client_confirm_hu(player2)
  t.deepEqual(room.selectShowQue.players, []) //不再有操作选项
  t.is(player2.is_hu, true)
  // t.deepEqual(player2.group_shou_pai.peng, pais("fa")) //player2记录下了碰牌
})