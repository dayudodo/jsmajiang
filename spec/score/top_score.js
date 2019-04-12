//测试封顶，最高不超过底分*8，外加上漂
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
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng: [],
      shouPai: pais("b1 b1 b1 b2 b2 b2 b4 b6 b3 b3 b3 b5 b5")
    },
    socket: null,
    username: "jack1",
    user_id: 10001
  })
  player1.is_hu = true
  player1.hupai_zhang = 5
  player1.hupai_data = {
    hupai_dict: { 5: [config.HuisPihu, config.HuisKaWuXing] }
  }

  player2 = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng: [],
      shouPai: pais("t6 t6 t5 t5 t3 t4 t4 t7 t7 t7 t9 zh fa")
    },
    socket: null,
    username: "rose2",
    user_id: 10002
  })
  //放炮了
  player2.is_fangpao = true

  player3 = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng: [],
      shouPai: pais("t1 t2 t2 t3 t3 t4 t4 di di di t9 zh fa")
    },
    socket: null,
    username: "tom3",
    user_id: 10003
  })
}

test("清一色卡五星亮倒自摸", function(t) {
  init()
  player1.is_zimo = true
  // player1.is_liang = true;
  player2.is_fangpao = false
  player1.hupai_data = {
    hupai_dict: {
      5: [config.HuisKaWuXing, config.IsYise, config.HuisLiangDao]
    }
  }
  ScoreManager.cal_oneju_score([player1, player2, player3])
  console.log(
    `各自分数： 
    ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  )
  t.deepEqual(player1.oneju_score, 100)
  console.log("~~~~~~~~~~~~~~end~~~~~~~~~~~~~~~~")
})
test("满放炮", function(t) {
  init()
  player1.hupai_data = {
    hupai_dict: {
      5: [config.HuisKaWuXing, config.IsYise, config.HuisLiangDao]
    }
  }
  ScoreManager.cal_oneju_score([player1, player2, player3])
  console.log(
    `各自分数： 
    ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  )
  t.deepEqual(player1.oneju_score, 50)
  console.log("~~~~~~~~~~~~~~end~~~~~~~~~~~~~~~~")
})
