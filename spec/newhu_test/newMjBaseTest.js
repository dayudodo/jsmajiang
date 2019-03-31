import test from "ava";
import { NMajiangAlgo as NMajiangAlgo } from "../../server_build/server/NMajiangAlgo";
import {PaiConvertor} from "../../server_build/server/PaiConverter"
// var Majiang = require("../server/Majiang");
// var mj = new Majiang()
/**f直接将字符串转换成数类麻将数组 */
function pais(strs) {
  return PaiConvertor.pais(strs)
}

// test(`is ABC AAA`, function(t) {
//   let str = "b2 b3 b4 b5 b5 b5 ";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.countJiJuhua(test_arr)
//   t.is(result, 2);
// });
// test(`is ABC 4A`, function(t) {
//   let str = "b2 b3 b4 b5 b5 b5 b5";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, true);
// });
// test(`is ABC 3A少一个false`, function(t) {
//   let str = "b2 b3 b4 b5 b5 ";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isJiJuhua(test_arr)
//   t.is(result, false);
// });


// test(`is and del 4A`, function(t) {
//   let str = "b1 b1 b1 b1 b2";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isAndDel4A(test_arr)
//   t.is(!!result, true);
//   t.deepEqual(result.remainArr, [1])
// });
// test(`is and del 4A 数量不够`, function(t) {
//   let str = "b1 b1 b1";
//   let test_arr = pais(str)
//   t.is(NMajiangAlgo.isAndDel4A(test_arr), false);
// });
// test(`is and del 4A 非4A`, function(t) {
//   let str = "b1 b1 b2 b3";
//   t.is(NMajiangAlgo.isAndDel4A(pais(str)), false);
// });
// test(`is and del AAA `, function(t) {
//   let str = "b1 b1 b1 b1 b2 b3";
//   let test_arr = pais(str)
//   const result = NMajiangAlgo.isAndDelAAA(test_arr);
//   t.is(!!result, true);
//   t.deepEqual(result.remainArr, [0,1,2])
// });
// test(`is and del AAA 开头3不连续`, function(t) {
//   let str = "b1 b2 b2 b2 b2 b3";
//   t.is(NMajiangAlgo.isAndDelAAA(pais(str)), false);
// });
// test(`is and del ABC`, function(t) {
//   let str = "b1 b2 b2 b2 b2 b3";
//   let test_arr = pais(str)
//   let result = NMajiangAlgo.isAndDelABC(test_arr)
//   t.is(!!result, true);
//   t.deepEqual(result.remainArr, [1,1,1])
// });
// test(`is and del ABC false`, function(t) {
//   let str = "b1 b2 b2 b2 b2";
//   t.is(NMajiangAlgo.isAndDelABC(pais(str)), false);
// });
// // test(`is and del ABC, AAA`, function(t) {
// //   let str = "b1 b1 b1 b1 b2 b3";
// //   t.is(NMajiangAlgo.isAndDelAAA(pais(str)), true);
// //   t.is(NMajiangAlgo.isAndDelABC(pais(str)), true);
// // });
// test(`is and del ABC error`, function(t) {
//   let str = "";
//   t.throws(()=>{NMajiangAlgo.isAndDelAAA(pais(str))}, /为空/);
// });
// test(`is and del ABC error`, function(t) {
//   let str = "";
//   t.throws(()=>{NMajiangAlgo.isAndDelABC(pais(str))}, /为空/);
// });
// test(`is and del 4A error`, function(t) {
//   let str = "";
//   t.throws(()=>{NMajiangAlgo.isAndDel4A(pais(str))}, /为空/);
// });

test(`get all jiangArr`, function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b8 b8 b9";
  t.deepEqual(NMajiangAlgo.getAllJiangArr(pais(str)), [0,1,2,7]);
});
test(`get all jiangArr empty`, function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b9";
  t.deepEqual(NMajiangAlgo.getAllJiangArr(pais(str)), []);
});


// // describe('2ABC group', function(t) {
// test("1 should is2ABC true", function(t) {
//   let str = getArr("b1 b2 b3 b4 b5 b6")
//   t.is(NMajiangAlgo.is2ABC(str), true);
// });
// test("1.1 should is2ABC true", function(t) {
//   let str = getArr("b1 b2 b3 b5 b4 b6")
//   t.is(NMajiangAlgo.is2ABC(str), true);
// });
// test("1.2 should is2ABC true", function(t) {
//   let str =getArr( "b1 b2 b3 t5 t4 t6")
//   t.is(NMajiangAlgo.is2ABC(str), true);
// });
// test("1.3 should is2ABC true", function(t) {
//   let str = getArr("b1 b1 b1 b1 b2 b3")
//   t.is(NMajiangAlgo.is2ABC(str), true);
// });

test("判断一色", function (t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b4 b5 b5 b7 b7 b7";
  //   let na_pai = "t9";
  let na_pai = pais("b7");
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng: [], shouPai: pais(str)
  };
  t.is(NMajiangAlgo.isYise(group_shoupai.shouPai.concat(na_pai)), true);
  na_pai = pais('t7')
  t.is(NMajiangAlgo.isYise(group_shoupai.shouPai.concat(na_pai)), false);

});


// test("5 should is2ABC true", function(t) {
//   let str = getArr("b1 b2 b3 zh zh zh")
//   t.is(NMajiangAlgo.is2ABC(str), true);
// });
// test("5.1 should is2ABC true", function(t) {
//   let str = getArr("b1 b1 b2 b2 b3 b3")
//   t.is(NMajiangAlgo.is2ABC(str), true);
// });
// test("6 should is2ABC false", function(t) {
//   let str = getArr("b1 b2 t2 b3 b3 b5")
//   t.is(NMajiangAlgo.is2ABC(str), false);
// });
// test("7 should is2ABC true", function(t) {
//   let str =getArr( "fa fa fa b1 t1 zh")
//   t.is(NMajiangAlgo.is2ABC(str), false);
// });
// test("7 should is2ABC true", function(t) {
//   let str = getArr("fa fa fa b1 t1 zh")
//   t.is(NMajiangAlgo.is2ABC(str), false);
// });


// test("不能杠b1", function(t) {
//   let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
//   t.is(NMajiangAlgo.canPeng(str, "b1"), false);
// });

// //能否碰
// test("能否碰fa", function(t) {
//   let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
//   t.is(NMajiangAlgo.canPeng(str, "di"), true);
// });
// test("能否碰t2", function(t) {
//   let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
//   t.is(NMajiangAlgo.canPeng(str, "zh"), true);
// });

// //不能
// test("不能碰di", function(t) {
//   let str = getArr("b1 b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6")
//   t.is(NMajiangAlgo.canPeng(str, "di"), false);
// });
// test("不能碰di", function(t) {
//   let str = getArr("di b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6")
//   t.is(NMajiangAlgo.canPeng(str, "di"), false);
// });
// test("不能碰di", function(t) {
//   let str = getArr("b2 b3 b5 b7 b8 b9 t2 t3 t6 t8 zh zh zh")
//   t.is(NMajiangAlgo.canPeng(str, "b1"), false);
// });
// test("不能碰di", function(t) {
//   let str = getArr("b1 b3 b5 b7 b8 b9 t2 t3 t6 t8 zh zh zh")
//   t.is(NMajiangAlgo.canPeng(str, "b1"), false);
// });
// test("group 亮牌不能碰", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: [],
//     selfPengCount: 1,
//     peng: ["b1"],
//     shouPai: getArr("b1 b2 b3 t1 t1 t2 t2 t3 t3 fa")
//   };
//   t.is(NMajiangAlgo.canPeng(group_shou_pai.shouPai, "t1", true), false);
// });

// //能否杠
// test("能杠fa", function(t) {
//   let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
//   t.is(NMajiangAlgo._canGang(str, "fa"), true);
// });
// test("能杠t2", function(t) {
//   let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
//   t.is(NMajiangAlgo._canGang(str, "t2"), true);
// });
// test("能杠t2, 使用手牌数组", function(t) {
//   let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa");
//   t.is(NMajiangAlgo._canGang(str, "t2"), true);
// });
// test("flat能扛", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: [],
//     selfPengCount: 1,
//     peng: ["b1"],
//     shouPai: getArr("b2 b3 b4 b5 b6 b7 t1 t2 t3 t4")
//   };
//   t.is(NMajiangAlgo._canGang(NMajiangAlgo.flat_shou_pai(group_shou_pai), "b1"), true);
// })

// test("group peng能扛", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: [],
//     selfPengCount: 1,
//     peng: ["b1"],
//     shouPai: getArr("b2 b3 b4 b5 b6 b7 t1 t2 t3 t4")
//   };
//   t.is(NMajiangAlgo._canGang(NMajiangAlgo.flat_shou_pai(group_shou_pai), "b1"), true);
//   //没有亮牌的时候，如果你是碰的牌，那么别人打的牌是不能杠的！
//   t.is(NMajiangAlgo.canGang(group_shou_pai, "b1", false), false);
// });
// test("group 没有亮，selfPeng能扛", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: ["b1"],
//     selfPengCount: 1,
//     peng: [],
//     shouPai: getArr("b2 b3 b4 b5 b6 b7 t1 t2 t3 t4")
//   };
//   t.is(NMajiangAlgo.canGang(group_shou_pai, "b1", false), true);
// });
// test("group 杠牌在亮牌中，亮牌后不能扛", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: ["b1"],
//     selfPengCount: 1,
//     peng: [],
//     shouPai: getArr("b2 b3 b4 b5 b6 b7 b9 b9 b9 t4")
//   };
//   t.is(NMajiangAlgo._canGang(NMajiangAlgo.flat_shou_pai(group_shou_pai), "b9"), true);
//   t.is(NMajiangAlgo.canGang(group_shou_pai, "b9", true), false);
// });
// test("group 亮牌不能碰,但是可以杠", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: [],
//     selfPengCount: 1,
//     peng: ["b1"],
//     shouPai: getArr("b2 b3 b4 t1 t1 t2 t2 t3 t3 fa")
//   };
//   t.is(NMajiangAlgo.canGang(group_shou_pai, "b1", true, true), true);
// });
// test("group 碰之后，别人打的牌不能扛", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: [],
//     selfPengCount: 1,
//     peng: ["b1"],
//     shouPai: getArr("b2 b3 b4 t1 t1 t2 t2 t3 t3 fa")
//   };
//   t.is(NMajiangAlgo.canGang(group_shou_pai, "b1", true, false), false);
// });
// test("group 能杠，但是先碰，拿牌可以杠peng", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: [],
//     selfPengCount: 1,
//     peng: ["b1"],
//     shouPai: getArr("b1 b3 b4 t1 t1 t2 t2 t3 t3 fa")
//   };
//   t.is(NMajiangAlgo.canGang(group_shou_pai, "b2", true), true);
// });
// test("group 能杠，但是先碰，拿牌可以杠selfPeng", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: ["b1"],
//     // selfPengCount: 1,
//     peng: [],
//     shouPai: getArr("b1 b3 b4 t1 t1 t2 t2 t3 t3 fa")
//   };
//   t.is(NMajiangAlgo.canGang(group_shou_pai, "b2", true), true);
// });
// test("group 不能扛自己摸的牌", function(t) {
//   let group_shou_pai = {
//     // anGang: ["zh"],
//     anGang: [],
//     anGangCount: 0,
//     mingGang: [],
//     selfPeng: [],
//     // selfPengCount: 1,
//     peng: [],
//     shouPai: getArr("b1 b1 b1 b3 b4 t1 t1 t4 t5 t6 t3 t3 fa fa")
//   };
//   t.is(NMajiangAlgo.canGang(group_shou_pai, "t3", false, true), false);
// });