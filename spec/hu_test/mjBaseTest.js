import test from "ava";
import { MajiangAlgo, getArr } from "../../server_build/server/MajiangAlgo";
// var Majiang = require("../server/Majiang");
// var mj = new Majiang()
test("应为将", function(t) {
  t.is(MajiangAlgo.isAA(getArr("b1 b1")), true);
});
test("should将", function(t) {
  t.is(MajiangAlgo.isAA(getArr("b1b1")), true);
});
test("should一句话", function(t) {
  t.is(MajiangAlgo._isAAA("b1 b1 b1"), true);
});
test("should一句话false", function(t) {
  t.is(MajiangAlgo._isAAA("b1 b1   b2"), false);
});

test(`0 should is4A 'b1 b1 b1 b1' true`, function(t) {
  let str = "b1 b1 b1 b1";
  t.is(MajiangAlgo._is4A(str), true);
});
test(`0 should _is4A 'b1b1b1b1' true`, function(t) {
  let str = "b1b1b1b1";
  t.is(MajiangAlgo._is4A(str), true);
});
test(`1 should _is4A  false`, function(t) {
  let str = "b1 b2 b1 b1";
  t.is(MajiangAlgo._is4A(str), false);
});
test(`2 should _is4A  false`, function(t) {
  let str = "b1 b1 b2 b1";
  t.is(MajiangAlgo._is4A(str), false);
});
test(`3 should _is4A  false`, function(t) {
  let str = "b1 b1 b1 b2";
  t.is(MajiangAlgo._is4A(str), false);
});
test("4 should vlaid4A throw error", function(t) {
  let str = "b1";
  //   t.is(Majiang._is4A.bind(null, str)).toThrowError(/must have/);
  t.throws(MajiangAlgo._is4A.bind(null, str), /必须等于/);
});

test("should isABCorAAA true", function(t) {
  t.is(MajiangAlgo.isABCorAAA("b1 b1 b1"), true);
});
test("should isABCorAAA true", function(t) {
  t.is(MajiangAlgo.isABCorAAA("b1 b2 b3"), true);
});
test("should isABCorAAA true", function(t) {
  t.is(MajiangAlgo.isABCorAAA("b1 b1 b1 b1"), true);
});
test("should isABCorAAA true", function(t) {
  t.is(MajiangAlgo.isABCorAAA("b1 b1 b1 t1"), false);
});
test("should isABCorAAA false", function(t) {
  t.is(MajiangAlgo.isABCorAAA("b1 b2 b3 t3"), false);
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

// test("只有两个值，isABC抛出错误", function (t) {
//   let str = "b1 b2";
//   t.throws(MajiangAlgo.isABC.bind(null, str), /必须/);
// });

// describe('2ABC group', function(t) {
test("1 should is2ABC true", function(t) {
  let str = getArr("b1 b2 b3 b4 b5 b6")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("1.1 should is2ABC true", function(t) {
  let str = getArr("b1 b2 b3 b5 b4 b6")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("1.2 should is2ABC true", function(t) {
  let str =getArr( "b1 b2 b3 t5 t4 t6")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("1.3 should is2ABC true", function(t) {
  let str = getArr("b1 b1 b1 b1 b2 b3")
  t.is(MajiangAlgo.is2ABC(str), true);
});

test("2 should is2ABC true", function(t) {
  let str = getArr("b1 b2 b2 b3 b3 b4")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("3 should is2ABC true", function(t) {
  let str = getArr("b1 b1 b1 t3 t4 t5")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("4 should is2ABC 非杠", function(t) {
  let str = getArr("b1 b2 b3 b3 b3 b3")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("4.0 should is2ABC 非杠", function(t) {
  let str = getArr("b4 b5 b5 b5 b5 b6")
  t.is(MajiangAlgo.is2ABC(str), true);
});

//7张带杠的检测
test("4.1 should is2ABC，前ABC，杠在后", function(t) {
  let str =getArr( "b1 b2 b3 t3 t3 t3 t3")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("4.2 is2ABC 一杠，杠在前，后三AAA", function(t) {
  let str = getArr("t1 t1 t1 t1 b3 b3 b3")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("4.3 is2ABC 一杠，杠在前，后ABC", function(t) {
  let str = getArr("b1 b1 b1 b1 t1 t2 t3")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("4.4 is2ABC 双杠", function(t) {
  let str = getArr("t1 t1 t1 t1 b3 b3 b3 b3")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("4.5 is2ABC 7张牌 false", function(t) {
  let str = getArr("t1 t1 t1 t1 b1 b3 b3")
  t.is(MajiangAlgo.is2ABC(str), false);
});
test("4.6 is2ABC 8张牌 false", function(t) {
  let str = getArr("t1 t1 t1 t1 b1 b3 b3 b3")
  t.is(MajiangAlgo.is2ABC(str), false);
});

test("5 should is2ABC true", function(t) {
  let str = getArr("b1 b2 b3 zh zh zh")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("5.1 should is2ABC true", function(t) {
  let str = getArr("b1 b1 b2 b2 b3 b3")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("6 should is2ABC false", function(t) {
  let str = getArr("b1 b2 t2 b3 b3 b5")
  t.is(MajiangAlgo.is2ABC(str), false);
});
test("7 should is2ABC true", function(t) {
  let str =getArr( "fa fa fa b1 t1 zh")
  t.is(MajiangAlgo.is2ABC(str), false);
});
test("7 should is2ABC true", function(t) {
  let str = getArr("fa fa fa b1 t1 zh")
  t.is(MajiangAlgo.is2ABC(str), false);
});
test("is2ABC 7张牌，一杠，前三为ABC", function(t) {
  let str = getArr("b1 b2 b3 b5 b5 b5 b5")
  t.is(MajiangAlgo.is2ABC(str), true);
});
test("is2ABC 7张牌，一杠，前三为ABC", function(t) {
  let str = getArr("t1 t1 t1 t2 t3 t4 t5")
  t.is(MajiangAlgo.is2ABC(str), false);
});
test("is2ABC 8张牌，一杠，false", function(t) {
  let str = getArr("b2 b2 b2 b2 t1 t1 t1 t2")
  t.is(MajiangAlgo.is2ABC(str), false);
});

test("不能杠b1", function(t) {
  let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
  t.is(MajiangAlgo.canPeng(str, "b1"), false);
});

//能否碰
test("能否碰fa", function(t) {
  let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
  t.is(MajiangAlgo.canPeng(str, "di"), true);
});
test("能否碰t2", function(t) {
  let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
  t.is(MajiangAlgo.canPeng(str, "zh"), true);
});

//不能
test("不能碰di", function(t) {
  let str = getArr("b1 b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6")
  t.is(MajiangAlgo.canPeng(str, "di"), false);
});
test("不能碰di", function(t) {
  let str = getArr("di b2 b3 b4 b5 b6 b7 t1 t2 t3 t4 t5 t6")
  t.is(MajiangAlgo.canPeng(str, "di"), false);
});
test("不能碰di", function(t) {
  let str = getArr("b2 b3 b5 b7 b8 b9 t2 t3 t6 t8 zh zh zh")
  t.is(MajiangAlgo.canPeng(str, "b1"), false);
});
test("不能碰di", function(t) {
  let str = getArr("b1 b3 b5 b7 b8 b9 t2 t3 t6 t8 zh zh zh")
  t.is(MajiangAlgo.canPeng(str, "b1"), false);
});
test("group 亮牌不能碰", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: [],
    selfPengCount: 1,
    peng: ["b1"],
    shouPai: getArr("b1 b2 b3 t1 t1 t2 t2 t3 t3 fa")
  };
  t.is(MajiangAlgo.canPeng(group_shou_pai.shouPai, "t1", true), false);
});

//能否杠
test("能杠fa", function(t) {
  let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
  t.is(MajiangAlgo._canGang(str, "fa"), true);
});
test("能杠t2", function(t) {
  let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa")
  t.is(MajiangAlgo._canGang(str, "t2"), true);
});
test("能杠t2, 使用手牌数组", function(t) {
  let str = getArr("zh zh di di b1 b2 b3 t2 t2 t2 fa fa fa");
  t.is(MajiangAlgo._canGang(str, "t2"), true);
});
test("flat能扛", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: [],
    selfPengCount: 1,
    peng: ["b1"],
    shouPai: getArr("b2 b3 b4 b5 b6 b7 t1 t2 t3 t4")
  };
  t.is(MajiangAlgo._canGang(MajiangAlgo.flat_shou_pai(group_shou_pai), "b1"), true);
})

test("group peng能扛", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: [],
    selfPengCount: 1,
    peng: ["b1"],
    shouPai: getArr("b2 b3 b4 b5 b6 b7 t1 t2 t3 t4")
  };
  t.is(MajiangAlgo._canGang(MajiangAlgo.flat_shou_pai(group_shou_pai), "b1"), true);
  //没有亮牌的时候，如果你是碰的牌，那么别人打的牌是不能杠的！
  t.is(MajiangAlgo.canGang(group_shou_pai, "b1", false), false);
});
test("group 没有亮，selfPeng能扛", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: ["b1"],
    selfPengCount: 1,
    peng: [],
    shouPai: getArr("b2 b3 b4 b5 b6 b7 t1 t2 t3 t4")
  };
  t.is(MajiangAlgo.canGang(group_shou_pai, "b1", false), true);
});
test("group 杠牌在亮牌中，亮牌后不能扛", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: ["b1"],
    selfPengCount: 1,
    peng: [],
    shouPai: getArr("b2 b3 b4 b5 b6 b7 b9 b9 b9 t4")
  };
  t.is(MajiangAlgo._canGang(MajiangAlgo.flat_shou_pai(group_shou_pai), "b9"), true);
  t.is(MajiangAlgo.canGang(group_shou_pai, "b9", true), false);
});
test("group 亮牌不能碰,但是可以杠", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: [],
    selfPengCount: 1,
    peng: ["b1"],
    shouPai: getArr("b2 b3 b4 t1 t1 t2 t2 t3 t3 fa")
  };
  t.is(MajiangAlgo.canGang(group_shou_pai, "b1", true, true), true);
});
test("group 碰之后，别人打的牌不能扛", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: [],
    selfPengCount: 1,
    peng: ["b1"],
    shouPai: getArr("b2 b3 b4 t1 t1 t2 t2 t3 t3 fa")
  };
  t.is(MajiangAlgo.canGang(group_shou_pai, "b1", true, false), false);
});
test("group 能杠，但是先碰，拿牌可以杠peng", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: [],
    selfPengCount: 1,
    peng: ["b1"],
    shouPai: getArr("b1 b3 b4 t1 t1 t2 t2 t3 t3 fa")
  };
  t.is(MajiangAlgo.canGang(group_shou_pai, "b2", true), true);
});
test("group 能杠，但是先碰，拿牌可以杠selfPeng", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: ["b1"],
    // selfPengCount: 1,
    peng: [],
    shouPai: getArr("b1 b3 b4 t1 t1 t2 t2 t3 t3 fa")
  };
  t.is(MajiangAlgo.canGang(group_shou_pai, "b2", true), true);
});
test("group 不能扛自己摸的牌", function(t) {
  let group_shou_pai = {
    // anGang: ["zh"],
    anGang: [],
    anGangCount: 0,
    mingGang: [],
    selfPeng: [],
    // selfPengCount: 1,
    peng: [],
    shouPai: getArr("b1 b1 b1 b3 b4 t1 t1 t4 t5 t6 t3 t3 fa fa")
  };
  t.is(MajiangAlgo.canGang(group_shou_pai, "t3", false, true), false);
});