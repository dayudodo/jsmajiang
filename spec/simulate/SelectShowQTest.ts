import test from "ava"
import { Room } from "../../server/room"
import { Player } from "../../server/Player"
import { PaiConvertor } from "../../server/PaiConvertor"
import { SelectShowQueue } from "../../server/SelectShowQueue"
import { SocketTest } from "../SocketTest"
import * as config from "../../server/config"

/**直接将字符串转换成数类麻将数组 */
function pais(strs): number[] {
  return PaiConvertor.pais(strs)
}
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}
var player1: Player, player2: Player, player3: Player

var init = function () {
  player1 = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: pais(["b1"]),
      selfPeng: pais(["b2"]),
      shouPai: pais("b1 b2 t7 t7 t7 t7 fa")
    },
    socket: new SocketTest("jack1"),
    username: "jack1",
    user_id: 10001
  })
  player2 = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: pais(["t1"]),
      selfPeng: pais(["t2"]),
      shouPai: pais("t1 t2 t3 t4 t5 t6 fa")
    },
    socket: new SocketTest("rose2"),
    username: "rose2",
    user_id: 10002
  })
  player3 = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: pais(["t6"]),
      selfPeng: pais(["t8"]),
      shouPai: pais("t1 t2 t3 t7 t7 t9 fa")
    },
    socket: new SocketTest("tom3"),
    username: "tom3",
    user_id: 10003
  })
  //[isShowHu, isShowLiang, isShowGang, isShowPeng]
  player1.seat_index = 0
  player1.arr_selectShow = [false, false, true, false]

  player2.seat_index = 1
  player2.arr_selectShow = [false, true, false, false]

  player3.seat_index = 2
  player3.arr_selectShow = [true, false, false, false]
}

test("发现胡", function (t) {
  init()
  var selectQue = new SelectShowQueue([player1, player2, player3])
  t.deepEqual(selectQue.findHuPlayer(), player3)
})
test("发现亮", function (t) {
  init()
  var selectQue = new SelectShowQueue([player1, player2, player3])
  t.deepEqual(selectQue.findLiangPlayer(), player2)
})
test("发现杠", function (t) {
  init()
  var selectQue = new SelectShowQueue([player1, player2, player3])
  t.deepEqual(selectQue.findGangPlayer(), player1)
})
test("优先级排序正确", function (t) {
  init()
  var selectQue = new SelectShowQueue([player1, player2, player3])
  t.deepEqual(selectQue.players, [player3, player2, player1])
})
test("双响优先级排序正确", function (t) {
  init()
  player1.seat_index = 0
  player1.arr_selectShow = [false, false, true, false] //可扛

  player2.seat_index = 1
  player2.arr_selectShow = [true, false, false, false] //可胡

  player3.seat_index = 2
  player3.arr_selectShow = [true, false, false, false] //可胡
  var selectQue = new SelectShowQueue([player1, player2, player3])
  t.deepEqual(selectQue.players, [player2, player3, player1])
})

test("任一玩家有selectShow", function (t) {
  init()
  player1.seat_index = 0
  player1.arr_selectShow = [false, false, true, false] //可扛

  player2.seat_index = 1
  player2.arr_selectShow = [true, false, false, false] //可胡

  player3.seat_index = 2
  player3.arr_selectShow = [true, false, false, false] //可胡
  var selectQue = new SelectShowQueue([player1, player2, player3])
  t.is(selectQue.hasSelectShow(), true)
})
test("player2选择操作有效，player1选择操作无效", function (t) {
  init()
  player1.seat_index = 0
  player1.arr_selectShow = [false, false, true, false] //可扛

  player2.seat_index = 1
  player2.arr_selectShow = [true, false, false, false] //可胡

  player3.seat_index = 2
  player3.arr_selectShow = [true, false, false, false] //可胡
  var selectQue = new SelectShowQueue([player1, player2, player3])
  t.is(selectQue.canSelect(player2), true)
  t.is(selectQue.canSelect(player1), false)
})

test("选择操作完成，只剩下两个玩家可操作", function (t) {
  init()
  player1.seat_index = 0
  player1.arr_selectShow = [false, false, true, false] //可扛

  player2.seat_index = 1
  player2.arr_selectShow = [true, false, false, false] //可胡

  player3.seat_index = 2
  player3.arr_selectShow = [true, false, false, false] //可胡
  var selectQue = new SelectShowQueue([player1, player2, player3])
  selectQue.selectCompleteBy(player2)
  t.deepEqual(player2.arr_selectShow, [])
  t.deepEqual(selectQue.players, [player3, player1])
  //player2选择完成后player3可以选择了
  selectQue.selectCompleteBy(player3)
  t.deepEqual(player3.arr_selectShow, [])
  t.deepEqual(selectQue.players, [ player1])

})

test("任一玩家无selectShow", function (t) {
  init()
  player1.arr_selectShow = []
  player2.arr_selectShow = []
  player3.arr_selectShow = []
  var selectQue = new SelectShowQueue([player1, player2, player3])

  t.is(selectQue.hasSelectShow(), false)
  t.is(selectQue.isAllPlayersNormal(), true)
})
test("players为空也能正常工作", function (t) {
  init()
  var selectQue = new SelectShowQueue([])

  t.is(selectQue.hasSelectShow(), false)
  t.is(selectQue.isAllPlayersNormal(), true)
})
test("增加player并重新排序", function (t) {
  init()
  var selectQue = new SelectShowQueue()
  player1.arr_selectShow = [false, false, true, false]
  selectQue.addAndAdjustPriority(player1)
  t.is(selectQue.hasSelectShow(), true)
  t.is(selectQue.isAllPlayersNormal(), false)
  t.deepEqual(selectQue.players, [player1])

  player2.arr_selectShow = [false, true, false, false]
  selectQue.addAndAdjustPriority(player2)
  t.deepEqual(selectQue.players, [player2, player1])
  t.is(selectQue.canSelect(player2), true)

  player3.arr_selectShow = [true, false, false, false]
  selectQue.addAndAdjustPriority(player3)
  t.deepEqual(selectQue.players, [player3, player2, player1])
  t.is(selectQue.canSelect(player2), false)
  t.is(selectQue.canSelect(player3), true)

})
