import test from "ava";
import { MajiangAlgo, getArr } from "../../server_build/server/MajiangAlgo";

test("清一色false", function (t) {
  let str = "b1 b1 b1 b2 b2 b4 b4 b5 b5 b8  b7 b7 b7";
  let na_pai = "b6";
  let group_shoupai = {
      anGang: [],
      mingGang: [],
      peng: [],
      selfPeng:[], shouPai: str.split(' ')
    }
  t.is(MajiangAlgo.HuisYise(group_shoupai, na_pai), false);
});

//清一色
test("清一色", function(t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b7 b7 b7";
  let na_pai = "b6";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisYise(group_shoupai, na_pai), true);
});
test("不是清一色", function (t) {
  let str = "b1 b2 b2 b3 b3 b4 b4 b5 b5 b5 b6 b7 b7";
  let na_pai = "fa";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: str.split(' ')
  }
  t.is(MajiangAlgo.HuisYise(group_shoupai, na_pai), false);
});
test("group是清一色", function (t) {
  let str = "b6 b6 b7 b8";
  let na_pai = "b9";
  let group_shoupai = {
    anGang: ['b1'],
    mingGang: [],
    peng: ['b5','b2'],
    selfPeng:[], shouPai: str.split(' ')
  }
  t.is(MajiangAlgo.HuisYise(group_shoupai, na_pai), true);
});
test("group纯flat是清一色", function (t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b3 b4 b5 b5 b5 b7 b8";
  let na_pai = "b9";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: str.split(' ')
  }
  t.is(MajiangAlgo.HuisYise(group_shoupai, na_pai), true);
});
test("group不是清一色", function (t) {
  let str = "b3 b4 b7 b8";
  let na_pai = "b9";
  let group_shoupai = {
    anGang: ['b1'],
    mingGang: [],
    peng: ['b5','b2'],
    selfPeng:[], shouPai: str.split(' ')
  }
  t.is(MajiangAlgo.HuisYise(group_shoupai, na_pai), false);
});
test("group不是清一色", function (t) {
  let str = "b3 b4 b7 b8";
  let na_pai = "b9";
  let group_shoupai = {
    anGang: ['b1'],
    mingGang: [],
    peng: ['b5','t2'],
    selfPeng:[], shouPai: str.split(' ')
  }
  t.is(MajiangAlgo.HuisYise(group_shoupai, na_pai), false);
});
test("group仅屁胡 ", function (t) {
  let str = "b1 b2 b3 b4 b5 b6 t4 t5 t6  zh";
  let na_pai = "zh"
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: ['fa'],
    selfPeng:[], shouPai: getArr(str)
  }
  t.is(MajiangAlgo.HuisYise(group_shoupai, na_pai), false)
})