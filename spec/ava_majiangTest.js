//麻将算法的测试程序，里面也包括了胡牌的一些用例

import test from "ava";
import {MajiangAlgo} from "../server_build/MajiangAlgo";
// var Majiang = require("../server/Majiang");
// var mj = new Majiang()
test("应为将", function(t) {
  t.is(MajiangAlgo.isAA("b1 b1"), true);
});
test("should将", function(t) {
  t.is(MajiangAlgo.isAA("b1b1"), true);
});
test("should一句话", function(t) {
  t.is(MajiangAlgo.isAAA("b1 b1 b1"), true);
});
test("should一句话false", function(t) {
  t.is(MajiangAlgo.isAAA("b1 b1   b2"), false);
});

test(`0 should is4A 'b1 b1 b1 b1' true`, function(t) {
  let str = "b1 b1 b1 b1";
  t.is(MajiangAlgo.is4A(str), true);
});
test(`0 should is4A 'b1b1b1b1' true`, function(t) {
  let str = "b1b1b1b1";
  t.is(MajiangAlgo.is4A(str), true);
});
test(`1 should is4A  false`, function(t) {
  let str = "b1 b2 b1 b1";
  t.is(MajiangAlgo.is4A(str), false);
});
test(`2 should is4A  false`, function(t) {
  let str = "b1 b1 b2 b1";
  t.is(MajiangAlgo.is4A(str), false);
});
test(`3 should is4A  false`, function(t) {
  let str = "b1 b1 b1 b2";
  t.is(MajiangAlgo.is4A(str), false);
});
test("4 should vlaid4A throw error", function(t) {
  let str = "b1";
  //   t.is(Majiang.is4A.bind(null, str)).toThrowError(/must have/);
  t.throws(MajiangAlgo.is4A.bind(null, str), /must have/);
});

test("should isABC true", function(t) {
  t.is(MajiangAlgo.isABC("b1 b2 b3"), true);
});
test("should isABC true", function(t) {
  t.is(MajiangAlgo.isABC("f7 f8 f9"), true);
});
test("should isABC false", function(t) {
  t.is(MajiangAlgo.isABC("b1 b2 b4"), false);
});
test("should isABC throw null error", function(t) {
  // t.is(Majiang.isABC).toThrowError(/empty/)
  t.throws(MajiangAlgo.isABC, /empty/);
  // t.is(foo(1)).toThrowError(/foo/)
});
test("should isABC throw values error", function(t) {
  let str = "b1 b2 b4 b5";
  //   t.is(Majiang.isABC.bind(null, str)).toThrowError(/must have/);
  t.throws(MajiangAlgo.isABC.bind(null, str), /must have/);
});

// describe('2ABC group', function(t) {
test("1 should is2ABC true", function(t) {
  let str = "b1 b2 b3 b4 b5 b6";
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("1.1 should is2ABC true", function(t) {
  let str = "b1 b2 b3 b5 b4 b6";
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("1.2 should is2ABC true", function(t) {
  let str = "b1 b2 b3 t5 t4 t6";
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("2 should is2ABC true", function(t) {
  let str = "b1 b2 b2 b3 b3 b4";
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("3 should is2ABC true", function(t) {
  let str = "b1 b1 b1 t3 t4 t5";
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("4 should is2ABC 非框", function(t) {
  let str = "b1 b2 b3 b3 b3 b3";
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("5 should is2ABC true", function(t) {
  let str = "b1 b2 b3 zh zh zh";
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("5.1 should is2ABC true", function(t) {
  let str = "b1 b1 b2 b2 b3 b3";
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("6 should is2ABC false", function(t) {
  let str = "b1 b2 t2 b3 b3 b5";
  t.is(MajiangAlgo.is2ABC(str), false);
});
test("7 should is2ABC true", function(t) {
  let str = "fa fa fa b1 t1 zh";
  t.is(MajiangAlgo.is2ABC(str), false);
});
test("7 should is2ABC true", function(t) {
  let str = "fa fa fa b1 t1 zh";
  t.is(MajiangAlgo.is2ABC(str), false);
});

// describe('is3ABC group', function(t) {
test("is3ABC 正规九张牌", function(t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3";
  t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 九张 122334123", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 t1 t2 t3";
  t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 九张 112233456", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6";
  t.is(MajiangAlgo.is3ABC(str), true);
});
test("is3ABC 九张 123445566", function(t) {
  let str = "b1 b2 b3 b4 b4 b5 b5 b6 b6";
  t.is(MajiangAlgo.is3ABC(str), true);
});

//     describe('is4ABC group', function(t) {
test("is4ABC 12张牌", function(t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6";
  t.is(MajiangAlgo.is4ABC(str), true);
  let str1 = "b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 t4";
  t.is(MajiangAlgo.is4ABC(str1), true);
});
test("is4ABC 12张牌 前6错位", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 t1 t2 t2 t3 t3 t4";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 12张牌，中间错位", function(t) {
  let str = "zh zh zh b1 b2 b2 b3 b3 b4 t1 t2 t3";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 12张牌 前9 112233", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b8 b9";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 12张牌 后9 112233", function(t) {
  let str = "b1 b2 b3 b4 b4 b5 b5 b6 b6 b7 b7 b7";
  t.is(MajiangAlgo.is4ABC(str), true);
});
test("is4ABC 12 false", function(t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t2 t3 t3 zh";
  t.is(MajiangAlgo.is4ABC(str), false);
});
test("is4ABC 12张牌", function(t) {
  let str = "b1 b2 b3 fa fa fa t1 t2 t3 t4 t5 t6";
  t.is(MajiangAlgo.is4ABC(str), true);
});

// 屁胡
test("普通屁胡", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 t4 t5  fa fa fa zh zh";
  let na_pai = "t6";
  t.is(MajiangAlgo.HuisPihu(str, na_pai), true);
});
test("多个同花色规则屁胡", function(t) {
  let str = " b2 b2 b3 b3 b4 t4 t5 t5 t5 t6 fa fa fa";
  let na_pai = "b1";
  t.is(MajiangAlgo.HuisPihu(str, na_pai), true);
});
test("带杠屁胡", function(t) {
  let str = "t1 t3 t4 t5 t6 b4 b5 b6 fa fa fa fa zh zh";
  let na_pai = "t2";
  t.is(MajiangAlgo.HuisPihu(str, na_pai), true);
});
test("双杠屁胡", function(t) {
  let str = " b1 b1 b1 b2 b2 b2 b2 t1 t2 t2 t3 t3 t4 t5 t5";
  let na_pai = "b1";
  t.is(MajiangAlgo.HuisPihu(str, na_pai), true);
});
test("屁胡清一色", function(t) {
  let str = "b1 b2 b3 b3 b4 b4 b5 b5 b5 b5 b6 b7 b7";
  let na_pai = "b2";
  t.is(MajiangAlgo.HuisPihu(str, na_pai), true);
});
test("少张屁胡", function(t) {
  let str = " b1 b1 b2 b3 b7 b7 b7 b7 b8 b9";
  let na_pai = "b1";
  t.is(MajiangAlgo.HuisPihu(str, na_pai), true);
});
test("非屁胡 should behave...", function(t) {
  let str = " b2 b2 b3 b3 b4 t4 t5 t6 fa fa fa zh t9";
  let na_pai = "b1";
  t.is(MajiangAlgo.HuisPihu(str, na_pai), false);
});
test("非屁胡 将都没有", function(t) {
  let str = "b2b3";
  let na_pai = "b1";
  t.is(MajiangAlgo.HuisPihu(str, na_pai), false);
});

// 特殊胡
test("七对", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 fa fa  t1 t1 t4 t4 t9 ";
  let na_pai = "t9";
  t.is(MajiangAlgo.HuisQidui(str, na_pai), true);
});
test("龙七对", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9 ";
  let na_pai = "t9";
  t.is(MajiangAlgo.HuisNongQiDui(str, na_pai), true);
});
test("清一色", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5  b7 b7 b7";
  let na_pai = "b6";
  t.is(MajiangAlgo.HuisYise(str, na_pai), true);
});
test("清一色false", function(t) {
  let str = "b1 b1 b1 b2 b2 b4 b4 b5 b5 b8  b7 b7 b7";
  let na_pai = "b6";
  t.is(MajiangAlgo.HuisYise(str, na_pai), false);
});
test("碰碰胡将在后", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa di ";
  let na_pai = "di";
  t.is(MajiangAlgo.HuisPengpeng(str, na_pai), true);
});
test("碰碰胡将在前", function(t) {
  let str = "di di b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa ";
  let na_pai = "fa";
  t.is(MajiangAlgo.HuisPengpeng(str, na_pai), true);
});
test("碰碰糊带1杠", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa t5 ";
  let na_pai = "t5";
  t.is(MajiangAlgo.HuisPengpeng(str, na_pai), true);
});
test("碰碰糊带2杠", function(t) {
  let str = "b2 b2 b2 b2 b1 b1 b1 b1 t3 t3 t3 fa fa fa t5 ";
  let na_pai = "t5";
  t.is(MajiangAlgo.HuisPengpeng(str, na_pai), true);
});
test("碰碰糊带3杠", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 t3 t3 t3 t3 fa fa fa t5 ";
  let na_pai = "t5";
  t.is(MajiangAlgo.HuisPengpeng(str, na_pai), true);
});
test("碰碰糊带3杠少将", function(t) {
  let str = "b2 fa fa fa fa t1 t1 t1 t1 zh zh zh zh";
  let na_pai = "b2";
  t.is(MajiangAlgo.HuisPengpeng(str, na_pai), true);
});
test("卡五星", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 b4 b6 t3 t3 t3 t5 t5";
  let na_pai = "b5";
  t.is(MajiangAlgo.HuisKaWuXing(str, na_pai), true);
});
test("三杠卡五星", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 b4 b6 t3 t3 t3 t3 t5 t5";
  let na_pai = "b5";
  t.is(MajiangAlgo.HuisKaWuXing(str, na_pai), true);
});
test("清一色卡五星", function(t) {
  let str = "b1 b1 b1 b2 b3 b4 b6 b7 b7 b7 b7 b8 b9";
  let na_pai = "b5";
  t.is(MajiangAlgo.HuisKaWuXing(str, na_pai), true);
  t.is(MajiangAlgo.HuisYise(str, na_pai), true);
});

//repeatTwiceOnly是专门为小三元服务的，因为要判断是否只重复了二次，不能有三次的情况！
//正则的话还没有找到限制重复次数的用法
test("should repeatTwiceOnly", t => {
  let str = "t1t2b1b1b1";
  t.is(MajiangAlgo.isRepeatTwiceOnly(str, "b1"), false);
  str = "t1t2b1b1fafa";
  t.is(MajiangAlgo.isRepeatTwiceOnly(str, "b1"), true);
});
test("should 大三元", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh fa fa";
  let na_pai = "fa";
  t.is(MajiangAlgo.HuisDaShanYuan(str, na_pai), true);
  t.is(MajiangAlgo.HuisXiaoShanYuan(str, na_pai), false);
});
test("should 大三元", t => {
  let str = "fa fa b1 b1 b1 b2 b3 di di di zh zh zh ";
  let na_pai = "fa";
  t.is(MajiangAlgo.HuisDaShanYuan(str, na_pai), true);
});
test("should 小三元", t => {
  let str = "fa b1 b1 b1 b2 b3 di di di zh zh zh fa ";
  let na_pai = "b1";
  t.is(MajiangAlgo.HuisXiaoShanYuan(str, na_pai), true);
  t.is(MajiangAlgo.HuisDaShanYuan(str, na_pai), false);
});
test("should not 大小三元", t => {
  let str = "b1 b1 b1 b2 b3 di di di zh zh zh t1 t1";
  let na_pai = "b1";
  t.is(MajiangAlgo.HuisXiaoShanYuan(str, na_pai), false);
  t.is(MajiangAlgo.HuisDaShanYuan(str, na_pai), false);
});

//胡牌false'
test("非七对", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa t1 t1 t4 t4 t9 t8";
  let na_pai = "fa";
  t.is(MajiangAlgo.HuisQidui(str, na_pai), false);
});
test("不是清一色", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7";
  let na_pai = "fa";
  t.is(MajiangAlgo.HuisYise(str, na_pai), false);
});
test("不是碰碰胡", function(t) {
  let str = "b1 b1 b2 b2 b2 t3 t4 t5 fa fa fa di di";
  let na_pai = "b1";
  t.is(MajiangAlgo.HuisPengpeng(str, na_pai), false);
});
test("可胡但不是卡五星", function(t) {
  let str = "t1 t2 t3 t4 t5 t6 b6 b7 b7 b7 b7 b8 b9";
  var na_pai = "b5";
  t.is(MajiangAlgo.HuisKaWuXing(str, na_pai), false);
  t.is(MajiangAlgo.HuisPihu(str, na_pai), true);
});
test("胡五条但不是卡", function(t) {
  let str = "fa fa fa t2 t2 t3 t4 t6 t7 t8 zh zh zh";
  var na_pai = "t5";
  t.is(MajiangAlgo.HuisKaWuXing(str, na_pai), false);
  t.is(MajiangAlgo.HuisPihu(str, na_pai), true);
});

// '胡啥牌'
test("清一色听牌", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["b5", "b7"]);
});
test("清一色听7张", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 b9 b9 b9";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, [
    "b1",
    "b3",
    "b4",
    "b6",
    "b7",
    "b8",
    "b9"
  ]);
});

test("双将倒", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["di", "zh"]);
});
test("单钓将", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b5 b6 b7 b7 b7 b8";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["b3", "b6", "b8", "b9"]);
});
test("清一色听牌false", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 t1 t3 t5";
  t.deepEqual(MajiangAlgo.HuWhatPai(str), {});
});
test("清一色听牌false", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b8 b8 t1 t3 t5";
  t.deepEqual(MajiangAlgo.HuWhatPai(str), {});
});
test("碰碰胡听牌", function(t) {
  let str = "b1 b1 b1 b2 b2 b2 b3 b3 b3 t1 t1 t1 t2";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["t2", "t3"]);
});
test("碰碰胡带杠听牌", function(t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b3 b3 b3 t1 t1 t1 t2";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["t2", "t3"]);
});
test("龙七对听牌", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9";
  t.deepEqual(MajiangAlgo.HuWhatPai(str).all_hupai_zhang, ["t9"]);
});

//能否杠
test("能杠fa", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(MajiangAlgo.canGang(str, "fa"), true);
});
test("能杠t2", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(MajiangAlgo.canGang(str, "t2"), true);
});
test("能杠t2, 使用手牌数组", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa".split(" ");
  t.is(MajiangAlgo.canGang(str, "t2"), true);
});

test("不能杠b1", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(MajiangAlgo.canPeng(str, "b1"), false);
});

//能否碰
test("能否碰fa", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(MajiangAlgo.canPeng(str, "di"), true);
});
test("能否碰t2", function(t) {
  let str = "zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa";
  t.is(MajiangAlgo.canPeng(str, "zh"), true);
});

//不能
test("不能碰di", function(t) {
  let str = "b1 b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6";
  t.is(MajiangAlgo.canPeng(str, "di"), false);
});
test("不能碰di", function(t) {
  let str = "di b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6";
  t.is(MajiangAlgo.canPeng(str, "di"), false);
});
test("不能碰di", function(t) {
  let str = "b2 b3 b5 b7 b8 b9 t2 t3 t6 t8 zh zh zh";
  t.is(MajiangAlgo.canPeng(str, "b1"), false);
});

//哪种胡类型
test("屁胡", t => {
  let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6 fa fa fa zh ";
  let na_pai = "zh";
  t.deepEqual(MajiangAlgo.HuPaiNames(str, na_pai), ["屁胡"]);
});
test("清一色", t => {
  let str = "b1 b2 b3 b4 b5 b6 b7 b8 b9 b1 b2 b3 b4 ";
  let na_pai = "b4";
  t.deepEqual(MajiangAlgo.HuPaiNames(str, na_pai), ["清一色", "屁胡"]);
});
test("清一色碰碰", t => {
  let str = "b1 b1 b1 b2 b2 b2 b3 b3 b3 b4 b4 b4 b5 ";
  let na_pai = "b5";
  t.deepEqual(MajiangAlgo.HuPaiNames(str, na_pai), ["清一色", "碰碰胡", "屁胡"]);
});
test("清一色七对", t => {
  let str = "b1 b1 b2 b2 b3 b3 b4 b4 b5 b5 b6 b6 b7 ";
  let na_pai = "b7";
  t.deepEqual(MajiangAlgo.HuPaiNames(str, na_pai), ["清一色", "七对", "屁胡"]);
});

// });
