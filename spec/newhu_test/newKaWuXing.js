import test from "ava";
import { NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConverter";

/**直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}
test("卡五星", function (t) {
  let str = "b1 b1 b1 b2 b2 b2 b4 b6 t3 t3 t3 t5 t5";
  let na_pai = pais("b5")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), true);
});
test("三杠卡五星", function (t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 b4 b6 t3 t3 t3 t3 t5 t5";
  let na_pai = pais("b5")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), true);
});
test("清一色卡五星", function (t) {
  let str = "b1 b1 b1 b2 b3 b4 b6 b7 b7 b7 b7 b8 b9";
  let na_pai = pais("b5")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), true);
//   t.is(NMajiangAlgo.HuisYise(group_shoupai, na_pai), true);
});

test("可胡但不是卡五星", function (t) {
  let str = "t1 t2 t3 t4 t5 t6 b6 b7 b7 b7 b7 b8 b9";
  var na_pai = pais("b5")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), false);
  // t.is(NMajiangAlgo.HuisPihu(str, na_pai), true);
});
test("胡五条但不是卡", function (t) {
  let str = "fa fa fa t2 t2 t3 t4 t6 t7 t8 zh zh zh";
  var na_pai = pais("t5")
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), false);
  // t.is(NMajiangAlgo.HuisPihu(str, na_pai), true);
});
test("group卡五星", function (t) {
  let str = "b1 b1 b4 b6";
  var na_pai = pais("b5")
  let group_shoupai = {
    anGang: pais(['t1']),
    mingGang: pais(['t2']),
    peng: pais(['t3']),
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), true);
  // t.is(NMajiangAlgo.HuisPihu(str, na_pai), true);
});
test("flat可胡，但group非卡五星", function (t) {
  let str = "t3 t4 b4 b6";
  var na_pai = pais("b5")
  let group_shoupai = {
    anGang: pais(['t1']),
    mingGang: pais(['t9']),
    peng: pais(['t2']),
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), false);
});
test("单胡5将，group非卡五星", function (t) {
  let str = "b5";
  var na_pai = pais("b5")
  let group_shoupai = {
    anGang: pais(['t1']),
    mingGang: pais(['t9']),
    peng: pais(['t2', 'zh']),
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), false);
});
test("胡五条，group非卡五星", function (t) {
  let str = "zh zh b3 b4";
  var na_pai = pais("b5")
  let group_shoupai = {
    anGang: pais(['t1']),
    mingGang: pais(['t9']),
    peng: pais(['t2']),
    selfPeng: [],
    shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisKaWuXing(group_shoupai, na_pai), false);
});
