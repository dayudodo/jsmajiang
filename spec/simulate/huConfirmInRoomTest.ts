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
import { Socket } from "dgram"

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
var init = function(paisData: Pai[] = TablePaiManager.player2_qidiu_ting()) {
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
  room.serverGameStart(paisData)
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
  room.client_confirm_hu(player1) //无效
  room.client_confirm_hu(player3) //无效
  player1.can_dapai = true //todo:改为正常的判断
  room.client_da_pai(player1, to_number("b5"))
  //player2可以胡b5, 七对！
  t.deepEqual(player2.hupai_data.all_hupai_zhang, _.sortBy(pais("b5")))
  //即能胡也可以亮
  t.deepEqual(player2.arr_selectShow, [true, true, false, false])
  t.deepEqual(player1.arr_selectShow, [])
  t.deepEqual(player3.arr_selectShow, [])
  room.client_confirm_hu(player2)
  t.deepEqual(room.selectShowQue.players, []) //不再有操作选项
  t.is(player2.is_hu, true)
  t.deepEqual(player2.hupai_typesCode(), [config.IsYise, config.HuisQidui])
  let players = room.players.map(person => room.player_result_filter(person))
  t.deepEqual((<SocketTest>player2.socket).latest_msg, {
    type: g_events.server_winner,
    players: players
  })
})

test("庄家打t6一炮双响屁胡", function(t) {
  init(TablePaiManager.zhuang_dapai_shuang())
  //发牌后player2, player3有selectShow
  t.deepEqual(room.selectShowQue.players, [player2, player3])
  room.client_confirm_guo(player2)
  room.client_confirm_guo(player3)
  t.deepEqual(room.selectShowQue.players, [])
  room.client_da_pai(player1, to_number("t6"))
  room.client_confirm_hu(player2)
  t.deepEqual(room.hupai_players, [player2, player3])
  t.is(player1.is_fangpao, true)
  t.is(player2.is_hu, true)
  t.is(player3.is_hu, true)
  t.deepEqual(player2.hupai_zhang, to_number("t6"))
  t.deepEqual(player3.hupai_zhang, to_number("t6"))
})
test("胡牌后的正确信息：一炮双响屁胡", function(t) {
  init(TablePaiManager.zhuang_dapai_shuang())
  room.client_confirm_guo(player2)
  room.client_confirm_guo(player3)
  t.deepEqual(room.selectShowQue.players, [])
  room.client_da_pai(player1, to_number("t6"))
  room.client_confirm_hu(player2)
  t.deepEqual(player1.gang_lose_names, [])
  t.deepEqual(player2.all_win_names, ["屁胡"])
  t.deepEqual(player3.all_win_names, ["屁胡"])
})

test("庄家摸牌就自摸fa", function(t) {
  init(TablePaiManager.zhuang_mopai_hu())
  //发牌后player2, player3有selectShow
  t.deepEqual(room.selectShowQue.players, [player1])
  t.deepEqual(player1.arr_selectShow, [true, false, false, false]) //摸牌之后直接出现胡选择，也可以过。
  room.client_confirm_hu(player1)
  t.deepEqual(room.hupai_players, [player1])
  // t.deepEqual(room.selectShowQue.players, [])
  t.is(player1.is_hu, true)
  t.is(player2.is_hu, false)
  t.is(player3.is_hu, false)
  t.is(player2.is_fangpao, false)
  t.is(player3.is_fangpao, false)
  t.deepEqual(player1.hupai_zhang, to_number("fa"))
})
test("自摸之后应该有自己的胡牌信息以及其它两家的出钱信息", function(t) {
  init(TablePaiManager.zhuang_mopai_hu())
  room.client_confirm_hu(player1)
  t.is(player1.is_zimo, true)
  t.deepEqual(player1.hupai_typesCode(), [config.HuisPihu])
  t.deepEqual(player1.all_win_names, ["屁胡"])
})

test("庄家打t6放player2屁胡炮, player2亮牌", function(t) {
  init(TablePaiManager.zhuang_dapai_fangpao())
  room.client_confirm_liang({}, player2)
  //player2选择后player1才可以打牌！
  room.client_da_pai(player1, to_number("t6"))
  room.client_confirm_hu(player2)
  t.deepEqual(room.hupai_players, [player2])
  // t.deepEqual(room.selectShowQue.players, [])
  t.is(player1.is_fangpao, true)
  t.is(player2.is_hu, true)
  t.is(player3.is_hu, false)
  t.deepEqual(player2.hupai_zhang, to_number("t6"))
})
test("胡牌后的正确信息：屁胡", function(t) {
  init(TablePaiManager.zhuang_dapai_fangpao())
  room.client_confirm_liang({}, player2)
  //player2选择后player1才可以打牌！
  room.client_da_pai(player1, to_number("t6"))
  room.client_confirm_hu(player2)
  t.deepEqual(player2.all_win_names, ["屁胡"])
})

test("留杠，摸牌后再去扛牌，杠上开花", function(t) {
  init(TablePaiManager.zhuang_GangShangHua())
  t.deepEqual(room.selectShowQue.players, [player1])
  t.deepEqual(player1.arr_selectShow, [false, false, true, false]) //会有扛的选择条
  //倒数第二个socket是可以选择的socket，这种似乎应该一次发送？
  t.deepEqual(_.nth(player1.socket.arr_msg, -2), {
    type: "server_can_select",
    select_opt: [false, false, true, false],
    canHidePais: [],
    canGangPais: [to_number("di")]
  })
  t.deepEqual(player1.socket.latest_msg, {
    type: "server_table_fa_pai",
    pai: to_number("t7")
  })
  //其它玩家应该收到player1的发牌消息，这是为了改变中间的指向箭头！
  t.deepEqual(player2.socket.latest_msg, {
    type: "server_table_fa_pai_other",
    user_id: player1.user_id
  })
  t.deepEqual(player3.socket.latest_msg, {
    type: "server_table_fa_pai_other",
    user_id: player1.user_id
  })
  t.deepEqual(player1.mo_pai, to_number('t7'))  //服务器发牌保存在player1.mo_pai中
  room.client_confirm_gang({ selectedPai: to_number("di")}, player1)
  t.deepEqual(player1.group_shou_pai.anGang, pais('di'))
  //选择扛之后会给个t5
  t.deepEqual(player1.mo_pai, to_number('t5'))
  //这时候就应该会有胡的选择项了
  t.deepEqual(player1.arr_selectShow, [true, false, false, false])
  // room.client_confirm_hu(player1)
  // t.is(player1.is_hu, true)
  // t.deepEqual(player1.socket.latest_msg, {
  //   type: g_events.server_winner,
  //   players: [player1]
  // })
})
