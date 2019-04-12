//测试一炮双响
import test from "ava"
import { Player } from "../../server_build/server/player"
import { ScoreManager } from "../../server_build/server/ScoreManager"
import { PaiConvertor } from "../../server_build/server/PaiConverter"
import * as config from "../../server_build/server/config"
/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}
function to_number(str) {
  return PaiConvertor.ToNumber(str)
}

var player1, player2, player3
config.base_score = 5 //5块钱
config.have_piao = true
config.piao_score = 5 //定漂5块

function init() {
  player1 = new Player({
    group_shou_pai: {
      anGang: pais(["b1"]),
      mingGang: pais(["b2"]),
      peng: pais(["t1"]),
      selfPeng: [],
      shouPai: pais(["zh", "zh", "t7", "t8"])
    },
    socket: null,
    username: "jack1",
    user_id: 10001
  })
  player1.is_hu = true
  player1.is_liang = true
  player1.hupai_zhang = to_number("t9")
  player1.hupai_data = {
    hupai_dict: { 19: [config.HuisPihu] }
  }

  player2 = new Player({
    group_shou_pai: {
      anGang: pais(["b3"]),
      mingGang: pais(["b4"]),
      peng: pais(["di"]),
      selfPeng: [],
      shouPai: pais(["zh", "zh", "t7", "t8"]),
    },
    socket: null,
    username: "rose2",
    user_id: 10002
  })
  player2.is_hu = true
  player2.is_liang = true
  player2.hupai_zhang = to_number("t9")
  player2.hupai_data = {
    hupai_dict: { 19: [config.HuisPihu] }
  }

  player3 = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng: [],
      shouPai: pais("t1 t2 t2 t3 t3 t4 t4 t5 t5 t5 t9 zh fa")
    },
    socket: null,
    username: "tom3",
    user_id: 10003
  })
  player3.is_fangpao = true
}

//
test("一炮双响", function(t) {
  init()
  ScoreManager.cal_oneju_score([player1, player2, player3])
  console.log(
    `各自分数： 
    ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  )
  t.deepEqual(player1.oneju_score, 20)
})
