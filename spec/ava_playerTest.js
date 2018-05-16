import test from "ava";
import { Player } from "../server_build/player";

var player;

test.beforeEach(t => {
  player = new Player({
    group_shou_pai: {
      anGang: ["b1"],
      mingGang: ["b2"],
      peng: ["t1"],
      shouPai: ["zh", "zh", "t7", "t8", "t9"]
    }
  });
});

test("group中shouPai不空之边界检查", function(t) {
  player = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      shouPai: "b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t1 t7 t8 t9 zh zh".split(" ")
    }
  });
  let flat = player.flat_shou_pai;
  t.deepEqual(
    flat,
    "b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t1 t7 t8 t9 zh zh".split(" ")
  );
});

test("正确得到flat_shoupai", function(t) {
  let flat = player.flat_shou_pai;
  t.deepEqual(
    flat,
    "b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t1 t7 t8 t9 zh zh".split(" ")
  );
});
test("打牌并碰之后正确得到flat_shoupai", function(t) {
  player.da_pai("t7");
  player.da_pai("t8");
  player.da_pai("t9");
  player.received_pai = "b3";
  player.received_pai = "b3";
  player.confirm_peng("b3");
  let flat = player.flat_shou_pai;
  t.deepEqual(
    flat,
    "b1 b1 b1 b1 b2 b2 b2 b2 b3 b3 b3 t1 t1 t1 zh zh".split(" ")
  );
  t.deepEqual(player.arr_dapai, "t7 t8 t9".split(" "));
});

test("明杠之后牌正常", function(t) {
  player.da_pai("t7");
  player.da_pai("t8");
  player.da_pai("t9");
  player.received_pai = "b3";
  player.received_pai = "b3";
  player.received_pai = "b3";
  player.confirm_mingGang("b3");
  let flat = player.flat_shou_pai;
  t.deepEqual(player.group_shou_pai.mingGang, "b2 b3".split(" "));
  t.deepEqual(
    flat,
    "b1 b1 b1 b1 b2 b2 b2 b2 b3 b3 b3 b3 t1 t1 t1 zh zh".split(" ")
  );
});
test("暗杠之后牌正常", function(t) {
  player.da_pai("t7");
  player.da_pai("t8");
  player.da_pai("t9");
  player.received_pai = "b3";
  player.received_pai = "b3";
  player.received_pai = "b3";
  player.confirm_anGang("b3");
  let flat = player.flat_shou_pai;
  t.deepEqual(player.group_shou_pai.anGang, "b1 b3".split(" "));
  t.deepEqual(
    flat,
    "b1 b1 b1 b1 b2 b2 b2 b2 b3 b3 b3 b3 t1 t1 t1 zh zh".split(" ")
  );
});

test("打牌之后正常算出胡牌", function(t) {
  player.da_pai("t9");
  t.deepEqual(player.hupai_data.all_hupai_zhang, ["t6", "t9"]);
});
test("打牌之后能否胡", function(t) {
  player.da_pai("t9");
  let canhu = player.canHu("t6")
  t.is(canhu, true)
  canhu = player.canHu('t8')
  t.is(canhu, false)
});
test("打牌之后能否大胡", function(t) {
  player = new Player({
    group_shou_pai: {
      anGang: [],
      mingGang: [],
      peng: [],
      shouPai: "b1 b1 b1 b1 b2 b2 b2 b2 t1 t1 t7 t7 t8 t8".split(" ")
    }
  });
  player.da_pai("t8");
  t.is(player.isDaHu("t8"), true)
  t.is(player.isDaHu("zh"), false)

});
test("打牌之后能否听", function(t) {
  player.da_pai("t9");
  let canting = player.canTing()
  t.is(canting, true)
  player.da_pai('t8')
  canting = player.canTing()
  t.is(canting, false)
});

