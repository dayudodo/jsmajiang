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
  // room.client_da_pai(player1, to_number("t6"))
  player1.client_da_pai("t6")
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
  t.is(player2.is_liang, true)
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
  t.deepEqual(player2.all_win_names, ["屁胡", '亮倒'])
})

test("留杠，摸牌后再去扛牌，杠上开花", function(t) {
  init(TablePaiManager.zhuang_GangShangHua())
  t.deepEqual(room.selectShowQue.players, [player1])
  t.deepEqual(player1.arr_selectShow, [false, false, true, false]) //会有扛的选择条
  //发牌完成后才应该有选择的消息
  t.deepEqual(_.nth(player1.socket.arr_msg, -2), {
    type: "server_table_fa_pai",
    pai: to_number("t7")
  })
  t.deepEqual(player1.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [false, false, true, false],
    canHidePais: [],
    canGangPais: [to_number("di")]
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
  t.deepEqual(player1.mo_pai, to_number("t7")) //服务器发牌保存在player1.mo_pai中
  room.client_confirm_gang({ selectedPai: to_number("di") }, player1)
  t.deepEqual(player1.group_shou_pai.anGang, pais("di"))
  //选择扛之后会给个t5
  t.deepEqual(
    player1.group_shou_pai.shouPai,
    pais("b1 b2 b3 b4 b5 b6 t3 t3 t6 t7")
  )
  t.deepEqual(player1.mo_pai, to_number("t5"))
  t.is(player1.canZhiMo(), true)
  //这时候就应该会有胡的选择项了
  t.deepEqual(player1.arr_selectShow, [true, false, false, false])
  t.deepEqual(player1.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: player1.arr_selectShow,
    canHidePais: [],
    canGangPais: []
  })
  room.client_confirm_hu(player1)
  t.is(player1.is_hu, true)
})

test("双杠上开花", function(t) {
  init(TablePaiManager.zhuang_ShuangGangShangHua())
  t.deepEqual(room.selectShowQue.players, [player1])
  t.deepEqual(player1.arr_selectShow, [false, false, true, false]) //会有扛的选择条

  t.deepEqual(player1.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [false, false, true, false],
    canHidePais: [],
    canGangPais: pais("b7 di")
  })

  //发牌完成后才应该有选择的消息
  t.deepEqual(_.nth(player1.socket.arr_msg, -2), {
    type: "server_table_fa_pai",
    pai: to_number("b7")
  })
  t.deepEqual(player1.mo_pai, to_number("b7")) //服务器发牌保存在player1.mo_pai中
  room.client_confirm_gang({ selectedPai: to_number("di") }, player1)
  t.deepEqual(player1.group_shou_pai.anGang, pais("di"))

  //选择扛之后会给个t7
  t.deepEqual(
    player1.group_shou_pai.shouPai,
    pais("b1 b2 b3 b7 b7 b7 b7 t3 t3 t6")
  )
  t.deepEqual(_.nth(player1.socket.arr_msg, -2), {
    type: "server_table_fa_pai",
    pai: to_number("t7")
  })
  t.deepEqual(player1.mo_pai, to_number("t7"))

  //最后的消息应该是又可以扛
  t.deepEqual(player1.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [false, false, true, false],
    canHidePais: [],
    canGangPais: pais("b7")
  })
  room.client_confirm_gang({ selectedPai: to_number("b7") }, player1)
  t.deepEqual(player1.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [true, false, false, false],
    canHidePais: [],
    canGangPais: []
  })

  room.client_confirm_hu(player1)
  t.is(player1.is_hu, true)
  t.is(player1.is_zimo, true)
})

test("庄家放t2杠,扛上扛di,胡扛上花t5 ", function(t) {
  init(TablePaiManager.zhuang_FangGangHuGang())
  //发牌t3,打t2, player扛后打di, player扛di之后摸t5, 胡牌！
  t.deepEqual(room.selectShowQue.players, [])
  t.deepEqual(player1.arr_selectShow, []) //会有扛的选择条
  t.deepEqual(player1.mo_pai, to_number("t3"))
  room.client_da_pai(player1, to_number("t2"))
  t.deepEqual(room.selectShowQue.players, [player1, player2])
  //player1已经可以亮牌了
  t.deepEqual(player1.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [false, true, false, false],
    canHidePais: pais("di"),
    canGangPais: []
  })
  //player2可以选择扛牌，但是socket并不会发送！
  t.deepEqual(player2.socket.latest_msg, {
    pai_name: to_number('t2'),
    type: "server_dapai_other",
    user_id: player1.user_id,
    username: player1.username
  })
  // 直接扛是没效果的，因为player1的亮牌优先
  room.client_confirm_gang({ selectedPai: to_number("t2") }, player2)
  //player1选择亮牌，并隐藏牌di
  room.client_confirm_liang({ liangHidePais: pais("di") }, player1)
  t.deepEqual(player1.group_shou_pai.selfPeng, pais("di"))
  t.is(player1.is_liang, true)
  //这时候player2才会有选择项
  t.deepEqual(player2.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [false, false, true, false],
    canHidePais: [],
    canGangPais: pais("t2")
  })
  //最后一张牌应该是t5
  t.deepEqual(room.cloneTablePais[room.cloneTablePais.length -1], to_number('t5'))
  //player2扛t2
  room.client_confirm_gang({ selectedPai: to_number("t2") }, player2)
  //得到最后摸到的牌t5
  t.deepEqual(player2.mo_pai, to_number('t5'))
  t.is(player2.can_dapai, true)
  room.client_da_pai(player2, to_number('di'))

  t.deepEqual(room.selectShowQue.players, [player1])
  t.deepEqual(player1.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [false, false, true, false],
    canHidePais: [],
    canGangPais: pais("di")
  })
  //此时庄家可扛di
  room.client_confirm_gang({ selectedPai: to_number("di") }, player1)
  //player1可以选择胡牌了，杠上花！
  t.deepEqual(player1.mo_pai, to_number('t7'))
  t.deepEqual(player1.socket.latest_msg, {
    type: "server_can_select",
    arr_selectShow: [true, false, false, false],
    canHidePais: [],
    canGangPais: []
  })
  room.client_confirm_hu(player1)
  t.is(player1.is_hu, true)
})
