//麻将算法的测试程序，里面也包括了胡牌的一些用例

import test from "ava";
import { Majiang } from "../server/Majiang";
// var Majiang = require("../server/Majiang");
// var mj = new Majiang()
test("应为将", function(t) {
  t.is(Majiang.isAA("b1 b1"), true);
});
test("should将", function(t) {
  t.is(Majiang.isAA("b1b1"), true);
});
test("should一句话", function(t) {
  t.is(Majiang.isAAA("b1 b1 b1"), true);
});
test("should一句话false", function(t) {
  t.is(Majiang.isAAA("b1 b1   b2"), false);
});

test(`0 should is4A 'b1 b1 b1 b1' true`, function(t) {
  let str = "b1 b1 b1 b1";
  t.is(Majiang.is4A(str), true);
});
test(`0 should is4A 'b1b1b1b1' true`, function(t) {
  let str = "b1b1b1b1";
  t.is(Majiang.is4A(str), true);
});
test(`1 should is4A  false`, function(t) {
  let str = "b1 b2 b1 b1";
  t.is(Majiang.is4A(str), false);
});
test(`2 should is4A  false`, function(t) {
  let str = "b1 b1 b2 b1";
  t.is(Majiang.is4A(str), false);
});
test(`3 should is4A  false`, function(t) {
  let str = "b1 b1 b1 b2";
  t.is(Majiang.is4A(str), false);
});
test("4 should vlaid4A throw error", function(t) {
  let str = "b1";
  //   t.is(Majiang.is4A.bind(null, str)).toThrowError(/must have/);
  t.throws(Majiang.is4A.bind(null, str), /must have/);
});

test("should isABC true", function(t) {
  t.is(Majiang.isABC("b1 b2 b3"), true);
});
test("should isABC true", function(t) {
  t.is(Majiang.isABC("f7 f8 f9"), true);
});
test("should isABC false", function(t) {
  t.is(Majiang.isABC("b1 b2 b4"), false);
});
test("should isABC throw null error", function(t) {
  // t.is(Majiang.isABC).toThrowError(/empty/)
  t.throws(Majiang.isABC, /empty/);
  // t.is(foo(1)).toThrowError(/foo/)
});
test("should isABC throw values error", function(t) {
  let str = "b1 b2 b4 b5";
  //   t.is(Majiang.isABC.bind(null, str)).toThrowError(/must have/);
  t.throws(Majiang.isABC.bind(null, str), /must have/);
});

// describe('2ABC group', function(t) {
test("1 should is2ABC true", function(t) {
  let str = "b1 b2 b3 b4 b5 b6";
  t.is(Majiang.is2ABC(str), true);
});
test("1.1 should is2ABC true", function(t) {
  let str = "b1 b2 b3 b5 b4 b6";
  t.is(Majiang.is2ABC(str), true);
});
test("1.2 should is2ABC true", function(t) {
  let str = "b1 b2 b3 t5 t4 t6";
  t.is(Majiang.is2ABC(str), true);
});
test("2 should is2ABC true", function(t) {
  let str = "b1 b2 b2 b3 b3 b4";
  t.is(Majiang.is2ABC(str), true);
});
test("3 should is2ABC true", function(t) {
  let str = "b1 b1 b1 t3 t4 t5";
  t.is(Majiang.is2ABC(str), true);
});
test("4 should is2ABC 非框", function(t) {
  let str = "b1 b2 b3 b3 b3 b3";
  t.is(Majiang.is2ABC(str), true);
});
test("5 should is2ABC true", function(t) {
  let str = "b1 b2 b3 zh zh zh";
  t.is(Majiang.is2ABC(str), true);
});
test("5.1 should is2ABC true", function(t) {
  let str = "b1 b1 b2 b2 b3 b3";
  t.is(Majiang.is2ABC(str), true);
});
test("6 should is2ABC false", function(t) {
  let str = "b1 b2 t2 b3 b3 b5";
  t.is(Majiang.is2ABC(str), false);
});
test("7 should is2ABC true", function(t) {
  let str = "fa fa fa b1 t1 zh";
  t.is(Majiang.is2ABC(str), false);
});
test("7 should is2ABC true", function(t) {
  let str = "fa fa fa b1 t1 zh";
  t.is(Majiang.is2ABC(str), false);
});

// describe('is3ABC group', function(t) {
test("is3ABC 正规九张牌", function(t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3";
  t.is(Majiang.is3ABC(str), true);
});
test("is3ABC 九张 122334123", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 t1 t2 t3";
  t.is(Majiang.is3ABC(str), true);
});
test("is3ABC 九张 112233456", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6";
  t.is(Majiang.is3ABC(str), true);
});
test("is3ABC 九张 123445566", function(t) {
  let str = "b1 b2 b3 b4 b4 b5 b5 b6 b6";
  t.is(Majiang.is3ABC(str), true);
});

//     describe('is4ABC group', function(t) {
test("is4ABC 12张牌", function(t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6";
  t.is(Majiang.is4ABC(str), true);
  let str1 = "b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 t4";
  t.is(Majiang.is4ABC(str1), true);
});
test("is4ABC 12张牌 前6错位", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 t1 t2 t2 t3 t3 t4";
  t.is(Majiang.is4ABC(str), true);
});
test("is4ABC 12张牌，中间错位", function(t) {
  let str = "zh zh zh b1 b2 b2 b3 b3 b4 t1 t2 t3";
  t.is(Majiang.is4ABC(str), true);
});
test("is4ABC 12张牌 前9 112233", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b8 b9";
  t.is(Majiang.is4ABC(str), true);
});
test("is4ABC 12张牌 后9 112233", function(t) {
  let str = "b1 b2 b3 b4 b4 b5 b5 b6 b6 b7 b7 b7";
  t.is(Majiang.is4ABC(str), true);
});
test("is4ABC 12 false", function(t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 zh";
  t.is(Majiang.is4ABC(str), false);
});
test("is4ABC 12张牌", function(t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6";
  t.is(Majiang.is4ABC(str), true);
});

// 屁胡
test("普通屁胡", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 t4 t5 t6 fa fa fa zh zh";
  t.is(Majiang.isPihu(str), true);
});
test("多个同花色规则屁胡", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 t4 t5 t5 t5 t6 fa fa fa";
  t.is(Majiang.isPihu(str), true);
});
test("带杠屁胡", function(t) {
  let str = "t1 t2 t3 t4 t5 t6 b4 b5 b6 fa fa fa fa zh zh";
  t.is(Majiang.isPihu(str), true);
});
test("双杠屁胡", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 t1 t2 t2 t3 t3 t4 t5 t5";
  t.is(Majiang.isPihu(str), true);
});
test("屁胡清一色", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b5 b6 b7 b7";
  t.is(Majiang.isPihu(str), true);
});
test("少张屁胡", function(t) {
  let str = "b1 b1 b1 b2 b3 b7 b7 b7 b7 b8 b9";
  t.is(Majiang.isPihu(str), true);
});
test("非屁胡 should behave...", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 t4 t5 t6 fa fa fa zh t9";
  t.is(Majiang.isPihu(str), false);
});
test("非屁胡 将都没有", function(t) {
  let str = "b1b2b3";
  t.is(Majiang.isPihu(str), false);
});

// 特殊胡
test("七对及龙七对", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9 t9";
  t.is(Majiang.isQidui(str), true);
  t.is(Majiang.isNongQiDui(str), true);
});
test("清一色", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7 b7";
  t.is(Majiang.isYise(str), true);
});
test("碰碰胡将在后", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa di di";
  t.is(Majiang.isPengpeng(str), true);
});
test("碰碰胡将在前", function(t) {
  let str = "di di b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa";
  t.is(Majiang.isPengpeng(str), true);
});
test("碰碰糊带1杠", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa t5 t5";
  t.is(Majiang.isPengpeng(str), true);
});
test("碰碰糊带2杠", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 t3 t3 t3 fa fa fa t5 t5";
  t.is(Majiang.isPengpeng(str), true);
});
test("碰碰糊带3杠", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 t3 t3 t3 t3 fa fa fa t5 t5";
  t.is(Majiang.isPengpeng(str), true);
});
test("碰碰糊带3杠少将", function(t) {
  let str = "b2 fa fa fa fa t1 t1 t1 t1 zh zh zh zh";
  let na_pai = "b2";
  t.is(Majiang.isPengpeng(str + na_pai), true);
});
test("卡五星", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 b4 b6 t3 t3 t3 t5 t5";
  let na_pai = "b5";
  t.is(Majiang.isKaWuXinG(str, na_pai), true);
});
test("三杠卡五星", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 b4 b6 t3 t3 t3 t3 t5 t5";
  let na_pai = "b5";
  t.is(Majiang.isKaWuXinG(str, na_pai), true);
});
test("清一色卡五星", function(t) {
  let str = "b1 b1 b1 b2 b3 b4 b6 b7 b7 b7 b7 b8 b9";
  let na_pai = "b5";
  t.is(Majiang.isKaWuXinG(str, na_pai), true);
  t.is(Majiang.isYise(str + na_pai), true);
});

//false'
test("非七对", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9 t8";
  t.is(Majiang.isQidui(str), false);
});
test("不是清一色", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7 fa";
  t.is(Majiang.isYise(str), false);
});
test("不是碰碰胡", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 t3 t4 t5 fa fa fa di di";
  t.is(Majiang.isPengpeng(str), false);
});
test("可胡但不是卡五星", function(t) {
  let str = "t1 t2 t3 t4 t5 t6 b6 b7 b7 b7 b7 b8 b9";
  var na_pai = "b5";
  t.is(Majiang.isKaWuXinG(str, na_pai), false);
  t.is(Majiang.isPihu(str + na_pai), true);
});
test("胡五条但不是卡", function(t) {
  let str = "fa fa fa t2 t2 t3 t4 t6 t7 t8 zh zh zh";
  var na_pai = "t5";
  t.is(Majiang.isKaWuXinG(str, na_pai), false);
  t.is(Majiang.isPihu(str + na_pai), true);
});

// '胡啥牌'
test("清一色听牌", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7";
  t.deepEqual(Majiang.whoIsHu(str), ["b5", "b7"]);
});
test("清一色听7张", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 b9 b9 b9";
  t.deepEqual(Majiang.whoIsHu(str), ["b1", "b3", "b4", "b6", "b7", "b8", "b9"]);
});

test("双将倒", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.deepEqual(Majiang.whoIsHu(str), ["di", "zh"]);
});
test("单钓将", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b7 b7 b8";
  t.deepEqual(Majiang.whoIsHu(str), ["b3", "b6", "b8", "b9"]);
});
test("清一色听牌false", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 t1 t3 t5";
  t.is(Majiang.whoIsHu(str), false);
});

//能否杠
test("能杠fa", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(Majiang.canGang(str, "fa"), true);
});
test("能杠t2", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(Majiang.canGang(str, "t2"), true);
});
test("能杠t2, 使用手牌数组", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa".split(" ");
  t.is(Majiang.canGang(str, "t2"), true);
});

test("不能杠b1", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(Majiang.canPeng(str, "b1"), false);
});

//能否碰
test("能否碰fa", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(Majiang.canPeng(str, "di"), true);
});
test("能否碰t2", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(Majiang.canPeng(str, "zh"), true);
});

//不能
test("不能碰di", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6";
  t.is(Majiang.canPeng(str, "di"), false);
});
test("不能碰di", function(t) {
  let str = "di b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6";
  t.is(Majiang.canPeng(str, "di"), false);
});
test("不能碰di", function(t) {
  let str = "b2 b3 b5 b7 b8 b9 t2 t3 t6 t8 zh zh zh";
  t.is(Majiang.canPeng(str, "b1"), false);
});


// });
