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
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng: [],
      shouPai: getArr("b4 b5 b6 b7 b8 b9 t6 t7 t7 t7 t8 t8 t9")
    },
    socket: null,
    username: "jack1",
    user_id: 10001
  });
  player1.is_hu = true;
  player1.hupai_zhang = "t7";
  player1.hupai_data = {
    hupai_dict: { "t7": [config.HuisPihu, config.HuisMingSiGui] }
  };

  player2 = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng: [],
      shouPai: getArr("t6 t6 t5 t5 t3 t4 t4 t9 t9 t9 t9 zh fa")
    },
    socket: null,
    username: "rose2",
    user_id: 10002
  });
  //放炮了
  player2.is_fangpao = true;

  player3 = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng: [],
      shouPai: getArr("t1 t2 t2 t3 t3 t4 t4 di di di t8 zh fa")
    },
    socket: null,
    username: "tom3",
    user_id: 10003
  });
});

//
test("明四归放炮", function(t) {
  ScoreManager.cal_oneju_score([player1, player2, player3]);
  console.log(
    `各自分数： 
    ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  );
  console.log("~~~~~~~~~~~~~~end~~~~~~~~~~~~~~~~");
  t.deepEqual(player1.oneju_score, 20);
  t.deepEqual(player2.oneju_score, -20);
});
test("明四归自摸", function(t) {
  player1.is_zimo = true;
  player2.is_fangpao = false;
  ScoreManager.cal_oneju_score([player1, player2, player3]);
  console.log(
    `各自分数： 
    ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  );
  console.log("~~~~~~~~~~~~~~end~~~~~~~~~~~~~~~~");
  t.deepEqual(player1.oneju_score, 40);
  t.deepEqual(player2.oneju_score, -20);
  t.deepEqual(player3.oneju_score, -20);
});
test("暗四归放炮", function(t) {
  //todo: 暗四归的牌
  player1.hupai_data = {
    hupai_dict: { "t7": [config.HuisPihu, config.HuisAnSiGui] }
  };
  ScoreManager.cal_oneju_score([player1, player2, player3]);
  console.log(
    `各自分数： 
    ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  );
  console.log("~~~~~~~~~~~~~~end~~~~~~~~~~~~~~~~")
  t.deepEqual(player1.oneju_score, 30);
});
test("暗四归自摸", function(t) {
  player1.is_zimo = true;
  player2.is_fangpao = false;
  //todo: 暗四归的牌
  player1.hupai_data = {
    hupai_dict: { "t7": [config.HuisPihu, config.HuisAnSiGui] }
  };
  ScoreManager.cal_oneju_score([player1, player2, player3]);
  console.log(
    `各自分数： 
    ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  );
  console.log("~~~~~~~~~~~~~~end~~~~~~~~~~~~~~~~")
  t.deepEqual(player1.oneju_score, 60);
});
