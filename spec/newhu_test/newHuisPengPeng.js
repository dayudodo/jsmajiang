import test from "ava";
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConverter";

/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}

test("不是碰碰胡", function(t) {
  let str = "b1 b1 b2 b2 b2 t3 t4 t5 fa fa fa di di";
  let na_pai = pais("b1")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), false);
});

test("碰碰胡将在后", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa di ";
  let na_pai = pais("di")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰胡将在前", function(t) {
  let str = "di di b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa ";
  let na_pai = pais("fa")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带1杠", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa t5 ";
  let na_pai = pais("t5")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带2杠", function(t) {
  let str = "b2 b2 b2 b2 b1 b1 b1 b1 t3 t3 t3 fa fa fa t5 ";
  let na_pai = pais("t5")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 t3 t3 t3 t3 fa fa fa t5 ";
  let na_pai = pais("t5")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠少将", function(t) {
  let str = "b2 fa fa fa fa t1 t1 t1 t1 zh zh zh zh t1 t1 t1";
  let na_pai = pais("b2")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠少将", function(t) {
  let str = "b2 zh zh zh zh t1 t1 t1";
  let na_pai = pais("b2")
  let group_shoupai = {
    anGang: pais("fa"),
    mingGang: pais("t1"),
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠少将", function(t) {
  let str = "b2 t1 t1 t1";
  let na_pai = pais("b2")
  let group_shoupai = {
    anGang: pais(["fa"]),
    mingGang: pais(["t1", "zh"]),
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带2杠少将, selfPeng", function(t) {
  let str = "b2 t1 t1 t1";
  let na_pai = pais("b2")
  let group_shoupai = {
    anGang: pais(["fa"]),
    mingGang: pais(["t1"]),
    peng: [],
    selfPeng: pais(['zh']),
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带2杠胡单将, selfPeng", function(t) {
  let str = "b2";
  let na_pai = pais("b2")
  let group_shoupai = {
    anGang: pais(["fa"]),
    mingGang: pais(["t1"]),
    peng: pais(['t1']),
    selfPeng: pais(['zh']),
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带2杠少将", function(t) {
  let str = "b2 t1 t1 t1";
  let na_pai = pais("b2")
  let group_shoupai = {
    anGang: [],
    mingGang: pais(["t1", "zh"]),
    peng: pais(["fa"]),
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), true);
});
test("碰碰糊带2杠少将 false", function(t) {
  let str = "b2 t1 t1 t1";
  let na_pai = pais("b1")
  let group_shoupai = {
    anGang: [],
    mingGang: pais(["t1", "zh"]),
    peng: pais(["fa"]),
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), false);
});
test("碰碰糊带2杠少将 false", function(t) {
  let str = "b2 t1 t1 t1";
  let na_pai = pais("fa")
  let group_shoupai = {
    anGang: [],
    mingGang: pais(["t1", "zh"]),
    peng: pais(["fa"]),
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisPengPeng(group_shoupai, na_pai), false);
});
