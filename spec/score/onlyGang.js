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

  //给player1放了个普通杠
  player1.saveGang(player2, "b2");

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
  //player2有个暗杠
  player2.saveAnGang([player1, player3], "b3");
  //给player2还有个擦炮
  player2.saveCaPao([player1, player3], "b4");
});

//杠钱是固定的，不算漂
test("只有杠钱，没人赢", function(t) {
  ScoreManager.cal_oneju_score([player1, player2, player3]);
  console.log(
    `各自分数： 
    ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  );
  t.deepEqual(player1.oneju_score, -10);
});
