import test from "ava";
import { NMajiangAlgo as NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import { PaiConvertor } from "../../server_build/server/PaiConverter"
// var Majiang = require("../server/Majiang");
// var mj = new Majiang()
/**f直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}

// 特殊胡
test("七对", function (t) {
  let str = "b1 b1 b2 b2 b3 b3 fa fa t1 t1 t4 t4 t9";
  //   let na_pai = "t9";
  let na_pai = pais("t9");
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [], shouPai: pais(str)
  };
  t.is(NMajiangAlgo.HuisQiDui(group_shoupai, na_pai), true);
});

test("清一色并龙七对", function (t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b4 b5 b5 b7 b7 b7";
  //   let na_pai = "b7";
  let na_pai = pais("b7");
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [], shouPai: pais(str)
  };
  // t.is(NMajiangAlgo.HuisYise(group_shoupai, na_pai), true);
  t.is(NMajiangAlgo.isYise(group_shoupai.shouPai.concat(na_pai)), true);
  t.is(NMajiangAlgo.HuisNongQiDui(group_shoupai, na_pai), true);
});
// test("龙七对true", function (t) {
//   let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9";
//   //   let na_pai = "t9";
//   let na_pai = pais("t9");
//   let group_shoupai = {
//     anGang: [],
//     mingGang: [],
//     peng: [],
//     selfPeng: [], shouPai: pais(str)
//   };
//   t.is(NMajiangAlgo.HuisNongQiDui(group_shoupai, na_pai), true);
// });


// test("非七对", function (t) {
//   let str = "b1 b1 b2 b2 fa fa fa t1 t1 t4 t4 t9 t8";
//   //   let na_pai = "fa";
//   let na_pai = pais("fa");
//   let group_shoupai = {
//     anGang: [],
//     mingGang: [],
//     peng: [],
//     selfPeng: [], shouPai: pais(str)
//   };
//   t.is(NMajiangAlgo.HuisQiDui(group_shoupai, na_pai), false);
// });
