import test from "ava";
import { Player } from "../../server_build/server/player";
import { ScoreManager } from "../../server_build/server/ScoreManager";
import { getArr } from "../../server_build/server/MajiangAlgo";
import * as config from "../../server_build/server/config";

var player1, player2, player3;
config.base_score = 5; //5块钱
config.have_piao = true;
config.piao_score = 5; //定漂5块

test.beforeEach(t => {
  player1 = new Player({
    group_shou_pai: {
      anGang: ["b1"],
      mingGang: ["b2"],
      peng: ["t1"],
      selfPeng: [],
      shouPai: ["zh", "zh", "t7", "t8"]
    },
    socket: null,
    username: "jack1",
    user_id: 10001
  });
  player1.is_hu = true;
  // player1.is_zimo = true;
  player1.is_liang = true
  player1.hupai_zhang = "t9";
  player1.hupai_data = {
    hupai_dict: { "t9": [config.HuisPihu, config.HuisLiangDao] }
  };

  player2 = new Player({
    group_shou_pai: {
      anGang: ["b3"],
      mingGang: ["b4"],
      peng: ["di"],
      selfPeng: [],
      shouPai: ["zh", "zh", "t7", "t8", "fa"]
    },
    socket: null,
    username: "rose2",
    user_id: 10002
  });
  player2.is_fangpao = true

  player3 = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng: [],
      shouPai: getArr("t1 t2 t2 t3 t3 t4 t4 t5 t5 t5 t9 zh fa")
    },
    socket: null,
    username: "tom3",
    user_id: 10003
  });

});

//
test("player1屁胡亮倒，player2放炮", function(t) {
  ScoreManager.cal_oneju_score([player1, player2, player3]);
  console.log(
    `各自分数： ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  );
  t.deepEqual(player1.oneju_score, 20);
});
test("player1屁胡亮倒，player2亮倒放炮", function(t) {
  player2.is_liang =  true
  ScoreManager.cal_oneju_score([player1, player2, player3]);
  console.log(
    `各自分数： ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  );
  t.deepEqual(player1.oneju_score, 30);
});

test("player1屁胡亮倒自摸", function(t) {
  player1.is_zimo = true
  player2.is_fangpao = false
  ScoreManager.cal_oneju_score([player1, player2, player3]);
  console.log(
    `各自分数： ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  );
  t.deepEqual(player1.oneju_score, 40);
});

