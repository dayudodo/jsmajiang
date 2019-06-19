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

/**直接将字符串转换成数类麻将数组 */
function pais(strs): number[] {
  return PaiConvertor.pais(strs)
}

test("zhuangGang_Player2ZhiMo_player3Liang", function(t) {
  let tablePais = TablePaiManager.zhuangGang_Player2ZhiMo_player3Liang()
  t.deepEqual(
    tablePais.slice(0, 13),
    pais("b1 b1 b1 b1 b5 b6 t2 t3 t5 t6 di di di")
  )
  t.deepEqual(
    tablePais.slice(13, 13*2),
    pais("b2 b3 b4 b5 b6 b7 t2 t3 t4 t4 fa fa fa")
  )
  t.deepEqual(
    tablePais.slice(13*2, 13*3),
    pais("b2 b3 b4 b7 b8 b9 t1 t2 t3 t7 t8 t8 t8")
  )
  t.deepEqual(tablePais.slice(13*3,13*3+1), pais('t1'))
})
