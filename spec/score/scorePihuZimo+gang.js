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
  player1.is_zimo = true;
  player1.hupai_zhang = "t9";
  player1.hupai_data = {
    hupai_dict: { t9: [config.HuisPihu] }
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

//
test("5定5 屁胡自摸进30,外带1杠5, 2暗杠+擦炮，可怜的3", function(t) {
  ScoreManager.cal_oneju_score([player1, player2, player3]);
  console.log(
    `各自分数： ${player1.username}:${player1.oneju_score}  
    ${player2.username}:${player2.oneju_score}  
    ${player3.username}:${player3.oneju_score}`
  );
  t.deepEqual(player1.oneju_score, 20);
});
// test("5， 没漂，屁胡进10", function(t) {
//   config.have_piao = false
//   player1.oneju_score = 0
//   player2.oneju_score = 0
//   player3.oneju_score = 0
//   ScoreManager.cal_oneju_score([player1, player2, player3]);
//   console.log(
//     `各自分数： player1:${player1.oneju_score}  player2:${player2.oneju_score}  player3:${player3.oneju_score}`
//   );
//   t.deepEqual(player1.oneju_score, 10);
// });
