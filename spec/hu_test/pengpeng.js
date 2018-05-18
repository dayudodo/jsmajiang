//麻将算法的测试程序，里面也包括了胡牌的一些用例

import test from "ava";
import { MajiangAlgo } from "../../server_build/MajiangAlgo";
// var Majiang = require("../server/Majiang");

test("不是碰碰胡", function (t) {
  let str = "b1 b1 b2 b2 b2 t3 t4 t5 fa fa fa di di";
  let na_pai = "b1";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), false);
});

test("碰碰胡将在后", function (t) {
  let str = "b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa di ";
  let na_pai = "di";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰胡将在前", function (t) {
  let str = "di di b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa ";
  let na_pai = "fa";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带1杠", function (t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 t3 t3 t3 fa fa fa t5 ";
  let na_pai = "t5";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带2杠", function (t) {
  let str = "b2 b2 b2 b2 b1 b1 b1 b1 t3 t3 t3 fa fa fa t5 ";
  let na_pai = "t5";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠", function (t) {
  let str = "b1 b1 b1 b1 b2 b2 b2 b2 t3 t3 t3 t3 fa fa fa t5 ";
  let na_pai = "t5";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});
test("碰碰糊带3杠少将", function (t) {
  let str = "b2 fa fa fa fa t1 t1 t1 t1 zh zh zh zh";
  let na_pai = "b2";
      let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisPengpeng(group_shoupai, na_pai), true);
});