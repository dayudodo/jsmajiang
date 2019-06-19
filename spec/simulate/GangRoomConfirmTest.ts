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

// test("player1有selectShow", function(t) {
//   init()
//   t.deepEqual(player1.arr_selectShow, [false, false, true, false])
//   t.deepEqual(player2.arr_selectShow, [])
//   t.deepEqual(player3.arr_selectShow, [])
//   t.deepEqual(room.selectShowQue.players, [player1])
//   t.is(room.selectShowQue.canSelect(player1), true)
// })
// test("player1选择过", function(t) {
//   init()
//   room.client_confirm_guo(player1)
//   room.client_confirm_guo(player2) //无效，没反应
//   room.client_confirm_guo(player3) //无效，没反应
//   t.deepEqual(room.selectShowQue.players, [])
// })
// test("测试自扛与他扛，player1选择杠", function(t) {
//   init()
//   room.client_confirm_gang({ selectedPai: to_number("di") }, player2) //无效
//   room.client_confirm_gang({ selectedPai: to_number("di") }, player3) //无效
//   t.deepEqual(room.selectShowQue.players, [player1])
//   room.client_confirm_gang({ selectedPai: to_number("di") }, player1)
//   t.deepEqual(player1.group_shou_pai.anGang, pais("di"))
//   //扛了di其实还有一个t1的扛
//   t.deepEqual(room.selectShowQue.players, [player1])
//   t.deepEqual(player1.canGangPais, pais("t1"))
//   room.client_confirm_gang({ selectedPai: to_number("t1") }, player1)
//   t.deepEqual(room.selectShowQue.players, [])
// })

// test("测试明扛，庄家打b1后player2能扛", function(t) {
//   init(TablePaiManager.zhuang_fangGang())
//   room.client_da_pai(player1, to_number("b1"))
//   t.deepEqual(room.selectShowQue.players, [player2])
//   room.client_confirm_gang({ selectedPai: to_number("b1") }, player2)
//   t.deepEqual(room.selectShowQue.players, [])
//   t.deepEqual(player2.group_shou_pai.mingGang, pais("b1"))
// })

// test("测试扛输赢名称，庄家打b1后player2能扛，打zh后player3扛上扛", function(t) {
//   init(TablePaiManager.player2_fang_GangShangGang())
//   // player1放扛牌b1
//   room.client_da_pai(player1, to_number("b1"))
//   t.deepEqual(room.selectShowQue.players, [player2])
//   //player2扛b1
//   room.client_confirm_gang({ selectedPai: to_number("b1") }, player2)
//   t.deepEqual(room.selectShowQue.players, [])
//   t.deepEqual(player2.group_shou_pai.mingGang, pais("b1"))
//   //player2放杠牌zh
//   room.client_da_pai(player2, to_number("zh"))
//   t.deepEqual(room.selectShowQue.players, [player3])
//   room.client_confirm_gang({ selectedPai: to_number("zh") }, player3)
//   t.deepEqual(room.selectShowQue.players, [])
//   t.deepEqual(player3.group_shou_pai.mingGang, pais("zh"))
//   t.deepEqual(room.front_operationOf(room.dapai_player, 3).action, Operate.gang)
//   t.deepEqual(room.dapai_player.innerGang_lose_data, [
//     { type: config.LoseGangShangGang, pai: to_number("zh") }
//   ])
//   t.deepEqual(player2.gang_lose_names, ["放杠上杠"])
//   t.deepEqual(player3.gang_win_codes, [config.HuisGangShangGang])
//   t.deepEqual(player3.gang_win_names, ["杠上杠"])
// })

// test("测试扛的消息发送,庄家开局双自杠，他人放杠", function(t) {
//   init(TablePaiManager.player1_3gang())
//   t.deepEqual(room.selectShowQue.players, [player1])
//   t.deepEqual(player1.socket.latest_msg, {
//     type: "server_can_select",
//     arr_selectShow: [false, false, true, false],
//     canHidePais: [],
//     canGangPais: pais("b1 b2")
//   })
//   t.deepEqual(player2.socket.latest_msg, {
//     type: "server_table_fa_pai_other",
//     user_id: player1.user_id
//   })
//   t.deepEqual(player3.socket.latest_msg, {
//     type: "server_table_fa_pai_other",
//     user_id: player1.user_id
//   })

//   //player1开始扛b1
//   room.client_confirm_gang({ selectedPai: to_number("b1") }, player1)
//   //扛之后还能扛
//   t.deepEqual(room.selectShowQue.players, [player1])
//   t.deepEqual(player1.socket.latest_msg, {
//     type: "server_can_select",
//     arr_selectShow: [false, false, true, false],
//     canHidePais: [],
//     canGangPais: pais("b2")
//   })
//   t.deepEqual(player2.socket.latest_msg, {
//     type: "server_table_fa_pai_other",
//     user_id: player1.user_id
//   })
//   t.deepEqual(player1.mo_pai, to_number("t5"))
//   //再扛b2
//   room.client_confirm_gang({ selectedPai: to_number("b2") }, player1)
//   //player1没有能扛的了
//   t.deepEqual(room.selectShowQue.players, [])
//   //todo: 应该能够看到他人扛牌，哪怕是暗扛
//   t.deepEqual(player2.socket.latest_msg, {
//     type: "server_table_fa_pai_other",
//     user_id: player1.user_id
//   })
//   t.deepEqual(player1.mo_pai, to_number("t4"))
//   t.deepEqual(player1.group_shou_pai.anGang, pais("b1 b2"))
//   //player1打牌
//   room.client_da_pai(player1, to_number("t4"))
//   t.deepEqual(player2.socket.latest_msg, {
//     type: "server_can_select",
//     arr_selectShow: [false, false, true, false],
//     canHidePais: [],
//     canGangPais: pais("t1")
//   })
//   //一扛服务器就会发牌并通知player1, player3
//   t.deepEqual(player1.socket.latest_msg, {
//     type: "server_table_fa_pai_other",
//     user_id: player2.user_id
//   })
//   t.deepEqual(player3.socket.latest_msg, {
//     type: "server_table_fa_pai_other",
//     user_id: player2.user_id
//   })
// })

test("测试庄扛时其它有亮的情况下消息的发送", function(t) {
  init(TablePaiManager.zhuangGang_Player2ZhiMo_player3Liang())
  //游戏一开始就会给庄家发牌，不管其它人有没有selectShow
  t.deepEqual(player1.mo_pai, to_number("b2"))
  t.deepEqual(room.cloneTablePais.slice(0, 2), pais("t1 t3"))

  t.deepEqual(room.cloneTablePais[0], 11)
  //扛家能扛，player2自摸，player3能亮
  t.deepEqual(player1.arr_selectShow, [false, false, true, false])
  t.deepEqual(player2.arr_selectShow, [false, true, false, false])
  t.deepEqual(player3.arr_selectShow, [false, true, false, false])
  t.deepEqual(room.selectShowQue.players, [player2, player3, player1])

  //player2过，应该给player3发消息，player2没消息
  room.client_confirm_guo(player2) 
  t.deepEqual(room.selectShowQue.players, [player3, player1])
  t.deepEqual(player3.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [false, true, false, false],
    canHidePais: pais("t8"),
    canGangPais: []
  })
  t.deepEqual(player2.socket.latest_msg, {
    type: "server_table_fa_pai_other",
    user_id: player1.user_id
  })

  //player3亮,并隐藏牌t8, player2无消息，todo: player3亮牌成功
  room.client_confirm_liang({ liangHidePais: pais("t8") }, player3) 
  t.deepEqual(room.selectShowQue.players, [player1])
  t.deepEqual(player1.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [false, false, true, false],
    canHidePais: [],
    canGangPais: pais("b1")
  })
  // todo: player2收到player3的亮消息
  // t.deepEqual(player2.socket.latest_msg, {
  //   type: "server_liang",
  //   liangPlayer: ...
  // })

  room.client_confirm_gang({ selectedPai: to_number("b1") }, player1)
  //摸牌了但是可以扛，所以继续从后面摸牌
  t.deepEqual(player1.mo_pai, to_number("t5"))
  room.client_da_pai(player1, to_number("t5")) //摸5条打5条
  //打牌后player2还是得选择一次亮，要么再过！
  t.deepEqual(room.selectShowQue.players, [player2])
  //player2收到亮牌消息
  t.deepEqual(player2.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [false, true, false, false],
    canHidePais: pais("fa"),
    canGangPais: []
  })
  //player3应该收到打牌的消息
  t.deepEqual(player3.socket.latest_msg, {
    pai_name: to_number('t5'),
    type: "server_dapai_other",
    username: player1.username,
    user_id: player1.user_id
  })
  room.client_confirm_guo(player2) //player2过
  t.deepEqual(player2.mo_pai, to_number("t1"))
  t.deepEqual(room.selectShowQue.players, [player2])
  t.deepEqual(player2.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [true, false, false, false],
    canHidePais: [],
    canGangPais: []
  })
})
