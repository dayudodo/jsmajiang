import test from "ava"
import { Player } from "../../server_build/server/player"
import { ScoreManager } from "../../server_build/server/ScoreManager"
import { PaiConvertor } from "../../server_build/server/PaiConvertor"
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


  player2 = new Player({
    group_shou_pai: {
      anGang: pais(["b3"]),
      mingGang: pais(["b4"]),
      peng: pais(["di"]),
      selfPeng: [],
      shouPai: pais(["zh", "zh", "t7", "t8", "fa"])
    },
    socket: null,
    username: "rose2",
    user_id: 10002
  })
  player2.is_fangpao = true

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
}

//
test("player1屁胡亮倒，player2放炮", function(t) {
  init()
  player1.is_hu = true
  player1.is_liang = true
  player1.hupai_zhang = to_number("t9")
  player1.hupai_data = {
    hupai_dict: { 19: [config.HuisPihu, config.HuisLiangDao] }
  }

  player2.is_fangpao = true
  ScoreManager.cal_oneju_score([player1, player2, player3])
  console.log(
    `各自分数： ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}
    ~~~~~~end test`
  )
  t.deepEqual(player1.oneju_score, 20)
})
test("player1屁胡亮倒，player2亮倒放炮", function(t) {
  init()
  player1.is_hu = true
  player1.is_liang = true
  player1.hupai_zhang = to_number("t9")
  player1.hupai_data = {
    hupai_dict: { 19: [config.HuisPihu, config.HuisLiangDao] }
  }

  player2.is_fangpao = true
  player2.is_liang = true
  ScoreManager.cal_oneju_score([player1, player2, player3])
  console.log(
    `各自分数： ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}
    ~~~~~~end test`
  )
  t.deepEqual(player1.oneju_score, 30)
})

test("player1屁胡亮倒自摸", function(t) {
  init()
  player1.is_hu = true
  player1.is_zimo = true
  player1.is_liang = true
  player1.hupai_zhang = to_number("t9")
  player1.hupai_data = {
    hupai_dict: { 19: [config.HuisPihu, config.HuisLiangDao] }
  }

  ScoreManager.cal_oneju_score([player1, player2, player3])
  console.log(
    `各自分数： ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}
    ~~~~~~end test`
  )
  t.deepEqual(player1.oneju_score, 40)
})
