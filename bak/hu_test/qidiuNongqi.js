import test from "ava";
import { MajiangAlgo, getArr } from "../../server_build/server/MajiangAlgo";
// var Majiang = require("../server/Majiang");

// 特殊胡
test("七对", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 fa fa t1 t1 t4 t4 t9";
  let na_pai = "t9";
    let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisQiDui(group_shoupai, na_pai), true);
});
test("龙七对true", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa fa t1 t1 t4 t4 t9";
  let na_pai = "t9";
    let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisNongQiDui(group_shoupai, na_pai), true);
});
test("清一色并龙七对", function(t) {
  let str = "b1 b1 b2 b2 b3 b3 b4 b4 b5 b5 b7 b7 b7";
  let na_pai = "b7";
  let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisYise(group_shoupai, na_pai), true);
  t.is(MajiangAlgo.HuisNongQiDui(group_shoupai, na_pai), true);
});

test("非七对", function(t) {
  let str = "b1 b1 b2 b2 fa fa fa t1 t1 t4 t4 t9 t8";
  let na_pai = "fa";
    let group_shoupai = {
    anGang: [],
    mingGang: [],
    peng: [],
    selfPeng:[], shouPai: str.split(" ")
  };
  t.is(MajiangAlgo.HuisQiDui(group_shoupai, na_pai), false);
});
